import { ReactElement } from 'react';
import NextLink from 'next/link';

type Params = {
  parameters: ReactElement
  share: ReactElement
  children: ReactElement
}

export default function Layout ({ parameters, share, children }: Params) {
  return (
    <div className='flex flex-col lg:flex-row min-h-page lg:max-h-page'>
      <aside className='lg:flex-1 p-4 bg-toolbar lg:max-h-page lg:min-h-page overflow-y-auto sticky top-header lg:border-r order-2'>
        <NextLink href='/widgets' className='Button Button-secondary inline-flex items-center gap-1 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
            />
          </svg>
          Back
        </NextLink>
        <h2 className='text-md text-subtitle font-bold mb-2'>
          Widget configuration
        </h2>
        {parameters}
      </aside>
      <main className='lg:flex-[3] lg:max-h-page lg:flex lg:flex-col overflow-x-hidden order-1 lg:order-3'>
        <div className='lg:max-h-[calc(100vh-210px)] lg:min-h-[calc(100vh-210px)] p-2 overflow-hidden'>
          {children}
        </div>
        <div className='h-[150px] bg-toolbar border-t p-2'>{share}</div>
      </main>
    </div>
  );
}