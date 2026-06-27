export type CmasCertificationLevel =
  | 'CMAS_1_STAR'
  | 'CMAS_2_STAR'
  | 'CMAS_3_STAR'
  | 'CMAS_INSTRUCTOR_1'
  | 'CMAS_INSTRUCTOR_2'
  | 'CMAS_INSTRUCTOR_3'

export type CertificationStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED'

export type CertificationSummary = {
  id: string
  level: CmasCertificationLevel
  status: CertificationStatus
  issued_at: string
  expires_at: string | null
  /** Numeric tier 0-3 derived from level, used for content gating. */
  cert_tier: number
}

export type DiverRole = 'DIVER' | 'INSTRUCTOR' | 'FEDERATION_ADMIN' | 'SUPER_ADMIN'

export type DiverIdentity = {
  id: string
  email: string
  display_name: string
  cmas_membership_number: string
  roles: DiverRole[]
  certifications: CertificationSummary[]
  highest_active_certification: CertificationSummary | null
  /** true when any active instructor-grade cert exists (derived on session start). */
  is_instructor: boolean
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export type LoginResponse = {
  tokens: AuthTokens
  diver: DiverIdentity
}

export type DiveLinkApiError = {
  message: string
  code: string
  status: number
}
