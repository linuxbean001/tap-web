import * as d3 from 'd3'
import { Tap } from '../../../../../lib'
import { useD3 } from '../../../hooks'

const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ') // '%Y-%m-%dT%H:%M:%S.%fZ'

type Props = {
  data: Tap.Report.CompletedActivities
}
export const SessionsOverTimeChart = ({ data = [] }: Props) => {
  const margin = { top: 0, right: 0, bottom: 50, left: 48 },
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom

  const ref = useD3(
    (svg) => {
      const yMinValue = d3.min(data, (d) => d.count)
      const yMaxValue = d3.max(data, (d) => d.count)
      const max = yMaxValue > 5 ? yMaxValue : 5

      const _date = data.map((item) => ({
        date: parseDate(new Date(item.date).toISOString()),
        completedActivities: Number(item.count),
      }))

      const getX = d3
        .scaleTime()
        .domain(d3.extent(_date, (d) => d.date))
        .range([0, width])

      const getY = d3
        .scaleLinear()
        .domain([yMinValue, max].map((t) => Math.round(t)))
        .range([height, 0])

      function make_x_gridlines() {
        return d3.axisBottom(getX).ticks(data.length - 1)
      }

      function make_y_gridlines() {
        return d3.axisLeft(getY).ticks(5)
      }

      const linePath = d3
        .line<{
          date: Date
          completedActivities: number
        }>()
        .x((d) => getX(d.date))
        .y((d) => getY(d.completedActivities))
        .curve(d3.curveCardinal.tension(0.9))(_date)

      const xAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) => {
        return g
          .call(
            make_x_gridlines()
              .tickSize(-height)
              .tickFormat(d3.timeFormat('%m-%d-%y'))
          )
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('class', 'text-dark-secondary')
          .attr('font-size', '9px')
          .attr('dx', '-.7em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-65)')
      }
      const yAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) =>
        g
          .call(make_y_gridlines().tickSize(-width))
          .selectAll('text')
          .attr('class', 'text-dark-secondary')

      svg.select('.x-axis-line').call(xAxis)
      svg.select('.y-axis-line').call(yAxis)

      svg.selectAll('.line-path').data(data).attr('d', linePath)
    },
    [data?.length]
  )

  return (
    <svg
      ref={ref}
      viewBox={`-48 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`}
      className="overflow-visible"
    >
      <g className="y-axis-line grid-chart" />
      <g
        className="x-axis-line grid-chart"
        transform={`translate(0, ${height})`}
      />
      <path fill={'#B4DED4'} opacity={0.3} className="area-path" />
      <path
        strokeWidth={2}
        fill="none"
        stroke={'#78C2B0'}
        className="line-path"
      />
    </svg>
  )
}
