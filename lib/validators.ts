import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const notifTimeField = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format')
  .refine((t) => {
    const [h, m] = t.split(':').map(Number)
    return h >= 0 && h <= 23 && m >= 0 && m <= 59
  }, 'Invalid time value')

export const NotificationTimeSchema = z.object({
  notif_time: notifTimeField,
})

export const DiveLogSchema = z
  .object({
    site_name: z.string().min(1, 'Site name is required').max(100),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    max_depth_m: z
      .number()
      .positive('Depth must be positive')
      .max(350, 'Max recorded depth is 350 m'),
    duration_min: z
      .number()
      .int()
      .positive()
      .max(600, 'Duration cannot exceed 600 minutes'),
    buddy_name: z.string().max(100).optional(),
    start_pressure_bar: z.number().int().min(1).max(350),
    end_pressure_bar: z.number().int().min(0).max(350),
    water_temp_c: z.number().min(-2).max(40).optional(),
    visibility_m: z.number().positive().max(100).optional(),
    notes: z.string().max(2000).optional(),
    photo_urls: z.array(z.string().url()).max(5, 'Max 5 photos per dive').default([]),
    checklist_completed: z.boolean(),
  })
  .refine(
    (d) => d.end_pressure_bar <= d.start_pressure_bar,
    { message: 'End pressure cannot exceed start pressure', path: ['end_pressure_bar'] },
  )

export const AppProfileSchema = z.object({
  unit_pref: z.enum(['metric', 'imperial']),
  leaderboard_opt_in: z.boolean(),
  notif_time: notifTimeField,
})

export type LoginInput = z.infer<typeof LoginSchema>
export type DiveLogInput = z.infer<typeof DiveLogSchema>
export type AppProfileInput = z.infer<typeof AppProfileSchema>
