import {NextRequest, NextResponse}  from "next/server"
import {currentUser} from "@clerk/nextjs/server"
import {prisma} from "@/lib/prisma"
import {stripe} from "@/lib/stripe"
import { getPriceIDFromType } from "@/lib/plans";

export async function POST(request:NextRequest){
        try {
                const clerkUser=await currentUser();
                if(!clerkUser?.id){
                        return NextResponse.json({error:"You are not Authorized"})
                }
                const {newPlan}=await request.json();

                if(!newPlan){
                        return NextResponse.json({error:"New Plan is Required"})
                }

                const profile=await prisma.profile.findUnique({
                        where:{userId:clerkUser.id},
                })
                if(!profile){
                        return NextResponse.json({error:"No Profile Found"})
                }
                if(!profile.stripeSubscriptionId){
                        return NextResponse.json({error:"No Active Subscription Found"})
                }
                const subscriptionId=profile.stripeSubscriptionId;
                const stripeSubscription=await stripe.subscriptions.retrieve(subscriptionId);
                const stripeSubscriptionItmeId=stripeSubscription.items.data[0]?.id

                if(!stripeSubscriptionItmeId){
                        return NextResponse.json({error:"No Active Subscription Found"})
                }

                const updatedSubscriptions=await stripe.subscriptions.update(subscriptionId,{
                        cancel_at_period_end:false,
                        items:[
                                {
                                        id:stripeSubscriptionItmeId,
                                        price:getPriceIDFromType(newPlan)
                                }
                        ],
                        proration_behavior:"create_prorations"
                });
                await prisma.profile.update({
                        where:{userId:clerkUser.id},
                        data:{
                                subscriptionTier:newPlan,
                                stripeSubscriptionId:updatedSubscriptions.id,
                                subscriptionActive:true,
                        }
                })

                return NextResponse.json({subscription:updatedSubscriptions})
        } catch (error:any) {
                console.log(error.message)
              return NextResponse.json({error:"Internal server error"},{status:500})  
        }
}