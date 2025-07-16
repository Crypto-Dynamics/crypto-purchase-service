const { Transaction, BankCard, CryptoWallet, User } = require('../models');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Mock Pago Wallet API integration
const processPagoPayment = async (cardDetails, amount, currency) => {
  // In a real implementation, this would call the actual Pago Wallet API
  // For demonstration, we'll simulate a successful payment
  
  // Generate a mock transaction reference
  const transactionRef = `PAGO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  return {
    success: true,
    transactionId: transactionRef,
    amount,
    currency,
    status: 'completed'
  };
};

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const { amount, currency, fromCardId, toWalletId } = req.body;
      const userId = req.user.userId;

      // Validate required fields
      if (!amount || !currency || !fromCardId || !toWalletId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Verify card belongs to user
      const card = await BankCard.findOne({ where: { id: fromCardId, userId } });
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }

      // Verify wallet belongs to user
      const wallet = await CryptoWallet.findOne({ where: { id: toWalletId, userId } });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      // Verify wallet supports the transaction currency
      if (wallet.currency !== currency) {
        return res.status(400).json({ 
          message: `Wallet only supports ${wallet.currency} transactions` 
        });
      }

      // Process payment with Pago Wallet
      const paymentResult = await processPagoPayment({
        cardNumber: card.cardNumber,
        cardHolder: card.cardHolder,
        expiryDate: card.expiryDate,
        cvv: card.cvv
      }, amount, currency);

      if (!paymentResult.success) {
        return res.status(400).json({ message: 'Payment processing failed' });
      }

      // Create transaction record
      const transaction = await Transaction.create({
        userId,
        amount,
        currency,
        status: paymentResult.status,
        fromCardId,
        toWalletId,
        transactionReference: paymentResult.transactionId
      });

      res.status(201).json({
        message: 'Transaction completed successfully',
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          transactionReference: transaction.transactionReference,
          createdAt: transaction.createdAt
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during transaction' });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const userId = req.user.userId;
      const transactions = await Transaction.findAll({
        where: { userId },
        include: [
          {
            model: BankCard,
            attributes: ['id', 'cardHolder'],
            as: 'fromCard'
          },
          {
            model: CryptoWallet,
            attributes: ['id', 'walletAddress', 'currency'],
            as: 'toWallet'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
      }

      res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching transactions' });
    }
  },

  getTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const transaction = await Transaction.findOne({
        where: { id, userId },
        include: [
          {
            model: BankCard,
            attributes: ['id', 'cardHolder'],
            as: 'fromCard'
          },
          {
            model: CryptoWallet,
            attributes: ['id', 'walletAddress', 'currency'],
            as: 'toWallet'
          }
        ]
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching transaction' });
    }
  }
};

module.exports = transactionController;