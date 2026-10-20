# last_spendwise
# SpendWise

A simple budgeting app. Set a monthly budget, log expenses, and get instant feedback on how you are doing. Built with HTML, CSS and vanilla JavaScript.

## What improved this week

SpendWise went from printing results in the console to a page you can use:

- A dashboard showing budget, total spent, remaining amount and a progress bar.
- Expenses stored as records in an array instead of separate variables.
- Add, delete and filter expenses without reloading the page.
- Feedback messages that change with how much of the budget is used.
- Spending totals per category, with the highest category marked.
- Data saved in `localStorage` so it survives a refresh.

## How conditionals are used

- `getBudgetStatus()` uses an `if / else if / else` chain to choose a message and colour: no budget set, no spending, under 50%, 50-79%, 80-99%, exactly 100%, or over budget.
- Form validation checks for an empty description or an amount that is missing, not a number, or not above 0, and shows an error instead of saving.
- Expenses of KES 5,000 or more get a highlight class.
- The expense list shows a different empty message depending on whether there are no expenses at all or none in the chosen category.

## How arrays are used to store data

All expenses live in one `expenses` array. Each item is an object:

```js
{ id: 3, description: "Matatu fare", amount: 150, category: "Transport", date: "20 Oct" }
```

- `push()` adds a new expense.
- `filter()` removes an expense by its `id`.
- The array is saved to and loaded from `localStorage` with `JSON.stringify` / `JSON.parse`.

Loops process the array: a `for` loop adds up the total, another builds per-category totals, a `for...of` loop finds the highest category, and a reverse `for` loop draws the list newest-first while skipping items that do not match the filter.

## How the DOM is updated

A single `render()` function redraws the page from the data. It calls `renderDashboard()`, `renderCategories()` and `renderExpenses()`.

- `textContent` updates the numbers and the status message.
- `style.width` and `style.backgroundColor` move and recolour the progress bar.
- `document.createElement()` and `appendChild()` build each list item.
- `className` switches the status styling between good, warning and over-budget.

Because the page is always rebuilt from the array, the screen and the data never disagree.

## How user interactions are handled

- **Budget form (`submit`)**: validates, saves the budget, calls `render()`.
- **Expense form (`submit`)**: validates, pushes a record to the array, resets the form, calls `render()`.
- **Expense list (`click`)**: one listener uses event delegation to catch any Delete button via its `data-id`.
- **Filter (`change`)**: re-renders the list for the chosen category.
- **Clear all (`click`)**: asks for confirmation, empties the array, re-renders.

Flow: user action → event listener → update data → `render()` → page updates.

## Challenges and how I solved them

*(Replace this section with your own experience. Examples of what to write about:)*

- Delete buttons are created dynamically, so listeners on them did not work at first. I solved it with event delegation on the parent list.
- Form values are strings, so `"100" + "50"` joined text instead of adding. I converted with `Number()` and checked for `NaN`.
- The page reloaded when I submitted a form until I added `event.preventDefault()`.

## Running it

Open `index.html` in a browser. No build step or libraries needed.
