import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'

export interface GetCotiEventsDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
}

export class GetCotiEventsReqDTO extends BaseRequestDTO implements GetCotiEventsDTO {
    @IsString()
    orderByKey: string = 'startDateTime'

    @IsString()
    orderByValue: string = 'asc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1    
}
