import type { Knex } from 'knex'
import knex from 'knex'
import config from './knexfile'

const conn: Knex = knex(config)

export default conn
