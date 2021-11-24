import { createRoute } from 'src/helpers/routes';

export const route = createRoute('management', {
  login: 'login',
  claimApprove: 'claim/approve',
  claimReject: 'claim/reject',
  companyApprove: 'company/approve',
  companyReject: 'company/reject',
  cgsManager: 'auth',
  deleteWorker: 'worker/:id',
  deactivateCompany: 'company/:id',
});
