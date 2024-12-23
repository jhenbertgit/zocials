import VideoCardSkeleton from './VideoCardSkeleton'

export default function VideoGridSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {[...Array(3)].map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  )
}
