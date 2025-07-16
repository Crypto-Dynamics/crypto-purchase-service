const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cryptoWalletController = require('../controllers/cryptoWalletController');

/**
 * @swagger
 * tags:
 *   name: Crypto Wallets
 *   description: Crypto wallet management
 */

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Add a new crypto wallet
 *     tags: [Crypto Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - currency
 *             properties:
 *               walletAddress:
 *                 type: string
 *               currency:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Wallet added successfully
 *       400:
 *         description: Bad request
 */
router.post('/', auth, cryptoWalletController.addWallet);

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get all user's crypto wallets
 *     tags: [Crypto Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of crypto wallets
 *       404:
 *         description: No wallets found
 */
router.get('/', auth, cryptoWalletController.getWallets);

/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     summary: Delete a crypto wallet
 *     tags: [Crypto Wallets]
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
 *         description: Wallet deleted successfully
 *       404:
 *         description: Wallet not found
 */
router.delete('/:id', auth, cryptoWalletController.deleteWallet);

module.exports = router;