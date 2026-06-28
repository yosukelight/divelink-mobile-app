const mockClient = {
  realtime: {
    setAuth: jest.fn(),
  },
  rest: {
    headers: {} as Record<string, string>,
  },
}

export const createClient = jest.fn(() => mockClient)
export type SupabaseClient = typeof mockClient
