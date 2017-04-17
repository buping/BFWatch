/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ba_PrintQueue', {
    PrintQueueID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    PrintQueueName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    OutPortCmd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Direction: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PrintFileName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    Weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    SerialNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    baggingBatchNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailBagNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sortingCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    barcodeContent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CountryCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ErrorMsg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PrintFlag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Ba_PrintQueue'
  });
};
