/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
const BudgetLineItem = require("./budget_line_item")


module.exports = function(sequelize, DataTypes) {
  const BudgetCategory = sequelize.define('BudgetCategory', {
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  BudgetCategory.associate = function (models){
    BudgetCategory.hasMany(models.BudgetLineItem, {
      onDelete: "cascade"
    })
  }

  return BudgetCategory;
};
