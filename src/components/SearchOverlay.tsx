'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post, User, Media } from '../payload-types'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const searchPosts = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const getMediaUrl = (media: string | Media | null | undefined): string => {
    if (!media) return '/default-avatar.png'
    if (typeof media === 'string') return media
    return media.url || '/default-avatar.png'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, hashtags, or users..."
                className="w-full bg-white/5 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/profile/${(post.author as User).username}`}
                    className="flex items-start gap-3 p-4 hover:bg-white/5 transition"
                    onClick={onClose}
                  >
                    <Image
                      src={getMediaUrl((post.author as User).avatar)}
                      alt={(post.author as User).username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{(post.author as User).username}</div>
                      <p className="text-sm text-gray-400 line-clamp-2">{post.caption}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-400">No results found</div>
            ) : null}
          </div>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
