import * as React from 'react';
import { cn } from '@/lib/utils';

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode;
}

interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TimelineTimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
  children: React.ReactNode;
}

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn('relative border-l border-gray-200', className)}
        {...props}
      >
        {children}
      </ol>
    );
  }
);
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('mb-8 ml-6 last:mb-0 p-3 rounded-lg transition-colors hover:bg-white/60', className)}
        {...props}
      >
        {children}
      </li>
    );
  }
);
TimelineItem.displayName = 'TimelineItem';

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, isActive, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute -left-3 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white',
          isActive
            ? 'bg-indigo-600'
            : 'bg-gray-200',
          className
        )}
        {...props}
      >
        {isActive && (
          <span className="h-3 w-3 rounded-full bg-white" />
        )}
      </span>
    );
  }
);
TimelineDot.displayName = 'TimelineDot';

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TimelineContent.displayName = 'TimelineContent';

const TimelineTime = React.forwardRef<HTMLElement, TimelineTimeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <time
        ref={ref as React.Ref<HTMLTimeElement>}
        className={cn(
          'text-sm font-semibold leading-none text-gray-900',
          className
        )}
        {...props}
      >
        {children}
      </time>
    );
  }
);
TimelineTime.displayName = 'TimelineTime';

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-sm font-semibold text-gray-700', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-500', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
TimelineDescription.displayName = 'TimelineDescription';

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
};
