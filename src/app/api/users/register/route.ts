import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: (await import('../../../../payload.config')).default,
    })

    const body = await request.json()
    const { email, password, username } = body

    const result = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        username,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 })
  }
}
