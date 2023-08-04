import { FetcherResponse } from 'swr/_internal'
import { apiPrefix } from './models'

export type DataFetchFunction<TResponse, TInput = RequestInfo | URL> = (
  input: TInput,
  init?: RequestInit
) => FetcherResponse<TResponse>

let _fetchFunction = (input: RequestInfo | URL, init: RequestInit) =>
  fetch(input, init)

export const getFetchFunction =
  () => (input: RequestInfo | URL, init: RequestInit) =>
    _fetchFunction(`${apiPrefix}${input}`, init)
      .then(async (res) => {
        if (!res.ok) {
          const resErrorData = await res
            .clone()
            .json()
            .catch(async () => ({ text: await res.clone().text() }))
          return Promise.reject({
            status: res.status,
            statusText: res.statusText,
            ...resErrorData,
          })
        }
        return res
      })
      .then((res) => res.json())

export const setFetchFunction = (
  fetch: (input: RequestInfo | URL, init: RequestInit) => Promise<any>
) => {
  _fetchFunction = fetch
  return _fetchFunction
}
