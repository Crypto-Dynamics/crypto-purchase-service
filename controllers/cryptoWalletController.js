const { CryptoWallet, User } = require('../models');

const cryptoWalletController = {
  addWallet: async (req, res) => {
    try {
      const { walletAddress, currency, isDefault } = req.body;
      const userId = req.user.userId;

      // Basic validation
      if (!walletAddress || !currency) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // If setting as default, unset any existing default wallets for this currency
      if (isDefault) {
        await CryptoWallet.update(
          { isDefault: false },
          { where: { userId, currency, isDefault: true } }
        );
      }

      // Create wallet
      const wallet = await CryptoWallet.create({
        userId,
        walletAddress,
        currency,
        isDefault: isDefault || false
      });

      res.status(201).json({
        message: 'Wallet added successfully',
        wallet
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while adding wallet' });
    }
  },

  getWallets: async (req, res) => {
    try {
      const userId = req.user.userId;
      const wallets = await CryptoWallet.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: []
          }
        ]
      });

      if (!wallets || wallets.length === 0) {
        return res.status(404).json({ message: 'No wallets found' });
      }

      res.status(200).json(wallets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching wallets' });
    }
  },

  deleteWallet: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const wallet = await CryptoWallet.findOne({ where: { id, userId } });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      await wallet.destroy();
      res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while deleting wallet' });
    }
  }
};

module.exports = cryptoWalletController;