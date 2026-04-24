import { IsNotEmpty, IsString } from 'class-validator';

export class FindByIdentificationRequestDto {
  @IsString()
  @IsNotEmpty()
  identificationNumber!: string;

  @IsString()
  @IsNotEmpty()
  identificationType!: string;
}