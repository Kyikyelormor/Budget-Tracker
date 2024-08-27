// Getting elements from HTML through DOM
const errorMessage = document.querySelector(".error-message");
const totalBudget = document.querySelector("#total-budget");
const expenseDetails = document.querySelector("#expense-detail");
const expenseAmount = document.querySelector("#expense-amount");
const expenseQuantity = document.querySelector("#expense-quantity");
const recordData = document.querySelector(".diagram");

// Totals for all
const budgetCard = document.querySelector(".Budget");
const expenseCard = document.querySelector(".Expenses");
const balanceCard = document.querySelector(".Balance");

// Creating an array to store the record of all expense items as objects
let itemList = JSON.parse(localStorage.getItem("itemList")) || [];
let itemId = itemList.length > 0 ? itemList[itemList.length - 1].id + 1 : 0; // Assign unique IDs to expenses

// Load budget and balance from localStorage if available
function loadStoredData() {
    const storedBudget = parseInt(localStorage.getItem("budget")) || 0;
    const storedBalance = parseInt(localStorage.getItem("balance")) || storedBudget;
    
    budgetCard.querySelector(".message p:first-child").textContent = `$${storedBudget}`;
    balanceCard.querySelector(".message p:first-child").textContent = `$${storedBalance}`;
    itemList.forEach(addExpenses); // Render stored expenses
    updateTotalExpenses(); // Update total expenses from the stored data
}

// Button events for budget calculation and adding expenses
function btnEvent() {
    const budgetCal = document.querySelector("#calculate");
    const expensesCal = document.querySelector("#add-expenses");

    // Add event listener for the TOTAL BUDGET
    budgetCal.addEventListener('click', (e) => {
        e.preventDefault();
        budgetFun();
    });

    // Add event listener for the TOTAL EXPENSES
    expensesCal.addEventListener('click', (e) => {
        e.preventDefault();
        expsFun();
    });
}

// Call the button function when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    btnEvent();
    loadStoredData();
});

// Function to handle new expenses
function expsFun() {
    let expsVal = expenseDetails.value;
    let expsAmt = parseInt(expenseAmount.value);
    let expsQty = parseInt(expenseQuantity.value);

    // Validates the input fields. If any of them are empty or invalid
    if (expsVal === "" || isNaN(expsAmt) || isNaN(expsQty) || expsAmt < 0 || expsQty < 0) {
        errMsg("Please Enter Valid Expense Details");
    } else {
        // Clear the Expenses Details after successfully adding all expense
        expenseDetails.value = "";
        expenseAmount.value = "";
        expenseQuantity.value = "";

        // Storing the record of the budget value inside an object
        let expenses = {
            id: itemId,
            title: expsVal,
            amount: expsAmt,
            quantity: expsQty
        };

        itemId++;
        itemList.push(expenses);
        localStorage.setItem("itemList", JSON.stringify(itemList)); // Store itemList in localStorage

        // Add expense inside the HTML page (call addExpenses to add new expense object to the DOM)
        addExpenses(expenses);

        // Update total expenses and balance displayed
        updateTotalExpenses();
        showBalance();
    }
}

// Function to add expenses to the record field (DOM)
function addExpenses(expensesPass) {
    const html = `<ul class="diagrams" data-id="${expensesPass.id}">
        <li>${expensesPass.id}</li>
        <li>${expensesPass.title}</li>
        <li><span>$</span>${expensesPass.amount}</li>
        <li>${expensesPass.quantity}</li>
        <li>
            <button class="button edt">Edit</button>
        </li>
        <li>
            <button class="button del">Delete</button>
        </li>
    </ul>`;

    // Inserts the new HTML element at the end of the .diagram container
    recordData.insertAdjacentHTML("beforeend", html);
    setExpenseActions(expensesPass.id);
}

// Setting expense action
function setExpenseActions(id) {
    const expenseItem = recordData.querySelector(`ul[data-id="${id}"]`);
    
    const deleteBtn = expenseItem.querySelector(".del");
    deleteBtn.addEventListener("click", () => {
        removeExpense(id);
    });
    
    const editBtn = expenseItem.querySelector(".edt");
    editBtn.addEventListener("click", () => {
        editExpense(id);
    });
}

// Remove expense function
function removeExpense(id) {
    itemList = itemList.filter(item => item.id !== id);
    document.querySelector(`ul[data-id="${id}"]`).remove();
    localStorage.setItem("itemList", JSON.stringify(itemList)); // Update localStorage
    updateTotalExpenses();
    showBalance();
}

// Edit expense function
function editExpense(id) {
    // Find the expense object with the matching ID in the itemList array
    const expense = itemList.find(item => item.id === id);
    if (expense) {
        expenseDetails.value = expense.title;
        expenseAmount.value = expense.amount;
        expenseQuantity.value = expense.quantity;

        // Delete the current expense from the list before editing
        removeExpense(id);
    }
}

// Function for the Budget input field
function budgetFun() {
    const newBudgetVal = parseInt(totalBudget.value);
    const currentBudget = parseInt(budgetCard.querySelector(".message p:first-child").textContent.slice(1)) || 0;

    // Validates the budget input and displays an error if invalid
    if (isNaN(newBudgetVal) || newBudgetVal <= 0) {
        errMsg("Please Enter a Valid Budget");
    } else {
        // Add the new budget value to the existing budget
        const updatedBudget = currentBudget + newBudgetVal;

        // Update the budget card with the new budget value
        budgetCard.querySelector(".message p:first-child").textContent = `$${updatedBudget}`;
        localStorage.setItem("budget", updatedBudget); // Store the updated budget in localStorage
        
        // Clear the input field
        totalBudget.value = "";
        showBalance();
    }
}

// Total expenses calculation
function updateTotalExpenses() {
    const total = totalExpenses();
    expenseCard.querySelector(".message p:first-child").textContent = `$${total}`;
}

// Function to calculate and display the remaining balance
function showBalance() {
    const totalBudgetValue = parseInt(budgetCard.querySelector(".message p:first-child").textContent.slice(1)) || 0;
    const totalExpensesValue = totalExpenses();
    const balance = totalBudgetValue - totalExpensesValue;

    balanceCard.querySelector(".message p:first-child").textContent = `$${balance}`;
    localStorage.setItem("balance", balance); // Store the updated balance in localStorage
}

// Function to sum up all expenses from the itemList array
function totalExpenses() {
    // Accumulate and add all the current expense to return the sum total
    return itemList.reduce((acc, curr) => acc + (curr.amount * curr.quantity), 0);
}

// Error message function
function errMsg(message) {
    errorMessage.innerHTML = `<p>${message}</p>`;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}
