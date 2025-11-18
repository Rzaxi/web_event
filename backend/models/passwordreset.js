'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PasswordReset.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PasswordReset.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    reset_expiry: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PasswordReset',
  });
  return PasswordReset;
};