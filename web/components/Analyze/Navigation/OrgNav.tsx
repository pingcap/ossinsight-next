'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import FileBarGraphIcon from 'bootstrap-icons/icons/file-bar-graph.svg';
import clsx from 'clsx';

export default function OrgNav(props: any) {
  const params = useParams();

  // https://github.com/vercel/next.js/discussions/49465#discussioncomment-5845312
  React.useEffect(() => {
    console.log("Hash:", window.location.hash);
  }, [params]);

  const ItemWrapper = (props: {
    anchor?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }) => {
    const { anchor, children, ...rest } = props;
    if (anchor) {
      return (
        <NextLink href={`#${props.anchor}`} {...rest}>
          {children}
        </NextLink>
      );
    }
    return <div {...rest}>{children}</div>;
  };

  return (
    <ul className='sticky overflow-x-auto w-full flex md:flex-col md:w-40 lg:h-full'>
      {navItems.map((item) => {
        return (
          <li
            key={item.id}
            className='flex items-center justify-start md:justify-center lg:justify-start'
          >
            <ItemWrapper
              anchor={item.anchor}
              className={clsx(
                'flex items-center justify-start gap-2 md:justify-center lg:justify-start w-full p-2',
                item.Icon ? 'text-base font-medium' : 'text-sm',
                {
                  'hover:text-gray-100': item.anchor,
                  'cursor-default': !item.anchor,
                }
              )}
            >
              {item.Icon ? (
                <item.Icon width={20} height={20} />
              ) : (
                <div className='w-5' />
              )}
              <span>{item.title}</span>
            </ItemWrapper>
          </li>
        );
      })}
    </ul>
  );
}

type NavItemType = {
  id: string;
  title: string;
  anchor?: string;
  Icon?: any;
};

const navItems: NavItemType[] = [
  {
    id: 'overview',
    title: 'Overview',
    anchor: 'overview',
    Icon: FileBarGraphIcon,
  },
  {
    id: 'Popularity',
    title: 'Popularity',
    Icon: FileBarGraphIcon,
  },
  {
    id: 'star-growth',
    title: 'Star Growth',
    anchor: 'star-growth',
  },
  {
    id: 'participant',
    title: 'Participant',
    Icon: FileBarGraphIcon,
  },
  {
    id: 'Engagement',
    title: 'Engagement',
    anchor: 'engagement',
  },
  {
    id: 'origins',
    title: 'Origins',
    anchor: 'origins',
  },
];
