import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'

export interface GetIdeaCategoriesDTO {
    limit?: number
    page?: number
}

export class GetIdeaCategoriesReqDTO extends BaseRequestDTO implements GetIdeaCategoriesDTO {
    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1
}
