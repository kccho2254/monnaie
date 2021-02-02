// when page loads, this function is called to render all of the user's budget info immediately
renderBudget()

function addCategory(event) {
    let desc = event.target.parentElement.querySelector('input').value
    $.post("/api/category", {
        desc: desc
    }).then(() => {
        renderBudget()
    })
}

function deleteCategory(event) {
    let id = event.target.getAttribute('category-id')
    $.ajax({
        url: "/api/category/" + id,
        type: "DELETE"
    }).then(() => {
        renderBudget()
    })
}

function addLine(event) {
    let categoryId = event.target.getAttribute('category-id')
    $.post("/api/lineitem", {
        desc: 'New line item',
        vendor: 'Line item vendor',
        estimated_cost: 10000,
        actual_cost: 10000,
        BudgetCategoryId: categoryId
    }).then(() => {
        renderBudget()
    })
}

function updateLine(event) {
    let id = event.target.getAttribute('line-id')
    let estimated_cost = event.target.parentElement.querySelector('input').value
    $.ajax({
        url: "/api/lineitem/" + id,
        type: "PUT",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ estimated_cost: estimated_cost })
    }).then(() => {
        renderBudget()
    })
}

function deleteLine(event) {
    let id = event.target.getAttribute('line-id')
    $.ajax({
        url: "/api/lineitem/" + id,
        type: "DELETE"
    }).then(() => {
        renderBudget()
    })
}

// For the entire page, there is an event listener for clicks. Each "if" statement
// handles code for what to do when the click is triggered on a certain element that 
// has the attribute. If a part of the page is clicked that does not have a matching
// attribute, then nothing will happen. 
document.addEventListener('click', (event) => {
    if (event.target.matches('[add-category]')) {
        addCategory(event)
    } else if (event.target.matches('[delete-category]')) {
        deleteCategory(event)
    } else if (event.target.matches('[add-line]')) {
        addLine(event)
    } else if (event.target.matches('[update-line]')) {
        updateLine(event)
    } else if (event.target.matches('[delete-line]')) {
        deleteLine(event)
    } 
})

// this function renders all of the budget info for a user on the front end
function renderBudget() {
    $.get("/api/user_data").then(user => {
        let categoriesHTML = ''
        user.BudgetCategories.forEach(category => {
            let categoryId = category.id
            let categoryDesc = category.desc
            let lineItemsHTML = ''
            if (category.BudgetLineItems) {
                category.BudgetLineItems.forEach(line => {
                    lineItemsHTML += `
                        <li>
                            <span>${line.desc}</span> 
                            <input value="${line.estimated_cost}"/> 
                            <button update-line line-id="${line.id}">Update</button> 
                            <button delete-line line-id="${line.id}">Delete</button>
                        </li>
                    `
                })
            }
            let categoryHTML = `
                <li>
                    <div>
                        <span>${categoryDesc}</span> 
                        <button add-line category-id="${categoryId}">Add</button> 
                        <button delete-category category-id="${categoryId}">Delete</button>
                    </div>
                    <ul>
                        ${lineItemsHTML}
                    </ul>
                </li>
            `
            categoriesHTML += categoryHTML
        })
        document.querySelector('#categories').innerHTML = categoriesHTML
    })
}