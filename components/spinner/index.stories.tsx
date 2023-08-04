import { ComponentMeta } from '@storybook/react'

import { Spinner } from '.'

export default {
  title: 'shared/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const Index = () => <Spinner />

export const CustomSize = () => <Spinner size="5rem" />

export const CustomSizeAndBorder = () => <Spinner size="5rem" borderWidth="7" />

export const CustomSizeBorderAndColor = () => (
  <Spinner size="5rem" borderWidth="7" borderColor={'#0AF'} />
)

export const Multiple = () => (
  <>
    <Spinner />
    <Spinner />
    <Spinner />
  </>
)
