"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Send, Loader2, Bot, User, Copy, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { IdeaFramework } from "@/types/framework"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatbotProps {
  data: IdeaFramework
  idea: string
  logoSrc?: string
  assistantName?: string
}

// ViveFlow Logo component for bot avatar
const ViveFlowLogo = () => {
  return (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g transform="scale(0.80) translate(50, 50)">
        <path 
          d="M223 142c-60 0-109 25-145 75-36 51-36 102 0 153 36 50 85 75 145 75 61 0 110-25 146-75 36-51 36-102 0-153-36-50-85-75-146-75z" 
          fill="#6366F1" 
          stroke="#4F46E5" 
          strokeWidth="2"
        />
        <path 
          d="M368 260l-24-24h-48v48l48 48v-24h72v-48h-48z" 
          fill="white" 
          stroke="#4F46E5" 
          strokeWidth="2"
        />
        <path 
          d="M368 188a28 28 0 1 0 0-56 28 28 0 0 0 0 56z" 
          fill="#6366F1" 
          stroke="white" 
          strokeWidth="8"
        />
        <path 
          d="M416 260a28 28 0 1 0 0-56 28 28 0 0 0 0 56z" 
          fill="#6366F1" 
          stroke="white" 
          strokeWidth="8"
        />
        <path 
          d="M368 332a28 28 0 1 0 0-56 28 28 0 0 0 0 56z" 
          fill="#6366F1" 
          stroke="white" 
          strokeWidth="8"
        />
      </g>
    </svg>
  );
};

// Component for displaying code blocks with copy functionality
const CodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="my-4 rounded-md overflow-hidden border border-slate-600 shadow-lg">
      <div className="code-block-header px-3 py-2 flex justify-between items-center">
        <span className="text-xs font-mono font-semibold text-gray-200">
          {language || "code"}
        </span>
        <button 
          onClick={handleCopy}
          className="copy-button p-1 rounded hover:bg-slate-600 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-gray-200 text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Function to format message content with code blocks
const formatMessageContent = (content: string) => {
  if (!content) return "";
  
  // Check if the content contains code blocks
  if (!content.includes("```")) {
    // Process numbered lists to add proper spacing
    let processedContent = content;
    
    // Add extra line break after numbered list items (1. Item or 1) Item format)
    processedContent = processedContent.replace(/(\d+[\.\)]\s+[^\n]+)(?=\n\d+[\.\)])/g, '$1\n');
    
    // Add extra line breaks after bullet points
    processedContent = processedContent.replace(/([-•*]\s+[^\n]+)(?=\n[-•*])/g, '$1\n');
    
    // Convert double newlines to paragraphs for better spacing
    const paragraphs = processedContent.split(/\n\s*\n/);
    if (paragraphs.length > 1) {
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => {
            // Check if this paragraph is a list item
            const isList = /^\d+[\.\)]/.test(paragraph.trim()) || /^[-•*]/.test(paragraph.trim());
            // Apply different margin and padding for list items
            return (
              <p key={i} className={`whitespace-pre-wrap leading-relaxed ${isList ? 'pl-1 mb-2' : ''}`}>
                {paragraph}
              </p>
            );
          })}
        </div>
      );
    }
    
    // Check if single paragraph is a list and render accordingly
    const containsList = /\n\d+[\.\)]/.test(processedContent) || /\n[-•*]/.test(processedContent);
    
    if (containsList) {
      // Split by lines and group list items
      const lines = processedContent.split('\n');
      const elements: React.ReactNode[] = [];
      let currentList: string[] = [];
      let isInList = false;
      
      lines.forEach((line, i) => {
        const isListItem = /^\d+[\.\)]/.test(line.trim()) || /^[-•*]/.test(line.trim());
        
        if (isListItem) {
          isInList = true;
          currentList.push(line);
        } else {
          if (isInList && currentList.length > 0) {
            // End of a list, add it to elements
            elements.push(
              <div key={`list-${i}`} className="space-y-2 my-3">
                {currentList.map((item, j) => (
                  <p key={j} className="whitespace-pre-wrap leading-relaxed pl-1">{item}</p>
                ))}
              </div>
            );
            currentList = [];
            isInList = false;
          }
          
          if (line.trim()) {
            elements.push(
              <p key={`text-${i}`} className="whitespace-pre-wrap leading-relaxed mb-3">{line}</p>
            );
          }
        }
      });
      
      // Add any remaining list items
      if (isInList && currentList.length > 0) {
        elements.push(
          <div key="list-final" className="space-y-2 my-3">
            {currentList.map((item, j) => (
              <p key={j} className="whitespace-pre-wrap leading-relaxed pl-1">{item}</p>
            ))}
          </div>
        );
      }
      
      return <div className="space-y-2">{elements}</div>;
    }
    
    return <p className="whitespace-pre-wrap break-words leading-relaxed">{processedContent}</p>;
  }

  // Split content by code blocks with a better regex that handles multiline code properly
  const regex = /(```(?:\w+)?\n[\s\S]*?\n```)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Use regex to find all code blocks and split content properly
  while ((match = regex.exec(content)) !== null) {
    // Add text before this code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    
    // Add the code block
    parts.push({
      type: 'code',
      content: match[1]
    });
    
    lastIndex = match.index + match[1].length;
  }
  
  // Add remaining text after last code block
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }
  
  // If regex didn't match anything (malformed code blocks), fallback to simple display
  if (parts.length === 0) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }
  
  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <p key={index} className="whitespace-pre-wrap break-words mb-4 leading-relaxed">{part.content}</p>;
        } else {
          // Process code block
          const codeBlock = part.content;
          // Extract language if specified
          const languageMatch = codeBlock.match(/```(\w+)?\n/);
          const language = languageMatch && languageMatch[1] ? languageMatch[1] : "";
          
          // Extract code content (handle both with and without language specifier)
          const codeContent = codeBlock
            .replace(/```\w*\n/, "") // Remove opening ```language\n
            .replace(/\n```$/, ""); // Remove closing \n```
          
          return <CodeBlock key={index} code={codeContent} language={language} />;
        }
      })}
    </div>
  );
};

export default function Chatbot({ data, idea, logoSrc, assistantName = "ViveFlow Assistant" }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize the chat with a greeting message or load chat history
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem(`chat-history-${idea}`);
      if (savedChat) {
        const parsedChat = JSON.parse(savedChat);
        if (parsedChat.frameworkGoal === data.goal) {
          setMessages(parsedChat.messages);
          return; // Skip the greeting if we're loading history
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }

    // If no history or different framework, show greeting
    const tipsCount = Array.isArray(data.tips) ? data.tips.length : 0;
    const tipsMention = tipsCount > 0 ? ` I've got ${tipsCount} helpful tips ready to share whenever you need them! 💡` : '';
    const goalText = data.goal || "your idea";
    
    setMessages([
      {
        role: "assistant",
        content: `Hey there! 👋 I'm your ${assistantName} and I'm genuinely excited to help bring "${goalText}" to life!${tipsMention}\n\nHow are you feeling about your project today? I'd love to know what aspect we should explore first! 😊`,
      },
    ])
  }, [data.goal, assistantName, data.tips, idea])

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`chat-history-${idea}`, JSON.stringify({
          frameworkGoal: data.goal,
          messages: messages
        }));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages, data.goal, idea]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      // Format messages for the API
      const apiMessages = messages.concat({ role: "user", content: userMessage })
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Call our API endpoint
      const response = await fetch("/api/chat-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          framework: data,
          idea: idea
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to get a response";
        console.error("API error:", errorMessage);
        
        // Add a user-friendly error message to the chat
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: "I'm having trouble connecting to the Llama model. " +
            `Based on your framework for "${data.goal || 'your idea'}", I recommend focusing on the action steps and challenges outlined. ` +
            "Please try again in a moment when the model service becomes available."
        }]);
        
        throw new Error(errorMessage);
      }
      
      // We'll keep code block formatting intact here
      let responseContent = responseData.content;
      
      if (!responseContent || typeof responseContent !== 'string') {
        console.error("Invalid response content format:", responseContent);
        responseContent = "I apologize, but I received an invalid response format. Could you please try rephrasing your question?";
      }
      
      // Fix common code block formatting issues
      
      // 1. Fix missing closing backticks
      if ((responseContent.match(/```/g) || []).length % 2 !== 0) {
        responseContent += "\n```";
      }
      
      // 2. Ensure code blocks have proper formatting
      responseContent = responseContent.replace(/```(\w*)\s+/g, "```$1\n");
      
      // 3. Ensure code blocks end with a newline before closing backticks
      responseContent = responseContent.replace(/\s*```$/gm, "\n```");
      
      // Add assistant response to chat
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: responseContent
      }]);
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Model connection issue",
        description: "Having trouble connecting to the Llama model. Please try again shortly.",
        variant: "destructive",
      });
      
      // Error message is already added above
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/60 border border-gray-800 rounded-md">
      <div className="p-2 sm:p-3 border-b border-gray-800 bg-slate-800/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden">
              {logoSrc ? (
                <Image 
                  src={logoSrc}
                  alt="Bot Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <ViveFlowLogo />
              )}
            </div>
            <h3 className="text-sm sm:text-lg font-semibold">{assistantName}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Clear chat history
              try {
                localStorage.removeItem(`chat-history-${idea}`);
                // Reset to initial greeting
                const tipsCount = Array.isArray(data.tips) ? data.tips.length : 0;
                const tipsMention = tipsCount > 0 ? ` I've got ${tipsCount} helpful tips ready to share whenever you need them! 💡` : '';
                const goalText = data.goal || "your idea";
                
                setMessages([
                  {
                    role: "assistant",
                    content: `Hey there! 👋 I'm your ${assistantName} and I'm genuinely excited to help bring "${goalText}" to life!${tipsMention}\n\nHow are you feeling about your project today? I'd love to know what aspect we should explore first! 😊`,
                  },
                ]);
                
                toast({
                  title: "Chat cleared",
                  description: "Your conversation has been reset.",
                  variant: "default",
                });
              } catch (error) {
                console.error("Error clearing chat history:", error);
                toast({
                  title: "Error",
                  description: "Could not clear chat history.",
                  variant: "destructive",
                });
              }
            }}
            className="text-[10px] sm:text-xs text-black bg-white hover:bg-gray-300 px-1.5 py-0.5 sm:px-2 sm:py-1 h-auto min-h-0 rounded"
          >
            Clear
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">Ask questions about your framework and how to implement it</p>
      </div>
      
      <ScrollArea className="flex-grow p-2 sm:p-4" ref={scrollAreaRef}>
        <div className="space-y-4 sm:space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
            >
              <div
                className={`flex flex-row max-w-[95%] sm:max-w-[85%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-md"
                    : "bg-slate-800 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-md"
                } px-3 py-2 sm:px-5 sm:py-4`}
              >
                <div className="mr-2 sm:mr-3 mt-1 flex-shrink-0">
                  {message.role === "user" ? (
                    <div className="avatar-icon-container h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-r from-blue-600 to-blue-400 ring-2 ring-blue-300/30 shadow-md">
                      <User className="text-white" />
                    </div>
                  ) : (
                    <div className="avatar-icon-container h-6 w-6 sm:h-7 sm:w-7 bg-white rounded-full p-0.5 ring-2 ring-indigo-300/50 shadow-md overflow-hidden">
                      {logoSrc ? (
                        <Image 
                          src={logoSrc}
                          alt="Bot Logo"
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        <ViveFlowLogo />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm overflow-hidden break-words min-w-0 flex-grow">
                  {formatMessageContent(message.content)}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-white rounded-tl-lg rounded-tr-lg rounded-br-lg px-3 py-2 sm:px-4 sm:py-3 shadow-md">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-indigo-400 mr-2" />
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-2 sm:p-3 border-t border-gray-800">
        <div className="flex gap-1 sm:gap-2">
          <Textarea
            placeholder="Chat with me about your idea! I'm here to help... 💭"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none bg-slate-800/70 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-gray-500 rounded-md leading-relaxed text-xs sm:text-sm"
            style={{ color: 'white', padding: '0.5rem 0.75rem' }}
            rows={2}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all p-2 sm:p-3"
          >
            {loading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
} 