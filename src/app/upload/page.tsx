'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [caption, setCaption] = useState('')
  const [video, setVideo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!video || !caption.trim()) {
      setError('Please provide both a video and caption')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('video', video)
      formData.append('caption', caption)

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload post')
      }

      router.push('/home')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="w-full p-2 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption... (use #hashtags to tag your post)"
            rows={4}
            className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-orange-600 rounded-lg font-medium ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'
          } transition`}
        >
          {loading ? 'Uploading...' : 'Post'}
        </button>
      </form>
    </div>
  )
}
