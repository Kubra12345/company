import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Where } from 'src/common/where';
import { CompanyService } from './company.service';
import { CreateCompanyAddressDto } from './dto/companyaddress.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  async findAll(@Req() req) {
    const filter: Where = {};
    if (req.query.search) {
      filter.search = req.query.search;
    }
    const data = await this.companyService.findAll(
      +req.query.limit || 1000,
      +req.query.offset || 0,
      filter,
    );
    return {
      message: `Companies listed succesfully`,
      status: true,
      data: data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(+id);
    return {
      status: true,
      message: `Company details showing successfully`,
      data: company,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  // @Post('address')
  // createAddress(@Body() createCompanyAddressDto: CreateCompanyAddressDto) {
  //   return this.companyService.createAddress(createCompanyAddressDto);
  // }
}
