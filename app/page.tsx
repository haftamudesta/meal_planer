import Link from "next/link";
export default function Home() {
  return (
    <main className="grid grid-rows-[20px_1fr-20px] md:items-center md:justify-center min-h-screen p-8 pb-20 gap-1">
      <section className="bg-gradient-to-r from-emerald-300 to-emerald-600 text-white rounded-lg p-4 md:text-center w-7xl mx-auto">
        <h1 className="text-4xl mb-2 font-bold">
          Personalized AI Meal Planner
        </h1>
        <p className="text-xl mb-2">
          Ask the AI for Planing.You focus on enjoying
        </p>
        <Link
          href="/sign-up"
          className="bg-white inline-block font-semibold text-emerald-500 rounded px-6 py-2 hover:bg-gray-300 transition"
        >
          Get Started
        </Link>
      </section>
      <section id="working-priciple" className="mb-2">
        <div className="md:text-center mb-2">
          <h2 className="text-3xl font-semibold">How it Works</h2>
          <p className="mb-2 text-gray-500">Flow the steps given below</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 gap-4">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center space-y-8 md:space-y-0 md:space-x-8  px-2">
            <div className="flex flex-col md:items-center border-2 rounded-2xl px-2 bg-blue-950 py-2">
              <div className="bg-emerald-400 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-3-3h6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-4 text-white">
                Create an Acount
              </h2>
              <p className="text-start text-sky-400 font-bold">
                Sign In or Sign Up to get Access to The AI
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col md:items-center border-2 rounded-2xl px-2 bg-blue-950 py-2">
              <div className="bg-emerald-400 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-4 text-white">
                Subscribe to the AI{" "}
              </h2>
              <p className="text-start text-sky-400 font-bold">
                In order to get Meal Plan you should have to Subscribe to the AI
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col md:items-center border-2 rounded-2xl px-2 bg-blue-950 py-2">
              <div className="bg-emerald-400 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-4 text-white">
                Set Your Preferences
              </h2>
              <p className="text-start text-sky-400 font-bold">
                Feed The AI Your dietary preference and goals to tailor your
                Meal Plans
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-8 md:space-y-0 md:space-x-8 ">
            <div className="flex flex-col md:items-center border-2 rounded-2xl px-2 bg-blue-950 py-2">
              <div className="bg-emerald-400 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 6L9 17l-5-5"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-4 text-white">
                Get your Meal Plan
              </h2>
              <p className="text-start text-sky-400 font-bold">
                Receive your customized meal plan delivered according to your
                preference to your account
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
