"use client"

import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<Element | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, root, rootMargin, hasIntersected])

  return { elementRef, isIntersecting, hasIntersected }
}

// Lazy loading hook for images
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string>()
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
  })

  useEffect(() => {
    if (hasIntersected && src) {
      setImageSrc(src)
    }
  }, [hasIntersected, src])

  const ref = (node: HTMLImageElement | null) => {
    setImageRef(node)
    elementRef.current = node
  }

  return { ref, src: imageSrc, isLoaded: !!imageSrc }
}
