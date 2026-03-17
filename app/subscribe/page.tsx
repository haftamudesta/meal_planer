"use client";

import { availablePlans } from "@/lib/plans";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type SubscribeResponse = {
  url: string;
};
type SubscribeError = {
  error: string;
};
async function subscribeToPlan(
  planType: string,
  userId: string,
  email: string,
): Promise<SubscribeResponse> {
  console.log("checkout stage");
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planType,
      userId,
      email,
    }),
  });
  if (!response.ok) {
    const errorData: SubscribeError = await response.json();
    throw new Error(errorData.error || "Something went wrong");
  }
  const data: SubscribeResponse = await response.json();
  return data;
}

export default function SubscripePage() {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;
  const email = user?.emailAddresses[0].emailAddress || "";

  const { mutate, isPending } = useMutation<
    SubscribeResponse,
    Error,
    { planType: string }
  >({
    mutationFn: async ({ planType }) => {
      if (!userId) {
        throw new Error("User not Signed In...");
      }
      return subscribeToPlan(planType, userId, email);
    },
    onMutate: () => {
      toast.loading("Processing your Subscription... Please wait a Moment!");
    },
    onSuccess: (data) => {
      console.log(data.url);
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Oops,Something want wrong!!!");
    },
  });
  const handleSubscrib = (planType: string) => {
    console.log("Plan Type:", planType);
    if (!userId) {
      router.push("/sign-up");
      return;
    }
    mutate({ planType });
  };
  return (
    <div>
      <Toaster
        toastOptions={{
          success: {
            className: "bg-green-500 text-white",
            iconTheme: {
              primary: "white",
              secondary: "green",
            },
          },
          error: {
            className: "bg-red-500 text-white",
            iconTheme: {
              primary: "white",
              secondary: "red",
            },
          },
          loading: {
            className: "bg-blue-500 text-white",
          },
        }}
      />
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-4xl font-bold">Pricing</h2>
        <p>
          Get started on my weeky plan or upgared to monthly or yearly plan!!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {availablePlans.map((plan, index) => (
          <div
            key={index}
            className="border border-gray-400 p-6 shadow-2xl hover:bg-gray-300"
          >
            {plan.isPopular && (
              <p className="bg-emerald-500 w-30 text-white rounded-full px-2 py-0.5 -mt-7.5">
                Most Popular
              </p>
            )}
            <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
            <p className="mb-8">
              <span className="text-2xl font-bold ">${plan.amount}</span>/
              <span>{plan.interval}</span>
            </p>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index} className="flex gap-4 mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 w-6 h-6 text-emerald-500"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`${plan.interval === "month" ? "bg-linear-45 from-indigo-600 to-sky-700 text-white hover:bg-emerald-600" : "bg-linear-40 from-emerald-600 to-indigo-600 text-white hover:bg-emerald-600 hover:text-white"} mt-8 block w-full py-3 px-6 border border-transparentrounded-md text-center font-medium cursor-pointer`}
              onClick={() => handleSubscrib(plan.interval)}
              disabled={isPending}
            >
              {isPending ? "Please wait..." : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
