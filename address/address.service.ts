import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Where } from 'src/common/where';
import { CreateCompanyAddressDto } from '../dto/companyaddress.dto';
import { UpdateCompanyAddressDto } from '../dto/update-companyaddress.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createAddressDto: CreateCompanyAddressDto) {
    console.log(createAddressDto);
    const checkCompany = await this.prisma.company.findUnique({
      where: { id: createAddressDto.companyId },
    });
    console.log(checkCompany);

    if (!checkCompany)
      throw new HttpException(`Company doesn't exist`, HttpStatus.BAD_REQUEST);
    const checkBranchName = await this.prisma.companyAddress.findFirst({
      where: {
        branchName: createAddressDto.branchName,
        companyId: createAddressDto.companyId,
        deletedAt: null,
      },
    });

    if (checkBranchName)
      throw new HttpException(
        `Branch name should be unique`,
        HttpStatus.BAD_REQUEST,
      );
    const create = await this.prisma.companyAddress.create({
      data: {
        state: createAddressDto.state,
        city: createAddressDto.city,
        address: createAddressDto.address,
        country: createAddressDto.country,
        zip: createAddressDto.zip,
        companyId: createAddressDto.companyId,
        branchName: createAddressDto.branchName,
      },
    });

    return create;
  }

  async findByCompany(
    companyId: number,
    limit: number,
    offset: number,
    filter: Where,
  ) {
    console.log(limit);
    const where: Where = { companyId: companyId, deletedAt: null };
    // if (filter.search) {
    //   where.name = { contains: filter.search, mode: 'insensitive' };
    // }
    const data = await this.prisma.companyAddress.findMany({
      where,
      skip: offset,
      take: limit,
    });
    const count = await this.prisma.companyAddress.count({
      where,
    });

    return {
      data: data,
      total: count,
    };
  }

  findOne(id: number) {
    return this.prisma.companyAddress.findFirst({
      where: { id: id, deletedAt: null },
    });
  }

  async update(id: number, updateAddressDto: UpdateCompanyAddressDto) {
    //
    const update = await this.prisma.companyAddress.update({
      where: { id: id },
      data: {
        city: updateAddressDto.city,
        country: updateAddressDto.country,
        zip: updateAddressDto.zip,
        address: updateAddressDto.address,
        state: updateAddressDto.state,
        branchName: updateAddressDto.branchName,
      },
    });
    return update;
  }

  async remove(id: number) {
    const remove = await this.prisma.companyAddress.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
    const getCompanyAddress = await this.prisma.companyAddress.findFirst({
      where: { companyId: remove.companyId, deletedAt: null },
    });
    await this.prisma.user.updateMany({
      where: { companyAddressId: id },
      data: { companyAddressId: getCompanyAddress.id },
    });
    await this.prisma.invites.updateMany({
      where: { companyAddressId: id },
      data: { companyAddressId: getCompanyAddress.id },
    });
    return {
      status: true,
      message: 'Address Deleted successfully',
      data: id,
    };
  }
}
