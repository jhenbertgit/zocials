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

    // Can't follow yourself
    if (decoded.id === id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    const targetUser = await payload.findByID({
      collection: 'users',
      id: id,
      depth: 0,
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const followers = Array.isArray(targetUser.followers) ? targetUser.followers : []
    const hasFollowed = followers.includes(decoded.id)

    // Toggle follow status
    const updatedFollowers = hasFollowed
      ? followers.filter((followerId) => followerId !== decoded.id)
      : [...new Set([...followers, decoded.id])]

    await payload.update({
      collection: 'users',
      id: id,
      data: {
        followers: updatedFollowers,
      },
    })

    return NextResponse.json({
      following: !hasFollowed,
      followersCount: updatedFollowers.length,
    })
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Failed to update follow status' }, { status: 500 })
  }
}
