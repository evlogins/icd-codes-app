import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'icd:context';
const DEFAULT_CONTEXT = 'clinical';
const VALID = new Set(['clinical', 'billing', 'research', 'public_health']);

const AppContext = createContext({ context: DEFAULT_CONTEXT, setContext: () => {} });

export function AppProvider({ children }) {
  const [context, setContextState] = useState(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_CONTEXT;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && VALID.has(stored) ? stored : DEFAULT_CONTEXT;
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, context);
    }
  }, [context]);

  const setContext = (next) => {
    if (VALID.has(next)) setContextState(next);
  };

  return <AppContext.Provider value={{ context, setContext }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
