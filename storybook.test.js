import initStoryshots, {
  Stories2SnapsConverter,
} from '@storybook/addon-storyshots'
import { act, render } from '@testing-library/react'
import React from 'react'

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'mock-id',
}))

jest.mock('@headlessui/react', () => ({
  ...jest.requireActual('@headlessui/react'),
  Transition: ({ children }) => (
    <div data-mocked-component="Transition">{children}</div>
  ),
}))

beforeEach(() => {
  window.matchMedia = () => ({
    matches: true,
    addListener: () => {},
    removeListener: () => {},
  })
})

beforeAll(() => {
  jest.spyOn(global.console, 'debug').mockImplementation(jest.fn())
  jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())
})

afterAll(() => {
  jest.clearAllMocks()
})

const converter = new Stories2SnapsConverter()

initStoryshots({
  suite: 'tab-web-platform',
  asyncJest: true,
  storyKindRegex: /^((?!.*?(App|mdx)).)*$/,
  test: async ({ story, context, done }) => {
    let renderer
    act(() => {
      // React.createElement() is important because of hooks [shouldn't call story.render() directly]
      renderer = render(React.createElement(story.render))
    })

    // Let one render cycle pass before rendering snapshot
    await act(() => sleep(15))

    // save each snapshot to a different file (similar to "multiSnapshotWithOptions")
    const snapshotFileName = converter.getSnapshotFileName(context)
    expect(renderer).toMatchSpecificSnapshot(
      snapshotFileName.replace(/^src(\\|\/)/, '')
    )

    done()
  },
})
