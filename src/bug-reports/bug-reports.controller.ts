import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { BugReportsService } from './bug-reports.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { UpdateBugReportDto } from './dto/update-bug-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@Controller('bug-reports')
export class BugReportsController {
  constructor(private readonly service: BugReportsService) {}

  /** Any authenticated user can submit a bug report */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBugReportDto, @Request() req: any) {
    return this.service.create(dto, req.user?.userId);
  }

  /** Only master can list / update / delete */
  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBugReportDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
