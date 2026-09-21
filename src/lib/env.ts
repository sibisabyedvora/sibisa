import { z } from 'zod';

const envSchema = z.object({
  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.string().length(0)).default(''),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),

  // AI Config (Google Gemini API - Gratisan)
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().default(350),

  // Upstash Redis (Rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().optional().default(''),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(''),

  // Resend Email
  RESEND_API_KEY: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('SIBISA <noreply@sibisa.id>'),

  // Cron Secret
  CRON_SECRET: z.string().optional().default('dev_cron_secret'),

  // Observability
  SENTRY_DSN: z.string().optional().default(''),

  // Product Rules & Limits
  PLAN_BASIC_PRICE: z.coerce.number().default(75000),
  PLAN_BASIC_QUOTA: z.coerce.number().default(600),
  TRIAL_DAYS: z.coerce.number().default(14),
  TRIAL_QUOTA: z.coerce.number().default(100),
  KB_MAX_CHARS: z.coerce.number().default(10000),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  AI_MAX_OUTPUT_TOKENS: process.env.AI_MAX_OUTPUT_TOKENS,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CRON_SECRET: process.env.CRON_SECRET,
  SENTRY_DSN: process.env.SENTRY_DSN,
  PLAN_BASIC_PRICE: process.env.PLAN_BASIC_PRICE,
  PLAN_BASIC_QUOTA: process.env.PLAN_BASIC_QUOTA,
  TRIAL_DAYS: process.env.TRIAL_DAYS,
  TRIAL_QUOTA: process.env.TRIAL_QUOTA,
  KB_MAX_CHARS: process.env.KB_MAX_CHARS,
});
