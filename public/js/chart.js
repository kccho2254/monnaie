let labels = [];
let estimated = [];
let actual = [];
let myChart;

const ctx = document.getElementById("myChart").getContext('2d');
const config = {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Estimated Cost',
                data: estimated,
                backgroundColor: 'palegoldenrod',
                barThickness: 20,
                barPercentage: .5

            },
            {
                label: 'Actual Cost',
                data: [2220, 7000, 4000, 2122, 4873, 1233, 828, 230, 2390, 3298, 8891, 2000, 2111, 3982, 10092, 2398, 3498, 3982, 209, 1298, 2989, 1222, 2333],
                backgroundColor: 'gainsboro',
                barThickness: 20,
                barPercentage: .5
            }
        ]
    },
    options: {
                responsive: true,
                maintainAspectRatio: false,
                barValueSpacing: 50,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 14000
                        }
                    }]
                }
            }
};

ctx.canvas.width = 1500;
ctx.canvas.height = 600;

const chart = new Chart(ctx, config);

$.get("/api/default_categories").then((data) => {
    // get api/default_categories
    data.map(function (e) {
        // const labels = e.desc;
        // console.log(labels);
        labels.push(e.desc);
    });
});

// get /api/user_data
// push to estimated_cost and actual_cost
// $.get("/api/user_data").then((json) => {
//     console.log(json.BudgetLineItems[0].estimated_cost);
//     json.map(function (w) {
//         estimated.push(w.BudgetLineItems.estimated_cost);
//         actual.push(w.BudgetLineItems.actual_cost);
//     });
// });

// For some reason jQuery doesn't want me getting user_data but it's ok with me getting default_categories
// I need to get the estimated cost of each line item, group them according to budget category, and add them to the graph

$.ajax({
    type: "GET",
    url: "/api/user_data",
    contentType: "application/json; charset=utf-8",
    success: function OnSuccess(response) {
        console.log(response.BudgetLineItems[0].estimated_cost);

        $.each(function (val) {
            // myChart.data.datasets[0].data.push(val.BudgetLineItems.estimated_cost);
            estimated.push(val.BudgetLineItems.estimated_cost);
            chart.update();
        });
    },
    error: function onError(error) {
        console.log(error.d);
    },
});         

// Data wasn't loading fast enough so I had to set a timeout to load the data faster
setTimeout(function() {
    chart.update();
},100);

// Changes the graph type on click. It glitches out if you zoom in and out though
$("#line").click(function() {
  change('line');
});

$("#bar").click(function() {
  change('bar');
});


function change(newType) {
  var ctx = document.getElementById("myChart").getContext("2d");

  // Remove the old chart and all its event handles
  if (myChart) {
    myChart.destroy();
  }

  // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
  var temp = jQuery.extend(true, {}, config);
  temp.type = newType;
  myChart = new Chart(ctx, temp);
};
