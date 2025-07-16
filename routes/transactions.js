const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Crypto purchase transactions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new crypto purchase transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - fromCardId
 *               - toWalletId
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               fromCardId:
 *                 type: integer
 *               toWalletId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaction initiated successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth, transactionController.createTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all user's transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       404:
 *         description: No transactions found
 */
router.get('/', auth, transactionController.getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', auth, transactionController.getTransaction);

module.exports = router;