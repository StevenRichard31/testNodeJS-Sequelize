'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type: DataTypes.STRING,
      validate: {
          isAlphanumeric: true,
          len: {
            args: [5,10],
            msg: "Le nom d'utilisateur est compris entre 5 et 10 caratères"
          },
          notEmpty: true
      }
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  },
  {
      // disable the modification of tablenames; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: true
  });

  User.associate = function(models) {
    // associations can be defined here
      models.User.hasMany(models.Message)
  };
  return User;
};