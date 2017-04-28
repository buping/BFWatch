/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
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
    projectCnName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    wsPort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'project'
  });
};
