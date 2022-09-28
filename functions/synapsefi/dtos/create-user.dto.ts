import { UserCipType } from "@app/synapsefi/constants/cip";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DocumentDto } from "./common/document.dto";

export class CreateUserExtraDto {
  @IsEnum(UserCipType)
  @IsOptional()
  cip_tag?: UserCipType;
}

export class CreateUserLoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateUserDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserLoginDto)
  logins: CreateUserLoginDto[];

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserExtraDto)
  extra: CreateUserExtraDto;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}
