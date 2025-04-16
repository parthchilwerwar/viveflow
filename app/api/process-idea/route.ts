import { type NextRequest, NextResponse } from "next/server"

const systemPrompt = `You are an AI assistant that helps transform ideas into actionable frameworks.
Given an idea, you will analyze it and provide a structured response with the following components:
- goal: A clear, concise statement of the main objective
- action_steps: A list of 3-5 concrete steps to achieve the goal
- challenges: A list of 2-4 potential obstacles or difficulties
- resources: A list of 3-5 tools, platforms, or resources that could help
- tips: A list of 2-4 practical pieces of advice
- clarification_needed (optional): Questions to better understand the idea if more context is needed

Format your response as a valid JSON object with these exact keys.
Keep responses concise but actionable.`

// Create a custom implementation that handles the API call to Groq
async function callGroqAPI(idea: string) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable")
  }

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
            content: systemPrompt
          },
          {
            role: "user",
            content: idea
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
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
        throw new Error("Request timed out. Please try again with a simpler idea.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    }

    if (idea.length > 2000) {
      return NextResponse.json(
        { error: "Idea is too long. Please keep it under 2000 characters." },
        { status: 400 }
      )
    }

    // If idea is very short, provide a helpful response
    if (idea.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed idea to process." },
        { status: 400 }
      )
    }

    const completion = await callGroqAPI(idea)
    
    try {
      const response = JSON.parse(completion.choices[0]?.message?.content || "{}")

      // Validate the response structure
      const requiredFields = ["goal", "action_steps", "challenges", "resources", "tips"]
      const missingFields = requiredFields.filter(field => !(field in response))

      if (missingFields.length > 0) {
        throw new Error(`Invalid response format. Missing fields: ${missingFields.join(", ")}`)
      }

      return NextResponse.json(response)
    } catch (parseError) {
      console.error("Error parsing API response:", parseError);
      throw new Error("Failed to parse the framework data. Please try again.");
    }
  } catch (error) {
    console.error("Error processing idea:", error)
    
    // Provide a more helpful error message based on the error type
    let errorMessage = "Failed to process idea. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("rate limit") || error.message.includes("temporarily unavailable")) {
        errorMessage = error.message;
      } else if (error.message.includes("timed out")) {
        errorMessage = "The request took too long. Please try again with a shorter idea.";
      } else if (error.message.includes("parse")) {
        errorMessage = "There was an issue creating your framework. Please try rephrasing your idea.";
      } else if (error.message.includes("Invalid response format")) {
        errorMessage = "The framework couldn't be properly generated. Please try rephrasing your idea.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
