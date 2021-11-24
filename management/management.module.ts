import { Module } from '@nestjs/common';
import { ManagementController } from './controllers/management.controller';
import { ManagementService } from './services/management.service';
import { ManagementAuthService } from './services/management-auth.service';
import { RegistrationGuardForManager } from 'src/guards/auth-manager.guard';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { EmailModule } from '../email/email.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from 'src/modules/user/user.module';
@Module({
  imports: [EmailModule, CompanyModule, UserModule],
  controllers: [ManagementController],
  providers: [
    ManagementService,
    ManagementAuthService,
    RegistrationGuardForManager,
    JWTAuthGuard,
  ],
  exports: [RegistrationGuardForManager, JWTAuthGuard],
})
export class ManagementModule {}
