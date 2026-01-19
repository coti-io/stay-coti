import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'

export interface GetEventsDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
}

export class GetEventReqDTO extends BaseRequestDTO implements GetEventsDTO {
    @IsString()
    orderByKey: string = 'startDateTime'

    @IsString()
    orderByValue: string = 'asc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1    
}
