import { ComponentMeta } from '@storybook/react'
import { CSSProperties } from 'react'
import Tabs, { ScrollableTabPanels } from '.'

export default {
  title: 'shared/Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>

const styles: CSSProperties = {
  marginTop: '25px',
}

export const Index = () => (
  <Tabs tabHeaders={['First tab', 'Second tab', 'Third tab']}>
    <div style={styles}>Tab 1 content</div>
    <div style={styles}>Tab 2 content</div>
    <div style={styles}>Tab 3 content</div>
  </Tabs>
)

export const WithBottomDivider = () => (
  <Tabs tabHeaders={['First tab', 'Second tab', 'Third tab']} bottomDivider>
    <div style={styles}>Tab 1 content</div>
    <div style={styles}>Tab 2 content</div>
    <div style={styles}>Tab 3 content</div>
  </Tabs>
)

export const WithSelectedTabIndex = () => (
  <Tabs
    tabHeaders={['First tab', 'Second tab', 'Third tab']}
    selectedTabIndex={1}
  >
    <div style={styles}>Tab 1 content</div>
    <div style={styles}>Tab 2 content</div>
    <div style={styles}>Tab 3 content</div>
  </Tabs>
)

export const WithScrollablePanels = () => (
  <Tabs
    tabHeaders={['First tab', 'Second tab', 'Third tab']}
    Panels={ScrollableTabPanels}
  >
    <div
      data-scrollable-id="tab-1-content"
      className="bg-yellow-4 flex items-center justify-center"
      style={{ height: '70vh' }}
    >
      Tab 1 content
    </div>
    <div
      data-scrollable-id="tab-2-content"
      className="bg-gray-6 flex items-center justify-center"
      style={{ height: '70vh' }}
    >
      Tab 2 content
    </div>
    <div
      data-scrollable-id="tab-3-content"
      className="bg-green-4 flex items-center justify-center"
      style={{ height: '70vh' }}
    >
      Tab 3 content
    </div>
  </Tabs>
)
