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

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application submission and management
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     tags: [Applications]
 *     summary: Create a new application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Application created
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */
router.post('/', protect, createApplication);
router.get('/', protect, admin, getAllApplications);

/**
 * @swagger
 * /api/applications/my-applications:
 *   get:
 *     tags: [Applications]
 *     summary: Get current user's applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's applications
 */
router.get('/my-applications', protect, getMyApplications);

/**
 * @swagger
 * /api/applications/stats/overview:
 *   get:
 *     tags: [Applications]
 *     summary: Get application statistics (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats overview
 */
router.get('/stats/overview', protect, admin, getApplicationStats);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Get application by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application object
 *   delete:
 *     tags: [Applications]
 *     summary: Delete an application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Application deleted
 */
router.get('/:id', protect, getApplicationById);
router.delete('/:id', protect, deleteApplication);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     tags: [Applications]
 *     summary: Update application status (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protect, admin, updateApplicationStatus);

export default router;

