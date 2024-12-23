export default function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Cover Image Skeleton */}
      <div className="h-48 bg-white/5 rounded-t-lg relative animate-pulse">
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-full bg-white/5 border-4 border-gray-900" />
        </div>
      </div>

      {/* Profile Info Skeleton */}
      <div className="mt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-9 w-64 bg-white/5 rounded animate-pulse" />
            <div className="flex gap-4 mt-2">
              <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-1 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-1 bg-white/5 rounded animate-pulse" />
              <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Bio Skeleton */}
        <div className="mt-4">
          <div className="h-20 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-8 border-b border-white/10">
          <div className="flex gap-8 pb-4">
            <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Videos Skeleton */}
        <div className="mt-6 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-lg animate-pulse">
              <div className="w-40 h-24 bg-white/10 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
                <div className="h-4 w-1/4 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
