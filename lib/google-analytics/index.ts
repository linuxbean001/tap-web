// log the pageview with their URL
export const pageview = (url: string) => {
  window.gtag('config', process.env.GTAG_ID, {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params)
}
