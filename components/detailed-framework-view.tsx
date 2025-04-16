"use client"

import React from "react"
import { IdeaFramework, ActionStepDetail, ChallengeDetail, ResourceDetail, TipDetail as BaseTipDetail, Metric } from "@/types/framework"

// Add backwards compatibility for old tip details format
interface TipDetail extends BaseTipDetail {
  description?: string; // For backward compatibility
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock, ArrowUp, ArrowRight, Lightbulb, Info, Target, Users, Calendar } from "lucide-react"

interface DetailedFrameworkViewProps {
  data: IdeaFramework
}

export default function DetailedFrameworkView({ data }: DetailedFrameworkViewProps) {
  if (!data) return null

  // Helper function to render priority badges
  const PriorityBadge = ({ priority }: { priority?: string }) => {
    if (!priority) return null
    
    const colorMap: Record<string, string> = {
      'High': 'bg-red-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-green-500'
    }
    
    return (
      <Badge className={`${colorMap[priority] || 'bg-gray-500'} text-white ml-2`}>
        {priority}
      </Badge>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Action Steps</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{data.goal}</CardTitle>
              <CardDescription>{data.goal_description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.introduction && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                  <p className="text-gray-700 dark:text-gray-300">{data.introduction}</p>
                </div>
              )}
              
              {data.background_context && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Background</h3>
                  <p className="text-gray-700 dark:text-gray-300">{data.background_context}</p>
                </div>
              )}
              
              {data.stakeholders && data.stakeholders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Key Stakeholders
                  </h3>
                  <ul className="list-disc list-inside">
                    {data.stakeholders.map((stakeholder, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{stakeholder}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.conclusion && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
                  <p className="text-gray-700 dark:text-gray-300">{data.conclusion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Action Steps Tab */}
        <TabsContent value="actions" className="space-y-4">
          {data.action_step_details?.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span>{step.step}</span>
                  <PriorityBadge priority={step.priority} />
                </CardTitle>
                {step.estimated_time && (
                  <CardDescription className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {step.estimated_time}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                
                {step.examples && step.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Examples:</h4>
                    <ul className="list-disc list-inside pl-4">
                      {step.examples.map((example, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {step.subtasks && step.subtasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subtasks:</h4>
                    <ul className="space-y-1">
                      {step.subtasks.map((subtask, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{subtask}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          {data.challenge_details?.map((challenge, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span>{challenge.challenge}</span>
                  {challenge.probability && (
                    <PriorityBadge priority={challenge.probability} />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{challenge.description}</p>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Impact:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{challenge.impact}</p>
                </div>
                
                {challenge.potential_solutions && challenge.potential_solutions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Potential Solutions:</h4>
                    <ul className="list-disc list-inside pl-4">
                      {challenge.potential_solutions.map((solution, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{solution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          {data.resource_details?.map((resource, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{resource.resource}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{resource.description}</p>
                
                {resource.usage_tips && resource.usage_tips.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Usage Tips:</h4>
                    <ul className="list-disc list-inside pl-4">
                      {resource.usage_tips.map((tip, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Implementation Tab */}
        <TabsContent value="implementation" className="space-y-6">
          {/* Tips Section */}
          {data.tip_details && data.tip_details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {data.tip_details.map((tip, index) => (
                    <AccordionItem key={index} value={`tip-${index}`}>
                      <AccordionTrigger>{tip.tip}</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">{tip.explanation || tip.description}</p>
                        
                        {tip.examples && tip.examples.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples:</h4>
                            <ul className="list-disc list-inside pl-4">
                              {tip.examples.map((example, i) => (
                                <li key={i} className="text-gray-700 dark:text-gray-300">{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {tip.context && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">When to apply:</h4>
                            <p className="text-gray-700 dark:text-gray-300">{tip.context}</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
          
          {/* Timeline Section */}
          {data.timeline && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Implementation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.timeline.short_term && data.timeline.short_term.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Short-term (1-4 weeks)</h3>
                      <ul className="list-disc list-inside pl-4">
                        {data.timeline.short_term.map((item, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {data.timeline.medium_term && data.timeline.medium_term.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Medium-term (1-3 months)</h3>
                      <ul className="list-disc list-inside pl-4">
                        {data.timeline.medium_term.map((item, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {data.timeline.long_term && data.timeline.long_term.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Long-term (3+ months)</h3>
                      <ul className="list-disc list-inside pl-4">
                        {data.timeline.long_term.map((item, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Metrics Section */}
          {data.metrics && data.metrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.metrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{metric.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{metric.description}</p>
                      
                      {metric.target_value && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Target:</span>
                          <span>{metric.target_value}</span>
                        </div>
                      )}
                      
                      {metric.measurement_method && (
                        <div className="flex items-center text-sm mt-1">
                          <span className="font-medium mr-2">Measurement:</span>
                          <span>{metric.measurement_method}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 