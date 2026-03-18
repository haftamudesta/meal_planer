import {NextResponse}  from "next/server"
import {currentUser} from "@clerk/nextjs/server"
import {prisma} from "@/lib/prisma"
import {stripe} from "@/lib/stripe"


export async function POST(){
        try {
                const clerkUser=await currentUser();
                if(!clerkUser?.id){
                        return NextResponse.json({error:"You are not Authorized"})
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
                const canceledSubscriptions=await stripe.subscriptions.update(subscriptionId,{
                        cancel_at_period_end:false,
                });

                await prisma.profile.update({
                        where:{userId:clerkUser.id},
                        data:{
                                subscriptionTier:null,
                                stripeSubscriptionId:null,
                                subscriptionActive:false,
                        }
                })
                return NextResponse.json({subscription:canceledSubscriptions})
        } catch (error:any) {
                console.log(error.message)
              return NextResponse.json({error:"Internal server error"},{status:500})  
        }
}