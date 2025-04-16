import { type NextRequest, NextResponse } from "next/server"
import { IdeaFramework } from "@/types/framework"

async function callGroqAPI(messages: any[], framework: IdeaFramework, originalIdea: string) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error("Missing GROQ_API_KEY environment variable");
    return { error: "Missing GROQ_API_KEY environment variable" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
  
  try {
    console.log("Calling Groq API for chat response with model: meta-llama/llama-4-maverick-17b-128e-instruct");
    
    // Prepare tips array with proper escaping
    const formattedTips = Array.isArray(framework.tips) 
      ? framework.tips.map((tip: any) => {
          if (typeof tip === 'string') {
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
            // If it's an object with a specific tip property, use that
            if (tip.tip) {
              return String(tip.tip)
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            }
            // Otherwise convert object to string without attribute labels
            try {
              return Object.values(tip).join(' - ')
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            } catch {
              return String(tip)
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
        })
      : [];
    
    const systemPrompt = `You are a friendly, empathetic, and supportive AI assistant named ViveFlow that connects with users on a personal level.
    Your personality is warm, encouraging, and genuinely caring - make users feel like they're chatting with a supportive friend who's fully invested in their success.
    
    You have access to a framework that has been generated for the user's idea.
    
    The original idea is: "${originalIdea}"
    
    The framework consists of the following elements:
    - goal: ${framework.goal || "Improve and implement your idea"}
    - action_steps: ${JSON.stringify(Array.isArray(framework.action_steps) ? framework.action_steps : [])}
    - challenges: ${JSON.stringify(Array.isArray(framework.challenges) ? framework.challenges : [])}
    - resources: ${JSON.stringify(Array.isArray(framework.resources) ? framework.resources : [])}
    - tips: ${JSON.stringify(formattedTips)}
    
    The detailed tips include:
    ${Array.isArray(framework.tip_details) 
      ? framework.tip_details.map((detail: any, index: number) => {
          if (!detail) return '';
          const tipText = detail.tip || formattedTips[index] || '';
          const examples = Array.isArray(detail.examples) ? detail.examples.join(', ') : '';
          const context = detail.context || '';
          // Format without showing field names, use explanation or description field if available
          const extraDetail = detail.explanation || detail.description || '';
          return `- ${tipText}\n  ${extraDetail ? `Further advice: ${extraDetail}\n  ` : ''}Examples: ${examples}\n  Best used: ${context}`;
        }).join('\n')
      : ''}
    
    Please pay special attention to the TIPS section, as these contain important best practices for implementation.
    
    When responding to the user:
    1. Be conversational and personable - use a casual, friendly tone with occasional interjections like "Great question!" or "I'm excited about this part!"
    2. Show genuine enthusiasm for their ideas and progress - make them feel their success matters to you
    3. Use supportive language that builds confidence - phrases like "You've got this!" or "I believe in your approach"
    4. Express emotions naturally using friendly emojis to convey warmth (😊), excitement (🎉), or thoughtfulness (🤔) where appropriate
    5. Ask engaging follow-up questions that show you're invested in their journey
    6. Celebrate small wins and acknowledge challenges with empathy
    7. Personalize responses by referencing previous parts of the conversation
    8. Use their name if they share it, and refer back to specific aspects of their idea
    9. Provide encouragement along with practical advice - balance emotional support with actionable guidance
    10. Be conversational but concise - keep responses friendly but focused
    
    CRITICAL INSTRUCTION - When showing code examples:
    - ALWAYS provide COMPLETE, EXECUTABLE code examples
    - Format code with triple backticks and language identifier (e.g., \`\`\`python)
    - NEVER use placeholders like CODEBLOCK0, [CODE], or [...] - provide the FULL actual code
    - Include helpful comments to explain key parts
    - Test your code mentally to ensure it would run correctly
    - Prioritize providing full working implementations over conceptual explanations
    
    Do not mention that you're accessing a framework or that you know their idea unless specifically asked.
    Respond naturally as a friendly, supportive assistant who genuinely cares about the user's success and emotional well-being.`;
    
    const requestBody = {
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 4000
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
    console.log("Chat API response successful");
    return jsonResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      console.error(`API call error: ${error.name} - ${error.message}`);
      if (error.name === 'AbortError') {
        return { error: "Request timed out. Please try again with a simpler question." };
      }
      return { error: error.message };
    }
    console.error("Unknown API call error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Helper function to clean markdown formatting but preserve code blocks
function cleanMarkdownFormatting(text: string): string {
  if (!text) return text;
  
  // Simplify code block handling - PRESERVE CODE BLOCKS EXACTLY AS THEY ARE
  // No placeholder substitution to prevent code corruption
  
  // Clean the text outside code blocks (but keep code blocks intact)
  let inCodeBlock = false;
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    // Check for code block delimiters
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line; // Keep code block markers unchanged
    }
    
    // If inside a code block, leave content untouched
    if (inCodeBlock) {
      return line;
    }
    
    // Process non-code text only
    let processed = line;
    
    // Leave inline code untouched
    const inlineCodeSegments: string[] = [];
    processed = processed.replace(/(`[^`]+`)/g, (match) => {
      inlineCodeSegments.push(match);
      return `__INLINE_CODE_${inlineCodeSegments.length - 1}__`;
    });
    
    // Remove markdown headers
    processed = processed.replace(/#{1,6}\s+/g, '');
    
    // Replace bold/italic markers with plain text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '$1');
    processed = processed.replace(/\*(.*?)\*/g, '$1');
    processed = processed.replace(/__(.*?)__/g, '$1');
    processed = processed.replace(/_(.*?)_/g, '$1');
    
    // Replace markdown bullet points with plain bullets
    processed = processed.replace(/^\s*[-*]\s+/g, '• ');
    
    // Restore inline code
    processed = processed.replace(/__INLINE_CODE_(\d+)__/g, (_, index) => {
      return inlineCodeSegments[parseInt(index)];
    });
    
    return processed;
  });
  
  // Ensure code blocks are properly closed
  let result = processedLines.join('\n');
  
  // Count backtick markers for code blocks
  const codeBlockMarkers = (result.match(/```/g) || []).length;
  
  // If odd number of code block markers, add closing marker
  if (codeBlockMarkers % 2 !== 0) {
    result += "\n```";
  }
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, framework, idea } = await request.json()

    if (!messages || !framework || !idea) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Limit message history to prevent large payloads
    const limitedMessages = messages.slice(-10) // Keep last 10 messages

    const result = await callGroqAPI(limitedMessages, framework, idea)
    
    // Check if there was an error from the API call
    if ('error' in result) {
      console.error("API returned error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    try {
      const responseContent = result.choices[0]?.message?.content;
      
      if (!responseContent) {
        console.error("API response missing content");
        return NextResponse.json(
          { error: "API response missing content" },
          { status: 500 }
        );
      }
      
      // Validate the response is a string
      if (typeof responseContent !== 'string') {
        console.error("API response content is not a string:", responseContent);
        return NextResponse.json(
          { error: "Invalid response format from the model" },
          { status: 500 }
        );
      }
      
      // Clean the response of markdown formatting
      const cleanedContent = cleanMarkdownFormatting(responseContent);
      
      return NextResponse.json({ 
        content: cleanedContent 
      });
    } catch (error) {
      console.error("Error processing chat response:", error);
      return NextResponse.json(
        { error: "Failed to process the response. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in chat response API:", error)
    
    let errorMessage = "Failed to process your message. Please try again.";
    if (error instanceof Error) {
      console.error("Error details:", error.name, error.message, error.stack);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 