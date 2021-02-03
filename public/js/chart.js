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
                data: actual,
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

$.get("/api/user_data").then((json) => {
    // get api/default_categories
    json.BudgetCategories.forEach(e => {
        labels.push(e.desc);
    });
});

// get /api/user_data
// push to estimated_cost and actual_cost
$.get("/api/user_data").then((json) => {
    json.BudgetCategories.forEach((e) => {
        e.BudgetLineItems.forEach((a) => {
            console.log(a.BudgetCategoryId)
            for (i = 0; i < json.BudgetCategories.length; i++) {
                // for however many budget categories there are, filter each budgetlineitem by estimated_cost, reduce() the numbers together, push to estimated[]
                console.log(e.BudgetLineItems);
                // var idArray = e.BudgetLineItems[i].filter((el) => {
                //     return el.estimated_cost.reduce();

                // });
                // console.log(idArray);

                // estimated.push(idArray);
            }
            return;
        });
    });
});


// json.map(e => {
//     estimated.push(e.BudgetLineItems.estimated_cost);
//     actual.push(e.BudgetLineItems.actual_cost);
// });

// I need to get the estimated cost of each line item, group them according to budget category, and add them to the graph

// $.ajax({
//     type: "GET",
//     url: "/api/user_data",
//     contentType: "application/json; charset=utf-8",
//     success: function OnSuccess(json) {
//         console.log(json.BudgetLineItems[0].estimated_cost);

//         $.each(function (json) {
//             // myChart.data.datasets[0].data.push(val.BudgetLineItems.estimated_cost);
//             estimated.push(json.BudgetLineItems.estimated_cost);
//             chart.update();
//         });
//     },
//     error: function onError(error) {
//         console.log(error);
//     },
// });         

// Data wasn't loading fast enough so I had to set a timeout to load the data faster
setTimeout(function () {
    chart.update();
}, 100);

// Changes the graph type on click. It glitches out if you zoom in and out though
$("#line").click(function () {
    change('line');
});

$("#bar").click(function () {
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
