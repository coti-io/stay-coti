import { IsString } from 'class-validator'

export class DatoCmsConfig {
    @IsString()
    host: string

    @IsString()
    token: string

    @IsString()
    apiHost: string

    @IsString()
    apiVersion: string

    @IsString()
    modelIdea: string

    @IsString()
    modelAuthor: string
}
