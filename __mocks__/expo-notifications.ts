export enum SchedulableTriggerInputTypes {
  DAILY = 'daily',
  CALENDAR = 'calendar',
  TIME_INTERVAL = 'timeInterval',
}

export const getPermissionsAsync = jest.fn().mockResolvedValue({ status: 'undetermined' })
export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' })
export const scheduleNotificationAsync = jest.fn().mockResolvedValue('mock-identifier')
export const cancelScheduledNotificationAsync = jest.fn().mockResolvedValue(undefined)
export const setNotificationHandler = jest.fn()
