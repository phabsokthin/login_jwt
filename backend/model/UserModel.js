'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserModel extends Model {
    static associate(models) {}
  }
  UserModel.init(
    {
      uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      names: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      refresh_token: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      tableName: "users",
      modelName: 'UserModel',
    }
  );
  return UserModel;
};
