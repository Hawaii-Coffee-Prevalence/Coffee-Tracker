type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`bg-base-300 rounded animate-pulse ${className}`} />
);
