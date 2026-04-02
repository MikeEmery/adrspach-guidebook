"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Crumb = { label: string; href?: string };

type BreadcrumbContextType = {
  crumbs: Crumb[];
  setCrumbs: (crumbs: Crumb[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  crumbs: [],
  setCrumbs: () => {},
});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbsState] = useState<Crumb[]>([]);
  const setCrumbs = useCallback((c: Crumb[]) => setCrumbsState(c), []);
  return (
    <BreadcrumbContext.Provider value={{ crumbs, setCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}
