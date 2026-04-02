import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl overflow-hidden';

    const variants = {
      default: 'bg-white shadow-lg border border-gray-100',
      outlined: 'bg-white border-2 border-gray-200 shadow-sm',
    };

    return (
      <div ref={ref} className={cn(baseStyles, variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
