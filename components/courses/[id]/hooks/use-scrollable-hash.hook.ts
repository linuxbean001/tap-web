import { useEffect, useState } from 'react'

export const useScrollableHash = (value?: string) => {
  const [hash, setHash] = useState(value || '')
  useEffect(() => {
    if (typeof window.IntersectionObserver === 'undefined') {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target
          if (entry.isIntersecting) {
            const hash = element.getAttribute('data-scrollable-id')
            const location = window.location.toString().split('#')[0]
            history.replaceState(null, null, location + '#' + hash)
            setHash(hash)
          }
        })
      },
      {
        threshold: 0.8,
      }
    )

    document
      .querySelectorAll('[data-scrollable-id]')
      .forEach((element) => observer.observe(element))

    return () => {
      document
        .querySelectorAll('[data-scrollable-id]')
        .forEach((element) => observer.unobserve(element))
    }
  }, [])

  return hash
}
