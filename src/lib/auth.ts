import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { timingSafeEqual } from 'crypto'
import { checkRateLimit, recordFailure, recordSuccess } from './rateLimit'

/**
 * Fail loudly in production if critical env vars are missing.
 * In development we allow a loud warning instead of a crash so local dev
 * is not blocked on first run.
 */
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variable: ${name}. ` +
          `Refusing to start with insecure defaults.`
      )
    }
    console.warn(
      `[auth] WARNING: ${name} is not set. Using an insecure dev placeholder. ` +
        `Set ${name} in your .env before deploying.`
    )
    return `__dev-insecure-${name}__`
  }
  return value
}

const NEXTAUTH_SECRET = requireEnv('NEXTAUTH_SECRET')
const ADMIN_USERNAME = requireEnv('ADMIN_USERNAME')

// Prefer hashed password. Fall back to plain ADMIN_PASSWORD for dev convenience.
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing credentials: set ADMIN_PASSWORD_HASH (preferred) or ADMIN_PASSWORD.'
    )
  }
  console.warn(
    '[auth] WARNING: no ADMIN_PASSWORD_HASH or ADMIN_PASSWORD set. Login will fail.'
  )
}

if (process.env.NODE_ENV === 'production' && ADMIN_PASSWORD && !ADMIN_PASSWORD_HASH) {
  console.warn(
    '[auth] WARNING: ADMIN_PASSWORD is set as plaintext in production. ' +
      'Generate a hash with bcrypt and use ADMIN_PASSWORD_HASH instead.'
  )
}

/** Constant-time string comparison to prevent timing attacks on username. */
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) {
    // Still do a comparison against aBuf to avoid early-exit timing leak
    timingSafeEqual(aBuf, aBuf)
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

async function verifyPassword(submitted: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(submitted, ADMIN_PASSWORD_HASH)
    } catch {
      return false
    }
  }
  if (ADMIN_PASSWORD) {
    return safeEqual(submitted, ADMIN_PASSWORD)
  }
  return false
}

// In production we rely on Next.js/Railway serving over HTTPS
const useSecureCookies = process.env.NODE_ENV === 'production'
const cookiePrefix = useSecureCookies ? '__Secure-' : ''

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Rate limit by IP (fall back to a shared bucket if IP missing)
        const ip =
          (req?.headers?.['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
          (req?.headers?.['x-real-ip'] as string | undefined) ??
          'unknown'
        const rateKey = `login:${ip}`

        const rl = checkRateLimit(rateKey)
        if (!rl.allowed) {
          // Returning null yields a generic "invalid credentials" response,
          // which is better than leaking lockout state to an attacker.
          return null
        }

        if (!credentials?.username || !credentials?.password) {
          recordFailure(rateKey)
          return null
        }

        const usernameOk = safeEqual(credentials.username, ADMIN_USERNAME)
        const passwordOk = await verifyPassword(credentials.password)

        if (!usernameOk || !passwordOk) {
          recordFailure(rateKey)
          return null
        }

        recordSuccess(rateKey)
        return {
          id: '1',
          name: 'Admin',
          email: 'admin@valentino.local',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60, // refresh every 1h of activity
  },
  jwt: {
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: '/admin/login',
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // 'strict' would break the post-login redirect in some browsers
        path: '/',
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  useSecureCookies,
  secret: NEXTAUTH_SECRET,
}

/** Shared helper to read the JWT from a request in API routes. */
export { NEXTAUTH_SECRET }
