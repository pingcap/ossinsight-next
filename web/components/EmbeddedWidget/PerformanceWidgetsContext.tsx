import { useDocumentVisible, useOnline } from '@/utils/hooks';
import { createContext, ReactNode, useContext } from 'react';

export function PerformanceWidgetsContextProvider ({ children }: { children: ReactNode }) {
  const documentVisible = useDocumentVisible();
  const online = useOnline();

  return (
    <PerformanceWidgetsContext.Provider value={{ shouldLoadWidget: documentVisible && online }}>
      {children}
    </PerformanceWidgetsContext.Provider>
  );
}

const PerformanceWidgetsContext = createContext<{ shouldLoadWidget: boolean }>({
  shouldLoadWidget: true,
});

export function useShouldLoadWidget () {
  return useContext(PerformanceWidgetsContext).shouldLoadWidget;
}
