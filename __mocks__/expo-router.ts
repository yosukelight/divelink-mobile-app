export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
}))
export const useSegments = jest.fn(() => [])
export const Stack = { Screen: jest.fn() }
export const Tabs = { Screen: jest.fn() }
