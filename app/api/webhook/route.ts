import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  console.log("\n🔔🔔🔔 PRODUCTION WEBHOOK 🔔🔔🔔");
  console.log("Time:", new Date().toISOString());
  
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  
  if (!signature) {
    console.log("❌ No signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.log("❌ No webhook secret in env");
    return NextResponse.json({ error: "No secret" }, { status: 500 });
  }

  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("✅ Event verified:", event.id);
    console.log("Event type:", event.type);
  } catch (err: any) {
    console.log("❌ Verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🎯 Processing checkout.session.completed");
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("📦 Session metadata:", session.metadata);
        console.log("📦 Session subscription:", session.subscription);
        console.log("📦 Customer email:", session.customer_email);
        
        const userId = session.metadata?.clerkUserId;
        const planType = session.metadata?.planType;
        const subscriptionId = session.subscription as string;
        const email = session.customer_email;

        console.log("📝 Extracted values:", { 
          userId, 
          planType, 
          subscriptionId,
          email 
        });

        if (!userId) {
          console.log("❌ No userId in metadata");
          return NextResponse.json({ received: true });
        }

        if (!subscriptionId) {
          console.log("❌ No subscriptionId");
          return NextResponse.json({ received: true });
        }

        if (!email) {
          console.log("❌ No email in session");
          return NextResponse.json({ received: true });
        }

        // Update database
        try {
          console.log("🗄️ Attempting database update...");
          
          // First check if profile exists
          const existingProfile = await prisma.profile.findUnique({
            where: { userId }
          });
          
          console.log("Existing profile:", existingProfile);

          let profile;
          if (!existingProfile) {
            // Create new profile with ALL required fields
            profile = await prisma.profile.create({
              data: {
                userId,
                email,
                stripeSubscriptionId: subscriptionId,
                subscriptionActive: true,
                subscriptionTier: planType,
              }
            });
            console.log("✅ Created new profile:", profile);
          } else {
            // Update existing profile
            profile = await prisma.profile.update({
              where: { userId },
              data: {
                stripeSubscriptionId: subscriptionId,
                subscriptionActive: true,
                subscriptionTier: planType,
                email: email, // Update email in case it changed
              }
            });
            console.log("✅ Updated existing profile:", profile);
          }
          
          console.log("✅ Database operation successful!");
          
        } catch (dbError) {
          console.log("❌ Database error details:");
          console.log("- Error name:", dbError instanceof Error ? dbError.name : "Unknown");
          console.log("- Error message:", dbError instanceof Error ? dbError.message : String(dbError));
        }
        break;
      }
      
      case "invoice.payment_failed": {
        console.log("💰 Processing invoice.payment_failed");
        const invoice = event.data.object as Stripe.Invoice;
        
        // For invoices, the subscription is in invoice.subscription (as a string or null)
        // We need to check if it exists and is a string
        if (!invoice.subscription || typeof invoice.subscription !== 'string') {
          console.log("⚠️ Invoice not related to subscription or subscription is not a string");
          return NextResponse.json({ received: true });
        }
        
        const subscriptionId = invoice.subscription;
        console.log("Subscription ID from invoice:", subscriptionId);
        
        try {
          const profile = await prisma.profile.findUnique({
            where: { stripeSubscriptionId: subscriptionId }
          });
          
          if (!profile) {
            console.log("❌ No profile found for subscription:", subscriptionId);
            return NextResponse.json({ received: true });
          }
          
          await prisma.profile.update({
            where: { userId: profile.userId },
            data: { subscriptionActive: false }
          });
          
          console.log("✅ Updated subscription status to inactive for user:", profile.userId);
        } catch (dbError) {
          console.log("❌ Database error in invoice.payment_failed:", dbError);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        console.log("🗑️ Processing customer.subscription.deleted");
        const subscription = event.data.object as Stripe.Subscription;
        
        try {
          const profile = await prisma.profile.findUnique({
            where: { stripeSubscriptionId: subscription.id }
          });
          
          if (!profile) {
            console.log("❌ No profile found for subscription:", subscription.id);
            return NextResponse.json({ received: true });
          }
          
          await prisma.profile.update({
            where: { userId: profile.userId },
            data: {
              subscriptionActive: false,
              stripeSubscriptionId: null,
              subscriptionTier: null,
            }
          });
          
          console.log("✅ Cleared subscription data for user:", profile.userId);
        } catch (dbError) {
          console.log("❌ Database error in customer.subscription.deleted:", dbError);
        }
        break;
      }
      
      default:
        console.log("⚠️ Unhandled event type:", event.type);
    }
    
    console.log("✅ Webhook processing complete\n");
    
  } catch (error) {
    console.log("❌ Error processing webhook:", error);
  }

  return NextResponse.json({ received: true });
}