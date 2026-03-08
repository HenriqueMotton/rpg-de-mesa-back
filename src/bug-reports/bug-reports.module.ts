import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BugReport } from './entities/bug-report.entity';
import { BugReportsService } from './bug-reports.service';
import { BugReportsController } from './bug-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BugReport])],
  providers: [BugReportsService],
  controllers: [BugReportsController],
})
export class BugReportsModule {}
