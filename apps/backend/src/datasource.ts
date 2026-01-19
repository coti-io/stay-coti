import { TypeOrmDataSource } from '@blazjs/datasource'
import 'dotenv/config'
import Container from 'typedi'
import { AppConfig } from './configs'

const config = Container.get(AppConfig)
const { masterDb, slavesDb } = config
const path = config.isProductionNodeEnv() ? 'dist/' : ''

export const INJECT_SQL = 'SqlDataSource'

const datasource = new TypeOrmDataSource({
    type: 'mysql',
    entities: [path + 'src/**/*.entity.{ts,js}'],
    replication: {
        master: {
            host: masterDb.host,
            port: masterDb.port,
            username: masterDb.username,
            password: masterDb.password,
            database: masterDb.database,
        },
        slaves: slavesDb.map((i) => {
            return {
                host: i.host,
                port: i.port,
                username: i.username,
                password: i.password,
                database: i.database,
            }
        }),
    },
    migrations: [path + 'migrations/*.{ts,js}'],
    metadataTableName: 'Migrations',
    poolSize: 10,
    maxQueryExecutionTime: 1000,
    synchronize: false,
})

Container.set(INJECT_SQL, datasource)

export default datasource.source
