import { IsString } from "class-validator";

export class AuthenticateDto {
  @IsString()
  userId: string;
}
