import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import ManagementActions from './strategies/management-actions.strategy';
import { IdDTO } from 'src/types';
import Company from 'src/entity/company.entity';
import Worker from 'src/entity/worker.entity';
import UserMetadata from 'src/entity/user-metadata.entity';
import { IActiveStatus } from 'src/entity/types/enums';
import CompanyMetadata from 'src/entity/company-metadata.entity';
@Injectable()
export class ManagementService extends ManagementActions {
  async deleteWorker(id: IdDTO) {
    await Worker.delete(id);
    return id;
  }

  async deactivateCompany(id: IdDTO) {
    // Here we deactivate company
    const company = await Company.findOne(id, { relations: ['metadata'] });
    await CompanyMetadata.update(company.metadata.id, {
      companyStatus: IActiveStatus.Inactive,
    });

    // Here we find users' metadata and turn user.isActive into false boolean value,
    // in order to forbind CRUD operation for users, whose company is being deactivated
    await getConnection()
      .createQueryBuilder()
      .update(UserMetadata)
      .set({ isActive: false })
      .where('isActive = :isActive', { isActive: true })
      .execute();

    return id;
  }
}
