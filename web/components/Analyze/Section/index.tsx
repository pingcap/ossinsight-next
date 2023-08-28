import * as React from 'react';
import clsx from 'clsx';

export interface SectionTemplateProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  level?: number;
  classname?: string;
}

export default function SectionTemplate(props: SectionTemplateProps) {
  const { children, title, description, level = 1, classname } = props;

  return (
    <section className={classname}>
      <TitleWrapper level={level} className=''>
        {title}
      </TitleWrapper>
      {description && <p>{description}</p>}
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
