/**
 * Helps you have a union type, that still accepts the parent type e.g.
 * "Car" | "Bicycle" should also accept a regular string, just so that strings can be
 * passed at runtime without the compiler complaining.
 */
type OneOf<TValues, TLiteralType extends string | number | symbol = string> =
  | TValues
  | (TLiteralType & { invalid?: never })

/**
 * Combines values of a property from every object in an array into a union type e.g.
 * @example
 * PickPropAsUnion<[{ a: 1, b: 2 }, { a: 3, b: 4 }], "a"> = "1" | "2"
 */
type PickPropAsUnion<
  TItems extends readonly { [key in TProp]: any }[],
  TProp extends string
> = TItems[number] extends { [key in TProp]: infer TValue } ? TValue : never

/**
 * Allows partial nested objects
 */
type PartialSubset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr]
}

type Environment = 'local' | 'dev' | 'staging' | 'prod'
