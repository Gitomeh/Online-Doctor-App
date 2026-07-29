export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-neutral-800 animate-pulse">
      {/* Card Header Skeleton */}
      <div className="bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon Skeleton */}
            <div className="w-12 h-12 bg-white/30 rounded-full"></div>
            
            {/* Text Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-white/30 rounded w-32"></div>
              <div className="h-3 bg-white/20 rounded w-24"></div>
            </div>
          </div>
          
          {/* Button Skeleton */}
          <div className="w-16 h-8 bg-white/30 rounded"></div>
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="p-4 space-y-4">
        {/* Date Section Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-40"></div>
          </div>
        </div>

        {/* Reason Section Skeleton */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>
        </div>

        {/* Patient Section Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-36"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
        </div>
      </div>
    </div>
  );
}