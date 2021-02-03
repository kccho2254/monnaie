// Automatically get locale from user's browser
Dinero.globalLocale = window.navigator.userLanguage || window.navigator.language

// when page loads, this function is called to render all of the user's budget info immediately
renderBudget()

function addCategory(event) {
    let desc = event.target.parentElement.parentElement
        .querySelector('section').querySelector('input').value
    $.post("/api/category", {
        desc: desc
    }).then(() => {
        hideCategoryForm()
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
    // <input id="lineitem-form-desc" class="input" placeholder="Description">
    //         <input id="lineitem-form-vendor" class="input" placeholder="Vendor">
    //         <input id="lineitem-form-estimated-cost" class="input" placeholder="Estimated Cost">
          
    let categoryId = event.target.getAttribute('category-id')
    $.post("/api/lineitem", {
        desc: document.querySelector('#lineitem-form-desc').value,
        vendor: document.querySelector('#lineitem-form-vendor').value,
        estimated_cost: parseFloat(document.querySelector('#lineitem-form-estimated-cost').value),
        actual_cost: 10000,
        BudgetCategoryId: categoryId
    }).then(() => {
        hideLineItemForm()
        renderBudget()
    })
}

function updateLine(event) {
    // <div line-id="${line.id}" class="is-flex is-align-items-center">
    // <input line-desc update-line value="${line.desc}" class="input is-rounded mr-1" style="width:500px" type="text" placeholder="Your Budget Line Item">
    // <input line-vendor update-line value="${line.vendor}" class="input is-rounded is-small mr-1" style="width:400px" type="text" placeholder="Vendor">
    // <input line-estimated-cost update-line value="${line.estimated_cost}" class="input is-rounded is-small" style="width:200px" type="number" min="0.00" step="1.00" placeholder="Estimated Amount">
    // <input line-actual-cost update-line value="${line.actual_cost}" class="input is-rounded is-small" style="width:200px" type="number" min="0.00" step="1.00" placeholder="Actual Amount">
    // </div>
    let id = event.target.parentElement.getAttribute('line-id')
    let desc = event.target.parentElement.querySelector('[line-desc]').value
    let vendor = event.target.parentElement.querySelector('[line-vendor]').value
    let estimated_cost = event.target.parentElement.querySelector('[line-estimated-cost]').value
    let actual_cost = event.target.parentElement.querySelector('[line-actual-cost]').value
    $.ajax({
        url: "/api/lineitem/" + id,
        type: "PUT",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ 
            desc: desc,
            vendor: vendor,
            actual_cost: actual_cost,
            estimated_cost: estimated_cost 
        })
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

function showCategoryForm(event) {
    document.querySelector('#category-form').classList.add("is-active")
}

function hideCategoryForm(event) {
    document.querySelector('#category-form').classList.remove("is-active")
    document.querySelector('#category-form-desc').value = ''
}

function showLineItemForm(event) {
    document.querySelector('#lineitem-form').classList.add("is-active")
    document.querySelector('#lineitem-form-category-desc').innerHTML = event.target.getAttribute('category-desc')
    document.querySelector('#lineitem-form-save').setAttribute('category-id', event.target.getAttribute('category-id'))
}

function hideLineItemForm(event) {
    document.querySelector('#lineitem-form').classList.remove("is-active")
    document.querySelector('#lineitem-form-desc').value = ''
    document.querySelector('#lineitem-form-vendor').value = ''
    document.querySelector('#lineitem-form-estimated-cost').value = ''
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
    } else if (event.target.matches('[delete-line]')) {
        deleteLine(event)
    } else if (event.target.matches('[show-category-form]')) {
        showCategoryForm(event)
    } else if (event.target.matches('[hide-category-form')) {
        hideCategoryForm(event)
    } else if (event.target.matches('[show-lineitem-form')) {
        showLineItemForm(event)
    } else if (event.target.matches('[hide-lineitem-form')) {
        hideLineItemForm(event)
    }
}, true)

document.addEventListener('blur', (event) => {
    if (event.target.matches('[update-line]')) {
        updateLine(event)
    }
}, true)

// this function renders all of the budget info for a user on the front end
function renderBudget() {
    $.get("/api/user_data").then(user => {
        document.querySelector('#total-estimated-cost').innerHTML = Dinero({ amount: user.estimatedTotalCost*100 }).toFormat('$0,0.00')
        document.querySelector('#total-actual-cost').innerHTML = Dinero({ amount: user.actualTotalCost*100}).toFormat('$0,0.00')
        let categoriesHTML = ''
        user.BudgetCategories.forEach(category => {
            let categoryId = category.id
            let categoryDesc = category.desc
            let lineItemsHTML = ''
            if (category.BudgetLineItems) {
                category.BudgetLineItems.forEach(line => {
                    lineItemsHTML += `
                        <tr>
                            <td class="is-flex is-justify-content-space-between is-align-items-center">
                                <div line-id="${line.id}" class="is-flex is-align-items-center">
                                    <input line-desc update-line value="${line.desc}" class="input is-rounded mr-1" style="width:500px" type="text" placeholder="Your Budget Line Item">
                                    <input line-vendor update-line value="${line.vendor}" class="input is-rounded is-small mr-1" style="width:400px" type="text" placeholder="Vendor">
                                    <input line-estimated-cost update-line value="${line.estimated_cost}" class="input is-primary has-background-primary-light is-rounded is-small" style="width:200px" type="number" min="0.00" step="1.00" placeholder="Estimated Amount">
                                    <input line-actual-cost update-line value="${line.actual_cost}" class="input is-info has-background-info-light is-rounded is-small" style="width:200px" type="number" min="0.00" step="1.00" placeholder="Actual Amount">
                                </div>
                                <button delete-line line-id="${line.id}" class="delete is-medium ml-2"></button>
                            </td>
                        </tr>
                    `
                })
            }
            let categoryHTML = `
                <thead>
                    <tr>
                        <th class="is-flex is-justify-content-space-between" style="background-color:#fab1a0; color: white;">
                            ${categoryDesc}
                            <div class="is-flex is-align-items-center">
                            <button category-id="${categoryId}" category-desc="${categoryDesc}" show-lineitem-form class="button">
                            + 
                            </button>
                            <button delete-category category-id="${categoryId}" class="delete is-medium ml-2"></button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItemsHTML}
                </tbody>
            `
            categoriesHTML += categoryHTML
        })
        document.querySelector('#categories').innerHTML = categoriesHTML
    })
}

categoryColors = ["FF9AA2", "FFB7B2", "FFDAC1", "E2F0CB", "B5EAD7", 
    "C7CEEA", "998AD3", "E494D3", "CDF1AF", "87DCC0", "88BBE4"]