import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: (await import('../../../payload.config')).default,
    })

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file instanceof File ? file.name : 'upload'

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: filename,
        type: file.type.startsWith('image/') ? 'image' : 'video',
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: filename,
        size: file.size,
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
