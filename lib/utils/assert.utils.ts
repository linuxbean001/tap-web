import invariant from 'tiny-invariant'

/**
 * Given a condition/value, ensure it is truthy, else throw an error
 * @throws {Error}
 */
export const assert = <TOptional>(
  condition: TOptional,
  message?: string | (() => string)
): NonNullable<TOptional> => {
  invariant(
    condition,
    typeof message === 'string'
      ? `AssertError: ${message}`
      : message || `AssertError: condition must be truthy`
  )
  const _condition: NonNullable<TOptional> = condition
  return _condition
}

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false
export type Expect<T extends true> = T
