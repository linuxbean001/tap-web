import { ComponentMeta } from '@storybook/react'

import Footer from '.'

export default {
  title: 'shared/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>

export const Index = () => <Footer />
