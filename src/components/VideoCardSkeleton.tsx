export default function VideoCardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 animate-shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-white/10 rounded animate-shimmer" />
          <div className="h-4 w-48 bg-white/10 rounded animate-shimmer" />
        </div>
      </div>
      <div className="relative pt-[56.25%] bg-white/5 animate-shimmer" />
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-white/10 rounded-lg animate-shimmer" />
          <div className="h-10 w-24 bg-white/10 rounded-lg animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
