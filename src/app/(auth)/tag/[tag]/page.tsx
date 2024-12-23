'use client'

import { useEffect, useState, use } from 'react'
import { Post } from '@/payload-types'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/tag/${tag}`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [tag])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">#{tag}</h1>
      <div className="space-y-6">
        {loading ? (
          <>
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => <VideoCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <div className="text-gray-400">No posts found with #{tag}</div>
          </div>
        )}
      </div>
    </div>
  )
}
