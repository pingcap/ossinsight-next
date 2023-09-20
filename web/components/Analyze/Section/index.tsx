import * as React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SectionTemplateProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  level?: number;
  className?: string;
}

export default function SectionTemplate(props: SectionTemplateProps) {
  const { children, title, description, level = 1, className } = props;

  return (
    <section className={twMerge(className)}>
      <TitleWrapper level={level} className=''>
        {title}
      </TitleWrapper>
      {description && <p className='max-w-[864px]'>{description}</p>}
      {children}
    </section>
  );
}

// Max level is 3
function TitleWrapper({
  children,
  level,
  className,
  ...rest
}: {
  children: React.ReactNode;
  level: number;
  className?: string;
  [key: string]: any;
}) {
  switch (level) {
    case 1:
      return (
        <h1
          className={clsx('text-title font-semibold pb-3 text-3xl', className)}
          {...rest}
        >
          {children}
        </h1>
      );
    case 2:
      return (
        <h2
          className={clsx('text-title font-semibold pb-3 text-2xl', className)}
          {...rest}
        >
          {children}
        </h2>
      );
    case 3:
    default:
      return (
        <h3
          className={clsx('text-title font-semibold pb-3 text-xl', className)}
          {...rest}
        >
          {children}
        </h3>
      );
  }
}