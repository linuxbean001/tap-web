interface Window {
  gtag: (command: 'config' | 'event', targetId: string, config?: any) => void
}
