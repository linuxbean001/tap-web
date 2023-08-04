type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S
type StringKeys<TEntity extends {}> = {
  [key in keyof TEntity]: key extends string ? key : never
}[keyof TEntity]
type IsLiteral<TValue> = TValue extends string | number | boolean | symbol
  ? true
  : false

declare module 'snake-camel' {
  function camel<TInput>(input: TInput): SnakeToCamelCase<TInput>
  function snake<TInput>(input: TInput): CamelToSnakeCase<TInput>
  function toCamel<TInput>(input: TInput): TInput extends any[]
    ? toCamel<TInput[number]>
    : TInput extends {}
    ? {
        [key in SnakeToCamelCase<StringKeys<TInput>>]: IsLiteral<
          TInput[CamelToSnakeCase<key>]
        > extends true
          ? TInput[CamelToSnakeCase<key>]
          : toCamel<TInput[CamelToSnakeCase<key>]>
      }
    : TInput

  function toSnake<TInput>(input: TInput): TInput extends any[]
    ? toSnake<TInput[number]>
    : TInput extends {}
    ? {
        [key in CamelToSnakeCase<StringKeys<TInput>>]: IsLiteral<
          TInput[SnakeToCamelCase<key>]
        > extends true
          ? TInput[SnakeToCamelCase<key>]
          : toSnake<TInput[SnakeToCamelCase<key>]>
      }
    : TInput
}
