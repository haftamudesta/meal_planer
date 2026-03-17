import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "MealPlan Generator",
  }
});

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { dietType, calories, allegries, cuisine, snacks } = await request.json();

    // Validate required fields
    if (!dietType || !calories) {
      return NextResponse.json(
        { error: "Missing required fields: dietType and calories" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a professional nutritionist. Create a 7-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
      
      Allergies or restrictions: ${allegries || "none"}.
      Preferred cuisine: ${cuisine || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      
      For each day (Monday through Sunday), provide:
        - Breakfast (with calories)
        - Lunch (with calories)  
        - Dinner (with calories)
        ${snacks ? "- Snacks (with calories)" : ""}
      
      Use simple ingredients and brief instructions.
      
      Return ONLY a valid JSON object with this exact structure:
      {
        "Monday": {
          "Breakfast": "Meal description - 350 calories",
          "Lunch": "Meal description - 500 calories",
          "Dinner": "Meal description - 600 calories"
          ${snacks ? ', "Snacks": "Snack description - 150 calories"' : ''}
        },
        // ... Tuesday through Sunday
      }
      
      No other text, markdown, or explanations.
    `;


    // Use the auto-router with fallback models
    const response = await openai.chat.completions.create({
      model: "openrouter/auto",  // This lets OpenRouter choose the best available model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    }, {
      headers: {
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "MealPlan Generator",
      }
    });

    console.log("✅ Response received from OpenRouter");

    // Extract and clean the response
    let aiContent = response.choices[0].message.content?.trim() || "";
    
    // Remove markdown code blocks if present
    aiContent = aiContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    aiContent = aiContent.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const parsedMealPlan = JSON.parse(aiContent);

    const requiredDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const missingDays = requiredDays.filter(day => !parsedMealPlan[day]);
    
    if (missingDays.length > 0) {
      throw new Error(`Missing days in meal plan: ${missingDays.join(', ')}`);
    }

    return NextResponse.json({ 
      mealPlan: parsedMealPlan,
      success: true 
    });

  } catch (error: any) {

    if (error.status === 429) {
      return NextResponse.json(
        { 
          error: "Daily limit reached. Free tier allows 50 requests/day.",
          details: {
            limit: 50,
            suggestion: "Add a small credit ($5-10) to your OpenRouter account for higher limits, or try again tomorrow."
          }
        },
        { status: 429 }
      );
    }

    if (error.status === 402) {
      return NextResponse.json(
        { 
          error: "Insufficient credits. Please add credits to your OpenRouter account.",
          suggestion: "Visit https://openrouter.ai/settings/credits to add credits."
        },
        { status: 402 }
      );
    }

    if (error.status === 404) {
      return NextResponse.json(
        { 
          error: "Model temporarily unavailable. Please try again in a few minutes.",
          suggestion: "OpenRouter is rotating models. This usually resolves quickly."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to generate meal plan. Please try again.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}