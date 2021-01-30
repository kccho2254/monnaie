/* eslint-disable prettier/prettier */
$(document).ready(() => {
  // Getting references to our form and input
  const budgetForm = $("form.budget-maker");
  const descForm = $("input#desc-input");
  const vendorForm = $("input#vendor-input");
  const estimateForm = $("input#estimate-input");
  const actualForm = $("input#actual-input");

  budgetForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      desc: descForm.val().trim(),
      vendor: vendorForm.val().trim(),
      estimated_cost: estimateForm.val().trim(),
      actual_cost: actualForm.val().trim()
    };

    if (!userData.estimated_cost) {
      return;
    }
    // If we have a budget, run the createNewBudget function
    createNewBudget(userData.desc, userData.vendor, userData.estimated_cost, userData.actual_cost);
    descForm.val("");
    vendorForm.val("");
    estimateForm.val("");
    actualForm.val("");
  });
  function createNewBudget(desc, vendor, estimated_cost, actual_cost) {
    $.post("/api/budget_data", {
      desc: desc,
      vendor: vendor,
      estimated_cost: estimated_cost,
      actual_cost: actual_cost
    })
      .then(() => {
        window.location.replace("/members");
      // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
