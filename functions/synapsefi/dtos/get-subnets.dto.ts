import { IsString } from "class-validator";

export class GetSubnetsDto {
  @IsString()
  userId: string;

  @IsString()
  nodeId: string;
}
