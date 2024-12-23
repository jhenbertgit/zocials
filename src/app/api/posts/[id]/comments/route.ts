import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const payload = await getPayload({
      config: (await import('../../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get post with populated comments and their authors
    const post = await payload.findByID({
      collection: 'posts',
      id: id,
      depth: 3,
    })

    // Get fully populated comments
    const populatedComments = await Promise.all(
      (post.comments || []).map(async (commentId) => {
        const comment = await payload.findByID({
          collection: 'comments',
          id: typeof commentId === 'string' ? commentId : commentId.id,
          depth: 2,
        })
        return comment
      }),
    )

    return NextResponse.json(populatedComments)
  } catch (error) {
    console.error('Comments error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch comments' },
      { status: 500 },
    )
  }
}
