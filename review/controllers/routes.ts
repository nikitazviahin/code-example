import { createRoute } from 'src/helpers/routes';

export const route = createRoute('review', {
  createReview: '/',
  getReviews: '/',
  getCurrReview: '/:id',
  deleteCurrReview: '/:id',
  updateCurrReview: '/',
  getReviewByWorkerId: '/worker/:workerId',
});
