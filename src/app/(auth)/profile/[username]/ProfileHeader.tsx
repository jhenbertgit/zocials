'use client'

import { User, Media, Post } from '@/payload-types'
import Image from 'next/image'
import { useState, useRef } from 'react'

interface ProfileHeaderProps {
  user: User
  posts: Post[]
  isOwnProfile: boolean
  isFollowing: boolean
  followersCount: number
  isEditing?: boolean
  onEdit?: () => void
  onFollow?: () => void
  onAvatarChange?: (file: File) => Promise<void>
}

const getMediaUrl = (media: string | Media | null | undefined): string => {
  if (!media) return '/default-avatar.png'
  if (typeof media === 'string') return media
  return media.url || '/default-avatar.png'
}

export default function ProfileHeader({
  user,
  posts,
  isOwnProfile,
  isFollowing,
  followersCount,
  isEditing,
  onEdit,
  onFollow,
  onAvatarChange,
}: ProfileHeaderProps) {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAvatarChange) {
      await onAvatarChange(file)
    }
  }

  return (
    <div>
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg relative">
        <div
          className="absolute -bottom-16 left-8"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
        >
          <div
            className={`relative ${isOwnProfile ? 'cursor-pointer' : ''}`}
            onClick={handleAvatarClick}
          >
            <Image
              src={getMediaUrl(user.avatar)}
              alt={user.username}
              width={128}
              height={128}
              className="rounded-full border-4 border-gray-900 object-cover"
              priority
              sizes="128px"
            />
            {isOwnProfile && isHoveringAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            )}
          </div>
          {isOwnProfile && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <div className="flex gap-4 mt-2 text-gray-400">
              <span>{posts.length} videos</span>
              <span>•</span>
              <span>{followersCount} followers</span>
              <span>•</span>
              <span>{Array.isArray(user.following) ? user.following.length : 0} following</span>
            </div>
          </div>
          {isOwnProfile ? (
            <button
              onClick={onEdit}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          ) : (
            <button
              onClick={onFollow}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                isFollowing
                  ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
