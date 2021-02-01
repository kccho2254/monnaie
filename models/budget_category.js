<<<<<<< HEAD
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
const BudgetLineItem = require("./budget_line_item")


=======
>>>>>>> d6f606f000d930dfe14a5d7ffb9b9de2ca673645
module.exports = function(sequelize, DataTypes) {
  const BudgetCategory = sequelize.define('BudgetCategory', {
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  BudgetCategory.associate = function (models) {
    models.BudgetCategory.hasMany(models.BudgetLineItem);
    models.BudgetCategory.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: true // Note: We will allow null because we have default categories which are not customized by user
      }
    });
  };

  return BudgetCategory;
};
