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

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Pet management
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     tags: [Pets]
 *     summary: Get all pets
 *     description: Retrieve a list of pets (supports pagination/filters in implementation).
 *     responses:
 *       200:
 *         description: A list of pets.
 */
router.get('/', getPets);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     tags: [Pets]
 *     summary: Create a new pet (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Pet created
 */
router.post('/', protect, admin, createPet);
router.get('/stats/overview', protect, admin, getPetStats);
/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     tags: [Pets]
 *     summary: Get pet by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet object
 *   put:
 *     tags: [Pets]
 *     summary: Update a pet (admin)
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
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Pet updated
 *   delete:
 *     tags: [Pets]
 *     summary: Delete a pet (admin)
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
 *         description: Pet deleted
 */
router.get('/:id', getPetById);
router.put('/:id', protect, admin, updatePet);
router.delete('/:id', protect, admin, deletePet);

export default router;

