'use client'

import { useEffect, useState, use } from 'react'
import { User } from '@/payload-types'
import ProfileContent from './ProfileContent'
import ProfileSkeleton from '@/components/ProfileSkeleton'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const [user, setUser] = useState<User | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch profile user
        const response = await fetch(`/api/users/profile/${username}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        const userData = await response.json()
        setUser(userData)
        setBio(userData.bio || '')
        setPosts(userData.posts || [])
        setFollowersCount(Array.isArray(userData.followers) ? userData.followers.length : 0)

        // Check if current user is viewing their own profile
        const currentUserResponse = await fetch('/api/users/me')
        if (currentUserResponse.ok) {
          const currentUser = await currentUserResponse.json()
          const isOwn = currentUser.id === userData.id
          setIsOwnProfile(isOwn)
          if (!isOwn) {
            setIsFollowing(
              Array.isArray(userData.followers) && userData.followers.includes(currentUser.id),
            )
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [username])

  const handleUpdateProfile = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bio }),
      })

      if (!response.ok) throw new Error('Failed to update profile')
      setIsEditing(false)
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleFollow = async () => {
    if (!user?.id) return

    try {
      const previousFollowing = isFollowing
      const previousCount = followersCount

      // Optimistic update
      setIsFollowing(!isFollowing)
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1)

      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        // Revert on error
        setIsFollowing(previousFollowing)
        setFollowersCount(previousCount)
        throw new Error(data.error)
      }

      // Update with server state
      setIsFollowing(data.following)
      setFollowersCount(data.followersCount)
    } catch (error) {
      console.error('Follow error:', error)
    }
  }

  const handleAvatarChange = async (file: File) => {
    if (!user) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Upload media
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!mediaResponse.ok) throw new Error('Failed to upload media')
      const media = await mediaResponse.json()

      // Update user avatar
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatar: media.id }),
      })

      if (!response.ok) throw new Error('Failed to update avatar')

      // Refresh user data
      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Avatar update error:', error)
    }
  }

  if (isLoading) return <ProfileSkeleton />
  if (!user) return <div>User not found</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {isOwnProfile ? (
        <ProfileContent
          user={user}
          bio={bio}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          followersCount={followersCount}
          isEditing={isEditing}
          setBio={setBio}
          handleUpdateProfile={handleUpdateProfile}
          setIsEditing={setIsEditing}
          handleFollow={handleFollow}
          posts={posts}
          isLoading={isLoading}
          onAvatarChange={handleAvatarChange}
        />
      ) : (
        <ProfileContent
          user={user}
          bio={bio}
          isOwnProfile={false}
          isFollowing={isFollowing}
          followersCount={followersCount}
          isEditing={false}
          setBio={() => {}}
          handleUpdateProfile={() => {}}
          setIsEditing={() => {}}
          handleFollow={handleFollow}
          posts={posts}
          isLoading={isLoading}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </div>
  )
}
