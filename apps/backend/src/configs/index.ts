import { Config } from '@blazjs/common'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Service } from 'typedi'
import { MySqlDataSourceConfig } from './types/db.config'
import { JwtConfig } from './types/jwt.config'
import { RedisConfig } from './types/redis.config'
import { DatoCmsConfig } from './types/datocms.config'

@Service()
export class AppConfig extends Config {
    @ValidateNested()
    masterDb: MySqlDataSourceConfig

    @ValidateNested()
    slavesDb: MySqlDataSourceConfig[]

    @ValidateNested()
    redis: RedisConfig

    @ValidateNested()
    jwt: JwtConfig

    @ValidateNested()
    datoCms: DatoCmsConfig

    @IsString()
    @IsNotEmpty()
    network: string

    @IsString()
    @IsNotEmpty()
    voteReceiverAddress: string

    constructor() {
        super()
        const { env } = process
        this.masterDb = this.decodeObj(env.MASTER_DB)
        this.slavesDb = this.decodeObj(env.SLAVES_DB)
        this.redis = this.decodeObj(env.REDIS)
        this.jwt = this.decodeObj(env.JWT)
        this.datoCms = this.decodeObj(env.DATO_CMS)
        this.network = env.NETWORK || 'testnet'
        this.voteReceiverAddress = env.VOTE_RECEIVER_ADDRESS || ''
    }
}
