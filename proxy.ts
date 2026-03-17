import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/user-profile"])
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",   
  "/api/check-subscription(.*)",
  "/api/checkout(.*)",
])

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"])
const isMealPlanRouter = createRouteMatcher("/mealplan(.*)")

export default clerkMiddleware(async (auth, req) => {
  const userAuth = await auth();
  const { userId } = userAuth;
  const { pathname, origin } = req.nextUrl;
  
  
  
  // Special handling for webhook - ALWAYS allow webhook requests
  if (pathname.startsWith('/api/webhook')) {
    return NextResponse.next();
  }
  
  // Special handling for checkout API
  if (pathname === '/api/checkout') {
    return NextResponse.next();
  }
  
  if (pathname === '/api/check-subscription') {
    return NextResponse.next();
  }
  
  if (!isPublicRoute(req) && !userId) {
    console.log(`🔒 Redirecting to sign-up: ${pathname}`);
    return NextResponse.redirect(new URL("/sign-up", origin));
  }
  
  if (isSignUpRoute(req) && userId) {
    console.log(`✅ Signed in user on sign-up page, redirecting to mealplan`);
    return NextResponse.redirect(new URL("/mealplan", origin));
  }
  
  if (isMealPlanRouter(req) && userId) {
    try {
      console.log(`🍽️ Checking subscription for user: ${userId}`);
      const response = await fetch(`${origin}/api/check-subscription/?userId=${userId}`);
      const data = await response.json();
      console.log(`📊 Subscription status:`, data);
      
      if (!data.subscriptionActive) {
        console.log(`⏳ No active subscription, redirecting to subscribe`);
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error: any) {
      console.log(`❌ Subscription check error:`, error.message);
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
  }
  
  return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}