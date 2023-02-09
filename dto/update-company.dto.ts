import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { UpdateCompanyAddressDto } from './update-companyaddress.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  companyName?: string;
  nameInLowerCase?: string;
  workPhone?: string;
  address?: UpdateCompanyAddressDto;
  logo?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}
