import express from 'express';
import {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createApplication).get(protect, admin, getAllApplications);
router.get('/my-applications', protect, getMyApplications);
router.get('/stats/overview', protect, admin, getApplicationStats);
router
  .route('/:id')
  .get(protect, getApplicationById)
  .delete(protect, deleteApplication);
router.put('/:id/status', protect, admin, updateApplicationStatus);

export default router;

