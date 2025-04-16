"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { TrashIcon, PencilIcon, FolderIcon, TagIcon, SearchIcon, FilterIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"

interface IdeaFramework {
  goal: string
  action_steps: string[]
  challenges: string[]
  resources: string[]
  tips: string[]
  clarification_needed?: string[]
}

interface SavedFramework {
  id: number
  idea: string
  framework: IdeaFramework
  tags?: string[]
  folder?: string
  date?: string
}

// Sample folder options
const FOLDERS = ["Business", "Personal", "Project", "Education", "Other"]

// Sample tag options
const TAGS = ["Important", "In Progress", "Completed", "Business", "Creative", "Technical", "Research", "Strategy"]

export default function SavedFrameworks() {
  const [savedFrameworks, setSavedFrameworks] = useState<SavedFramework[]>([])
  const [filteredFrameworks, setFilteredFrameworks] = useState<SavedFramework[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [editingFramework, setEditingFramework] = useState<SavedFramework | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  useEffect(() => {
    // Load saved frameworks from localStorage
    try {
      const storedFrameworks = JSON.parse(localStorage.getItem("idea-frameworks") || "[]") as SavedFramework[]
      
      // Enrich with metadata if not present
      const enrichedFrameworks = storedFrameworks.map(framework => ({
        ...framework,
        tags: framework.tags || [],
        folder: framework.folder || "Other",
        date: framework.date || new Date(framework.id).toLocaleDateString()
      }))
      
      setSavedFrameworks(enrichedFrameworks)
      setFilteredFrameworks(enrichedFrameworks)
    } catch (error) {
      console.error("Error loading saved frameworks:", error)
      toast({
        title: "Error loading frameworks",
        description: "There was an error loading your saved frameworks.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    // Apply filters and search
    let results = [...savedFrameworks]
    
    // Apply folder filter
    if (activeFolder) {
      results = results.filter(framework => framework.folder === activeFolder)
    }
    
    // Apply tag filters
    if (activeTags.length > 0) {
      results = results.filter(framework => 
        activeTags.some(tag => framework.tags?.includes(tag))
      )
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(framework => 
        framework.idea.toLowerCase().includes(query) || 
        framework.framework.goal.toLowerCase().includes(query)
      )
    }
    
    setFilteredFrameworks(results)
  }, [savedFrameworks, searchQuery, activeFolder, activeTags])

  const handleDelete = (id: number) => {
    try {
      const updatedFrameworks = savedFrameworks.filter(framework => framework.id !== id)
      setSavedFrameworks(updatedFrameworks)
      localStorage.setItem("idea-frameworks", JSON.stringify(updatedFrameworks))
      
      toast({
        title: "Framework deleted",
        description: "The framework has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting framework",
        description: "There was an error deleting the framework.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (framework: SavedFramework) => {
    setEditingFramework(framework)
    setIsEditDialogOpen(true)
  }

  const saveEditedFramework = () => {
    if (!editingFramework) return
    
    try {
      const updatedFrameworks = savedFrameworks.map(framework => 
        framework.id === editingFramework.id ? editingFramework : framework
      )
      
      setSavedFrameworks(updatedFrameworks)
      localStorage.setItem("idea-frameworks", JSON.stringify(updatedFrameworks))
      
      setIsEditDialogOpen(false)
      setEditingFramework(null)
      
      toast({
        title: "Framework updated",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating framework",
        description: "There was an error saving your changes.",
        variant: "destructive",
      })
    }
  }

  const handleTagToggle = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActiveFolder(null)
    setActiveTags([])
  }

  const getFolderColor = (folder: string) => {
    const colors: Record<string, string> = {
      "Business": "bg-blue-800/30 text-blue-400",
      "Personal": "bg-green-800/30 text-green-400",
      "Project": "bg-purple-800/30 text-purple-400",
      "Education": "bg-yellow-800/30 text-yellow-400",
      "Other": "bg-gray-800/30 text-gray-400"
    }
    return colors[folder] || colors["Other"]
  }

  const getFrameworkSummary = (framework: IdeaFramework) => {
    const total = 
      framework.action_steps.length + 
      framework.challenges.length + 
      framework.resources.length + 
      framework.tips.length + 
      (framework.clarification_needed?.length || 0)
    
    return `${total} items (${framework.action_steps.length} actions, ${framework.challenges.length} challenges)`
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
            <Link href="/dashboard">
              <Button className="text-black hover:text-black-300 bg-white text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Saved Frameworks</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 sm:gap-6">
          {/* Sidebar / Filters */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 border-gray-800 text-white">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <SearchIcon size={16} className="text-blue-400" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search frameworks..."
                    className="pl-8 bg-slate-800/60 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderIcon size={18} className="text-blue-400" />
                  Folders
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-0 pr-0">
                <div className="space-y-1">
                  <Button 
                    variant="ghost"
                    className={`w-full justify-start ${activeFolder === null ? "bg-blue-600 text-white" : "text-gray-300"}`}
                    onClick={() => setActiveFolder(null)}
                  >
                    All Folders
                  </Button>
                  {FOLDERS.map(folder => (
                    <Button 
                      key={folder}
                      variant="ghost" 
                      className={`w-full justify-start ${activeFolder === folder ? "bg-blue-600 text-white" : "text-gray-300"}`}
                      onClick={() => setActiveFolder(folder === activeFolder ? null : folder)}
                    >
                      {folder}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TagIcon size={18} className="text-blue-400" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <Badge 
                      key={tag} 
                      variant={activeTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${activeTags.includes(tag) ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 text-gray-300 hover:border-gray-600"}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {(activeTags.length > 0 || activeFolder || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4 w-full bg-white text-black hover:bg-gray-300"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs defaultValue="grid" onValueChange={(value) => setView(value as "grid" | "list")}>
              <div className="flex justify-between items-center">
                <TabsList className="bg-slate-900/60 border border-gray-800">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white">Grid View</TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white">List View</TabsTrigger>
                </TabsList>
                <div className="text-sm text-gray-400">
                  {filteredFrameworks.length} {filteredFrameworks.length === 1 ? 'framework' : 'frameworks'} found
                </div>
              </div>

              <TabsContent value="grid" className="mt-6">
                {filteredFrameworks.length === 0 ? (
                  <div className="col-span-full text-center p-4 sm:p-8 bg-slate-900/60 rounded-lg border border-gray-800">
                    <p className="text-sm sm:text-base text-gray-400">No frameworks found. Try adjusting your filters or search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filteredFrameworks.map((item) => (
                      <Card key={item.id} className={`bg-slate-900/60 border-gray-800 text-white transition-all duration-200 hover:shadow-lg ${
                        view === "list" ? "w-full" : ""
                      }`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{item.framework.goal}</CardTitle>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Badge className={`text-xs ${getFolderColor(item.folder || "Other")}`}>
                              {item.folder || "Other"}
                            </Badge>
                            <span className="ml-auto">{item.date}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm line-clamp-2 text-gray-300">{item.idea}</p>
                          <div className="text-xs text-gray-400 mt-2">
                            {getFrameworkSummary(item.framework)}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs border-gray-700 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-300 hover:text-red-400 hover:bg-red-900/20"
                            onClick={() => handleDelete(item.id)}
                          >
                            <TrashIcon size={16} />
                          </Button>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className=" bg-white text-black hover:bg-gray-300"
                              onClick={() => handleEdit(item)}
                            >
                              <PencilIcon size={16} className="mr-1" />
                              Edit
                            </Button>
                            <Link href={`/dashboard?framework=${item.id}`}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View</Button>
                            </Link>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                {filteredFrameworks.length === 0 ? (
                  <div className="col-span-full text-center p-4 sm:p-8 bg-slate-900/60 rounded-lg border border-gray-800">
                    <p className="text-sm sm:text-base text-gray-400">No frameworks found. Try adjusting your filters or search.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFrameworks.map((item) => (
                      <Card key={item.id} className={`bg-slate-900/60 border-gray-800 text-white transition-all duration-200 hover:shadow-lg ${
                        view === "grid" ? "w-full" : ""
                      }`}>
                        <div className="flex items-start p-4 gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-base mb-1">{item.framework.goal}</h3>
                            <p className="text-sm text-gray-300 line-clamp-1">{item.idea}</p>
                            <div className="flex flex-wrap gap-2 mt-2 items-center">
                              <Badge className={`text-xs ${getFolderColor(item.folder || "Other")}`}>
                                {item.folder || "Other"}
                              </Badge>
                              <span className="text-xs text-gray-400">{getFrameworkSummary(item.framework)}</span>
                              <span className="text-xs text-gray-400 ml-auto">{item.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-300 hover:text-red-400 hover:bg-red-900/20"
                              onClick={() => handleDelete(item.id)}
                            >
                              <TrashIcon size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-300 hover:bg-slate-800"
                              onClick={() => handleEdit(item)}
                            >
                              <PencilIcon size={16} />
                            </Button>
                            <Link href={`/dashboard?framework=${item.id}`}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-gray-800 text-white">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <DialogTitle className="text-lg sm:text-xl">Edit Framework</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-400">
              Update the details of your saved framework
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="editIdea" className="text-sm sm:text-base">Framework Idea</Label>
              <Textarea 
                id="editIdea"
                value={editingFramework?.idea || ""}
                onChange={(e) => editingFramework && setEditingFramework({
                  ...editingFramework,
                  idea: e.target.value
                })}
                className="bg-slate-800/60 border-gray-700 text-white text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-folder">Folder</Label>
              <Select 
                value={editingFramework?.folder || "Other"}
                onValueChange={(value) => editingFramework && setEditingFramework({
                  ...editingFramework,
                  folder: value
                })}
              >
                <SelectTrigger id="edit-folder" className="bg-slate-800/60 border-gray-700 text-white">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-gray-700 text-white">
                  {FOLDERS.map(folder => (
                    <SelectItem key={folder} value={folder} className="focus:bg-slate-700 focus:text-white">
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <ScrollArea className="h-24 rounded-md border border-gray-700 bg-slate-800/60 p-2">
                {TAGS.map(tag => (
                  <div key={tag} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={editingFramework?.tags?.includes(tag) || false}
                      onCheckedChange={(checked) => {
                        if (!editingFramework) return;
                        
                        const newTags = checked 
                          ? [...(editingFramework.tags || []), tag]
                          : (editingFramework.tags || []).filter(t => t !== tag);
                        
                        setEditingFramework({
                          ...editingFramework,
                          tags: newTags
                        });
                      }}
                      className="bg-slate-700 border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={saveEditedFramework} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 