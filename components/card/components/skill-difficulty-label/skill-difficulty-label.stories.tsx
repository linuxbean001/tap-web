import { ComponentMeta } from '@storybook/react'

import SkillDifficultyLabel from '.'

export default {
  title: 'shared/Card/SkillDifficultyLabel',
  component: SkillDifficultyLabel,
} as ComponentMeta<typeof SkillDifficultyLabel>

export const Index = () => <SkillDifficultyLabel difficulty="Intermediate" />
