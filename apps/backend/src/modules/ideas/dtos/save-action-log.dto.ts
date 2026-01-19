import { BaseRequestDTO } from '@blazjs/common'
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'

export interface SaveActionLogDTO {
    entity?: {
        id: string;
        attributes: {
            idea_status: string;
        };
    };
    previous_entity?: {
        id: string;
        attributes: {
            idea_status: string;
        };
    };
}


class EntityDTO {
    @IsString()
    id: string;

    @IsObject()
    attributes: {
        idea_status: string;
    };
}



export class SaveActionLogReqDTO extends BaseRequestDTO implements SaveActionLogDTO {
    @IsOptional()
    @ValidateNested()
    @Type(() => EntityDTO)
    entity?: EntityDTO;

    @IsOptional()
    @ValidateNested()
    @Type(() => EntityDTO)
    previous_entity?: EntityDTO;
}
