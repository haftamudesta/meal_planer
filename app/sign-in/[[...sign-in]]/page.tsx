import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex justify-center items-center min-h-[calc(100vh-60px)]">
      <SignIn
        signUpFallbackRedirectUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl rounded-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
            formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700",
            footerActionLink: "text-emerald-600 hover:text-emerald-700",
          },
        }}
      />
    </div>
  );
}
