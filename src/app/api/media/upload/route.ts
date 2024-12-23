import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: (await import('../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    try {
      const media = await payload.create({
        collection: 'media',
        data: {
          type: file.type.startsWith('image/') ? 'image' : 'video',
          alt: file.name || 'Uploaded media',
        },
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })

      console.log('Media created successfully:', media)
      return NextResponse.json(media)
    } catch (createError) {
      console.error('Payload create error:', createError)
      throw createError
    }
  } catch (error) {
    console.error('Upload error details:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
