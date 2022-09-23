import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class VirtualDocumentMetaDto {
  @IsString()
  country_code: string;
}

export class VirtualDocumentDto {
  @IsString()
  document_value: string;

  @IsString()
  document_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => VirtualDocumentMetaDto)
  meta: VirtualDocumentMetaDto;
}

export class SocialDocumentMetaDto {
  @IsString()
  address_street: string;

  @IsString()
  address_city: string;

  @IsString()
  address_subdivision: string;

  @IsString()
  address_postal_code: string;

  @IsString()
  address_country_code: string;

  @IsString()
  address_care_of: string;
}

export class SocialDocumentDto {
  @IsString()
  document_value: string;

  @IsString()
  document_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SocialDocumentMetaDto)
  meta: SocialDocumentMetaDto;
}

export class PhysicalDocumentMetaDto {
  @IsString()
  country_code: string;
}

export class PhysicalDocumentDto {
  @IsString()
  document_value: string;

  @IsString()
  document_type: string;

  @IsString()
  @IsOptional()
  id?: string | undefined;

  @IsObject()
  @ValidateNested()
  @Type(() => PhysicalDocumentMetaDto)
  meta: PhysicalDocumentMetaDto;
}

export class DocumentDto {
  @IsString()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  ip: string;

  @IsOptional()
  @IsArray()
  company_activity?: string[];

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  ownership_percentage?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  entity_type: string;

  @IsString()
  entity_scope: string;

  @IsNumber()
  day: number;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsString()
  address_street: string;

  @IsString()
  address_city: string;

  @IsString()
  address_subdivision: string;

  @IsString()
  address_postal_code: string;

  @IsString()
  address_country_code: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PhysicalDocumentDto)
  physical_docs: PhysicalDocumentDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VirtualDocumentDto)
  virtual_docs?: VirtualDocumentDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialDocumentDto)
  social_docs?: SocialDocumentDto[];
}
