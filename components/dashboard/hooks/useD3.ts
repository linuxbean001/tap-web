import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export const useD3 = <T>(
  renderChartFn: (
    svg: d3.Selection<SVGElement, {}, HTMLElement, unknown>
  ) => void,
  deps: readonly T[]
) => {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    renderChartFn(d3.select(ref.current))
    return () => undefined
  }, [...deps, renderChartFn])

  return ref
}
