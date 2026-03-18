"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader } from "@/components/Loader";
import { availablePlans } from "@/lib/plans";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

async function fetchSubscriptionStatus() {
  const response = await fetch("/api/profile/subscription-status");
  return response.json();
}

async function updateSubscriptionPlan(newPlan: string) {
  const response = await fetch("/api/profile/change-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPlan }),
  });
  return response.json();
}

async function unSubscribeToPlan() {
  const response = await fetch("/api/profile/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export default function ProfilePage() {
  const [selectPlan, setSelectPlan] = useState<string>("");
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 100,
  });

  const {
    data: updatedPlan,
    mutate: updatedPlanMutation,
    isPending: isUpdatePlanPending,
  } = useMutation({
    mutationFn: updateSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("subscription Plan Updated successfully");
      refetch();
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.error("Error Updating Plan");
    },
  });

  const {
    data: unSubscribePlan,
    mutate: unSubscribePlanMutation,
    isPending: isUnSubscribePlanPending,
  } = useMutation({
    mutationFn: unSubscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("You have unsubscribed to the plan successfully!");
      router.push("/subscribe");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.error("Error Updating Plan");
    },
  });
  const currentPlan = availablePlans.find(
    (plan: any) =>
      plan.interval === subscription?.subscription?.subscriptionTier,
  );
  const handleUpdatePlan = () => {
    if (selectPlan) {
      updatedPlanMutation(selectPlan);
    }
    setSelectPlan("");
  };
  const handleUnsubscribe = () => {
    if (confirm("Are you sure you want to unsubscribe!!!")) {
      unSubscribePlanMutation();
    }
  };
  if (!isLoaded) {
    <div>
      <Loader />
    </div>;
  }
  if (!isSignedIn) {
    <div>
      <p>Pleas Sign In...</p>
    </div>;
  }
  return (
    <div>
      <Toaster position="top-center" />
      <div className="grid md:grid-cols-2 lg:grid-3 md:gap-4 xl:items-center xl:gap-12 xl:grid-cols-4">
        <div className="bg-teal-400 border-2 border-emerald-400 rounded-lg p-4 h-50 mb-4">
          {user?.imageUrl && (
            <Image
              src={user?.imageUrl}
              alt="user profile"
              width={100}
              height={100}
              className="mb-3"
            />
          )}
          {user?.firstName} {user?.lastName}
          <p className="mt-3">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="border bg-blue-950 p-4 h-45">
          <h1 className="text-emerald-700 text-2xl font-bold mb-2">
            Subscription Details
          </h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <p>{error?.message}</p>
          ) : subscription ? (
            <div className="bg-gray-300 px-2">
              <h3 className="text-emerald-400 font-bold">Current Plan</h3>
              {currentPlan ? (
                <div>
                  <p>
                    <strong> Plan:</strong>
                    {currentPlan.name}
                  </p>
                  <p>
                    <strong>Amount:</strong>
                    {currentPlan.amount} {currentPlan.currency}
                  </p>
                  <p>
                    <strong>Status:</strong>Active
                  </p>
                </div>
              ) : (
                <p>Current Plan Not Found</p>
              )}
            </div>
          ) : (
            <p>You are not subscribed to any plan</p>
          )}
        </div>
        <div className="border bg-blue-900 p-2 h-45">
          <h2 className="text-emerald-500 text-xl font-bold mb-3">
            Change Subscription Plan
          </h2>
          {currentPlan && (
            <div>
              <div className="flex flex-col">
                <select
                  defaultValue={currentPlan?.interval}
                  disabled={isUpdatePlanPending}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectPlan(e.target.value)
                  }
                  className="border border-emerald-500 px-4 py-4 rounded-lg shadow-md text-white"
                >
                  <option value="" disabled>
                    Select New Plan
                  </option>
                  {availablePlans.map((plan, index) => (
                    <option
                      value={plan.interval}
                      key={index}
                      className="text-black"
                    >
                      {plan.name}-{plan.amount} /{plan.interval}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdatePlan}
                  className="mt-4 bg-sky-400 text-white rounded-2xl py-2 cursor-pointer"
                >
                  Save Change
                </button>
              </div>
              {isUpdatePlanPending && (
                <div>
                  <Loader />
                  <span>Updating Plan...</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border bg-blue-950 p-4 h-45">
          <h3 className="text-emerald-300 font-bold mb-2">
            Unsubscribe From The Plan
          </h3>
          <button
            onClick={handleUnsubscribe}
            disabled={isUnSubscribePlanPending}
            className="bg-red-500 rounded-full text-teal-300 px-4 py-2 font-bold cursor-pointer"
          >
            {isUnSubscribePlanPending ? "Unsubscribing" : "Unsubscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
