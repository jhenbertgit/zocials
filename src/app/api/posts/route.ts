import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'
import config from '../../../payload.config'
import { decode } from 'jsonwebtoken'

function extractHashtags(caption: string): { value: string }[] {
  const hashtagRegex = /#(\w+)/g
  const matches = caption.match(hashtagRegex) || []
  return matches.map((tag) => ({
    value: tag.slice(1), // Remove the # symbol
  }))
}

function removeHashtags(caption: string): string {
  return caption.replace(/#\w+/g, '').trim()
}

export async function GET() {
  try {
    const payload = await getPayload({
      config,
    })

    const posts = await payload.find({
      collection: 'posts',
      depth: 2,
      sort: '-createdAt',
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config,
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

    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const rawCaption = formData.get('caption') as string
    const hashtags = extractHashtags(rawCaption)
    const caption = removeHashtags(rawCaption)
    const videoFile = formData.get('video') as File
    const arrayBuffer = await videoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadedVideo = await payload.create({
      collection: 'media',
      data: {
        filename: videoFile.name,
        mimeType: videoFile.type,
        filesize: videoFile.size,
        alt: caption || 'Video upload',
        type: 'video',
      },
      file: {
        data: buffer,
        mimetype: videoFile.type,
        name: videoFile.name,
        size: videoFile.size,
      },
    })

    const post = await payload.create({
      collection: 'posts',
      data: {
        caption,
        video: uploadedVideo.id,
        author: user.id,
        hashtags,
      },
    })

    console.log('Created post:', post)
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}
