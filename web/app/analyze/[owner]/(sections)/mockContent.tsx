'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function Content(props: {
  title: string;
  nextLink?: string;
  prevLink?: string;
}) {
  const { title, nextLink, prevLink } = props;

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // handle scroll(desktop) and touchmove(mobile) event, and navigate to next/prev page
  React.useEffect(() => {
    // listen for whell event and call set state
    const handleWhellScroll = (e: WheelEvent) => {
      const { deltaY } = e;
      if (bottomRef.current && topRef.current) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        scrollTop >= scrollHeight - windowHeight &&
          deltaY > 0 &&
          nextLink &&
          router.push(nextLink);
        scrollTop <= 0 && deltaY < 0 && prevLink && router.push(prevLink);
      }
    };

    let startY: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    // listen for touchmove event on mobile browser
    const handleTouchMove = (e: TouchEvent) => {
      const { touches } = e;
      if (bottomRef.current && topRef.current && startY !== null) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const touchY = touches[0].clientY;
        const touchDeltaY = touchY - startY;
        scrollTop >= scrollHeight - windowHeight &&
          touchDeltaY < 0 &&
          nextLink &&
          router.push(nextLink);
        scrollTop <= 0 && touchDeltaY > 0 && prevLink && router.push(prevLink);
      }
    };

    // handle wheel scroll event debounce
    const debounce = (fn: Function, delay: number) => {
      let timer: any = null;
      return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    };

    const handleWhellScrollDebounced = debounce(handleWhellScroll, 500);
    const handleTouchMoveDebounced = debounce(handleTouchMove, 500);

    window.addEventListener('wheel', handleWhellScrollDebounced);
    window.addEventListener('touchmove', handleTouchMoveDebounced);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('wheel', handleWhellScrollDebounced);
      window.removeEventListener('touchmove', handleTouchMoveDebounced);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [nextLink, prevLink, router]);

  return (
    <>
      <div ref={topRef}>top</div>
      <h1 className='text-4xl'>{title} - Content</h1>
      {new Array(100).fill(0).map((_, i) => (
        <p key={i}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          voluptatum.
        </p>
      ))}
      <div ref={bottomRef}>bottom</div>
    </>
  );
}
