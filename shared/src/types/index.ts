// Shared Types
// Add common types used by both frontend and backend here

export interface User {
  id: string
  walletAddress: string
  createdAt: Date
  updatedAt: Date
}

export interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: IdeaStatus
  upvotes: number
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export type IdeaStatus = 'pending' | 'approved' | 'rejected' | 'implemented'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AuthPayload {
  userId: string
  walletAddress: string
  exp: number
  iat: number
}
