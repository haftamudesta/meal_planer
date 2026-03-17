"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader } from "../../components/Loader";
import { motion } from "framer-motion";

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
}

async function generateMealPlan(payload: MealPlanInput) {
  const response = await fetch("/api/generate_mealplan", {
    method: "POST",
    headers: { "Conten-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export default function MealPlanDashBoard() {
  const { mutate, isPending, data, isSuccess } = useMutation<
    MealPlanResponse,
    Error,
    MealPlanInput
  >({
    mutationFn: generateMealPlan,
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payLoad: MealPlanInput = {
      dietType: formData.get("dietType")?.toString() || "",
      calories: Number(formData.get("calories")) || 0,
      allegries: formData.get("allegries")?.toString() || "",
      cuisine: formData.get("cuisine")?.toString() || "",
      snacks: formData.get("snacks")?.toString() || "",
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
    <main>
      <div className="flex flex-col md:flex-row md:justify-center gap-2 mt-4 shadow-2xl">
        <div className="bg-sky-500 px-6 gap-4">
          <h2 className="text-2xl pt-2">AI Meal Plan Generator</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="dietType">Diet Type</label>
              <input
                type="text"
                id="dietType"
                name="dietType"
                required
                placeholder="e.g vegan,vegterian,keto"
                className="input inset-shadow-sm inset-shadow-amber-500 ring-4 rounded-sm border-2 border-gray-200 w-full pl-10 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="calories">Daily Calories Goal</label>
              <input
                type="number"
                id="calories"
                name="calories"
                required
                min={500}
                max={15000}
                placeholder="2000"
                className="input inset-shadow-sm inset-shadow-amber-500 ring-4 rounded-sm border-2 border-gray-200 w-full pl-10 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="allegries">Allegries</label>
              <input
                type="text"
                id="allegries"
                name="allegries"
                required
                placeholder="e.g Dairy,none"
                className="input inset-shadow-sm inset-shadow-amber-500 ring-4 rounded-sm border-2 border-gray-200 w-full pl-10 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="cuisine">Prefered Cuisine</label>
              <input
                type="text"
                id="cuisine"
                name="cuisine"
                required
                placeholder="e.g Ethiopian,Italian"
                className="input inset-shadow-sm inset-shadow-amber-500 ring-4 rounded-sm border-2 border-gray-200 w-full pl-10 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors duration-200 dark:text-white"
              />
            </div>
            <div className="flex gap-2 mt-2 mb-2">
              <input type="checkbox" id="snacks" name="snacks" />
              <label htmlFor="snacks">Include Snack</label>
            </div>
            <div className="">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-emerald-500 text-white px-4 py-2 hover:bg-emerald-700 transision-colors"
              >
                {isPending
                  ? "Generating... Please wait a Moment"
                  : "Generate Meal Plan"}
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2>Weekly Meal Plan</h2>
          {data?.mealPlan && isSuccess ? (
            <div>
              <motion.div className="flex flex-col gap-4">
                {weekday.map((day, index) => {
                  const mealplan = getMealPlanForDay(day);

                  return (
                    <motion.div
                      key={index}
                      className="bg-gray-400 shadow-lg rounded-lg p-4 border-2 border-sky-400 gap-2"
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.3,
                      }}
                      whileHover={{
                        y: -10,
                      }}
                    >
                      <h3>{day}</h3>
                      {mealplan ? (
                        <div>
                          <div>
                            <strong>Breakfast:</strong>
                            {mealplan.Breakfast}
                          </div>
                          <div>
                            <strong>Lunch:</strong>
                            {mealplan.Lunch}
                          </div>
                          <div>
                            <strong>Dinner:</strong>
                            {mealplan.Dinner}
                          </div>
                          <div>
                            <strong>Snack:</strong>
                            {mealplan.Snacks}
                          </div>
                        </div>
                      ) : (
                        <p>No Meal Plan</p>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ) : isPending ? (
            <Loader />
          ) : (
            <p>Please Generate Meal Plan</p>
          )}
        </div>
      </div>
    </main>
  );
}
