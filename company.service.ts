import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { of } from 'rxjs';
import { Where } from 'src/common/where';
import { AddressService } from './address/address.service';
import { CreateCompanyAddressDto } from './dto/companyaddress.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly addressService: AddressService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    console.log(createCompanyDto);
    const createCompany = await this.prisma.company.create({
      data: {
        name: createCompanyDto.companyName,
        nameInLowerCase: createCompanyDto.companyName.toLowerCase().trim(),
        workPhone: createCompanyDto.workPhone,
        logo: createCompanyDto.logo,
        isVerified: createCompanyDto.isVerified,
      },
    });
    if (!createCompany)
      throw new HttpException(
        'Something Went Wrong on company creation',
        HttpStatus.BAD_REQUEST,
      );

    const createAddressdto: CreateCompanyAddressDto = {
      state: createCompanyDto.address.state,
      city: createCompanyDto.address.city,
      address: createCompanyDto.address.address,
      country: createCompanyDto.address.country,
      zip: createCompanyDto.address.zip,
      companyId: createCompany.id,
      branchName: createCompanyDto.address.branchName,
    };
    const createCompanyAddress = await this.addressService.create(
      createAddressdto,
    );
    if (!createCompanyAddress) {
      throw new HttpException(
        'Something Went Wrong on address creation',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      ...createCompany,
      address: { ...createCompanyAddress },
    };
  }

  async findAll(limit: number, offset: number, filter: Where) {
    console.log(limit);
    const where: Where = {
      block: false,
      isVerified: true,
      deletedAt: null,
    };
    if (filter.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }
    return await this.prisma.company.findMany({
      where,
      include: { addresses: { where: { deletedAt: null } } },
      orderBy: { name: 'asc' },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    return this.prisma.company.findUnique({
      where: { id: id },
      include: { addresses: { where: { deletedAt: null } } },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const updateCompany = await this.prisma.company.update({
      where: { id: id },
      data: {
        name: updateCompanyDto.companyName,
        nameInLowerCase: updateCompanyDto.companyName.toLowerCase().trim(),
        logo: updateCompanyDto.logo,
        linkedIn: updateCompanyDto.linkedIn,
        facebook: updateCompanyDto.facebook,
        twitter: updateCompanyDto.twitter,
        website: updateCompanyDto.website,
      },
      include: { addresses: true },
    });
    return updateCompany;
  }

  async remove(id: number) {
    const deleteCompany = await this.prisma.company.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
    if (!deleteCompany)
      throw new HttpException(
        'Something Went Wrong on company deletion',
        HttpStatus.BAD_REQUEST,
      );
    const deleteAddresses = await this.prisma.companyAddress.updateMany({
      where: { companyId: id },
      data: { deletedAt: new Date() },
    });
    return {
      status: true,
      message: 'Company deleted successfully',
      data: [],
    };
  }
  async updateAttributes(id: number, updateCompanyDto: UpdateCompanyDto) {
    const data = {
      workPhone: updateCompanyDto.workPhone,
    };
    const updateCompany = await this.prisma.company.update({
      where: { id: id },
      data,
      include: { addresses: true },
    });
    return updateCompany;
  }
}
