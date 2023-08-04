import { useState } from 'react'

/**
 * A hook for mutating data, perhaps via an RPC, or even internal data
 *
 * @example
 * const { loading, mutate } = useDataMutation(
 *  (data: { courseId: string }) => startCourse(data.courseId)
 * )
 *
 * const res = await mutate({ courseId: "course-001" })
 */
export const useDataMutation = <TData, TResult>(
  fn: (data?: TData) => Promise<TResult>
) => {
  const [loading, setLoading] = useState(false)
  const mutate = async (data?: TData) => {
    setLoading(true)
    return fn(data).finally(() => setLoading(false))
  }

  return {
    loading,
    mutate,
  }
}
