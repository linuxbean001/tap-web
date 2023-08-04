import { ComponentMeta } from '@storybook/react'

import TextInput from '.'

export default {
  title: 'shared/TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>

export const Index = () => <TextInput placeholder="Placeholder" />

export const WithRequired = () => (
  <TextInput placeholder="Placeholder" required />
)

export const WithTitle = () => (
  <TextInput placeholder="Placeholder" title="Title" />
)

export const Disabled = () => <TextInput placeholder="Placeholder" disabled />

export const Valid = () => <TextInput placeholder="Placeholder" valid />

export const Invalid = () => (
  <TextInput placeholder="Placeholder" valid={false} />
)

export const ReadOnly = () => (
  <TextInput
    placeholder="Placeholder"
    className="w-full"
    value="Hello!"
    aria-readonly
  />
)
