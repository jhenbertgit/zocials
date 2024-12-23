import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

interface Params {
  params: Promise<{ tag: string }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { tag } = await params
    const payload = await getPayload({
      config: (await import('../../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await payload.find({
      collection: 'posts',
      where: {
        'hashtags.value': {
          equals: tag,
        },
      },
      depth: 2,
      sort: '-createdAt',
    })

    return NextResponse.json(posts.docs)
  } catch (error) {
    console.error('Tag search error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
