"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lightbulb, RefreshCw, Sparkles, ArrowRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface PromptEnhancerProps {
  originalPrompt: string
  onEnhancedPrompt: (enhancedPrompt: string) => void
}

export default function PromptEnhancer({ originalPrompt, onEnhancedPrompt }: PromptEnhancerProps) {
  const [loading, setLoading] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const enhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter an idea first before enhancing.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: originalPrompt,
          context: "idea_framework" // Add context to ensure framework-specific enhancement
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance prompt")
      }

      setEnhancedPrompt(data.enhancedPrompt)
      
      toast({
        title: "Prompt enhanced",
        description: "Your idea has been expanded for better framework generation.",
      })
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Enhancement failed",
        description: "An error occurred while enhancing your idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyEnhancedPrompt = () => {
    if (!enhancedPrompt.trim()) return
    onEnhancedPrompt(enhancedPrompt)
    
    toast({
      title: "Enhanced idea applied",
      description: "Your enhanced idea is ready for framework generation.",
    })
  }

  return (
    <Card className="w-full bg-slate-900/60 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-400" />
          Idea Enhancer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Expand your brief idea into a detailed description for better framework generation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!enhancedPrompt ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Lightbulb size={48} className="text-blue-400 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2 text-white">Enhance your idea</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Turn your brief idea into a more detailed concept. Our AI will add structure and depth to your idea, making it easier to generate a comprehensive framework.
            </p>
            {error && (
              <div className="text-red-400 mb-4 text-sm p-3 bg-red-900/30 border border-red-800 rounded-md max-w-md">
                {error}
              </div>
            )}
            <Button
              onClick={enhancePrompt}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing your idea...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance My Idea
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Original Idea:</h3>
              <div className="p-3 bg-slate-800/60 rounded-md text-sm text-gray-300">
                {originalPrompt}
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <ArrowRight className="text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Enhanced Idea:</h3>
              <Textarea 
                value={enhancedPrompt} 
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                className="min-h-[120px] font-mono text-sm bg-slate-800/60 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEnhancedPrompt("")}
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Reset
              </Button>
              <Button 
                onClick={applyEnhancedPrompt}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use Enhanced Idea
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 