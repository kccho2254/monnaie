$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

  $.get("/api/budget_data").then(data => {
    $(".budget-desc").text(data.desc);
    $(".budget-vendor").text(data.vendor);
    $(".budget-estimate").text(data.estimated_cost);
    $(".budget-actual").text(data.actual_cost);
  });
});
