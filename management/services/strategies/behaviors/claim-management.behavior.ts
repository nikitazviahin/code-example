import { IStatus } from './../../../../../entity/types/enums';
import Claim from 'src/entity/claim.entity';
import { IManagementActionsBehavior } from '../../types';
import { IdDTO } from 'src/types';
import ClaimMetadata from 'src/entity/claim-metadata.entity';

export class ClaimManagementBehavior implements IManagementActionsBehavior {
  async approve(id: IdDTO): Promise<any> {
    const claim = await Claim.findOne(id, { relations: ['metadata'] });
    await ClaimMetadata.update(claim.metadata.id, {
      approvedByApp: IStatus.Approved,
    });
    return id;
  }

  async reject(id: IdDTO): Promise<IdDTO> {
    const claim = await Claim.findOne(id, { relations: ['metadata'] });
    await ClaimMetadata.update(claim.metadata.id, {
      approvedByApp: IStatus.Rejected,
    });
    return id;
  }
}
