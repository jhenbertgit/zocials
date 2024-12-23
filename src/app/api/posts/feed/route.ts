import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

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

    const posts = await payload.find({
      collection: 'posts',
      sort: '-createdAt',
      depth: 3,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}
