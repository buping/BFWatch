/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nodeStatus', {
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
    nodeName: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    online: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    lastReportTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastOnlineTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastOfflineTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'nodeStatus'
  });
};
