import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import { decode } from 'jsonwebtoken'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params

  try {
    const payload = await getPayload({
      config: (await import('../../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = decode(token) as { id: string }
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const post = await payload.findByID({
      collection: 'posts',
      id: id,
      depth: 1,
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Ensure likes is an array and contains unique values
    const likes = Array.isArray(post.likes) ? [...new Set(post.likes)] : []
    const hasLiked = likes.includes(decoded.id)

    // Update likes array - remove if liked, add if not liked
    const updatedLikes = hasLiked
      ? likes.filter((likeId) => likeId !== decoded.id)
      : [...new Set([...likes, decoded.id])]

    // Update post with new likes array
    await payload.update({
      collection: 'posts',
      id: id,
      data: {
        likes: updatedLikes,
      },
    })

    return NextResponse.json({
      liked: !hasLiked,
      likesCount: updatedLikes.length,
    })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to update like status' }, { status: 500 })
  }
}
