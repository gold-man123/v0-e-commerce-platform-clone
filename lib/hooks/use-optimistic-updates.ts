"use client"

import { useState, useCallback } from "react"

interface OptimisticState<T> {
  data: T[]
  isLoading: boolean
  error: string | null
}

export function useOptimisticUpdates<T extends { id: string }>(initialData: T[] = []) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  })

  const optimisticAdd = useCallback((item: T, apiCall: () => Promise<T>) => {
    // Optimistically add item
    setState((prev) => ({
      ...prev,
      data: [...prev.data, item],
      isLoading: true,
      error: null,
    }))

    // Make API call
    apiCall()
      .then((result) => {
        setState((prev) => ({
          ...prev,
          data: prev.data.map((i) => (i.id === item.id ? result : i)),
          isLoading: false,
        }))
      })
      .catch((error) => {
        // Revert optimistic update
        setState((prev) => ({
          ...prev,
          data: prev.data.filter((i) => i.id !== item.id),
          isLoading: false,
          error: error.message,
        }))
      })
  }, [])

  const optimisticUpdate = useCallback((id: string, updates: Partial<T>, apiCall: () => Promise<T>) => {
    // Optimistically update item
    setState((prev) => ({
      ...prev,
      data: prev.data.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      isLoading: true,
      error: null,
    }))

    // Make API call
    apiCall()
      .then((result) => {
        setState((prev) => ({
          ...prev,
          data: prev.data.map((i) => (i.id === id ? result : i)),
          isLoading: false,
        }))
      })
      .catch((error) => {
        // Revert optimistic update
        setState((prev) => ({
          ...prev,
          data: prev.data.map((item) => (item.id === id ? { ...item, ...updates } : item)),
          isLoading: false,
          error: error.message,
        }))
      })
  }, [])

  const optimisticDelete = useCallback(
    (id: string, apiCall: () => Promise<void>) => {
      const itemToDelete = state.data.find((item) => item.id === id)
      if (!itemToDelete) return

      // Optimistically remove item
      setState((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item.id !== id),
        isLoading: true,
        error: null,
      }))

      // Make API call
      apiCall()
        .then(() => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }))
        })
        .catch((error) => {
          // Revert optimistic update
          setState((prev) => ({
            ...prev,
            data: [...prev.data, itemToDelete],
            isLoading: false,
            error: error.message,
          }))
        })
    },
    [state.data],
  )

  const setData = useCallback((data: T[]) => {
    setState((prev) => ({ ...prev, data }))
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  return {
    ...state,
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete,
    setData,
    setLoading,
    setError,
  }
}
