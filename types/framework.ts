export interface IdeaFramework {
  // Core elements
  goal: string
  action_steps: string[]
  challenges: string[]
  resources: string[]
  tips: string[]
  clarification_needed?: string[]
  
  // Enhanced elements with examples and descriptions
  goal_description?: string
  introduction?: string
  background_context?: string
  action_step_details?: ActionStepDetail[]
  challenge_details?: ChallengeDetail[]
  resource_details?: ResourceDetail[]
  tip_details?: TipDetail[]
  timeline?: Timeline
  metrics?: Metric[]
  stakeholders?: string[]
  conclusion?: string
}

export interface ActionStepDetail {
  step: string
  description: string
  examples: string[]
  subtasks?: string[]
  estimated_time?: string
  priority?: 'Low' | 'Medium' | 'High'
}

export interface ChallengeDetail {
  challenge: string
  description: string
  potential_solutions: string[]
  impact: string
  probability?: 'Low' | 'Medium' | 'High'
}

export interface ResourceDetail {
  resource: string
  description: string
  usage_tips?: string[]
}

export interface TipDetail {
  tip: string
  explanation: string
  examples: string[]
  context: string
  description?: string
}

export interface Timeline {
  short_term: string[]
  medium_term: string[]
  long_term: string[]
}

export interface Metric {
  name: string
  description: string
  target_value?: string
  measurement_method?: string
} 