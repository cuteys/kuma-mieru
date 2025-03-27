import { Tooltip as HeroTooltip, type TooltipProps } from '@heroui/react';
import { cn } from '@heroui/react';
import type { ReactNode } from 'react';

export interface CustomTooltipProps extends Omit<TooltipProps, 'content'> {
  content: ReactNode;
  children: React.ReactElement;
  className?: string;
}

export function CustomTooltip({ content, children, className, ...props }: CustomTooltipProps) {
  return (
    <HeroTooltip
      content={
        <div
          className={cn(
            'min-w-[140px] rounded-md p-2 text-tiny px-2 py-1',
            // 'shadow-small bg-default-100 dark:bg-default-50',
            // 'border border-divider/30 dark:border-divider/30',
            className,
          )}
        >
          {content}
        </div>
      }
      {...props}
    >
      {children}
    </HeroTooltip>
  );
}
