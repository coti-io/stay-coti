import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'

export interface GetSectionsDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
}

export class GetSectionsReqDTO extends BaseRequestDTO implements GetSectionsDTO {
    @IsString()
    orderByKey: string = 'menuPosition'

    @IsString()
    orderByValue: string = 'asc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1
}
