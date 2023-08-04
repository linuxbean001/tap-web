import useSWR from 'swr'

export type SetValue<T> = (value: T) => Promise<void>
export type RemoveValue = () => Promise<void>

export type HookResult<T> = readonly [T | null, SetValue<T>]

export const useSharedState = <T>(
  key: string,
  defaultValue: T | null = null
): HookResult<T> => {
  const { data: state = defaultValue, mutate } = useSWR(key, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    shouldRetryOnError: false,
    fetcher: null,
  })

  const setState = async (value: T): Promise<void> => {
    await mutate(value, false)
  }

  return [state, setState]
}
