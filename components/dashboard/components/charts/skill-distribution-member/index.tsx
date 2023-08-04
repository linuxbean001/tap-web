import * as d3 from 'd3'
import Image from 'next/image'
import { useCallback } from 'react'
import { setDefaultProps } from '../../../../../lib'
import { useDataFetch } from '../../../../../lib/contexts'
import Tooltip from '../../../../tooltip'
import { getUserSkillDistribution } from '../../../dashboard.service'
import { useD3 } from '../../../hooks'
import { useSelectedTimeState } from '../../../state'
import { NoChartData } from '../NoChartData'

type Props = {
  userId?: string
  getUserSkillDistribution?: typeof getUserSkillDistribution
}

const LEVELS = {
  'Needs Practice': 25,
  Novice: 50,
  Proficient: 75,
  Expert: 100,
}

const Skeleton = () => (
  <div
    role="status"
    className="p-4 border border-gray-4 animate-pulse md:p-6 h-[26rem]"
  >
    <div className="flex flex-col items-baseline mt-4 space-x-6">
      <div className="w-3/4 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
      <div className="w-5/6 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
      <div className="w-2/4 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
      <div className="w-3/4 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
      <div className="w-80 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
      <div className="w-72 h-10 bg-gray-200  bg-gray-3 mb-4"></div>
    </div>
  </div>
)

export function SkillDistributionMemberChart({
  getUserSkillDistribution,
  userId,
}: Props) {
  const margin = { top: 10, right: 30, bottom: 20, left: 35 }
  const width = 560 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const [selectedTime] = useSelectedTimeState()
  const { start, end } = selectedTime
  const userSkillDistributionQp = new URLSearchParams({
    start: start,
    end: end,
  }).toString()

  const { data, error } = useDataFetch(
    `/reports/user-skill-distribution/${userId}?daterange=${JSON.stringify(
      selectedTime
    )}`,
    {
      fetcher: async () =>
        userId ? getUserSkillDistribution(userId, selectedTime) : [],
    }
  )
  const isLoading = !data && !error

  function wrap(
    text: d3.Selection<SVGTextElement, unknown, HTMLElement, unknown>,
    width: number,
    chartHeight: number
  ) {
    text.each(function () {
      const text = d3.select(this)
      const words = text.text().split(/\s+/).reverse()
      let word: string
      let line: string[] = []
      let lineNumber = 0
      const lineHeight = 1.1 // ems
      const x = text.attr('x') ?? '0' // Get the x position or default to 0
      const y = +text.attr('y')! + chartHeight / (2 * words.length) // Get the y position and adjust for bar height
      const dy = parseFloat(text.attr('dy') ?? '0')
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', -65)
        .attr('y', y)
        .attr('dy', `${dy}em`)
        .style('text-anchor', 'start')
        .style('alignment-baseline', 'middle')

      while ((word = words.pop())) {
        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node()?.getComputedTextLength() ?? 0 > width - 2) {
          // subtracting 2 pixels for right padding
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = text
            .append('tspan')
            .attr('x', -65)
            .attr('y', y)
            .attr('dy', `${++lineNumber * lineHeight + dy}em`)
            .style('text-anchor', 'start')
            .style('alignment-baseline', 'middle')
            .text(word)
        }
      }
    })
  }

  const svgRenderer = useCallback(
    (svg: d3.Selection<SVGElement, {}, HTMLElement, unknown>) => {
      const values = Object.entries(LEVELS).map(([_, value]) => value)
      const scaleX = d3
        .scaleLinear()
        .domain([0, d3.max(values)])
        .range([0, width])

      const xAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) =>
        g
          .attr('transform', `translate(0,${height})`)
          .attr('class', 'grid-chart')
          .call(
            d3
              .axisBottom(scaleX)
              .tickSize(-height)
              .tickValues([25, 50, 75, 100])
              .tickFormat((d) => {
                const name = Object.entries(LEVELS).reduce(
                  (acc, [key, value]) => (acc = d === value ? key : acc),
                  ''
                )
                return name
              })
          )
          .call((g) => g.select('.domain').remove())
          .selectAll('text')
          .attr('class', 'text-dark-secondary')
          .attr('transform', 'translate(-60,0)rotate(0)')
          .style('text-anchor', 'center')

      const scaleY = d3
        .scaleBand()
        .range([0, height])
        .domain((data ?? []).map((d) => d.topic))
        .paddingOuter(1.5)
        .paddingInner(0.5)

      const chartHeight = data && scaleY.bandwidth()
      const yAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) => {
        g.attr('class', 'grid-chart')
          .call(d3.axisLeft(scaleY).tickSize(0))
          .selectAll<SVGTextElement, unknown>('text')
          .attr('class', 'text-dark-secondary')
          .attr('x', -margin.left - 8)
          .attr('y', -margin.right) // add a left margin of 2px
          .call(
            (
              selection: d3.Selection<
                SVGTextElement,
                unknown,
                SVGSVGElement,
                {}
              >
            ) => {
              selection.each(function (this: SVGTextElement) {
                wrap(d3.select(this), margin.left, chartHeight)
              })
            }
          )
      }
      svg.select('.x-axis').call(xAxis)
      svg.select('.y-axis').call(yAxis)

      svg.selectAll('rect').remove()

      svg
        .selectAll('bars')
        .data(data ?? [])
        .join('rect')
        .attr('x', scaleX(0))
        .attr('y', (d) => scaleY(d.topic))
        .attr('width', 0)
        .attr('height', scaleY.bandwidth())
        .attr('class', 'fill-primary-7')

      svg
        .selectAll('rect')
        .transition()
        .duration(1000)
        .attr('width', (d: Record<string, number>) => scaleX(LEVELS[d.level]))
        .delay((_, i) => i * 50)
    },
    [data, height, margin.left, margin.right, width]
  )
  const ref = useD3(svgRenderer, [data?.length ?? []])

  return (
    <div>
      <header className="flex justify-between flex-col md:flex-row">
        <h3 className="text-h-sm font-medium text-dark-primary inline-flex items-center mb-4 md:mb-8">
          Skill Distribution By Course
          <Tooltip
            content="Shows your workforce's skill level across topics "
            className="mr-2 md:mr-0 ml-0 md:ml-1.5"
          >
            <Image
              src="/images/question-circle.svg"
              width="18"
              height="18"
              alt="question icon"
            />
          </Tooltip>
        </h3>
      </header>
      {isLoading && <Skeleton />}
      {!isLoading && (data ?? []).length === 0 && <NoChartData />}
      {!isLoading && (data ?? []).length > 0 && (
        <svg
          ref={ref}
          className="bg-gray-1"
          viewBox={`-68 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      )}
    </div>
  )
}

setDefaultProps(SkillDistributionMemberChart, {
  getUserSkillDistribution,
})
