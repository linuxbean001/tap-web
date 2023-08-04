import * as d3 from 'd3'
import _ from 'lodash'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Tap } from '../../../../../lib'
import { useDataFetch } from '../../../../../lib/contexts'
import { useAnalytics } from '../../../../../lib/contexts/analytics/analytics.provider'
import { setDefaultProps } from '../../../../../lib/utils'
import AutocompleteInput from '../../../../autocomplete-input'
import Tooltip from '../../../../tooltip'
import { getCourses } from '../../../dashboard.service'
import { useD3 } from '../../../hooks'
import { NoChartData } from '../NoChartData'

export interface IGroupedData {
  label: string
  values: {
    topicId: string
    topicTitle: string
    value: number
  }[]
}

type Props = {
  getCourses?: typeof getCourses
  data?: Tap.Report.SkillDistribution
  error?: Error
  setSelectedTopic?: Dispatch<SetStateAction<string[]>>
  selectedTopicIds?: string[]
}

const chartColors: string[] = [
  '#64AEC6',
  '#223E6F',
  '#9CA3AF',
  '#78C2B0',
  '#94AACF',
  // '#32518B',
  // '#3777D6',
  // '#67BCEB',
  // '#94B0F9',
  // '#E9D296',
  // '#618377',
]

const chartDataMapper = (data: Tap.Report.SkillDistribution) => {
  if (data.length === 0) return []
  const levels = data[0].metrics.map((i) => i.level)
  const result = levels.reduce(
    (
      agg: {
        label: string
        values: { topicId: string; topicTitle: string; value: number }[]
      }[],
      cur
    ) => {
      const item = {
        label: cur,
        values: data.reduce(
          (
            acc: { topicId: string; topicTitle: string; value: number }[],
            curItem
          ) => {
            const { topicId, topicTitle } = curItem
            const d = {
              topicId,
              topicTitle,
              value: curItem.metrics.find((i) => i.level === cur)?.count ?? 0,
            }
            acc.push(d)
            return acc
          },
          []
        ),
      }
      agg.push(item)
      return agg
    },
    []
  )
  return result
}

const Skeleton = () => (
  <div
    role="status"
    className="p-4 border border-gray-4 animate-pulse md:p-6 h-[26rem]"
  >
    <div className="flex items-baseline mt-4 space-x-6">
      <div className="w-full h-72 bg-gray-200  bg-gray-3"></div>
      <div className="w-full h-56 bg-gray-200  bg-gray-3"></div>
      <div className="w-full h-72 bg-gray-200  bg-gray-3"></div>

      <div className="w-full h-64 bg-gray-200  bg-gray-3"></div>
      <div className="w-full h-80 bg-gray-200 bg-gray-3"></div>
      <div className="w-full h-72 bg-gray-200  bg-gray-3"></div>

      <div className="w-full h-80 bg-gray-200  bg-gray-3"></div>
      <div className="w-full h-64 bg-gray-200  bg-gray-3"></div>
      <div className="w-full h-80 bg-gray-200 bg-gray-3"></div>
    </div>
  </div>
)

export function SkillDistributionAdminChart({
  getCourses,
  data,
  error,
  setSelectedTopic,
  selectedTopicIds,
}: Props) {
  const { analytics } = useAnalytics()
  const coursesFetch = useDataFetch(`/courses`, {
    fetcher: async () => await getCourses(),
  })
  const activeCourses = coursesFetch.data
    ? coursesFetch.data
        .filter((course) => course.published === true)
        .map((course) => {
          return {
            topicTitle: course.title,
            topicId: course.id,
          }
        })
    : []
  const isLoading = !data && !error

  const mappedData = chartDataMapper(data ?? [])
  const unsortedTopics =
    activeCourses?.map((item) => ({
      label: item.topicTitle,
      value: item.topicId,
    })) ?? []

  const topics = _.orderBy(unsortedTopics, ['label'])
  const topicsByValue = _.keyBy(topics, 'value')

  const margin = { top: 10, right: 0, bottom: 10, left: 40 }
  const width = 500 - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  const svgRenderer = useCallback(
    (svg: d3.Selection<SVGElement, {}, HTMLElement, unknown>) => {
      const labels = mappedData.map(({ label }) => label)
      const sublabels = Object.keys(
        mappedData[0]?.values.map((i) => i.value) ?? ''
      )
      const result = data?.map((course) => {
        const cumulativeSum = course.metrics.reduce(
          (sum, metric) => sum + metric.count,
          0
        )
        return { topicId: course.topicId, maxValue: cumulativeSum }
      })

      const maxValues = result?.map((data) => data.maxValue) ?? []
      const globalMax = maxValues.reduce((a, b) => a + b, 0)
      const scaleX = d3
        .scaleBand()
        .domain(labels)
        .range([0, width])
        .padding(0.35)

      const scaleY = d3
        .scaleLinear()
        .domain([0, globalMax === 0 ? 1 : Math.max(...maxValues)])
        .range([height, 0])

      const subscaleX = d3
        .scaleBand()
        .domain(sublabels)
        .range([0, scaleX.bandwidth()])
        .padding(0.05)

      const color = d3.scaleOrdinal().domain(sublabels).range(chartColors)

      const xAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) =>
        g
          .attr('transform', `translate(0,${height + margin.top})`)
          .attr('class', 'stroke-0 text-dark-secondary')
          .call(d3.axisBottom(scaleX).tickSize(0))

      const yAxis = (
        g: d3.Selection<SVGSVGElement, {}, HTMLElement, unknown>
      ) =>
        g
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .attr('class', 'stroke-0 text-dark-secondary')
          .call(
            d3.axisLeft(scaleY).tickFormat((d) => {
              const denominator = globalMax === 0 ? 1 : Math.max(...maxValues)
              return Math.round((Number(d) * 100) / denominator) + '%'
            })
          )

      svg.select('.x-axis').call(xAxis)
      svg.select('.y-axis').call(yAxis)

      d3.select('div[class="tooltip-tip"]').remove()
      const tooltip = d3
        .select('.admin-chart-wrapper')
        .append('div')
        .attr('class', 'tooltip-tip')
        .style('opacity', 0)

      const mouseover = (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9)
        tooltip
          .html(`${d.topicTitle} - ${d.value} Trainees`)
          .style('left', `${event.layerX + 35}px`)
          .style('top', `${event.layerY - 28}px`)
      }

      const mouseout = () => {
        tooltip.transition().duration(500).style('opacity', 0)
      }

      svg
        .select('.plot-area')
        .selectAll('g')
        .data(mappedData)
        .join('g')
        .attr(
          'transform',
          (d) => `translate(${scaleX(d.label)}, ${margin.top})`
        )
        .selectAll('rect')
        .data((d) => d.values)
        .join('rect')
        .attr('x', (d, index) => subscaleX(String(index)))
        .attr('y', (d) => scaleY(0))
        .attr('width', subscaleX.bandwidth())
        .attr('height', (d) => height - scaleY(0))
        .attr('fill', (d, index) => {
          const _color = index <= 9 ? color(`${index}`) : '#E7AD55'
          return color(`${index}`) as string
        })
        .on('mouseout', mouseout)
        .on('mouseover', mouseover)

      svg
        .selectAll('rect')
        .transition()
        .duration(1000)
        .attr('y', (d: Record<string, number>) => scaleY(d.value))
        .attr('height', (d: Record<string, number>) => height - scaleY(d.value))
        .delay((_, i) => i * 50)
    },
    [mappedData, data, width, height, margin.top, margin.left]
  )
  const ref = useD3(svgRenderer, [JSON.stringify(mappedData)])

  const onChangeSelectedTopic = useCallback(
    (value) => {
      const selectedCourses = value.map((id: string) => ({
        courseId: id,
        course: topicsByValue[id].label,
      }))
      analytics.track('Skill Distribution: Change Selected Courses: ', {
        selectedCourses,
      })
      setSelectedTopic(value)
    },
    [topicsByValue, setSelectedTopic, analytics]
  )

  return (
    <div className="admin-chart-wrapper bg-gray-0">
      <header className="flex justify-between flex-col md:flex-row mb-8">
        <h3 className="text-h-sm font-medium text-dark-primary inline-flex items-center mb-4 md:mb-8">
          Skill Distribution By Course
          <Tooltip
            content="Shows your workforce's skill level across topics "
            className="ml-1.5"
          >
            <Image
              src="/images/question-circle.svg"
              width="18"
              height="18"
              alt="question icon"
            />
          </Tooltip>
        </h3>
        <AutocompleteInput
          multiple
          placeholder="Select a course"
          onChange={onChangeSelectedTopic}
          defaultValue="All Courses"
          options={topics}
          value={selectedTopicIds?.join(',')}
        ></AutocompleteInput>
      </header>

      {isLoading && <Skeleton />}
      {!isLoading && mappedData.length === 0 && <NoChartData />}
      {!isLoading && mappedData.length > 0 && (
        <svg
          ref={ref}
          className="bg-gray-1"
          viewBox={`0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom + 5
          }`}
        >
          <g className="plot-area" />
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      )}
    </div>
  )
}

setDefaultProps(SkillDistributionAdminChart, {
  getCourses,
})
