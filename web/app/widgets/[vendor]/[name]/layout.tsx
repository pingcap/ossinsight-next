import BackButton from '@/app/widgets/[vendor]/[name]/BackButton';
import { Providers } from '@/app/widgets/[vendor]/[name]/Providers';
import { ReactElement } from 'react';

type Params = {
  parameters: ReactElement
  info: ReactElement
  share: ReactElement
  children: ReactElement
}

export default function Layout ({ parameters, info, share, children }: Params) {
  return (
    <Providers>
      <div className="flex flex-col lg:flex-row min-h-page lg:max-h-page">
        <aside className="lg:flex-1 p-4 bg-toolbar lg:max-h-page lg:min-h-page overflow-y-auto sticky top-header lg:border-r order-2">
          <BackButton />
          {info}
          <h2 className="text-md text-subtitle font-bold mt-8 mb-2">
            Widget configuration
          </h2>
          {parameters}
        </aside>
        <main className="lg:flex-[3] lg:max-h-page lg:flex lg:flex-col overflow-x-hidden order-1 lg:order-3">
          <div className="lg:max-h-[calc(100vh-210px)] lg:min-h-[calc(100vh-210px)] p-2 overflow-hidden">
            {children}
          </div>
          <div className="h-[150px] bg-toolbar border-t p-2">{share}</div>
        </main>
      </div>
    </Providers>
  );
}