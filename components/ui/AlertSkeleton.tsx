import { Card } from '@heroui/react';
import { Skeleton } from '@heroui/react';

export const AlertSkeleton = () => {
  return (
    <Card className="w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-1/4 rounded-lg mb-2" />
          <Skeleton className="h-3 w-3/4 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  );
};
