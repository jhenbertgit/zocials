import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params

  try {
    const payload = await getPayload({
      config: (await import('../../../../payload.config')).default,
    })

    const cookiesList = await cookies()
    const token = cookiesList.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bio, avatar } = body

    if (avatar) {
      const currentUser = await payload.findByID({
        collection: 'users',
        id: id,
      })

      if (currentUser?.avatar && typeof currentUser.avatar !== 'string') {
        try {
          await payload.delete({
            collection: 'media',
            id: currentUser.avatar.id,
          })
        } catch (deleteError) {
          console.error('Failed to delete old avatar:', deleteError)
        }
      }
    }

    const result = await payload.update({
      collection: 'users',
      id: id,
      data: avatar ? { avatar } : { bio },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
