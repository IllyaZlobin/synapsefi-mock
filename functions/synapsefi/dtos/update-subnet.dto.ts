import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateSubnetParamsDto {
  @IsString()
  userId: string;

  @IsString()
  nodeId: string;

  @IsString()
  subnetId: string;
}

export class UpdateSubnetDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  supp_id?: string; // subnet id

  @IsIn(["ACTIVE", "INACTIVE"])
  @IsOptional()
  status?: "ACTIVE" | "INACTIVE";

  @IsString()
  @IsOptional()
  pin?: string;
}
