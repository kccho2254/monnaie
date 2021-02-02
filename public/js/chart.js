let labels = [];
let estimated_cost = [];
let actual_cost = [];

$.get("/api/default_categories").then((data) => {
    // get api/default_categories
    data.map(function (e) {
        // const labels = e.desc;
        // console.log(labels);
        labels.push(e.desc);
    });
});
$.get("/api/user_data").then((data) => {
    // get api/default_categories
    data.map(function (e) {
        // const labels = e.desc;
        // console.log(labels);
        estimated_cost.push(e.estimated_cost);
        actual_cost.push(e.actual_cost);
    });
});


// get /api/user_data
// push to estimated_cost and actual_cost

const ctx = document.getElementById("myChart").getContext('2d');
const config = {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Estimated Cost',
                data: [3000, 7000, 4000, 2122, 4873, 1233, 828, 230],
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
                barValueSpacing: 50,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 20000
                        }
                    }]
                }
            }
};

ctx.canvas.width = 3000;
ctx.canvas.height = 1000;

const chart = new Chart(ctx, config);
