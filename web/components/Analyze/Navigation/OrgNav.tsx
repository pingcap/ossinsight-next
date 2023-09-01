'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import FileBarGraphIcon from 'bootstrap-icons/icons/file-bar-graph.svg';
import clsx from 'clsx';

export default function OrgNav(props: { org: string }) {
  const { org } = props;

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // https://github.com/vercel/next.js/discussions/49465#discussioncomment-5845312
  // const params = useParams();
  const pathname = usePathname();

  React.useEffect(() => {
    const section =
      pathname.split(`/${org}`).pop()?.replace('/', '') || DEFAULT_NAV_ID;
    console.log('section:', section);
    selectedId !== section && setSelectedId(section);
  }, [org, pathname, selectedId]);

  const highlightIdMemo = React.useMemo(() => {
    return calcSelectedIdParents(navItems, selectedId);
  }, [selectedId]);
  const basePathMemo = React.useMemo(() => {
    return `/analyze/org/${org}`;
  }, [org]);

  return (
    <>
      <NavList
        items={navItems}
        selectedId={selectedId}
        highlightId={highlightIdMemo}
        basePath={basePathMemo}
      />
    </>
  );
}

const NavList = (props: {
  items: NavItemType[];
  selectedId: string | null;
  depth?: number;
  highlightId?: string[];
  basePath: string;
}) => {
  const { items, selectedId, depth = 0, highlightId = [], basePath } = props;

  return (
    <ul
      className={clsx('w-full flex md:flex-col md:w-40', {
        'sticky overflow-x-auto lg:h-full': depth === 0,
      })}
    >
      {items.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <li
              className={clsx(
                'flex md:flex-col items-center justify-start md:justify-center lg:justify-start',
                highlightId.includes(item.id)
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--text-color-content)]',
                {
                  'border-b-2 border-[var(--color-primary)] md:border-r-2 md:border-b-0':
                    selectedId === item.id,
                }
              )}
            >
              {item?.anchor ? (
                <NextLink
                  href={`${basePath}/${item.id}`}
                  className={clsx(
                    'flex items-center justify-start gap-2 md:justify-center lg:justify-start w-full p-2',
                    item.Icon ? 'text-base font-medium' : 'text-sm md:pl-9',
                    {
                      'hover:text-[var(--color-primary)]': item.anchor,
                      'cursor-default': !item.anchor,
                    }
                  )}
                >
                  {item.Icon && <item.Icon width={20} height={20} />}
                  <span>{item.title}</span>
                </NextLink>
              ) : (
                <div
                  className={clsx(
                    'flex items-center justify-start gap-2 md:justify-center lg:justify-start w-full p-2',
                    item.Icon ? 'text-base font-medium' : 'text-sm md:pl-9'
                  )}
                >
                  {item.Icon && <item.Icon width={20} height={20} />}
                  <span>{item.title}</span>
                </div>
              )}

              {item.children && (
                <NavList
                  items={item.children}
                  selectedId={selectedId}
                  depth={depth + 1}
                  highlightId={highlightId}
                  basePath={basePath}
                />
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

const calcSelectedIdParents = (
  items: NavItemType[],
  selectedId: string | null
): string[] => {
  const parents: string[] = [];
  const find = (items: NavItemType[], selectedId: string | null) => {
    for (const item of items) {
      if (item.id === selectedId) {
        parents.push(item.id);
        return true;
      }
      if (item.children) {
        if (find(item.children, selectedId)) {
          parents.push(item.id);
          return true;
        }
      }
    }
    return false;
  };
  find(items, selectedId);
  return parents;
};

const flattenNavItems = (
  items: NavItemType[]
): Omit<NavItemType, 'children'>[] => {
  const result: NavItemType[] = [];
  const find = (items: NavItemType[]) => {
    for (const item of items) {
      const { children, ...rest } = item;
      result.push({ ...rest });
      if (children) {
        find(children);
      }
    }
  };
  find(items);
  return result;
};

export function calcPrevNextId(
  items: NavItemType[],
  selectedId: string | null
): {
  prevId: string | null;
  nextId: string | null;
  prevItem: NavItemType | null;
  nextItem: NavItemType | null;
} {
  let prevItem: NavItemType | null = null;
  let nextItem: NavItemType | null = null;
  let prevId: string | null = null;
  let nextId: string | null = null;
  const flattenItems = flattenNavItems(items).filter((item) => item.anchor);
  const index = flattenItems.findIndex((item) => item.id === selectedId);
  if (index > 0) {
    prevItem = flattenItems[index - 1];
    prevId = prevItem.id;
  }
  if (index < flattenItems.length - 1) {
    nextItem = flattenItems[index + 1];
    nextId = nextItem.id;
  }
  return { prevId, nextId, prevItem, nextItem };
}

export function getNavItemById(id: string): NavItemType | null {
  const find = (items: NavItemType[]): NavItemType | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const result = find(item.children);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };
  return find(navItems);
}

type NavItemType = {
  id: string;
  title: string;
  anchor?: string;
  Icon?: any;
  children?: NavItemType[];
};

export const DEFAULT_NAV_ID = 'overview';

// DEPTH 0~1
export const navItems: NavItemType[] = [
  {
    id: 'overview',
    title: 'Overview',
    anchor: 'overview',
    Icon: FileBarGraphIcon,
  },
  {
    id: 'popularity',
    title: 'Popularity',
    Icon: FileBarGraphIcon,
    children: [
      {
        id: 'star-growth',
        title: 'Star Growth',
        anchor: 'star-growth',
      },
    ],
  },
  {
    id: 'participant',
    title: 'Participant',
    Icon: FileBarGraphIcon,
    children: [
      {
        id: 'engagement',
        title: 'Engagement',
        anchor: 'engagement',
      },
      {
        id: 'origins',
        title: 'Origins',
        anchor: 'origins',
      },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity',
    Icon: FileBarGraphIcon,
    children: [
      {
        id: 'pull-request-efficiency',
        title: 'Pull Request Efficiency',
        anchor: 'pull-request-efficiency',
      },
      {
        id: 'code-review-efficiency',
        title: 'Code Review Efficiency',
        anchor: 'code-review-efficiency',
      },
      {
        id: 'code-submission',
        title: 'Code Submission',
        anchor: 'code-submission',
      },
    ],
  },
  {
    id: 'issue',
    title: 'Issue',
    Icon: FileBarGraphIcon,
    anchor: 'issue',
  },
];
