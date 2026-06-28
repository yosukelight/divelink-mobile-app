export const AppState = {
  currentState: 'active' as string,
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}
export const Alert = {
  alert: jest.fn(),
}
export const View = 'View'
export const Text = 'Text'
export const TouchableOpacity = 'TouchableOpacity'
export const StyleSheet = { create: (s: Record<string, unknown>) => s }
export const ScrollView = 'ScrollView'
export const TextInput = 'TextInput'
export const ActivityIndicator = 'ActivityIndicator'
export const KeyboardAvoidingView = 'KeyboardAvoidingView'
export const Platform = { OS: 'ios' }
export const Dimensions = { get: jest.fn(() => ({ width: 390, height: 844 })) }
export const Image = 'Image'
