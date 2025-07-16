'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankCard extends Model {
    static associate(models) {
      BankCard.belongsTo(models.User, { foreignKey: 'userId' });
      BankCard.hasMany(models.Transaction, { foreignKey: 'fromCardId' });
    }
  }
  BankCard.init({
    userId: DataTypes.INTEGER,
    cardNumber: DataTypes.STRING,
    cardHolder: DataTypes.STRING,
    expiryDate: DataTypes.STRING,
    cvv: DataTypes.STRING,
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'BankCard',
  });
  return BankCard;
};