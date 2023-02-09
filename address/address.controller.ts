import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Where } from 'src/common/where';
import { CreateCompanyAddressDto } from '../dto/companyaddress.dto';
import { AddressService } from './address.service';

@Controller('company/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createAddressDto: CreateCompanyAddressDto) {
    console.log(createAddressDto);
    const result = await this.addressService.create(createAddressDto);
    return {
      status: true,
      message: `Address added successfully`,
      data: result,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('all')
  async findAllByCompany(@Req() req) {
    console.log(req);
    const filter: Where = {};
    if (req.query.search) {
      filter.search = req.query.search;
    }
    const result = await this.addressService.findByCompany(
      +req.user['companyId'],
      +req.query.limit || 1000,
      +req.query.offset || 0,
      filter,
    );
    return {
      status: true,
      message: `Address listed successfully`,
      data: result.data,
      total: result.total,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.addressService.findOne(+id);
    return {
      status: true,
      message: `Get-one address by id listed successfully`,
      data: result,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateCompanyAddressDto) {
    const result = await this.addressService.update(
      +id,
      UpdateCompanyAddressDto,
    );
    return {
      status: true,
      message: `Address updated successfully`,
      data: result,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
    // return {
    //   status: true,
    //   message: `Address deleted successfully`,
    //   data: [],
    // };
  }
}
