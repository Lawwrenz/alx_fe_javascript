// Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
];

let currentCategory = "All"; // Default category

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const addQuoteForm = document.getElementById('addQuoteForm');
const categorySelector = document.getElementById('categorySelector');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  showAddFormBtn.addEventListener('click', showAddForm);
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

// Show the add quote form
function showAddForm() {
  addQuoteForm.style.display = 'block';
}

// Hide the add quote form
function hideAddForm() {
  addQuoteForm.style.display = 'none';
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
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
  hideAddForm();
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