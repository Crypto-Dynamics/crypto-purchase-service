const { BankCard, User } = require('../models');

const bankCardController = {
  addCard: async (req, res) => {
    try {
      const { cardNumber, cardHolder, expiryDate, cvv, isDefault } = req.body;
      const userId = req.user.userId;

      // Basic validation
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // If setting as default, unset any existing default cards
      if (isDefault) {
        await BankCard.update(
          { isDefault: false },
          { where: { userId, isDefault: true } }
        );
      }

      // Create card
      const card = await BankCard.create({
        userId,
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
        isDefault: isDefault || false
      });

      res.status(201).json({
        message: 'Card added successfully',
        card: {
          id: card.id,
          cardHolder: card.cardHolder,
          lastFour: card.cardNumber.slice(-4),
          expiryDate: card.expiryDate,
          isDefault: card.isDefault
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while adding card' });
    }
  },

  getCards: async (req, res) => {
    try {
      const userId = req.user.userId;
      const cards = await BankCard.findAll({
        where: { userId },
        attributes: ['id', 'cardHolder', 'expiryDate', 'isDefault'],
        include: [
          {
            model: User,
            attributes: []
          }
        ]
      });

      if (!cards || cards.length === 0) {
        return res.status(404).json({ message: 'No cards found' });
      }

      // Mask card numbers for security
      const maskedCards = cards.map(card => ({
        ...card.toJSON(),
        lastFour: card.cardNumber ? card.cardNumber.slice(-4) : null,
        cardNumber: undefined // Remove full card number
      }));

      res.status(200).json(maskedCards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching cards' });
    }
  },

  deleteCard: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const card = await BankCard.findOne({ where: { id, userId } });
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }

      await card.destroy();
      res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while deleting card' });
    }
  }
};

module.exports = bankCardController;