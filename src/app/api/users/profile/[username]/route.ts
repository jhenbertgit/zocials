import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface Params {
  params: Promise<{ username: string }>
}
export async function GET(_request: Request, { params }: Params) {
  const { username } = await params

  try {
    const payload = await getPayload({
      config: (await import('../../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value
    let currentUser = null

    // Debug logs
    console.log('Token:', token)

    if (token) {
      try {
        const decoded = jwt.decode(token) as { id: string }
        console.log('Decoded token:', decoded) // Debug log

        if (decoded?.id) {
          currentUser = await payload.findByID({
            collection: 'users',
            id: decoded.id,
          })
          console.log('Current user:', currentUser) // Debug log
        }
      } catch (err) {
        console.error('Token verification error:', err)
      }
    }

    // Fetch user
    const users = await payload.find({
      collection: 'users',
      where: {
        username: {
          equals: username,
        },
      },
      depth: 1,
    })

    if (!users.docs.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]
    console.log('Profile user:', user) // Debug log
    console.log('Is current user:', currentUser?.id === user.id) // Debug log

    // Fetch user's posts
    const posts = await payload.find({
      collection: 'posts',
      where: {
        'author.id': {
          equals: user.id,
        },
      },
      depth: 2,
      sort: '-createdAt',
    })

    return NextResponse.json({
      ...user,
      isCurrentUser: currentUser?.id === user.id,
      posts: posts.docs,
    })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
