import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {prisma} from "@/lib/prisma"

export async function POST(request:NextRequest){
        const body=await request.text();
        const signature= request.headers.get("stripe-signature");
        const stripeWebhookSecret=process.env.STRIPE_WEBHOOK_SECRET!
        let event:Stripe.Event;
        try {
            event=stripe.webhooks.constructEvent(
                body,
                signature || "",
                stripeWebhookSecret)    
        } catch (error:any) {
                return NextResponse.json({error:error.message},{status:400})
        }
        try{
        switch(event.type){
                case "checkout.session.completed":{
                        console.log("Web hook route hitted")
                        const session=event.data.object as Stripe.Checkout.Session;
                        await handleCheckoutSessionCompleted(session)
                        break;
                }
                case "invoice.payment_failed":{
                      const session=event.data.object as Stripe.Invoice
                      await handleInvoicePaymentFaild(session)
                        break;   
                }
                case "customer.subscription.deleted":{
                        const session=event.data.object as Stripe.Subscription
                        await handleCustomerSubscriptionDeleted(session)
                        break; 
                }
                default:
                        console.log("unhandle event type",event.type)
        }
        }catch(error:any){
                console.log(error.message);
                return NextResponse.json({error:error.message},{status:400})
        }
        return NextResponse.json({})
}
async function handleCheckoutSessionCompleted(session:Stripe.Checkout.Session){
        console.log("Metadata",session.metadata);
        const userId=session.metadata?.clerkUserId;
        console.log("user Id:",userId)
        if(!userId){
                console.log("User not found");
                return;
        }
        const subscriptionId=session.subscription as string;
        if(!subscriptionId){
                console.log("User not found");
                return;
        }
        try {
                const planType = session.metadata?.planType || null;
                console.log("plan Type:",planType)
             await prisma.profile.update({
                where:{userId},
                data:{
                        stripeSubscriptionId:subscriptionId,
                        subscriptionActive:true,
                        subscriptionTier:planType,
                }
             })
        } catch (error) {
                console.log(error)           
        }
}
async function handleInvoicePaymentFaild(invoice:Stripe.Invoice){
        const subscriptionId=invoice.subscription as string;
        if(!subscriptionId){
                return
        }
        let userId:string | undefined;
        try {
                console.log({
                        userId,
                        subscriptionId,
                    });
             const profile=await prisma.profile.findUnique({
                where:{
                        stripeSubscriptionId:subscriptionId
                },
                select:{
                        userId:true
                }
             }) 
             if(!profile?.userId){
                console.log("No profile found");
                return;
             } 
             userId=profile.userId;
        } catch (error) {
               console.log(error)
               return; 
        }
        try{
                console.log({
                        userId,
                        subscriptionId,
                    });
                await prisma.profile.update({
                        where:{userId:userId},
                        data:{
                                subscriptionActive:false,
                        }
                })
        }catch(error){
                console.log(error)
        }

}
async function handleCustomerSubscriptionDeleted(subscription:Stripe.Subscription){
        const subscriptionId=subscription.id;
        if(!subscriptionId){
                return
        }
        let userId:string | undefined;
        try {
             const profile=await prisma.profile.findUnique({
                where:{
                        stripeSubscriptionId:subscriptionId
                },
                select:{
                        userId:true
                }
             }) 
             if(!profile?.userId){
                console.log("No profile found");
                return;
             } 
             userId=profile.userId;
        } catch (error) {
               console.log(error)
               return; 
        }
        try{
                await prisma.profile.update({
                        where:{userId:userId},
                        data:{
                                subscriptionActive:false,
                                stripeSubscriptionId:null,
                                subscriptionTier:null,
                        }
                })
        }catch(error){
                console.log(error)
        }
}