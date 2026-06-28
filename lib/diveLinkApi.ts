import type { LoginResponse, AuthTokens, DiverIdentity, CertificationSummary } from '../types/divelink'

export class DiveLinkApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'DiveLinkApiError'
  }
}

function getBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_DIVELINK_API_URL
  if (!url) throw new Error('EXPO_PUBLIC_DIVELINK_API_URL is not set')
  return url.replace(/\/$/, '')
}

async function request<T>(
  path: string,
  accessToken?: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getBaseUrl()}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, { ...init, headers })

  if (!res.ok) {
    let code = 'UNKNOWN_ERROR'
    let message = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { code?: string; message?: string }
      code = body.code ?? code
      message = body.message ?? message
    } catch {
      // body not JSON — use fallback message
    }
    throw new DiveLinkApiError(res.status, code, message)
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const diveLinkApi = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>('/api/v1/auth/login', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    refresh: (refreshToken: string) =>
      request<AuthTokens>('/api/v1/auth/refresh', undefined, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    logout: (refreshToken: string) =>
      request<void>('/api/v1/auth/logout', undefined, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
  },

  divers: {
    me: (accessToken: string) =>
      request<DiverIdentity>('/api/v1/divers/me', accessToken),

    certifications: (diverId: string, accessToken: string) =>
      request<CertificationSummary[]>(
        `/api/v1/divers/${diverId}/certifications`,
        accessToken,
      ),
  },

  public: {
    verifyCertificate: (token: string) =>
      request<{ valid: boolean; diver?: DiverIdentity }>(
        `/api/v1/public/verify/${token}`,
      ),
  },
}
