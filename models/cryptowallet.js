'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CryptoWallet extends Model {
    static associate(models) {
      CryptoWallet.belongsTo(models.User, { foreignKey: 'userId' });
      CryptoWallet.hasMany(models.Transaction, { foreignKey: 'toWalletId' });
    }
  }
  CryptoWallet.init({
    userId: DataTypes.INTEGER,
    walletAddress: DataTypes.STRING,
    currency: DataTypes.STRING,
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CryptoWallet',
  });
  return CryptoWallet;
};