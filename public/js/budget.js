function calculateEstimatedTotal(budget_categories) {
  let estimatedTotal = Dinero({ amount: 0 });

  budget_categories.forEach(category => {
    category.budget_line_items.forEach(line_item => {
      const estimated_cost = Dinero({ amount: line_item.estimated_cost });
      estimatedTotal = estimatedTotal.add(estimated_cost);
    });
  });

  return estimatedTotal;
}

const budget_categories = [
  {
    desc: "Venue",
    budget_line_items: [
      {
        desc: "Hummingbird House",
        estimated_cost: 480000,
        actual_cost: 0
      },
      {
        desc: "Parking fee",
        estimated_cost: 8050,
        actual_cost: 0
      }
    ]
  }
];

const estimatedTotal = calculateEstimatedTotal(budget_categories);
alert("Calculated estimated total: " + estimatedTotal.toFormat("$0,0.00"));
