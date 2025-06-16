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
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  duration: number
}

export interface CustomHeader {
  key: string
  value: string
}
