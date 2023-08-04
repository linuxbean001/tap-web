import { Tab } from '@headlessui/react'
import classNames from 'classnames/dedupe'
import React, {
  Children,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { UrlObject } from 'url'
import { setDefaultProps } from '../../lib'
import { Link } from '../nav'

export type TabsProps = {
  className?: any
  tabHeaders: (string | { text: string; href: string | UrlObject })[]
  bottomDivider?: boolean
  selectedTabIndex?: number
  children?: ReactNode
  Panels?: React.FC<{
    children: (
      | string
      | number
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
      | React.ReactPortal
    )[]
    selectedIndex: number
  }>
}

export default function Tabs({
  className,
  tabHeaders,
  children,
  selectedTabIndex = 0,
  bottomDivider = false,
  Panels,
}: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(selectedTabIndex)
  useEffect(() => {
    setSelectedIndex(selectedTabIndex)
  }, [selectedTabIndex])
  const arrayChildren = Children.toArray(children)
  const classes = classNames('-mb-px flex space-x-2', className, {
    [`${bottomDivider ? 'border-b border-gray-2' : ''}`]: bottomDivider,
  })
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className={classes}>
        {tabHeaders.map((header, index) => {
          const text = typeof header === 'string' ? header : header.text
          const href = typeof header === 'string' ? null : header.href
          const TabButton = (props: Parameters<typeof Tab>[0]) => (
            <Tab
              {...props}
              {...(href ? { as: Link, href: href || '#', shallow: true } : {})}
            />
          )
          return (
            <TabButton
              key={`${text}-${index}`}
              className={classNames(
                selectedIndex === index
                  ? 'border-blue-0 text-dark-primary'
                  : 'border-transparent text-dark-tertiary hover:text-gray-7 hover:border-gray-3',
                'whitespace-nowrap py-4 px-8 border-b-2 font-bold text-sm'
              )}
            >
              {text}
            </TabButton>
          )
        })}
      </Tab.List>
      <Panels selectedIndex={selectedIndex}>{arrayChildren}</Panels>
    </Tab.Group>
  )
}

export const TabPanels: TabsProps['Panels'] = ({ children }) => (
  <Tab.Panels>
    {Children.map(children, (child, index) => {
      return <Tab.Panel key={index}>{child}</Tab.Panel>
    })}
  </Tab.Panels>
)

export const ScrollableTabPanels: TabsProps['Panels'] = ({
  children,
  selectedIndex,
}) => {
  const refs: React.RefObject<HTMLElement>[] = useMemo(
    () => new Array(children.length).fill(0).map(() => React.createRef()),
    [children]
  )
  const isScrollableRef = useRef<boolean>(false)
  useEffect(() => {
    if (isScrollableRef.current === true) {
      refs[selectedIndex]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
    isScrollableRef.current = true
  }, [selectedIndex, refs])

  return (
    <>
      {Children.map(children, (child, index) => {
        return (
          <React.Fragment key={index}>
            {typeof child === 'string' || typeof child === 'number'
              ? child
              : React.isValidElement(child)
              ? React.cloneElement(child as JSX.Element, { ref: refs[index] })
              : child}
          </React.Fragment>
        )
      })}
    </>
  )
}

setDefaultProps(Tabs, {
  Panels: TabPanels,
})
