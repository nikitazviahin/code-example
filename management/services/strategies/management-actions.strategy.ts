import { IManagementActions, IManagementActionsBehavior } from '../types';

export default class ManagementActions implements IManagementActions {
  constructor(public managementActionsBehavior: IManagementActionsBehavior) {}

  performApproval<T>(id: string): T {
    return this.managementActionsBehavior.approve(id);
  }

  performRejection<T>(id: string): T {
    return this.managementActionsBehavior.reject(id);
  }

  setBehavior(behavior) {
    this.managementActionsBehavior = behavior;
  }
}
