import { useCallback, useEffect } from 'react'

export function debounce(func, wait = 16) { // 16ms = ~60fps
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function useScrollHandler(callback, delay = 16) {
  const debouncedCallback = useCallback(
    debounce(callback, delay),
    [callback]
  )

  useEffect(() => {
    window.addEventListener('scroll', debouncedCallback)
    return () => window.removeEventListener('scroll', debouncedCallback)
  }, [debouncedCallback])
}

// Throttle for continuous animations
export function throttle(func, limit = 16) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 