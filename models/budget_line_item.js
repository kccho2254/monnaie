

module.exports = function(sequelize, DataTypes) {
  const BudgetLineItem = sequelize.define('BudgetLineItem', {
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estimated_cost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    actual_cost: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

  });

  return BudgetLineItem;
};
