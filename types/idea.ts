export interface Idea {
  id: string
  text: string
  parentId?: string 
  children?: Idea[]
} 