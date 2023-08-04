type ReferenceKeys<TEntity extends {}> = {
  [key in keyof TEntity]: key extends string
    ? TEntity[key] extends Array<any> | Record<string, any>
      ? TEntity[key] extends string[]
        ? never
        : key
      : never
    : never
}[keyof TEntity]

export type ReferenceFields<TEntity extends {}> = keyof {
  [key in ReferenceKeys<TEntity>]
}
