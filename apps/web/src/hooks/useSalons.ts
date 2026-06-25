"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SalonListing, SalonFilters } from "@/types/salon";

interface UseSalonsOptions {
  filters?:  SalonFilters;
  pageSize?: number;
  enabled?:  boolean;
}

interface UseSalonsResult {
  salons:    SalonListing[];
  isLoading: boolean;
  isError:   boolean;
  errorMsg:  string | null;
  hasMore:   boolean;
  total:     number;
  page:      number;
  fetchNext: () => void;
  refetch:   () => void;
  reset:     () => void;
}

function buildQueryString(filters: SalonFilters, page: number, pageSize: number): string {
  const params = new URLSearchParams();
  params.set("page",     String(page));
  params.set("pageSize", String(pageSize));
  if (filters.area?.length)     filters.area.forEach((a) => params.append("area", a));
  if (filters.category?.length) filters.category.forEach((c) => params.append("category", c));
  if (filters.gender)           params.set("gender",    filters.gender);
  if (filters.tier?.length)     filters.tier.forEach((t) => params.append("tier", t));
  if (filters.minRating)        params.set("minRating", String(filters.minRating));
  if (filters.maxPrice)         params.set("maxPrice",  String(filters.maxPrice));
  if (filters.isOpen)           params.set("isOpen",    "true");
  if (filters.sortBy)           params.set("sortBy",    filters.sortBy);
  return params.toString();
}

interface ApiSalonsResponse {
  success: boolean;
  message?: string;
  data?: {
    salons:   SalonListing[];
    total:    number;
    page:     number;
    pageSize: number;
  };
}

export function useSalons({
  filters  = {},
  pageSize = 12,
  enabled  = true,
}: UseSalonsOptions = {}): UseSalonsResult {
  const [salons,    setSalons]    = useState<SalonListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError,   setIsError]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);
  const [total,     setTotal]     = useState(0);

  const abortRef   = useRef<AbortController | null>(null);
  const filtersKey = JSON.stringify(filters);

  const fetchPage = useCallback(async (p: number, append: boolean) => {
    if (!enabled) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setIsError(false);
    setErrorMsg(null);

    try {
      const qs  = buildQueryString(filters, p, pageSize);
      const res = await fetch(`/api/salons?${qs}`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const json: ApiSalonsResponse = await res.json();
      if (!json.success || !json.data) throw new Error(json.message ?? "Failed to load salons");

      const { salons: newSalons, total: newTotal } = json.data;
      setSalons((prev) => (append ? [...prev, ...newSalons] : newSalons));
      setTotal(newTotal);
      setHasMore(newSalons.length === pageSize);
      setPage(p);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setIsError(true);
      setErrorMsg((err as Error).message ?? "Failed to load salons");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, pageSize, enabled]);

  useEffect(() => {
    setSalons([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, enabled]);

  const fetchNext = useCallback(() => {
    if (!isLoading && hasMore) fetchPage(page + 1, true);
  }, [isLoading, hasMore, page, fetchPage]);

  const refetch = useCallback(() => fetchPage(page, false), [fetchPage, page]);

  const reset = useCallback(() => {
    setSalons([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, false);
  }, [fetchPage]);

  return { salons, isLoading, isError, errorMsg, hasMore, total, page, fetchNext, refetch, reset };
}