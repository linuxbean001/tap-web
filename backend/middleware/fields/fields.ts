type LiteralKeys<TEntity extends {}> = {
  [key in keyof TEntity]: key extends string
    ? TEntity[key] extends string | number | boolean
      ? key
      : never
    : never
}[keyof TEntity]
type ObjectKeys<TEntity extends {}> = {
  [key in keyof TEntity]: key extends string
    ? TEntity[key] extends Array<any>
      ? never
      : TEntity[key] extends Record<string, any>
      ? key
      : never
    : never
}[keyof TEntity]
type IdSuffix<TKey> = TKey extends string ? `${TKey}Id` : never

export type Fields<TEntity extends {}> = keyof {
  [key in LiteralKeys<TEntity> | IdSuffix<ObjectKeys<TEntity>>]: key
}
