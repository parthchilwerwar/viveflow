"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ChevronDown, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JsonPanelProps {
  data: any
}

const JsonPanel = ({ data }: JsonPanelProps) => {
  const { toast } = useToast()
  const [expanded, setExpanded] = useState(true)
  const [showRawJson, setShowRawJson] = useState(false)

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);

  // Use useCallback for event handlers
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(memoizedData, null, 2))
    toast({
      title: "Copied to clipboard",
      description: "The data has been copied to your clipboard.",
    })
  }, [memoizedData, toast])

  const toggleRawJson = useCallback(() => {
    setShowRawJson(prev => !prev);
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  // Format the data in a more readable way
  const renderFormattedContent = useCallback(() => {
    return (
      <div className="p-6 prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-6 text-white">{memoizedData.goal}</h2>
        
        {/* Action Steps */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-semibold text-emerald-400 mb-3">
            <span className="mr-2">📋</span> Action Steps
          </h3>
          <ul className="space-y-2 pl-6">
            {memoizedData.action_steps.map((step: string, index: number) => (
              <li key={index} className="list-disc text-gray-300">{step}</li>
            ))}
          </ul>
        </div>
        
        {/* Challenges */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-semibold text-rose-400 mb-3">
            <span className="mr-2">⚠️</span> Challenges
          </h3>
          <ul className="space-y-2 pl-6">
            {memoizedData.challenges.map((challenge: string, index: number) => (
              <li key={index} className="list-disc text-gray-300">{challenge}</li>
            ))}
          </ul>
        </div>
        
        {/* Resources */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-semibold text-blue-400 mb-3">
            <span className="mr-2">🔧</span> Resources
          </h3>
          <ul className="space-y-2 pl-6">
            {memoizedData.resources.map((resource: string, index: number) => (
              <li key={index} className="list-disc text-gray-300">{resource}</li>
            ))}
          </ul>
        </div>
        
        {/* Tips */}
        <div className="mb-8">
          <h3 className="flex items-center text-lg font-semibold text-amber-400 mb-3">
            <span className="mr-2">💡</span> Tips
          </h3>
          <ul className="space-y-2 pl-6">
            {memoizedData.tips.map((tip: string, index: number) => (
              <li key={index} className="list-disc text-gray-300">{tip}</li>
            ))}
          </ul>
        </div>
        
        {/* Clarification Needed (if any) */}
        {memoizedData.clarification_needed && memoizedData.clarification_needed.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center text-lg font-semibold text-purple-400 mb-3">
              <span className="mr-2">❓</span> Clarification Needed
            </h3>
            <ul className="space-y-2 pl-6">
              {memoizedData.clarification_needed.map((item: string, index: number) => (
                <li key={index} className="list-disc text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }, [memoizedData]);

  return (
    <Card className="overflow-hidden bg-slate-900/60 border-gray-800 text-white">
      <div className="bg-slate-800 p-3 flex justify-between items-center">
        <div className="font-medium">Framework Details</div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleRawJson}
            className="text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            {showRawJson ? "Show Text View" : "Show JSON"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpanded}
            className="text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            {expanded ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                Expand
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="text-gray-300 hover:bg-slate-700 hover:text-white"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>
      {expanded && (
        <CardContent className="p-0">
          {showRawJson ? (
            <pre className="font-mono text-sm p-4 overflow-auto max-h-[500px] bg-slate-800/60 text-gray-300">
              {JSON.stringify(memoizedData, null, 2)}
            </pre>
          ) : (
            renderFormattedContent()
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default React.memo(JsonPanel)
