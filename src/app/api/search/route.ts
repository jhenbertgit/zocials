import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json([])
    }

    const payload = await getPayload({
      config: (await import('../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await payload.find({
      collection: 'posts',
      where: {
        or: [
          {
            caption: {
              like: query,
            },
          },
          {
            'author.username': {
              like: query,
            },
          },
        ],
      },
      depth: 2,
    })

    return NextResponse.json(posts.docs)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
