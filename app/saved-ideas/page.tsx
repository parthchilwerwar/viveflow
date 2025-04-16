"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import FlowChart from "@/components/flow-chart"
import JsonPanel from "@/components/json-panel"
import { useToast } from "@/hooks/use-toast"

interface SavedIdea {
  id: number
  idea: string
  framework: {
    goal: string
    action_steps: string[]
    challenges: string[]
    resources: string[]
    tips: string[]
    clarification_needed?: string[]
  }
}

export default function SavedIdeas() {
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved ideas from localStorage
    const ideas = JSON.parse(localStorage.getItem("viveflow-ideas") || "[]")
    setSavedIdeas(ideas)
  }, [])

  const deleteIdea = (id: number) => {
    const updatedIdeas = savedIdeas.filter((idea) => idea.id !== id)
    setSavedIdeas(updatedIdeas)
    localStorage.setItem("viveflow-ideas", JSON.stringify(updatedIdeas))

    if (selectedIdea?.id === id) {
      setSelectedIdea(null)
    }

    toast({
      title: "Idea deleted",
      description: "The saved idea has been removed.",
    })
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Saved Ideas</h1>
        <p className="text-muted-foreground">Review and manage your previously generated frameworks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            {savedIdeas.length > 0 ? (
              savedIdeas.map((idea) => (
                <Card
                  key={idea.id}
                  className={`cursor-pointer hover:border-teal-500 transition-colors ${
                    selectedIdea?.id === idea.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/20" : ""
                  }`}
                  onClick={() => setSelectedIdea(idea)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base truncate">{idea.framework.goal}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{idea.idea}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <p className="text-xs text-muted-foreground">{new Date(idea.id).toLocaleDateString()}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteIdea(idea.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No saved ideas</CardTitle>
                  <CardDescription>
                    You haven't saved any ideas yet. Generate some frameworks on the home page.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/">
                    <Button>Go to Home</Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedIdea ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedIdea.framework.goal}</CardTitle>
                  <CardDescription>Original idea: {selectedIdea.idea}</CardDescription>
                </CardHeader>
              </Card>

              <Tabs defaultValue="mindmap">
                <TabsList className="mb-4">
                  <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
                  <TabsTrigger value="json">Text View</TabsTrigger>
                </TabsList>

                <TabsContent value="mindmap" className="min-h-[500px]">
                  <FlowChart data={selectedIdea.framework} />
                </TabsContent>

                <TabsContent value="json">
                  <JsonPanel data={selectedIdea.framework} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Select an idea to view its details</p>
                {savedIdeas.length === 0 && (
                  <Link href="/">
                    <Button>Generate New Idea</Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
