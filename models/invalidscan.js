/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invalidscan', {
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
    scanTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    scanResult: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    packetID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'invalidscan'
  });
};
