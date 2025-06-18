export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  github_url?: string
  live_url?: string
  created_at?: string
  updated_at?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormStatus {
  loading: boolean
  success: boolean
  error: string | null
}

export interface ApiEndpoint {
  id: number
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  category: string
  requiresAuth?: boolean
  parameters?: ApiParameter[]
  exampleResponse?: any
}

export interface ApiParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object'
  required: boolean
  description: string
  defaultValue?: any
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  duration: number
  timestamp: string
  size: number
}

export interface CustomHeader {
  key: string
  value: string
}

export interface RequestHistory {
  id: string
  endpoint: ApiEndpoint
  response: ApiResponse
  timestamp: string
  duration: number
}

export interface ApiCategory {
  id: string
  name: string
  description: string
  icon: string
  endpoints: ApiEndpoint[]
}

export interface ApiStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  popularEndpoints: { path: string; count: number }[]
}
