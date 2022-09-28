import { IsString } from "class-validator";

export class GetCardShipmentDto {
  @IsString()
  userId: string;

  @IsString()
  nodeId: string;

  @IsString()
  subnetId: string;

  @IsString()
  shipmentId: string;
}
