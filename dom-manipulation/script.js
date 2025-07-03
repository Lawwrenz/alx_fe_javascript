// Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
];

let currentCategory = "All";
let addFormVisible = false;

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const formContainer = document.getElementById('formContainer');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  showAddFormBtn.addEventListener('click', toggleAddForm);
  updateCategoryButtons();
});

// Display a random quote
function showRandomQuote() {
  let filteredQuotes = currentCategory === "All" 
    ? quotes 
    : quotes.filter(quote => quote.category === currentCategory);
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in the ${currentCategory} category.</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p>— ${quote.category}</p>
  `;
}

// Create the add quote form dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.id = 'addQuoteForm';
  
  formDiv.innerHTML = `
    <h3>Add a New Quote</h3>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="submitQuote">Add Quote</button>
    <button id="cancelAdd">Cancel</button>
  `;
  
  // Add event listeners to the dynamically created buttons
  formDiv.querySelector('#submitQuote').addEventListener('click', addQuote);
  formDiv.querySelector('#cancelAdd').addEventListener('click', toggleAddForm);
  
  return formDiv;
}

// Toggle the add quote form visibility
function toggleAddForm() {
  if (!addFormVisible) {
    const form = createAddQuoteForm();
    formContainer.appendChild(form);
    addFormVisible = true;
  } else {
    formContainer.innerHTML = '';
    addFormVisible = false;
  }
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (!text || !category) {
    alert('Please enter both a quote and a category');
    return;
  }
  
  quotes.push({ text, category });
  toggleAddForm();
  showRandomQuote();
  updateCategoryButtons();
  alert('Quote added successfully!');
}

// Update category buttons
function updateCategoryButtons() {
  const categories = ["All", ...new Set(quotes.map(quote => quote.category))];
  categorySelector.innerHTML = '<h3>Select a category:</h3>';
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    
    if (category === currentCategory) {
      button.style.fontWeight = 'bold';
    }
    
    button.addEventListener('click', () => {
      currentCategory = category;
      updateCategoryButtons();
      showRandomQuote();
    });
    
    categorySelector.appendChild(button);
  });
}