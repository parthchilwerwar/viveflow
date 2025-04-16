"use client"

import React, { useMemo } from "react"
import ReactFlowChart from "./reactflow-chart"
import "@xyflow/react/dist/style.css"
import "../styles/reactflow.css"
import styles from "./flow-chart.module.css"

interface IdeaFramework {
  goal: string
  action_steps: string[]
  challenges: string[]
  resources: string[]
  tips: string[]
  clarification_needed?: string[]
}

interface FlowChartProps {
  data: IdeaFramework
}

const FlowChart = ({ data }: FlowChartProps) => {
  // Fix: Don't use JSON.stringify in dependency array as it creates a new string on every render
  // Instead, use a proper deep comparison or rely on reference equality if data doesn't change often
  const memoizedData = useMemo(
    () => data,
    [data.goal, data.action_steps, data.challenges, data.resources, data.tips, data.clarification_needed],
  )

  return (
    <div className={styles.flowchartWrapper}>
      <ReactFlowChart data={memoizedData} />
    </div>
  )
}

export default React.memo(FlowChart)
