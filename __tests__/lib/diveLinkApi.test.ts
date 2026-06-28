import { diveLinkApi, DiveLinkApiError } from '../../lib/diveLinkApi'

const BASE = 'http://localhost:3000'

/** Helper: mock the next fetch call with a given status and JSON body. */
function mockFetch(status: number, body: unknown): jest.SpyInstance {
  return jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response)
}

describe('diveLinkApi', () => {
  const _env = process.env

  beforeAll(() => {
    process.env = { ..._env, EXPO_PUBLIC_DIVELINK_API_URL: BASE }
  })

  afterAll(() => {
    process.env = _env
  })

  afterEach(() => jest.restoreAllMocks())

  // ── auth.login ────────────────────────────────────────────────────────────

  describe('auth.login', () => {
    const PAYLOAD = {
      tokens: { access_token: 'acc', refresh_token: 'ref', expires_in: 3600 },
      diver: { id: 'u1', email: 'a@b.com', display_name: 'Alice', is_instructor: false },
    }

    it('POSTs to /api/v1/auth/login', async () => {
      const spy = mockFetch(200, PAYLOAD)
      await diveLinkApi.auth.login('a@b.com', 'pass')
      expect(spy).toHaveBeenCalledWith(
        `${BASE}/api/v1/auth/login`,
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('returns LoginResponse on 200', async () => {
      mockFetch(200, PAYLOAD)
      const r = await diveLinkApi.auth.login('a@b.com', 'pass')
      expect(r.tokens.access_token).toBe('acc')
      expect(r.diver.id).toBe('u1')
    })

    it('throws DiveLinkApiError on 401', async () => {
      mockFetch(401, { code: 'INVALID_CREDENTIALS', message: 'Wrong password' })
      await expect(diveLinkApi.auth.login('a@b.com', 'bad')).rejects.toBeInstanceOf(DiveLinkApiError)
    })

    it('DiveLinkApiError carries status and code', async () => {
      mockFetch(401, { code: 'INVALID_CREDENTIALS', message: 'Wrong password' })
      try {
        await diveLinkApi.auth.login('a@b.com', 'bad')
      } catch (e) {
        expect((e as DiveLinkApiError).status).toBe(401)
        expect((e as DiveLinkApiError).code).toBe('INVALID_CREDENTIALS')
      }
    })
  })

  // ── auth.refresh ──────────────────────────────────────────────────────────

  describe('auth.refresh', () => {
    it('POSTs refresh token and returns new AuthTokens', async () => {
      const tokens = { access_token: 'new-acc', refresh_token: 'new-ref', expires_in: 3600 }
      const spy = mockFetch(200, tokens)
      const r = await diveLinkApi.auth.refresh('old-ref')
      expect(spy).toHaveBeenCalledWith(`${BASE}/api/v1/auth/refresh`, expect.objectContaining({ method: 'POST' }))
      expect(r.access_token).toBe('new-acc')
    })

    it('throws DiveLinkApiError on 403 (expired)', async () => {
      mockFetch(403, { code: 'TOKEN_EXPIRED', message: 'Refresh token expired' })
      await expect(diveLinkApi.auth.refresh('stale')).rejects.toBeInstanceOf(DiveLinkApiError)
    })
  })

  // ── auth.logout ───────────────────────────────────────────────────────────

  describe('auth.logout', () => {
    it('POSTs to /api/v1/auth/logout', async () => {
      const spy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => undefined,
      } as unknown as Response)
      await diveLinkApi.auth.logout('ref-token')
      expect(spy).toHaveBeenCalledWith(`${BASE}/api/v1/auth/logout`, expect.objectContaining({ method: 'POST' }))
    })
  })

  // ── divers.me ─────────────────────────────────────────────────────────────

  describe('divers.me', () => {
    const DIVER = { id: 'u1', email: 'a@b.com', display_name: 'Alice', is_instructor: false }

    it('sends Authorization header', async () => {
      const spy = mockFetch(200, DIVER)
      await diveLinkApi.divers.me('my-jwt')
      expect(spy).toHaveBeenCalledWith(
        `${BASE}/api/v1/divers/me`,
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer my-jwt' }),
        }),
      )
    })

    it('returns DiverIdentity on 200', async () => {
      mockFetch(200, DIVER)
      const r = await diveLinkApi.divers.me('jwt')
      expect(r.id).toBe('u1')
      expect(r.is_instructor).toBe(false)
    })

    it('throws DiveLinkApiError on 401', async () => {
      mockFetch(401, { code: 'UNAUTHORIZED', message: 'Unauthorized' })
      await expect(diveLinkApi.divers.me('bad')).rejects.toBeInstanceOf(DiveLinkApiError)
    })
  })

  // ── divers.certifications ─────────────────────────────────────────────────

  describe('divers.certifications', () => {
    it('requests the correct URL with auth header', async () => {
      const certs = [{ id: 'c1', level: 'CMAS_2_STAR', status: 'ACTIVE', cert_tier: 2 }]
      const spy = mockFetch(200, certs)
      const r = await diveLinkApi.divers.certifications('diver-uuid', 'acc-token')
      expect(spy).toHaveBeenCalledWith(
        `${BASE}/api/v1/divers/diver-uuid/certifications`,
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer acc-token' }),
        }),
      )
      expect(r[0].level).toBe('CMAS_2_STAR')
    })
  })

  // ── public.verifyCertificate ──────────────────────────────────────────────

  describe('public.verifyCertificate', () => {
    it('fetches the correct public URL', async () => {
      const spy = mockFetch(200, { valid: true })
      const r = await diveLinkApi.public.verifyCertificate('cert-token-abc')
      expect(spy).toHaveBeenCalledWith(
        `${BASE}/api/v1/public/verify/cert-token-abc`,
        expect.anything(),
      )
      expect(r.valid).toBe(true)
    })
  })

  // ── error handling ────────────────────────────────────────────────────────

  describe('error handling', () => {
    it('uses fallback message when error body is not JSON', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('not JSON') },
      } as unknown as Response)
      try {
        await diveLinkApi.divers.me('token')
      } catch (e) {
        expect((e as DiveLinkApiError).status).toBe(500)
        expect((e as DiveLinkApiError).message).toContain('500')
      }
    })

    it('throws when EXPO_PUBLIC_DIVELINK_API_URL is not configured', async () => {
      const saved = process.env.EXPO_PUBLIC_DIVELINK_API_URL
      delete process.env.EXPO_PUBLIC_DIVELINK_API_URL
      await expect(diveLinkApi.divers.me('token')).rejects.toThrow('EXPO_PUBLIC_DIVELINK_API_URL')
      process.env.EXPO_PUBLIC_DIVELINK_API_URL = saved
    })

    it('strips trailing slash from base URL', async () => {
      process.env.EXPO_PUBLIC_DIVELINK_API_URL = `${BASE}/`
      const spy = mockFetch(200, { valid: true })
      await diveLinkApi.public.verifyCertificate('tok')
      expect(spy).toHaveBeenCalledWith(
        expect.not.stringContaining('//api'),
        expect.anything(),
      )
      process.env.EXPO_PUBLIC_DIVELINK_API_URL = BASE
    })
  })
})
