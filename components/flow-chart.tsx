"use client"

import React, { useMemo } from "react"
import ReactFlowChart from "./reactflow-chart"
import "@xyflow/react/dist/style.css"
import "../styles/reactflow.css"
import styles from "./flow-chart.module.css"
import { IdeaFramework } from "@/types/framework"

interface FlowChartProps {
  data: IdeaFramework
}

const FlowChart = ({ data }: FlowChartProps) => {
  // Fix: Don't use JSON.stringify in dependency array as it creates a new string on every render
  // Instead, use a proper deep comparison or rely on reference equality if data doesn't change often
  const memoizedData = useMemo(
    () => data,
    [
      data.goal, 
      data.action_steps, 
      data.challenges, 
      data.resources, 
      data.tips, 
      // Safely access clarification_needed with fallback
      Array.isArray(data.clarification_needed) 
        ? data.clarification_needed 
        : (typeof data.clarification_needed === 'string' ? data.clarification_needed : undefined)
    ],
  )

  return (
    <div className={styles.flowchartWrapper}>
      <ReactFlowChart data={memoizedData} />
    </div>
  )
}

export default React.memo(FlowChart)
