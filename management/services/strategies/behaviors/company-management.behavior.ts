import { IManagementActionsBehavior } from '../../types';
import Company from 'src/entity/company.entity';
import { IStatus } from 'src/entity/types/enums';
import { IdDTO } from 'src/types';
import CompanyMetadata from 'src/entity/company-metadata.entity';

// TODO: Implement approve company logic
// TODO: Implement Company entity

export class CompanyManagementBehavior implements IManagementActionsBehavior {
  async approve(id: IdDTO): Promise<IdDTO> {
    const company = await Company.findOne(id, { relations: ['metadata'] });
    await CompanyMetadata.update(company.metadata.id, {
      approvedByApp: IStatus.Approved,
    });
    return id;
  }

  async reject(id: IdDTO): Promise<IdDTO> {
    const company = await Company.findOne(id, { relations: ['metadata'] });
    await CompanyMetadata.update(company.metadata.id, {
      approvedByApp: IStatus.Rejected,
    });
    return id;
  }
}
