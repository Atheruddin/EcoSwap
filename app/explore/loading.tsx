export default function ExploreLoading() {
  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-slate-700/50 rounded-lg w-64 mb-2"></div>
          <div className="h-6 bg-slate-700/30 rounded-lg w-96"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 h-10 bg-slate-700/50 rounded-lg"></div>
            <div className="h-10 bg-slate-700/50 rounded-lg"></div>
            <div className="h-10 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-slate-700/50"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700/30 rounded w-full"></div>
                <div className="h-4 bg-slate-700/30 rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-700/30 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-700/50 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
