import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="card-metric p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
      <Skeleton className="h-7 w-16 rounded" />
      <Skeleton className="h-2.5 w-12 rounded" />
    </div>
  );
}

export function RiskHeroSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-9 w-36 rounded" />
        </div>
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-3/4 rounded" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = "h-48" }: { height?: string }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className={`w-full ${height} rounded-lg`} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <RiskHeroSkeleton />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartSkeleton height="h-64" />
        </div>
        <ChartSkeleton height="h-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChartSkeleton height="h-48" />
        <ChartSkeleton height="h-48" />
      </div>
    </div>
  );
}
