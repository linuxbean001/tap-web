import knex from 'knex'
import path from 'path'

const db = knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve('./backend/services/db/migrations'),
  },
  seeds: {
    directory: path.resolve('./backend/services/db/seeds'),
  },
})

jest.mock('./backend/middleware/auth.ts', () => ({
  ...jest.requireActual('./backend/middleware/auth.ts'),
  isAuthorizedPropel: async () => {},
}))
jest.mock('./backend/services/db/conn.knex.ts', () => db)
jest.mock('nanoid', () => ({
  customAlphabet: () => () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2),
}))

beforeAll(async () => {
  await db.migrate.up()
  await db.seed.run()
})
