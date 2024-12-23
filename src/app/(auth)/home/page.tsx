'use client'

import { Suspense } from 'react'
import VideoFeed from '@/components/VideoFeed'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        {/* Main Content */}
        <div className="py-6">
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <VideoFeed />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
