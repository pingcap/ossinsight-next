import { ReactElement } from 'react';

type Params = {
  parameters: ReactElement
  share: ReactElement
  children: ReactElement
}

export default function Layout ({ parameters, share, children }: Params) {
  return (
    <div className="flex flex-col lg:flex-row min-h-page lg:max-h-page">
      <aside className="lg:flex-1 p-4 bg-toolbar lg:max-h-page lg:min-h-page overflow-y-auto sticky top-header lg:border-r order-2">
        <h2 className="text-md text-subtitle font-bold mb-2">Widget configuration</h2>
        {parameters}
      </aside>
      <main className="lg:flex-[3] lg:max-h-screen lg:flex lg:flex-col overflow-x-hidden order-1 lg:order-3">
        <div className="lg:h-[calc(100%-150px)] p-2">
          {children}
        </div>
        <div className="h-[150px] bg-toolbar border-t p-2">
          {share}
        </div>
      </main>
    </div>
  );
}