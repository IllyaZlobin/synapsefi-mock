import { IsString } from "class-validator";

export class CreateSubnetParamsDto {
  @IsString()
  userId: string;

  @IsString()
  nodeId: string;
}

export class CreateSubnetDto {
  @IsString()
  nickname: string;

  @IsString()
  account_class: string;

  @IsString()
  supp_id: string; // subnet id
}
