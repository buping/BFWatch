/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scanstat', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    scanHour: {
      type: DataTypes.DATE,
      allowNull: true
    },
    allScan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    validScan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    emptyCart: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    invalidScan:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'scanstat'
  });
};
