import { AppRoles, IdDTO, TokenDTO } from './../../../types/index';
import { ManagementService } from './../services/management.service';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { route } from './routes';
import { ManagementAuthService } from '../services/management-auth.service';
import {
  CreateCgsManagerDTO,
  CreateTokenManagerDTO,
} from '../dtos/management.dto';
import { ClaimManagementBehavior } from '../services/strategies/behaviors/claim-management.behavior';
import {
  ApiCreateResponse,
  ApiForbiddenResponse,
  ApiLoginResponse,
  ApiUpdateResponse,
} from 'src/helpers/docs';
import { CheckRecordExistGuard } from 'src/guards/check-record-exist.guard';
import { RegistrationGuardForManager } from 'src/guards/auth-manager.guard';
import { CompanyManagementBehavior } from '../services/strategies/behaviors/company-management.behavior';
import { Roles } from 'src/types/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import Manager from '../entities/manager.entity';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { CheckCredentialsForValid } from 'src/guards/check-credentials.guard';
import { EmailService } from 'src/modules/email/email.service';
import { CompanyService } from 'src/modules/company/company.service';
import { UserService } from 'src/modules/user/user.service';
import { CheckIdValidGuard } from 'src/guards/check-id-valid.guard';
import Claim from 'src/entity/claim.entity';
import Worker from 'src/entity/worker.entity';
import Company from 'src/entity/company.entity';
import { MetadataGuard } from 'src/guards/metadata.guard';
@ApiTags(route.main)
@Controller(route.main)
export class ManagementController {
  constructor(
    public managementService: ManagementService,
    public managementAuthService: ManagementAuthService,
    private readonly emailService: EmailService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {}

  @Put(route.children.claimApprove)
  @Roles(AppRoles.CgsManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    new CheckIdValidGuard({ findIn: 'body' }),
    new CheckRecordExistGuard([{ field: 'id', Entity: Claim }]),
    new MetadataGuard({ Entity: Claim, setTo: 'approved' }),
  )
  @ApiUpdateResponse('Claim has been successfully approved by manager.')
  @ApiForbiddenResponse()
  async approveClaim(@Body() data: IdDTO): Promise<IdDTO> {
    this.managementService.setBehavior(new ClaimManagementBehavior());
    this.managementService.performApproval<IdDTO>(data.id);
    return { id: data.id };
  }

  @Put(route.children.claimReject)
  @Roles(AppRoles.CgsManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    new CheckIdValidGuard({ findIn: 'body' }),
    new CheckRecordExistGuard([{ field: 'id', Entity: Claim }]),
    new MetadataGuard({ Entity: Claim, setTo: 'rejected' }),
  )
  @ApiUpdateResponse('Claim has been successfully rejected by manager.')
  @ApiForbiddenResponse()
  async rejectClaim(@Body() data: IdDTO): Promise<IdDTO> {
    this.managementService.setBehavior(new ClaimManagementBehavior());
    this.managementService.performRejection<IdDTO>(data.id);
    return { id: data.id };
  }

  @Put(route.children.companyApprove)
  @Roles(AppRoles.CgsManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    new MetadataGuard({ Entity: Company, setTo: 'approved' }),
    new CheckIdValidGuard({ findIn: 'body' }),
    new CheckRecordExistGuard([{ field: 'id', Entity: Company }]),
  )
  @ApiUpdateResponse('Company has been successfully approved by manager.')
  @ApiForbiddenResponse()
  async approveCompany(@Body() data: IdDTO): Promise<IdDTO> {
    this.managementService.setBehavior(new CompanyManagementBehavior());
    this.managementService.performApproval<IdDTO>(data.id);
    const companyAdminUser = await this.companyService.findAdmin(data.id);
    const user = await this.userService.getUserWithPassword(
      companyAdminUser.id,
    );
    await this.emailService.sendSetPasswordLink(user.email);
    return { id: data.id };
  }

  @Put(route.children.companyReject)
  @Roles(AppRoles.CgsManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    new MetadataGuard({ Entity: Company, setTo: 'rejected' }),
    new CheckIdValidGuard({ findIn: 'body' }),
    new CheckRecordExistGuard([{ field: 'id', Entity: Company }]),
  )
  @ApiUpdateResponse('Company has been successfully rejected by manager.')
  @ApiForbiddenResponse()
  async rejectCompany(@Body() data: IdDTO): Promise<IdDTO> {
    this.managementService.setBehavior(new CompanyManagementBehavior());
    this.managementService.performRejection<IdDTO>(data.id);
    return { id: data.id };
  }

  @Post(route.children.cgsManager)
  @UseGuards(
    RegistrationGuardForManager,
    new CheckRecordExistGuard([
      {
        field: 'email',
        Entity: Manager,
        errorIfExist: true,
      },
    ]),
  )
  @ApiCreateResponse(
    'CgsManager has been successfully created and him secret key coincides with secret key in .env',
    CreateCgsManagerDTO,
  )
  async createManager(@Body() data: CreateCgsManagerDTO) {
    return await this.managementAuthService.register(data);
  }

  @Post(route.children.login)
  @Roles(AppRoles.CgsManager)
  @UseGuards(
    new CheckRecordExistGuard([{ field: 'email', Entity: Manager }]),
    new CheckCredentialsForValid({
      entity: Manager,
      propsToCheck: ['email'],
      findBy: 'email',
    }),
  )
  @ApiLoginResponse(AppRoles.CgsManager)
  async loginManager(@Body() data: CreateTokenManagerDTO): Promise<TokenDTO> {
    try {
      return await this.managementAuthService.login(data);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  @Delete(route.children.deleteWorker)
  @Roles(AppRoles.CgsManager)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseGuards(
    new CheckIdValidGuard({}),
    new CheckRecordExistGuard([{ field: 'id', Entity: Worker }]),
  )
  @ApiCreateResponse('CgsManager has been successfully deleted worker', IdDTO)
  async deleteWorker(@Param() id: IdDTO) {
    const managementService = this.managementService.deleteWorker(id);
    return managementService;
  }
  @Post(route.children.deactivateCompany)
  @Roles(AppRoles.CgsManager)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseGuards(
    new CheckIdValidGuard({}),
    new CheckRecordExistGuard([{ field: 'id', Entity: Company }]),
  )
  @ApiCreateResponse(
    'CgsManager has been successfully deactivated company',
    IdDTO,
  )
  async deactivateCompany(@Param() id: IdDTO) {
    const managementService = this.managementService.deactivateCompany(id);
    return managementService;
  }
}
