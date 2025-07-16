'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'userId' });
      Transaction.belongsTo(models.BankCard, { foreignKey: 'fromCardId' });
      Transaction.belongsTo(models.CryptoWallet, { foreignKey: 'toWalletId' });
    }
  }
  Transaction.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(20, 8),
    currency: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'completed', 'failed'],
      defaultValue: 'pending'
    },
    fromCardId: DataTypes.INTEGER,
    toWalletId: DataTypes.INTEGER,
    transactionReference: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};