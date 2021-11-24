import { CreateCgsManagerDTO } from './../dtos/management.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Manager from '../entities/manager.entity';
import { AppRoles } from 'src/types';
import AuthService from 'src/modules/common/services/auth.service';
import { jwtSecret } from 'src/constants';
import ManagerMetadata from 'src/entity/manager-metadata.entity';

@Injectable()
export class ManagementAuthService extends AuthService<CreateCgsManagerDTO> {
  constructor() {
    super(
      { entity: Manager, role: AppRoles.CgsManager },
      new JwtService({
        secret: jwtSecret,
        signOptions: { expiresIn: '60m' },
      }),
    );
  }

  onMatchFail() {
    throw new Error('Credentials not valid');
  }

  async register(dto: CreateCgsManagerDTO) {
    const cgsManager = Manager.create(dto);
    const cgsManagerMetaEntity = ManagerMetadata.create();
    cgsManagerMetaEntity.isActive = true;
    cgsManager.metadata = cgsManagerMetaEntity;
    cgsManager.password = await this.encrypt(dto.password);
    await cgsManager.save();
    return cgsManager;
  }
}
