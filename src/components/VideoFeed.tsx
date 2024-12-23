'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '../payload-types'
import VideoCard from './VideoCard'
import VideoCardSkeleton from './VideoCardSkeleton'

export default function VideoFeed() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/feed')

        if (response.status === 401) {
          router.push('/login')
          return
        }

        if (!response.ok) throw new Error('Failed to fetch posts')

        const data = await response.json()
        setPosts(data.docs || [])
      } catch (_err) {
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [router])

  if (loading)
    return (
      <div className="space-y-6">
        <VideoCardSkeleton />
        <VideoCardSkeleton />
        <VideoCardSkeleton />
      </div>
    )

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (posts.length === 0) return <div className="text-center py-8">No posts yet</div>

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <VideoCard key={post.id} post={post} />
      ))}
    </div>
  )
}
