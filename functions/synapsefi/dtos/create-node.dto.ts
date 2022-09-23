import { Type } from "class-transformer";
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateNodeParamsDto {
  @IsString()
  userId: string;
}

export class CreateNodeExtraDto {
  @IsString()
  supp_id: string;
}

export class CreateNodeInfoDto {
  @IsString()
  nickname: string;

  @IsString()
  document_id: string;
}

export class CreateNodeDto {
  @IsString()
  type: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateNodeExtraDto)
  extra: CreateNodeExtraDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateNodeInfoDto)
  info: CreateNodeInfoDto;
}
