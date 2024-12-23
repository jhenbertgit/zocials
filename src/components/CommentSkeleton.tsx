export default function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-white/10 rounded-full animate-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-24 animate-shimmer" />
        <div className="h-4 bg-white/10 rounded w-full animate-shimmer" />
      </div>
    </div>
  )
}
