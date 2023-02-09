import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompanyAddressDto {
  // @IsNumber()
  // id: number;

  address: string;

  state: string;

  city: string;

  country: string;

  zip: string;

  branchName?: string;

  companyId?: number;
}
