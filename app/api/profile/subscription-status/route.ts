import {NextResponse}  from "next/server"
import {currentUser} from "@clerk/nextjs/server"
import {prisma} from "@/lib/prisma"

export async function GET(){
        try {
                const clerkUser=await currentUser();
                if(!clerkUser?.id){
                        return NextResponse.json({error:"You are not Authorized"})
                }
                const profile=await prisma.profile.findUnique({
                        where:{userId:clerkUser.id},
                        select:{subscriptionTier:true},
                })
                if(!profile){
                        return NextResponse.json({error:"No Profile Found"})
                }
                return NextResponse.json({subscription:profile})
        } catch (error:any) {
                console.log(error.message)
              return NextResponse.json({error:"Internal server error"},{status:500})  
        }
}