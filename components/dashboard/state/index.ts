import User from '../../../lib/domain/user'
import { useSharedState } from '../hooks'

export const useSelectedUserState = () =>
  useSharedState<PartialSubset<User>>('selected-user', { id: null })

export const useSelectedTimeState = () =>
  useSharedState<{ start: string | null; end: string | null }>(
    'selected-time',
    { start: null, end: null }
  )
