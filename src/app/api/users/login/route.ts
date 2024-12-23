import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: (await import('../../../../payload.config')).default,
    })

    const body = await request.json()
    const { email, password } = body

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    // Set the cookie with the token
    const cookiesList = await cookies()
    if (result.token) {
      cookiesList.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
