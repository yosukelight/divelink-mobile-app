import * as ExpoNotifications from 'expo-notifications'
import type { NotificationTriggerInput } from 'expo-notifications'

export type PermissionStatus = 'granted' | 'denied' | 'undetermined'

export type DailyTrigger = {
  hour: number
  minute: number
  repeats: true
}

/**
 * Request push notification permission from the OS.
 * Returns the resulting status.
 */
export async function requestNotificationPermission(): Promise<PermissionStatus> {
  const { status: existing } = await ExpoNotifications.getPermissionsAsync()
  if (existing === 'granted') return 'granted'
  const { status } = await ExpoNotifications.requestPermissionsAsync()
  return status as PermissionStatus
}

/**
 * Schedule a daily local notification at the given HH:MM time string (24-hour).
 * Cancels any previously scheduled notification with the same identifier first.
 * Returns the notification identifier.
 */
export async function scheduleDailyBriefing(
  notifTime: string,
  identifier = 'daily-briefing',
): Promise<string> {
  const [hourStr, minuteStr] = notifTime.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  await ExpoNotifications.cancelScheduledNotificationAsync(identifier).catch(() => {})

  const trigger: NotificationTriggerInput = {
    type: ExpoNotifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute,
  } as unknown as NotificationTriggerInput

  return ExpoNotifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: "Today's Dive Briefing",
      body: 'Your daily Do & Don\'t is ready. Tap to quiz yourself.',
      sound: true,
    },
    trigger,
  })
}

/**
 * Cancel a scheduled notification by identifier.
 */
export async function cancelDailyBriefing(identifier = 'daily-briefing'): Promise<void> {
  await ExpoNotifications.cancelScheduledNotificationAsync(identifier).catch(() => {})
}

/**
 * Parse a "HH:MM" time string into { hour, minute }.
 * Returns { hour: 8, minute: 0 } as fallback on invalid input.
 */
export function parseNotifTime(notifTime: string): { hour: number; minute: number } {
  const parts = notifTime.split(':')
  const hour = parseInt(parts[0] ?? '8', 10)
  const minute = parseInt(parts[1] ?? '0', 10)
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return { hour: 8, minute: 0 }
  }
  return { hour, minute }
}

/**
 * Configure how notifications appear when the app is in the foreground.
 * Call once at app startup (e.g., in _layout.tsx).
 */
export function configureForegroundHandler(): void {
  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })
}
