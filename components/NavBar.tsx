"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHand } from "react-icons/fa6";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export const NavBar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <nav className="bg-gray-200 h-15 flex justify-between items-center ml-8 mr-8">
      <div>
        <Link href="/">
          <FaHand className="text-teal-500 font-bold text-6xl p-4" />
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <SignedIn>
          <Link
            href="/mealplan"
            className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors"
          >
            Meal Plan
          </Link>
          <SignOutButton>
            <button className="ml-4 px-3 py-1.5 bg-emerald-300 text-white rounded hover:bg-emerald-600 transition">
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <Link
            href="/"
            className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors text-xl"
          >
            Home
          </Link>
          <Link
            href="/sign-up"
            className="text-emerald-700 hover:text-emerald-500 font-bold transition-colors text-xl"
          >
            Subscribe
          </Link>
          <Link
            href="/sign-up"
            className="ml-4 px-2 py-0.5 bg-emerald-300 text-white rounded hover:bg-emerald-600 transition"
          >
            Sign Up
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};
