import { Knex } from 'knex'
import { snake, toCamel } from 'snake-camel'
import { Tap } from '../../../lib'
import { FieldsQueryResult } from '../../middleware/fields'
import { WithTimestamps } from '../db'
import knex from '../db/conn.knex'
import { Table } from '../db/tables'

export class AssetService {
  db: Knex

  constructor(db: Knex = knex) {
    this.db = db
  }

  async getAssets(
    assetIds: string[],
    {
      fields = ['*'] as FieldsQueryResult<Tap.Asset>,
      getAssets = (): Promise<Table<Tap.Asset>[]> =>
        this.db
          .select(...fields.map(snake))
          .from('asset')
          .whereIn('id', assetIds),
    } = {}
  ): Promise<WithTimestamps<Tap.Asset>[]> {
    const dbAssets = await getAssets()
    return dbAssets.map(this.transform)
  }

  async getAsset(
    assetId: string,
    {
      fields = ['*'] as FieldsQueryResult<Tap.Asset>,
      getAsset = (): Promise<Table<Tap.Asset>> =>
        knex('asset')
          .where({ id: assetId })
          .select(...fields.map(snake))
          .first(),
    } = {}
  ): Promise<WithTimestamps<Tap.Asset>> {
    const dbAsset = await getAsset()
    if (!dbAsset) return null
    return this.transform(dbAsset)
  }

  transform(dbAsset: Table<Tap.Asset>): WithTimestamps<Tap.Asset> {
    return toCamel(dbAsset)
  }
}
