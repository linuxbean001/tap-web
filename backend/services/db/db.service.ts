import { Knex } from 'knex'

export type WithTimestamps<TEntity> = TEntity & {
  createdAt: string
  updatedAt: string
}

export async function rawQuery<T extends {}>(
  conn: Knex,
  q: string,
  params: string[]
): Promise<T[]> {
  const resp = await conn.raw(q, params)
  if (resp && resp.rows) {
    return resp.rows
  } else {
    return []
  }
}
