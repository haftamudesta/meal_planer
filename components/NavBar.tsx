"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHand } from "react-icons/fa6";
import { SignOutButton, useUser } from "@clerk/nextjs";

export const NavBar = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <nav className="bg-gray-200 h-15 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-200 h-15">
      <div className="flex justify-between items-center h-full ml-8 mr-8">
        <div>
          <Link href="/" className="block">
            <FaHand className="text-teal-500 text-6xl p-4 hover:text-teal-600 transition-colors" />
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/mealplan"
                className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors"
              >
                Meal Plan
              </Link>

              {user?.imageUrl && (
                <Link href="/profile" className="block">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-300 hover:border-emerald-500 transition-colors">
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "Profile image"}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </Link>
              )}

              <SignOutButton>
                <button className="ml-4 px-3 py-1.5 bg-emerald-300 text-white rounded-md hover:bg-emerald-600 transition font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors"
              >
                Home
              </Link>
              <Link
                href="/sign-up"
                className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors"
              >
                Subscribe
              </Link>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 bg-emerald-300 text-white rounded-md hover:bg-emerald-600 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
