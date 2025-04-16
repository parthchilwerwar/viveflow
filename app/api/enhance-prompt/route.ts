import { type NextRequest, NextResponse } from "next/server"

const systemPrompt = `You are an AI assistant that helps improve and enhance ideas specifically for generating idea frameworks.
Given a brief idea, you will expand it into a more detailed, structured input that can be used to generate a comprehensive idea framework.

Your enhanced idea should:
1. Maintain the original intent and purpose of the user's idea
2. Add specific details that would help generate better action steps, identify challenges, and suggest resources
3. Structure the idea with a clear goal, scope, and desired outcomes
4. Include relevant considerations that would help in implementation
5. Make the idea more specific, actionable, and detailed
6. Focus specifically on business, project, or personal development frameworks
7. Avoid adding unrelated or tangential content not connected to the original idea

Do not invent completely new ideas or change the core concept. Focus on enriching and expanding what the user has provided to facilitate better framework generation.
Return just the enhanced idea with no additional explanation or commentary.`

const frameworkPrompt = `You are an AI assistant that helps improve and enhance ideas specifically for generating idea frameworks.
Given a brief idea, you will expand it into a more detailed, structured input that can be used to generate a comprehensive idea framework with goals, action steps, challenges, resources, and tips.

Your enhanced idea should:
1. Maintain the original intent and purpose of the user's idea
2. Add specific details that would help generate better action steps, identify potential challenges, and suggest useful resources
3. Structure the idea with a clear goal, implementation path, and desired outcomes
4. Consider practical aspects of implementation and execution
5. Make the idea more specific, actionable, and detailed
6. Focus on content that will help build a robust framework with executable steps

Do not invent completely new directions or change the core concept. Focus on enriching and expanding what the user has provided to facilitate better framework generation.
Return just the enhanced idea with no additional explanation or commentary.`

// Create a custom implementation that handles the API call to Groq
async function callGroqAPI(prompt: string, context: string = "general") {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable")
  }

  // Select the appropriate system prompt based on context
  const selectedPrompt = context === "idea_framework" ? frameworkPrompt : systemPrompt;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemma2-9b-it", // Using Gemma 2 9B-IT model through Groq
        messages: [
          {
            role: "system",
            content: selectedPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      
      if (response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again in a few moments.");
      }
      if (response.status === 503 || response.status === 504) {
        throw new Error("API service is temporarily unavailable. Please try again later.");
      }
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, context = "general" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Idea is too long. Please keep it under 2000 characters." },
        { status: 400 }
      )
    }

    // If prompt is very short, provide a helpful response
    if (prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed idea to enhance." },
        { status: 400 }
      )
    }

    const completion = await callGroqAPI(prompt, context)
    const enhancedPrompt = completion.choices[0]?.message?.content || ""

    if (!enhancedPrompt) {
      throw new Error("Failed to generate an enhanced idea")
    }

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error("Error enhancing idea:", error)
    
    // Provide a more helpful error message based on the error type
    let errorMessage = "Failed to enhance idea. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("rate limit") || error.message.includes("temporarily unavailable")) {
        errorMessage = error.message;
      } else if (error.message.includes("timed out")) {
        errorMessage = "The request took too long. Please try again with a shorter idea.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 