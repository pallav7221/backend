import express from 'express';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetStats,
} from '../controllers/petController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getPets).post(protect, admin, createPet);
router.get('/stats/overview', protect, admin, getPetStats);
router
  .route('/:id')
  .get(getPetById)
  .put(protect, admin, updatePet)
  .delete(protect, admin, deletePet);

export default router;

