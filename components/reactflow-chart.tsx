"use client"

import { useCallback, useEffect } from "react"
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
  Panel
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import ErrorBoundary from './error-boundary'

interface IdeaFramework {
  goal: string
  action_steps: string[]
  challenges: string[]
  resources: string[]
  tips: string[]
  clarification_needed?: string[]
}

interface ReactFlowChartProps {
  data: IdeaFramework
}

// Define custom node and edge types for TypeScript
type CustomNode = {
  id: string
  data: { label: string }
  position: { x: number; y: number }
  style?: React.CSSProperties
  className?: string
}

type CustomEdge = {
  id: string
  source: string
  target: string
  animated?: boolean
  style?: React.CSSProperties
  className?: string
  markerEnd?: {
    type: MarkerType
    color: string
  }
}

export default function ReactFlowChart({ data }: ReactFlowChartProps) {
  // Use proper type annotations for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([])

  const createNodesAndEdges = useCallback((data: IdeaFramework) => {
    const newNodes: CustomNode[] = []
    const newEdges: CustomEdge[] = []

    // Determine if we're in a mobile viewport (approximate)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    // Base positions and sizing - responsive values
    const centerX = 0
    const startY = 0
    const horizontalSpacing = isMobile ? 300 : 500
    const verticalSpacing = isMobile ? 120 : 150
    const nodeWidth = isMobile ? 180 : 240

    // Define colors for each category
    const colors = {
      goal: { bg: '#1a2a5e', border: '#5eabff', text: '#ffffff' },
      action_steps: { bg: '#1a342e', border: '#2fcca0', text: '#ffffff' },
      challenges: { bg: '#2a1a1a', border: '#ff5757', text: '#ffffff' },
      resources: { bg: '#1a2e36', border: '#4dcce6', text: '#ffffff' },
      tips: { bg: '#2a240d', border: '#ffb940', text: '#ffffff' },
      clarification: { bg: '#231a40', border: '#a78bff', text: '#ffffff' }
    }

    // Add goal node at the top center
    newNodes.push({
      id: 'goal',
      data: { label: data.goal },
      position: { x: centerX - nodeWidth/2, y: startY },
      style: {
        width: nodeWidth,
        padding: isMobile ? '8px' : '12px',
        border: `1px solid ${colors.goal.border}`,
        borderRadius: '4px',
        background: colors.goal.bg,
        color: colors.goal.text,
        textAlign: 'center',
        fontSize: isMobile ? '12px' : '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    })

    // Add category nodes in a tree structure
    // Action Steps (left top)
    const actionStepsX = centerX - horizontalSpacing
    const actionStepsY = startY + verticalSpacing
    newNodes.push({
      id: 'action_steps',
      data: { label: 'Action Steps' },
      position: { x: actionStepsX - nodeWidth/2, y: actionStepsY },
      style: {
        width: nodeWidth,
        padding: '10px',
        border: `1px solid ${colors.action_steps.border}`,
        borderRadius: '4px',
        background: colors.action_steps.bg,
        color: colors.action_steps.text,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    })

    // Challenges (right top)
    const challengesX = centerX + horizontalSpacing
    const challengesY = startY + verticalSpacing
    newNodes.push({
      id: 'challenges',
      data: { label: 'Challenges' },
      position: { x: challengesX - nodeWidth/2, y: challengesY },
      style: {
        width: nodeWidth,
        padding: '10px',
        border: `1px solid ${colors.challenges.border}`,
        borderRadius: '4px',
        background: colors.challenges.bg,
        color: colors.challenges.text,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    })

    // Resources (left bottom)
    const resourcesX = centerX - horizontalSpacing
    const resourcesY = startY + verticalSpacing * 7
    newNodes.push({
      id: 'resources',
      data: { label: 'Resources' },
      position: { x: resourcesX - nodeWidth/2, y: resourcesY },
      style: {
        width: nodeWidth,
        padding: '10px',
        border: `1px solid ${colors.resources.border}`,
        borderRadius: '4px',
        background: colors.resources.bg,
        color: colors.resources.text,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    })

    // Tips (right bottom)
    const tipsX = centerX + horizontalSpacing
    const tipsY = startY + verticalSpacing * 7
    newNodes.push({
      id: 'tips',
      data: { label: 'Tips' },
      position: { x: tipsX - nodeWidth/2, y: tipsY },
      style: {
        width: nodeWidth,
        padding: '10px',
        border: `1px solid ${colors.tips.border}`,
        borderRadius: '4px',
        background: colors.tips.bg,
        color: colors.tips.text,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    })

    // Create edges from goal to categories
    // Edge to Action Steps
    newEdges.push({
      id: 'goal-action_steps',
      source: 'goal',
      target: 'action_steps',
      style: { 
        stroke: colors.action_steps.border,
        strokeDasharray: '5 5',
        strokeWidth: 1.5
      },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: colors.action_steps.border,
      }
    })

    // Edge to Challenges
    newEdges.push({
      id: 'goal-challenges',
      source: 'goal',
      target: 'challenges',
      style: { 
        stroke: colors.challenges.border,
        strokeDasharray: '5 5',
        strokeWidth: 1.5
      },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: colors.challenges.border,
      }
    })

    // Edge to Resources
    newEdges.push({
      id: 'goal-resources',
      source: 'goal',
      target: 'resources',
      style: { 
        stroke: colors.resources.border,
        strokeDasharray: '5 5',
        strokeWidth: 1.5
      },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: colors.resources.border,
      }
    })

    // Edge to Tips
    newEdges.push({
      id: 'goal-tips',
      source: 'goal',
      target: 'tips',
      style: { 
        stroke: colors.tips.border,
        strokeDasharray: '5 5',
        strokeWidth: 1.5
      },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: colors.tips.border,
      }
    })

    // Add Action Steps items
    data.action_steps.forEach((item, index) => {
      const itemId = `action_steps-${index}`
      const offset = (index + 1) * verticalSpacing * 0.85
      const itemX = actionStepsX + (index % 2 === 0 ? -200 : 200)
      const itemY = actionStepsY + offset

      newNodes.push({
        id: itemId,
        data: { label: item },
        position: { x: itemX - nodeWidth/2, y: itemY },
        style: {
          width: nodeWidth,
          padding: '8px',
          border: `1px solid ${colors.action_steps.border}`,
          borderRadius: '4px',
          background: colors.action_steps.bg,
          color: '#ffffff',
          fontSize: '13px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }
      })

      newEdges.push({
        id: `action_steps-${itemId}`,
        source: 'action_steps',
        target: itemId,
        style: { 
          stroke: colors.action_steps.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: colors.action_steps.border,
        }
      })

      
      if (index > 0 && index < data.action_steps.length - 1 && index % 2 === 0) {
        newEdges.push({
          id: `action_steps-${index-1}-${index}`,
          source: `action_steps-${index-1}`,
          target: `action_steps-${index}`,
          style: { 
            stroke: colors.action_steps.border,
            strokeDasharray: '5 5',
            strokeWidth: 1
          }
        })
      }
    })

    
    data.challenges.forEach((item, index) => {
      const itemId = `challenges-${index}`
      const offset = (index + 1) * verticalSpacing * 0.85
      const itemX = challengesX + (index % 2 === 0 ? -200 : 200)
      const itemY = challengesY + offset

      newNodes.push({
        id: itemId,
        data: { label: item },
        position: { x: itemX - nodeWidth/2, y: itemY },
        style: {
          width: nodeWidth,
          padding: '8px',
          border: `1px solid ${colors.challenges.border}`,
          borderRadius: '4px',
          background: colors.challenges.bg,
          color: '#ffffff',
          fontSize: '13px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }
      })

      newEdges.push({
        id: `challenges-${itemId}`,
        source: 'challenges',
        target: itemId,
        style: { 
          stroke: colors.challenges.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: colors.challenges.border,
        }
      })

      
      if (index > 0 && index < data.challenges.length - 1 && index % 2 === 0) {
        newEdges.push({
          id: `challenges-${index-1}-${index}`,
          source: `challenges-${index-1}`,
          target: `challenges-${index}`,
          style: { 
            stroke: colors.challenges.border,
            strokeDasharray: '5 5',
            strokeWidth: 1
          }
        })
      }
    })

    
    data.resources.forEach((item, index) => {
      const itemId = `resources-${index}`
      const offset = (index + 1) * verticalSpacing * 0.85
      const itemX = resourcesX + (index % 2 === 0 ? -200 : 200)
      const itemY = resourcesY + offset

      newNodes.push({
        id: itemId,
        data: { label: item },
        position: { x: itemX - nodeWidth/2, y: itemY },
        style: {
          width: nodeWidth,
          padding: '8px',
          border: `1px solid ${colors.resources.border}`,
          borderRadius: '4px',
          background: colors.resources.bg,
          color: '#ffffff',
          fontSize: '13px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }
      })

      newEdges.push({
        id: `resources-${itemId}`,
        source: 'resources',
        target: itemId,
        style: { 
          stroke: colors.resources.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: colors.resources.border,
        }
      })
    })

    // Add Tips items
    data.tips.forEach((item, index) => {
      const itemId = `tips-${index}`
      const offset = (index + 1) * verticalSpacing * 0.85
      const itemX = tipsX + (index % 2 === 0 ? -200 : 200)
      const itemY = tipsY + offset

      newNodes.push({
        id: itemId,
        data: { label: item },
        position: { x: itemX - nodeWidth/2, y: itemY },
        style: {
          width: nodeWidth,
          padding: '8px',
          border: `1px solid ${colors.tips.border}`,
          borderRadius: '4px',
          background: colors.tips.bg,
          color: '#ffffff',
          fontSize: '13px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }
      })

      newEdges.push({
        id: `tips-${itemId}`,
        source: 'tips',
        target: itemId,
        style: { 
          stroke: colors.tips.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: colors.tips.border,
        }
      })
    })

    // Add cross-connections between categories (similar to the image)
    // Action Steps to Resources
    if (data.action_steps.length > 0 && data.resources.length > 0) {
      newEdges.push({
        id: 'action_steps-resources',
        source: 'action_steps',
        target: 'resources',
        style: { 
          stroke: colors.action_steps.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        }
      })
    }

    // Challenges to Tips
    if (data.challenges.length > 0 && data.tips.length > 0) {
      newEdges.push({
        id: 'challenges-tips',
        source: 'challenges',
        target: 'tips',
        style: { 
          stroke: colors.challenges.border,
          strokeDasharray: '5 5',
          strokeWidth: 1
        }
      })
    }

    // Action Steps to Challenges (some items may connect)
    if (data.action_steps.length > 0 && data.challenges.length > 0) {
      const sourceItemId = `action_steps-${Math.min(1, data.action_steps.length - 1)}`
      const targetItemId = `challenges-${Math.min(1, data.challenges.length - 1)}`
      
      newEdges.push({
        id: `${sourceItemId}-${targetItemId}`,
        source: sourceItemId,
        target: targetItemId,
        style: { 
          stroke: '#999999',
          strokeDasharray: '5 5',
          strokeWidth: 1
        }
      })
    }

    // Add clarification nodes if needed
    if (data.clarification_needed && data.clarification_needed.length > 0) {
      // Place clarification below the goal
      const clarificationX = centerX
      const clarificationY = startY + verticalSpacing * 10
      
      newNodes.push({
        id: 'clarification',
        data: { label: 'Clarification Needed' },
        position: { x: clarificationX - nodeWidth/2, y: clarificationY },
        style: {
          width: nodeWidth,
          padding: '10px',
          border: `1px solid ${colors.clarification.border}`,
          borderRadius: '4px',
          background: colors.clarification.bg,
          color: colors.clarification.text,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      })

      newEdges.push({
        id: 'goal-clarification',
        source: 'goal',
        target: 'clarification',
        style: { 
          stroke: colors.clarification.border,
          strokeDasharray: '5 5',
          strokeWidth: 1.5
        },
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: colors.clarification.border,
        }
      })

      // Add clarification items
      data.clarification_needed.forEach((item, index) => {
        const itemId = `clarification-${index}`
        const offset = (index + 1) * verticalSpacing * 0.85
        const itemX = clarificationX + (index % 2 === 0 ? -200 : 200)
        const itemY = clarificationY + offset

        newNodes.push({
          id: itemId,
          data: { label: item },
          position: { x: itemX - nodeWidth/2, y: itemY },
          style: {
            width: nodeWidth,
            padding: '8px',
            border: `1px solid ${colors.clarification.border}`,
            borderRadius: '4px',
            background: colors.clarification.bg,
            color: '#ffffff',
            fontSize: '13px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }
        })

        newEdges.push({
          id: `clarification-${itemId}`,
          source: 'clarification',
          target: itemId,
          style: { 
            stroke: colors.clarification.border,
            strokeDasharray: '5 5',
            strokeWidth: 1
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: colors.clarification.border,
          }
        })
      })
    }

    return { nodes: newNodes, edges: newEdges }
  }, [])

  useEffect(() => {
    if (data) {
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(data)
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [data, createNodesAndEdges, setNodes, setEdges])

  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <div style={{ width: '100%', height: '600px' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.5 }}
      attributionPosition="bottom-left"
      minZoom={0.2}
      maxZoom={1.5}
      zoomOnScroll={true}
      panOnScroll={false}
      zoomOnPinch={true}
      panOnDrag={true}
    >
      <Controls 
        showInteractive={false}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          padding: '4px',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }}
      />
      <Background color="#222" gap={16} />
      <Panel position="top-right" className="bg-slate-900/80 border border-gray-700 p-2 rounded text-xs text-gray-300">
        <div className="flex flex-col gap-1">
          <div>Scroll to zoom in/out</div>
          <div>Drag empty space to pan</div>
        </div>
      </Panel>
    </ReactFlow>
      </div>
        </ReactFlowProvider>
    </ErrorBoundary>
  )
}