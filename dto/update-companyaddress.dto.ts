import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateCompanyAddressDto } from './companyaddress.dto';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyAddressDto extends PartialType(
  CreateCompanyAddressDto,
) {
  // @IsNumber()
  // id: number;

  address: string;

  state: string;

  city: string;

  country: string;

  zip: string;

  branchName: string;
}
