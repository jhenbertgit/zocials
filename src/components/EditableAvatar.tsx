'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Media } from '../payload-types'

interface EditableAvatarProps {
  currentAvatar: string | Media | null
  username: string
  isEditable: boolean
  onAvatarChange?: (file: File) => Promise<void>
}

export default function EditableAvatar({
  currentAvatar,
  username,
  isEditable,
  onAvatarChange,
}: EditableAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getAvatarUrl = (avatar: string | Media | null): string => {
    if (!avatar) return '/default-avatar.png'
    if (typeof avatar === 'string') return avatar
    return avatar.url || '/default-avatar.png'
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAvatarChange) {
      await onAvatarChange(file)
    }
  }

  return (
    <div
      className="relative w-24 h-24 md:w-32 md:h-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={getAvatarUrl(currentAvatar)}
        alt={username}
        width={128}
        height={128}
        className="rounded-full w-full h-full object-cover"
      />
      {isEditable && isHovered && (
        <label
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer group"
          htmlFor="avatar-upload"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white opacity-75 group-hover:opacity-100 transition"
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
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  )
}
