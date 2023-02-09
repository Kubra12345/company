import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateCompanyAddressDto } from './companyaddress.dto';

export class CreateCompanyDto {
  // @IsNumber()
  // id: number;

  @IsNotEmpty()
  companyName: string;

  nameInLowerCase: string;

  workPhone: string;

  logo?: string;

  isVerified?: boolean;

  @ValidateNested()
  @Type(() => CreateCompanyAddressDto)
  address: CreateCompanyAddressDto;
}
