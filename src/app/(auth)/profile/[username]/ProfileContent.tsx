'use client'

import { useState } from 'react'
import { User, Post } from '@/payload-types'
import ProfileHeader from './ProfileHeader'
import ProfileVideos from './ProfileVideos'

interface ProfileContentProps {
  user: User
  bio: string
  isOwnProfile: boolean
  isFollowing: boolean
  followersCount: number
  isEditing: boolean
  setBio: (bio: string) => void
  handleUpdateProfile: () => void
  setIsEditing: (isEditing: boolean) => void
  handleFollow: () => void
  posts: Post[]
  isLoading?: boolean
  onAvatarChange?: (file: File) => Promise<void>
}

export default function ProfileContent({
  user,
  bio,
  isOwnProfile,
  isFollowing,
  followersCount,
  isEditing,
  setBio,
  handleUpdateProfile,
  setIsEditing,
  handleFollow,
  posts,
  isLoading = false,
  onAvatarChange,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos')

  return (
    <div>
      <ProfileHeader
        user={user}
        posts={posts}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followersCount={followersCount}
        isEditing={isEditing}
        onEdit={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
        onFollow={handleFollow}
        onAvatarChange={onAvatarChange}
      />

      {/* Bio */}
      <div className="mt-4 px-8">
        {!isEditing ? (
          <p className="text-gray-300">{bio || 'No bio yet'}</p>
        ) : (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/5 rounded-lg p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Write something about yourself..."
            rows={3}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="mt-8 px-8 border-b border-white/10">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'videos'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'about'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 px-8">
        {activeTab === 'videos' ? (
          <ProfileVideos posts={posts} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-400">{bio || 'No bio yet'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
