import { ComponentMeta } from '@storybook/react'

import { LeaderBoard } from '.'
import { leaderboard } from '../../../../backend/data/mocks/'
import { MockAuthProvider } from '../../../../lib/contexts'

export default {
  title: 'pages/Dashboard/Leaderboard',
  component: LeaderBoard,
} as ComponentMeta<typeof LeaderBoard>

export const Index = () => (
  <MockAuthProvider>
    <div className="w-[360px]">
      <LeaderBoard getLeaderBoard={async () => leaderboard} />
    </div>
  </MockAuthProvider>
)
