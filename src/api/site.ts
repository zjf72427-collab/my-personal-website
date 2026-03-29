const API_BASE = import.meta.env.VITE_API_URL || ''
const ADMIN_TOKEN_KEY = 'muz-admin-token'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled'

export interface ArticleSummary {
  id: number
  title: string
  summary: string
  category: string
  status: ArticleStatus
  isPublic: boolean
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface ArticleDetail extends ArticleSummary {
  content: string
}

export interface ArticlePayload {
  title: string
  summary?: string
  content: string
  category: string
  status?: ArticleStatus
  isPublic: boolean
  publishedAt?: string | null
}

export interface ProjectUpdateSummary {
  id: number
  title: string
  stage: string
  content?: string
  createdAt: string
}

export interface ProjectUpdatePayload {
  title: string
  content: string
  stage: string
}

export interface GuestbookMessage {
  id: number
  name: string
  body: string
  createdAt: string
}

export interface GuestbookPayload {
  name: string
  body: string
}

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

export interface GameScore {
  id: number
  nickname: string
  score: number
  createdAt: string
}

export interface GetArticlesOptions {
  admin?: boolean
  category?: string
  search?: string
  status?: ArticleStatus
  limit?: number
}

async function siteRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, init)

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`
    let errorMessage = fallbackMessage

    try {
      const data = await response.json()
      errorMessage = data.error || fallbackMessage
    } catch {}

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

function createJsonHeaders(withAuth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (withAuth) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

export const siteApi = {
  login(payload: LoginPayload) {
    return siteRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(payload)
    })
  },
  getArticles(options: boolean | GetArticlesOptions = false) {
    const normalizedOptions = typeof options === 'boolean' ? { admin: options } : options
    const query = new URLSearchParams()

    if (normalizedOptions.admin) {
      query.set('admin', '1')
    }

    if (normalizedOptions.category) {
      query.set('category', normalizedOptions.category)
    }

    if (normalizedOptions.search) {
      query.set('search', normalizedOptions.search)
    }

    if (normalizedOptions.status) {
      query.set('status', normalizedOptions.status)
    }

    if (typeof normalizedOptions.limit === 'number') {
      query.set('limit', String(normalizedOptions.limit))
    }

    const search = query.toString()

    return siteRequest<ArticleSummary[]>(`/api/articles${search ? `?${search}` : ''}`, {
      headers: normalizedOptions.admin ? createJsonHeaders(true) : undefined
    })
  },
  getArticle(id: number | string, admin = false) {
    return siteRequest<ArticleDetail>(`/api/articles/${id}`, {
      headers: admin ? createJsonHeaders(true) : undefined
    })
  },
  createArticle(payload: ArticlePayload) {
    return siteRequest<ArticleDetail>('/api/articles', {
      method: 'POST',
      headers: createJsonHeaders(true),
      body: JSON.stringify(payload)
    })
  },
  updateArticle(id: number, payload: ArticlePayload) {
    return siteRequest<ArticleDetail>(`/api/articles/${id}`, {
      method: 'PUT',
      headers: createJsonHeaders(true),
      body: JSON.stringify(payload)
    })
  },
  deleteArticle(id: number) {
    return siteRequest<{ ok: boolean }>(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: createJsonHeaders(true)
    })
  },
  getProjectUpdates() {
    return siteRequest<ProjectUpdateSummary[]>('/api/project-updates')
  },
  getProjectUpdate(id: number) {
    return siteRequest<ProjectUpdateSummary>(`/api/project-updates/${id}`)
  },
  createProjectUpdate(payload: ProjectUpdatePayload) {
    return siteRequest<ProjectUpdateSummary>('/api/project-updates', {
      method: 'POST',
      headers: createJsonHeaders(true),
      body: JSON.stringify(payload)
    })
  },
  updateProjectUpdate(id: number, payload: ProjectUpdatePayload) {
    return siteRequest<ProjectUpdateSummary>(`/api/project-updates/${id}`, {
      method: 'PUT',
      headers: createJsonHeaders(true),
      body: JSON.stringify(payload)
    })
  },
  deleteProjectUpdate(id: number) {
    return siteRequest<{ ok: boolean }>(`/api/project-updates/${id}`, {
      method: 'DELETE',
      headers: createJsonHeaders(true)
    })
  },
  getGuestbookMessages() {
    return siteRequest<GuestbookMessage[]>('/api/guestbook')
  },
  createGuestbookMessage(payload: GuestbookPayload) {
    return siteRequest<GuestbookMessage>('/api/guestbook', {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(payload)
    })
  },
  createContactMessage(payload: ContactPayload) {
    return siteRequest<{ ok: boolean; id: number }>('/api/contact', {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify(payload)
    })
  },
  getContactMessages() {
    return siteRequest<ContactMessage[]>('/api/contact', {
      headers: createJsonHeaders(true)
    })
  },
  getScores() {
    return siteRequest<GameScore[]>('/api/scores')
  }
}
