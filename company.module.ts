import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaClient } from '@prisma/client';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';

@Module({
  controllers: [CompanyController, AddressController],
  providers: [CompanyService, PrismaClient, AddressService],
  imports: [],
  exports: [CompanyService],
})
export class CompanyModule {}
