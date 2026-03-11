import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"

export async function POST(req: Request){
        try{
        const clerkUser=await currentUser()
        if(!clerkUser){
                return NextResponse.json(
                        {error:"user not found"},
                        {status:404}
                )
        }
        const email=clerkUser.emailAddresses[0].emailAddress;
        if(!email){
                return NextResponse.json(
                        {error:"user do not have an email address"},
                        {status:404}
                )
        }
        const existingProfile=await prisma.profile.findUnique({where:{userId:clerkUser.id}})

        if(existingProfile){
                return NextResponse.json(
                        {message:"profile already exist"}
                )
        }
        await prisma.profile.create({
                data:{
                        userId:clerkUser.id,
                        email,
                        subscriptionTier:null,
                        stripeSubscriptionId:null,
                        subscriptionActive:false,
                }
        });
        return NextResponse.json(
                {message:"Profile created successfully"},
                {status:201}
        )
}catch(error){
        console.log(error)
        return NextResponse.json(
                {error:"Internal Server Error"},
                {status:500}
        )
}
}