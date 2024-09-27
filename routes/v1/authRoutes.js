import { Router } from "express";
import authRoute from "../../middleware/authMiddleware.js"; // Import the auth middleware
import {
  register,
  login,
  update,
} from "../../controllers/v1/authController.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         loginAttempts:
 *           type: integer
 *           example: 0
 *         lastLoginAttempt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User successfully registered"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '409':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User already exists"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.route("/register").post(register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *                   example: ""
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.route("/login").post(login);

/**
 * @swagger
 * /api/v1/auth/update/{id}:
 *   put:
 *     summary: Update user information
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: The new name of the user
 *                 example: "John"
 *               newEmail:
 *                 type: string
 *                 description: The new email of the user
 *                 example: "john.doe@example.com"
 *               newPassword:
 *                 type: string
 *                 description: The new password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.route("/update/:id").put(authRoute, update);

export default router;
