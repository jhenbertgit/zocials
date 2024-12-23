'use client'

import { Post } from '@/payload-types'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'

interface ProfileVideosProps {
  posts: Post[]
  isLoading?: boolean
}

export default function ProfileVideos({ posts, isLoading = false }: ProfileVideosProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <VideoCardSkeleton />
        <VideoCardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <VideoCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-8">No videos posted yet</div>
      )}
    </div>
  )
}
