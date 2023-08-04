import { useContext } from 'react'
import useSWR, { Fetcher, SWRConfiguration, useSWRConfig } from 'swr'

import { DataFetchContext } from '../data-fetch.context'
import { Api, apiPrefix } from '../models'

type ApiPrefix = typeof apiPrefix

type DataFetchOptions<
  TKeyPattern extends Api.KeyPattern<keyof Api.Get>,
  TError = Error
> = Omit<
  SWRConfiguration<
    Api.Get[ApiKeyOf<TKeyPattern>],
    TError,
    Fetcher<Api.Get[ApiKeyOf<TKeyPattern>], `${ApiPrefix}${TKeyPattern}`>
  >,
  'fetcher'
> & {
  fetcher?: () => Promise<Api.Get[ApiKeyOf<TKeyPattern>]>
}

/**
 * The `useDataFetch` hook lets us fetch data from the Tap3D API, in a type-safe manner, leveraging the SWR cache system.
 *
 * To extend the endpoints allowed, please update the [Api Get/Post]("./models/index.ts") types
 *
 * To use:
 *
 * @example
 * const { data: user } = useDataFetch("/user/me")
 * console.log(user) // Tap.User
 *
 * @example
 * const { data: courses } = useDataFetch("/courses?level=Intermediate")
 * console.log(courses) // Tap.Course[]
 *
 * @example
 * const { data: courses } = useDataFetch("/courses", {
 *   fetcher: fetch => getCourses({ fetch })
 * })
 * console.log(courses) // Tap.Course[]
 */
export const useDataFetch = <
  TKeyValue extends WithQueryFilters<Api.KeyPattern<keyof Api.Get>>,
  TKeyPattern extends IExtract<
    Api.KeyPattern<keyof Api.Get>,
    RemoveQueryFilters<TKeyValue>
  > = IExtract<Api.KeyPattern<keyof Api.Get>, RemoveQueryFilters<TKeyValue>>,
  TKey extends ApiKeyOf<TKeyPattern> = ApiKeyOf<TKeyPattern>,
  TError = Error
>(
  key: TKeyValue,
  options?: DataFetchOptions<TKeyPattern, TError>
) => {
  const config = useSWRConfig()
  const { fallback } = useContext(DataFetchContext)
  const res = useSWR<Api.Get[TKey], TError, `${ApiPrefix}${TKey}`>(
    `${apiPrefix}${key as any}`,
    {
      fetcher: (typeof options?.fetcher === 'function'
        ? options?.fetcher
        : config.fetcher) as Fetcher<
        Api.Get[TKey],
        `${typeof apiPrefix}${TKey}`
      >,
      fallbackData: options?.fallbackData || fallback[key as string],
    }
  )
  if (res.error) {
    console.error(res.error)
  }
  return res
}

type IExtract<T, U> = T extends U ? U : U extends T ? T : never
type WithQueryFilters<TPattern extends Api.KeyPattern<keyof Api.Get>> =
  | TPattern
  | `${TPattern}?${string}`
type RemoveQueryFilters<TPatternWithQueryFilters> =
  TPatternWithQueryFilters extends WithQueryFilters<infer TPattern>
    ? TPattern
    : never
type ApiKeyOf<TKeyPattern extends Api.KeyPattern<keyof Api.Get>> = Extract<
  keyof Api.Get,
  TKeyPattern
>

/** ====== Type assertions ====== */

import { Tap } from '../../../domain'
import type { Equal, Expect } from '../../../utils'

type testCases = [
  Expect<
    Equal<
      IExtract<Api.KeyPattern<keyof Api.Get>, `/course/hello`>,
      `/course/${string}`
    >
  >,
  Expect<
    Equal<
      ApiKeyOf<IExtract<Api.KeyPattern<keyof Api.Get>, `/course/hello`>>,
      '/course/:id'
    >
  >,
  Expect<Equal<ReturnType<typeof useDataFetch<'/user/me'>>['data'], Tap.User>>,
  Expect<
    Equal<ReturnType<typeof useDataFetch<'/courses'>>['data'], Tap.Course[]>
  >,
  Expect<
    Equal<ReturnType<typeof useDataFetch<'/course/1'>>['data'], Tap.Course>
  >,
  Expect<
    Equal<
      ReturnType<typeof useDataFetch<'/courses?fields=[id]'>>['data'],
      Tap.Course[]
    >
  >,
  Expect<
    Equal<
      ReturnType<
        typeof useDataFetch<'/reports/user-progress-summary/:user_id?start=2021-01-01&end=2023-12-31'>
      >['data'],
      Tap.Report.UserProgressSummary
    >
  >
]
