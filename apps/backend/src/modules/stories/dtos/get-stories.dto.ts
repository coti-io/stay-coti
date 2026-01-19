import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'

export interface GetStoriesDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
}

export class GetStoriesReqDTO extends BaseRequestDTO implements GetStoriesDTO {
    @IsString()
    orderByKey: string = '_createdAt'

    @IsString()
    orderByValue: string = 'desc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1    
}
