"use client";

import { useEffect, useRef } from "react";
import { useBreadcrumbs } from "./BreadcrumbContext";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const { setCrumbs } = useBreadcrumbs();
  const key = JSON.stringify(crumbs);
  const prevKey = useRef("");

  useEffect(() => {
    if (prevKey.current !== key) {
      prevKey.current = key;
      setCrumbs(crumbs);
    }
    return () => setCrumbs([]);
  }, [key, setCrumbs, crumbs]);

  return null;
}
