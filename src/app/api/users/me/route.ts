import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const payload = await getPayload({
      config: (await import('../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.decode(token) as { id: string }
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json({ error: 'Failed to get current user' }, { status: 500 })
  }
}
