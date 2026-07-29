export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 dark:bg-neutral-700 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Doctor Image Skeleton */}
        <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0"></div>
        
        {/* Doctor Info Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name Skeleton */}
          <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4"></div>
          
          {/* Specialty Skeleton */}
          <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-1/2"></div>
          
          {/* Hospital Skeleton */}
          <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}