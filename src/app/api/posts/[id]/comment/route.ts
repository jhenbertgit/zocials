import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
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

    const decoded = jwt.decode(token) as { id: string }
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { content } = await request.json()

    // Create the comment
    const comment = await payload.create({
      collection: 'comments',
      data: {
        content,
        author: decoded.id,
        post: id,
      },
    })

    // Get the populated comment with author details and avatar
    const populatedComment = await payload.findByID({
      collection: 'comments',
      id: comment.id,
      depth: 2,
    })

    // Update post's comments array
    const post = await payload.findByID({
      collection: 'posts',
      id: id,
    })

    await payload.update({
      collection: 'posts',
      id: id,
      data: {
        comments: [...(post.comments || []), comment.id],
      },
    })

    return NextResponse.json(populatedComment)
  } catch (error) {
    console.error('Comment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add comment' },
      { status: 500 },
    )
  }
}
