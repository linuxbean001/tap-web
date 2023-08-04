import type { Knex } from 'knex'

const config: Knex.Config = {
  client: 'pg',
  version: process.env.PG_VERSION,
  connection: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    pool: {
      min: 0,
      max: 10,
    },
    ...{ ssl: true },
    // ...(process.env.ENV === 'local' ? {} : { ssl: true }),
  },
}

export default config
