import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  is_bot?: boolean;

  @IsString()
  first_name: string;

  @IsString()
  last_name?: string;

  @IsString()
  username?: string;

  @IsString()
  language_code: string;
}
