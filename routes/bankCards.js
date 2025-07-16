const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bankCardController = require('../controllers/bankCardController');

/**
 * @swagger
 * tags:
 *   name: Bank Cards
 *   description: Bank card management
 */

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Add a new bank card
 *     tags: [Bank Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - cardHolder
 *               - expiryDate
 *               - cvv
 *             properties:
 *               cardNumber:
 *                 type: string
 *               cardHolder:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *               cvv:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Card added successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth, bankCardController.addCard);

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all user's bank cards
 *     tags: [Bank Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bank cards
 *       404:
 *         description: No cards found
 */
router.get('/', auth, bankCardController.getCards);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Delete a bank card
 *     tags: [Bank Cards]
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
 *         description: Card deleted successfully
 *       404:
 *         description: Card not found
 */
router.delete('/:id', auth, bankCardController.deleteCard);

module.exports = router;