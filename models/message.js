'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    idUser: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    like: DataTypes.INTEGER
  },
  {
      // disable the modification of tablenames; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: true
  });

  Message.associate = function(models) {
    // associations can be defined here
      models.Message.belongsTo(models.User,{
        foreignKey:{
          allowNull: false
        }
      })
  };
  return Message;
};