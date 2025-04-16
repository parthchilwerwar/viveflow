import { type NextRequest, NextResponse } from "next/server"

const systemPrompt = `You are an AI assistant that helps transform ideas into comprehensive, actionable frameworks.
Given an idea, you will analyze it and provide a detailed structured response with the following components:

CORE ELEMENTS (REQUIRED):
- goal: A clear, concise statement of the main objective
- action_steps: A list of 3-5 concrete steps to achieve the goal
- challenges: A list of 2-4 potential obstacles or difficulties
- resources: A list of 3-5 tools, platforms, or resources that could help
- tips: A list of 3-5 practical pieces of advice or best practices (THIS IS REQUIRED)
- clarification_needed (optional): Questions to better understand the idea if more context is needed



Format your response as a valid JSON object with these exact keys.
IMPORTANT: Your response MUST include the "tips" array with at least 2-3 items. This is a critical component.
Each section should be detailed yet concise, providing actionable guidance.
Focus on practical, implementable advice with concrete examples.
Do not include external URLs, complex technical implementations, or specific product recommendations that require specialized knowledge.`

// Create a custom implementation that handles the API call to Groq
async function callGroqAPI(idea: string) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error("Missing GROQ_API_KEY environment variable");
    return { error: "Missing GROQ_API_KEY environment variable" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for larger model
  
  try {
    console.log("Calling Groq API with model: meta-llama/llama-4-maverick-17b-128e-instruct");
    
    const requestBody = {
      model: "meta-llama/llama-4-maverick-17b-128e-instruct", 
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
      max_tokens: 4000, // Increase token limit for more detailed responses
      response_format: { type: "json_object" }
    };
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}: ${errorText}`);
      
      if (response.status === 429) {
        return { error: "API rate limit exceeded. Please try again in a few moments." };
      }
      if (response.status === 503 || response.status === 504) {
        return { error: "API service is temporarily unavailable. Please try again later." };
      }
      return { error: `API request failed with status ${response.status}: ${errorText}` };
    }
    
    const jsonResponse = await response.json();
    console.log("API response successful");
    return jsonResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      console.error(`API call error: ${error.name} - ${error.message}`);
      if (error.name === 'AbortError') {
        return { error: "Request timed out. Please try again with a simpler idea." };
      }
      return { error: error.message };
    }
    console.error("Unknown API call error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Helper function to sanitize text in objects
function sanitizeJsonText(obj: any): any {
  if (!obj) return obj;
  
  if (typeof obj === 'string') {
    // Remove markdown headers
    let text = obj.replace(/#{1,6}\s+/g, '');
    
    // Replace bold/italic markers with plain text
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    text = text.replace(/__(.*?)__/g, '$1');
    text = text.replace(/_(.*?)_/g, '$1');
    
    // Replace markdown bullet points with plain bullets
    text = text.replace(/^\s*[-*]\s+/gm, '• ');
    
    // Remove code blocks formatting
    text = text.replace(/```[a-z]*\n/g, '');
    text = text.replace(/```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    
    return text;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJsonText(item));
  }
  
  if (typeof obj === 'object') {
    const newObj: {[key: string]: any} = {};
    for (const key in obj) {
      newObj[key] = sanitizeJsonText(obj[key]);
    }
    return newObj;
  }
  
  return obj;
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

    console.log("Processing idea:", idea.substring(0, 50) + "...");
    const result = await callGroqAPI(idea)
    
    // Check if there was an error from the API call
    if ('error' in result) {
      console.error("API returned error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    try {
      console.log("Parsing API response");
      const responseContent = result.choices[0]?.message?.content;
      
      if (!responseContent) {
        console.error("API response missing content");
        return NextResponse.json(
          { error: "API response missing content" },
          { status: 500 }
        );
      }
      
      let response;
      try {
        response = JSON.parse(responseContent);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", responseContent.substring(0, 100) + "...");
        return NextResponse.json(
          { error: "Failed to parse the framework data. Invalid JSON format." },
          { status: 500 }
        );
      }

      // Clean and sanitize all text in the response to remove markdown formatting
      const sanitizedResponse = sanitizeJsonText(response);

      // Validate the response structure and add missing fields with defaults
      const requiredFields = ["goal", "action_steps", "challenges", "resources", "tips"];
      const missingFields = requiredFields.filter(field => !(field in sanitizedResponse));

      if (missingFields.length > 0) {
        console.warn("Adding default values for missing fields:", missingFields);
        
        // Instead of failing, add default values for missing fields
        missingFields.forEach(field => {
          // String fields get empty string, array fields get empty array
          if (field === "goal") {
            sanitizedResponse.goal = sanitizedResponse.goal || "Untitled Goal";
          } else {
            // All other required fields are arrays
            sanitizedResponse[field] = [];
          }
        });
      }
      
      // Ensure 'tips' is never empty - add default tips if needed
      if (!sanitizedResponse.tips || !Array.isArray(sanitizedResponse.tips) || sanitizedResponse.tips.length === 0) {
        console.warn("Tips array is missing or empty, adding default tips");
        sanitizedResponse.tips = [
          "Consider starting with small, achievable milestones to build momentum",
          "Regularly review and adjust your approach based on feedback",
          "Document your progress and learnings throughout the process"
        ];
      }

      // Add empty arrays for any missing enhanced fields that should be arrays
      const enhancedArrayFields = [
        "action_step_details", 
        "challenge_details", 
        "resource_details", 
        "tip_details",
        "stakeholders"
      ];
      
      enhancedArrayFields.forEach(field => {
        if (!sanitizedResponse[field]) {
          sanitizedResponse[field] = [];
        }
      });
      
      // Ensure other important fields have at least empty values
      if (!sanitizedResponse.goal_description) sanitizedResponse.goal_description = "";
      if (!sanitizedResponse.introduction) sanitizedResponse.introduction = "";
      if (!sanitizedResponse.background_context) sanitizedResponse.background_context = "";
      if (!sanitizedResponse.conclusion) sanitizedResponse.conclusion = "";
      
      // Ensure clarification_needed is always an array
      if (!sanitizedResponse.clarification_needed) {
        sanitizedResponse.clarification_needed = [];
      } else if (!Array.isArray(sanitizedResponse.clarification_needed)) {
        // Convert string or object to an array with one item
        sanitizedResponse.clarification_needed = [String(sanitizedResponse.clarification_needed)];
      }
      
      // Ensure all tips are properly formatted as strings
      if (Array.isArray(sanitizedResponse.tips)) {
        sanitizedResponse.tips = sanitizedResponse.tips.map((tip: any) => {
          if (typeof tip === 'string') {
            // Clean up any JSON-looking strings that might cause display issues
            return tip
              .replace(/\{/g, '\\{')
              .replace(/\}/g, '\\}')
              .replace(/\[/g, '\\[')
              .replace(/\]/g, '\\]')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
          }
          if (tip === null || tip === undefined) return "Consider regularly reviewing your progress";
          if (typeof tip === 'object') {
            try {
              // Try to convert object to readable string, avoiding JSON artifacts
              return Object.entries(tip)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            } catch {
              return JSON.stringify(tip)
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            }
          }
          return String(tip)
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        });
      }
      
      // Ensure tip_details array corresponds to the tips array
      if (!sanitizedResponse.tip_details || !Array.isArray(sanitizedResponse.tip_details) || 
          sanitizedResponse.tip_details.length < sanitizedResponse.tips.length) {
        
        console.warn("Generating missing tip_details");
        
        // Create or supplement tip_details
        if (!Array.isArray(sanitizedResponse.tip_details)) {
          sanitizedResponse.tip_details = [];
        }
        
        // For each tip without a corresponding detail, create one
        for (let i = 0; i < sanitizedResponse.tips.length; i++) {
          if (i >= sanitizedResponse.tip_details.length) {
            const tipText = typeof sanitizedResponse.tips[i] === 'string' 
              ? sanitizedResponse.tips[i] 
              : String(sanitizedResponse.tips[i]);
              
            sanitizedResponse.tip_details.push({
              tip: tipText,
              explanation: tipText.toLowerCase(), // Renamed from 'description' to 'explanation'
              examples: ["Start by applying this tip to the first action step"],
              context: "This tip applies throughout the implementation process"
            });
          }
        }
      }
      
      console.log("Successfully processed framework");
      return NextResponse.json(sanitizedResponse);
    } catch (parseError) {
      console.error("Error parsing API response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse the framework data. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing idea:", error)
    
    // Provide a more helpful error message based on the error type
    let errorMessage = "Failed to process idea. Please try again.";
    if (error instanceof Error) {
      console.error("Error details:", error.name, error.message, error.stack);
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
