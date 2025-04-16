"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, Wand2, ArrowLeft } from "lucide-react"
import FlowChart from "@/components/flow-chart"
import JsonPanel from "@/components/json-panel"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/error-boundary"
import ExportMenu from "@/components/export-menu"
import PromptEnhancer from "@/components/ai-suggestions"
import Link from "next/link"
import { FolderIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { IdeaFramework } from "@/types/framework"
import Chatbot from "@/components/chatbot"

interface SavedFramework {
  id: number
  idea: string
  framework: IdeaFramework
  tags?: string[]
  folder?: string
  date?: string
}

// Create a client component that uses the search params
function DashboardContent() {
  const [idea, setIdea] = useState("")
  const [framework, setFramework] = useState<IdeaFramework | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("mindmap")
  const [showPromptEnhancer, setShowPromptEnhancer] = useState(false)
  const [isViewingPrevious, setIsViewingPrevious] = useState(false)
  const [currentFrameworkId, setCurrentFrameworkId] = useState<number | null>(null)
  const { toast } = useToast()
  const frameworkRef = useRef<IdeaFramework | null>(null)
  const searchParams = useSearchParams()

  // Load a framework from URL if present
  useEffect(() => {
    const frameworkId = searchParams.get('framework')
    
    if (frameworkId) {
      try {
        // Try to load from localStorage
        const savedFrameworks = JSON.parse(localStorage.getItem("idea-frameworks") || "[]") as SavedFramework[]
        const targetFramework = savedFrameworks.find(f => f.id === parseInt(frameworkId))
        
        if (targetFramework) {
          // Set the idea and framework
          setIdea(targetFramework.idea)
          setFramework(targetFramework.framework)
          frameworkRef.current = targetFramework.framework
          setIsViewingPrevious(true)
          setCurrentFrameworkId(parseInt(frameworkId))
          
          toast({
            title: "Framework loaded",
            description: "A previously saved framework has been loaded.",
          })
        } else {
          toast({
            title: "Framework not found",
            description: "The requested framework could not be found.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading framework from URL:", error)
        toast({
          title: "Error loading framework",
          description: "There was an error loading the framework.",
          variant: "destructive",
        })
      }
    }
  }, [searchParams, toast])

  const processIdea = async () => {
    if (!idea.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your idea before generating a framework.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Sending idea to API:", idea.substring(0, 50) + "...");
      
      const response = await fetch("/api/process-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}:`, responseData);
        setLoading(false);
        toast({
          title: "Processing failed",
          description: responseData.error || "Failed to process idea. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("API response received, validating structure");
      
      // Validate the response structure
      const requiredFields = ["goal", "action_steps", "challenges", "resources", "tips"];
      let hasAllRequiredFields = true;
      
      // Instead of stopping on missing fields, log warnings and continue
      requiredFields.forEach(field => {
        if (!(field in responseData)) {
          console.warn(`Missing field in response: ${field}`);
          hasAllRequiredFields = false;
        } else if (Array.isArray(responseData[field]) && responseData[field].length === 0) {
          console.warn(`Field ${field} is empty array`);
        }
      });
      
      if (!hasAllRequiredFields) {
        console.warn("Some required fields are missing, but continuing with available data");
        toast({
          title: "Partial framework generated",
          description: "Some elements may be missing from the framework, but we'll display what we have.",
          variant: "default",
        });
      } else {
        console.log("Framework generated successfully");
      }
      
      // Ensure we have at least empty arrays for all required array fields
      if (!responseData.action_steps) responseData.action_steps = [];
      if (!responseData.challenges) responseData.challenges = [];
      if (!responseData.resources) responseData.resources = [];
      if (!responseData.tips) responseData.tips = [];
      
      // Update both state and ref to ensure synchronization
      setFramework(responseData);
      frameworkRef.current = responseData;
      setIsViewingPrevious(false);
      setCurrentFrameworkId(null);

      // Save to localStorage
      try {
        const savedIdeas = JSON.parse(localStorage.getItem("idea-frameworks") || "[]")
        const newSavedIdeas = [
          { id: Date.now(), idea, framework: responseData },
          ...savedIdeas.slice(0, 9), // Keep only the 10 most recent
        ]
        localStorage.setItem("idea-frameworks", JSON.stringify(newSavedIdeas))
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError)
      }
      
      // Force both views to render with the same data
      setActiveTab("mindmap")
      
      toast({
        title: "Success!",
        description: "Your idea has been processed and framework generated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error processing idea:", error)
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "There was an error processing your idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setIdea("")
    setFramework(null)
    frameworkRef.current = null
    setShowPromptEnhancer(false)
    setIsViewingPrevious(false)
    setCurrentFrameworkId(null)
  }
  
  const handleEnhancedPrompt = (enhancedPrompt: string) => {
    setIdea(enhancedPrompt)
    setShowPromptEnhancer(false)
    toast({
      title: "Idea enhanced",
      description: "Your enhanced idea is ready for framework generation.",
    })
  }
  
  const syncData = () => {
    if (!framework) return;
    
    // Make a deep copy of the framework data
    const currentData = JSON.parse(JSON.stringify(framework));
    
    // Use requestAnimationFrame to batch state updates
    requestAnimationFrame(() => {
      setFramework(currentData);
      toast({
        title: "Data synchronized",
        description: "Mind map and JSON view have been synchronized.",
      });
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-blue-950 text-white">
      {/* Dashboard Navigation - Dark navbar */}
      <header className="bg-slate-950 py-3 sm:py-5 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xl sm:text-2xl text-blue-400 font-bold">ViveFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link href="/saved">
              <Button variant="outline" className="gap-1 text-black hover:text-black-300 bg-white border-gray-700 hover:bg-gray-300 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4">
                <FolderIcon size={14} className="hidden sm:inline" />
                <span className="sm:ml-1">Saved</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl">
        <div className="text-center mb-6 sm:mb-8">
          {isViewingPrevious && (
            <div className="mb-3 sm:mb-4">
              <Link href="/saved">
                <Button variant="outline" className="gap-1 border-gray-700 text-black hover:bg-gray-300 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4">
                  <ArrowLeft size={14} className="sm:size-16" />
                  <span className="sm:ml-1">Back</span>
                </Button>
              </Link>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            {isViewingPrevious ? 'Saved Framework' : 'Idea Framework'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            {isViewingPrevious ? 'Viewing a previously saved framework' : 'Transform your ideas into actionable frameworks'}
          </p>
        </div>

        <Card className="mb-8 bg-slate-900/60 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>{isViewingPrevious ? 'Framework Idea' : 'Your Idea'}</CardTitle>
            <CardDescription className="text-gray-400">
              {isViewingPrevious 
                ? 'This is the idea that was used to generate this framework' 
                : 'Enter your goal, challenge, or abstract idea below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your idea... (e.g., 'I want to build a successful business empire')"
              className="min-h-[120px] font-mono text-base mb-4 bg-slate-800/60 border-gray-700 text-white placeholder:text-gray-500"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              readOnly={isViewingPrevious}
            />
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {!isViewingPrevious ? (
                  <>
                    <Button
                      onClick={processIdea}
                      disabled={loading}
                      className="gap-1 sm:gap-2 text-black bg-white hover:bg-gray-200 text-xs sm:text-sm py-2 px-2 sm:px-4 col-span-2 sm:col-span-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Generate Framework</span>
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={clearForm}
                      disabled={loading}
                      className="border-gray-700 bg-white text-black hover:bg-gray-300 hover:text-black text-xs sm:text-sm py-2 px-2 sm:px-4"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>Clear</span>
                    </Button>
    
                    {!showPromptEnhancer && (
                      <Button
                        variant="outline"
                        onClick={() => setShowPromptEnhancer(true)}
                        disabled={loading || !idea.trim()}
                        className="border-gray-700 bg-white text-black hover:bg-gray-300 hover:text-black text-xs sm:text-sm py-2 px-2 sm:px-4"
                      >
                        <span>⚡Enhance</span>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={clearForm}
                    className="border-gray-700 text-black hover:bg-gray-300 text-xs sm:text-sm py-2 px-2 sm:px-4 col-span-2"
                  >
                    <span>Create New</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {showPromptEnhancer && (
          <div className="mb-8">
            <PromptEnhancer
              originalPrompt={idea}
              onEnhancedPrompt={handleEnhancedPrompt}
            />
          </div>
        )}

        {framework && (
          <ErrorBoundary>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col mb-4 rounded-t-md">
                {/* Action buttons - moved to top for mobile */}
                <div className="flex gap-1 justify-end mb-2 px-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={syncData} 
                    title="Sync data between views" 
                    className="bg-white text-black hover:bg-gray-300 border-gray-700 p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Sync</span>
                  </Button>
                  
                  <div className="flex-none">
                    <ExportMenu elementId="flow-chart-container" filename={`framework-${currentFrameworkId || Date.now()}`} />
                  </div>
                </div>
                
                {/* Tabs list */}
                <TabsList className="bg-black w-full flex justify-between py-1 px-1">
                  <TabsTrigger 
                    value="mindmap"
                    className={`${activeTab === 'mindmap' ? 'bg-blue-600 text-white' : 'bg-transparent text-white hover:bg-blue-800/60'} px-2 sm:px-3 py-1.5 rounded text-xs whitespace-nowrap flex-1`}
                  >
                    Flow Chart
                  </TabsTrigger>
                  <TabsTrigger 
                    value="json"
                    className={`${activeTab === 'json' ? 'bg-blue-600 text-white' : 'bg-transparent text-white hover:bg-blue-800/60'} px-2 sm:px-3 py-1.5 rounded text-xs whitespace-nowrap flex-1`}
                  >
                    Text View
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chatbot"
                    className={`${activeTab === 'chatbot' ? 'bg-blue-600 text-white' : 'bg-transparent text-white hover:bg-blue-800/60'} px-2 sm:px-3 py-1.5 rounded text-xs whitespace-nowrap flex-1`}
                  >
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Removed "Back to editor" button */}

              <TabsContent value="mindmap" className="min-h-[500px] sm:min-h-[600px]">
                <div id="flow-chart-container">
                  <FlowChart data={framework} />
                </div>
              </TabsContent>

              <TabsContent value="json">
                <JsonPanel data={framework} />
              </TabsContent>
              
              <TabsContent value="chatbot">
                <Chatbot data={framework} idea={idea} />
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}

// Main dashboard component that wraps the content in Suspense
export default function Dashboard() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}