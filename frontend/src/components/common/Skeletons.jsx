export const ProductSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-6 w-1/3" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="skeleton h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div className="skeleton h-4 w-1/2 mb-3" />
          <div className="skeleton h-8 w-2/3" />
        </div>
      ))}
    </div>
    <div className="glass-card p-6">
      <div className="skeleton h-64 w-full" />
    </div>
  </div>
);
