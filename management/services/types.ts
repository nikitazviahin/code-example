interface IApproveBehavior {
  approve(id: any): any;
}

interface IRejectBehavior {
  reject(id: any): any;
}

export interface IManagementActionsBehavior
  extends IRejectBehavior,
    IApproveBehavior {}

export interface IManagementActions {
  performRejection(id: any): any;

  performApproval(id: any): any;

  setBehavior(behavior: IManagementActionsBehavior): void;
}
