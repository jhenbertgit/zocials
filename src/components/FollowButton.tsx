'use client'

import { useState } from 'react'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (following: boolean) => void
}

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to follow/unfollow')

      const newFollowState = !isFollowing
      setIsFollowing(newFollowState)
      onFollowChange?.(newFollowState)
    } catch (error) {
      console.error('Follow error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-medium ${
        isFollowing
          ? 'bg-gray-800 hover:bg-red-500/10 hover:text-red-500'
          : 'bg-orange-600 hover:bg-orange-700'
      }`}
    >
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
