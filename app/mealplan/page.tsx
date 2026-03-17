"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader } from "../../components/Loader";
import { motion } from "framer-motion";
import { useState } from "react";

interface MealPlanInput {
  dietType: string;
  calories: number;
  allegries: string;
  cuisine: string;
  snacks: string;
  days?: number;
}

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}
interface weeklyMealPlan {
  [day: string]: DailyMealPlan;
}

interface MealPlanResponse {
  mealPlan: weeklyMealPlan;
  error?: string;
  limit?: string;
}

async function generateMealPlan(payload: MealPlanInput) {
  const response = await fetch("/api/generate_mealplan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate meal plan");
  }

  return data;
}

export default function MealPlanDashBoard() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isPending, data, isSuccess, error } = useMutation<
    MealPlanResponse,
    Error,
    MealPlanInput
  >({
    mutationFn: generateMealPlan,
    onError: (error) => {
      setErrorMessage(error.message);
      // Auto-clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    },
    onSuccess: () => {
      setErrorMessage(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payLoad: MealPlanInput = {
      dietType: formData.get("dietType")?.toString() || "",
      calories: Number(formData.get("calories")) || 2000,
      allegries: formData.get("allegries")?.toString() || "none",
      cuisine: formData.get("cuisine")?.toString() || "any",
      snacks: formData.get("snacks")?.toString() || "false",
      days: 7,
    };
    mutate(payLoad);
  };

  const weekday = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {
    if (!data?.mealPlan) return undefined;
    return data.mealPlan[day];
  };

  if (isPending) return <Loader />;

  console.log("data:", data);

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg"
          >
            <p className="font-medium">⚠️ {errorMessage}</p>
            {errorMessage.includes("Rate limit") && (
              <p className="text-sm mt-2">
                💡 Free tier allows 50 requests/day. Try again tomorrow or add a
                small credit to your OpenRouter account.
              </p>
            )}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                AI Meal Plan Generator
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="dietType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Diet Type *
                  </label>
                  <input
                    type="text"
                    id="dietType"
                    name="dietType"
                    required
                    placeholder="e.g vegan, vegetarian, keto"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    defaultValue=""
                  />
                </div>

                <div>
                  <label
                    htmlFor="calories"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Daily Calories Goal *
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    required
                    min={500}
                    max={15000}
                    placeholder="2000"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    defaultValue={2000}
                  />
                </div>

                <div>
                  <label
                    htmlFor="allegries"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Allergies / Restrictions
                  </label>
                  <input
                    type="text"
                    id="allegries"
                    name="allegries"
                    placeholder="e.g Dairy, nuts, none"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    defaultValue="none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cuisine"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Preferred Cuisine
                  </label>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    placeholder="e.g Ethiopian, Italian"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    defaultValue="any"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="snacks"
                    name="snacks"
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                  />
                  <label
                    htmlFor="snacks"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Include Snacks
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Meal Plan"
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Powered by OpenRouter AI • Free tier: 50 requests/day
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Your Weekly Meal Plan
            </h2>

            {data?.mealPlan && isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {weekday.map((day, index) => {
                  const mealplan = getMealPlanForDay(day);
                  return (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-green-200 dark:border-green-900 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                      }}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        {day}
                      </h3>

                      {mealplan ? (
                        <div className="space-y-3">
                          {mealplan.Breakfast && (
                            <div>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 block">
                                🌅 Breakfast
                              </span>
                              <p className="text-gray-800 dark:text-gray-200">
                                {mealplan.Breakfast}
                              </p>
                            </div>
                          )}
                          {mealplan.Lunch && (
                            <div>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 block">
                                ☀️ Lunch
                              </span>
                              <p className="text-gray-800 dark:text-gray-200">
                                {mealplan.Lunch}
                              </p>
                            </div>
                          )}
                          {mealplan.Dinner && (
                            <div>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 block">
                                🌙 Dinner
                              </span>
                              <p className="text-gray-800 dark:text-gray-200">
                                {mealplan.Dinner}
                              </p>
                            </div>
                          )}
                          {mealplan.Snacks && (
                            <div>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 block">
                                🍎 Snacks
                              </span>
                              <p className="text-gray-800 dark:text-gray-200">
                                {mealplan.Snacks}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No meal plan available
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg"
              >
                <svg
                  className="w-24 h-24 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Fill in your preferences and click "Generate Meal Plan" to get
                  started!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
