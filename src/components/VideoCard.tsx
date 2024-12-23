'use client'

/*eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Post, User, Media } from '../payload-types'
import Image from 'next/image'
import Link from 'next/link'
import CommentSkeleton from './CommentSkeleton'

interface VideoCardProps {
  post: Post
  compact?: boolean
}

export default function VideoCard({ post, compact = false }: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(() => {
    if (Array.isArray(post.likes) && post.likes.length > 0) {
      return false
    }
    return false
  })
  const [likesCount, setLikesCount] = useState(Array.isArray(post.likes) ? post.likes.length : 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/users/me')
        if (!response.ok) return
        const user = await response.json()

        localStorage.setItem('userId', user.id)

        setIsAuthor(user.id === (typeof post.author === 'string' ? post.author : post.author.id))

        const userHasLiked = Array.isArray(post.likes) && post.likes.includes(user.id)
        setIsLiked(userHasLiked)
        setLikesCount(Array.isArray(post.likes) ? post.likes.length : 0)
      } catch (error) {
        console.error('Error checking user status:', error)
      }
    }

    const userId = localStorage.getItem('userId')
    if (userId && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(userId))
    }

    checkUserStatus()
  }, [post.author, post.likes])

  const handleLike = async () => {
    if (isAuthor) return

    try {
      const previousLiked = isLiked
      const previousCount = likesCount

      setIsLiked(!isLiked)
      setLikesCount(!isLiked ? likesCount + 1 : likesCount - 1)

      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setIsLiked(previousLiked)
        setLikesCount(previousCount)
        throw new Error(data.error || 'Failed to update like')
      }

      setIsLiked(data.liked)
      setLikesCount(data.likesCount)
    } catch (error) {
      console.error('Like error:', error)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add comment')
      }

      const comment = await response.json()
      const populatedComment = {
        ...comment,
        author: {
          ...comment.author,
          avatar: comment.author.avatar || null,
        },
      }
      setComments([...comments, populatedComment])
      setNewComment('')
    } catch (error) {
      console.error('Comment error:', error)
      alert(error instanceof Error ? error.message : 'Failed to add comment')
    }
  }

  const author = post.author as User

  const getMediaUrl = (media: string | Media | null | undefined): string => {
    if (!media) return '/default-avatar.png'
    if (typeof media === 'string') return media
    return media.url || '/default-avatar.png'
  }

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleToggleComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true)
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`)
        if (response.ok) {
          const comments = await response.json()
          setComments(
            comments.map((comment: any) => ({
              ...comment,
              author: {
                ...comment.author,
                avatar: comment.author?.avatar || null,
              },
            })),
          )
        }
      } catch (error) {
        console.error('Failed to load comments:', error)
      } finally {
        setIsLoadingComments(false)
      }
    }
    setShowComments(!showComments)
  }

  useEffect(() => {
    console.log('Post hashtags:', post.hashtags)
    console.log('Post data:', post)
  }, [post])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
      <div>
        <div className="p-4 flex items-center gap-3">
          <Link href={`/profile/${author.username}`}>
            <Image
              src={getMediaUrl(author.avatar)}
              alt={author.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div>
            <Link
              href={`/profile/${author.username}`}
              className="font-medium hover:text-orange-400 transition"
            >
              {author.username}
            </Link>
            <p className="text-sm text-gray-400">{post.caption}</p>
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((item: { value?: string | null }, index: number) => {
                  return (
                    item.value && (
                      <Link
                        key={index}
                        href={`/tag/${item.value}`}
                        className="text-sm text-orange-400 hover:text-orange-300 transition"
                      >
                        #{item.value}
                      </Link>
                    )
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className={`relative ${compact ? 'pt-[100%]' : 'pt-[56.25%]'} group cursor-pointer`}>
          <video
            src={getMediaUrl(post.video)}
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
            controls={isPlaying}
            loop
            muted={!isPlaying}
            onClick={handleVideoClick}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/50 group-hover:bg-black/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-4">
            <button
              onMouseEnter={() => isAuthor && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={!isAuthor ? handleLike : undefined}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isLiked
                  ? 'text-orange-500 bg-orange-500/10 hover:bg-orange-500/20'
                  : 'text-gray-300 hover:bg-white/5'
              } ${isAuthor ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-200 ${isLiked ? 'scale-110' : ''}`}
                fill={isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isLiked ? 0 : 2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className={`font-medium ${isLiked ? 'scale-105' : ''}`}>{likesCount}</span>
              {isAuthor && showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap">
                  Cannot like <br /> your own post
                </div>
              )}
            </button>

            <button
              onClick={handleToggleComments}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showComments ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{comments.length}</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-4 space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-4">
                {isLoadingComments ? (
                  <>
                    <CommentSkeleton />
                    <CommentSkeleton />
                    <CommentSkeleton />
                  </>
                ) : (
                  comments.map((comment) => {
                    const commentAuthor = comment.author as User
                    return (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={getMediaUrl(commentAuthor?.avatar)}
                            alt={commentAuthor?.username || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <Link
                            href={`/profile/${commentAuthor?.username}`}
                            className="font-medium hover:text-orange-400 transition"
                          >
                            {commentAuthor?.username}
                          </Link>
                          <p className="text-gray-300 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  className="px-4 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
