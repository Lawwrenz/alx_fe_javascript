// Initial quotes data
let quotes = [];
let currentCategory = "All";
let addFormVisible = false;

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const formContainer = document.getElementById('formContainer');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importQuotesBtn = document.getElementById('importQuotes');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter'); // Changed to categoryFilter

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Load last selected category from localStorage
  if (localStorage.getItem('lastCategory')) {
    currentCategory = localStorage.getItem('lastCategory');
    categoryFilter.value = currentCategory;
  }
  
  showRandomQuote();
  
  // Event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  showAddFormBtn.addEventListener('click', toggleAddForm);
  exportQuotesBtn.addEventListener('click', exportToJson);
  importQuotesBtn.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);
  
  // Store last viewed quote in session storage
  if (sessionStorage.getItem('lastViewedQuote')) {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    quoteDisplay.innerHTML = `
      <p>"${lastQuote.text}"</p>
      <p>— ${lastQuote.category}</p>
      <p><em>(Last viewed quote)</em></p>
    `;
  }
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
  
  // Explicit random selection using Math.random()
  const randomDecimal = Math.random(); // Generates number between 0 (inclusive) and 1 (exclusive)
  const randomIndex = Math.floor(randomDecimal * filteredQuotes.length); // Convert to integer index
  
  const quote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p>— ${quote.category}</p>
  `;
  
  // Store last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// [Rest of the functions remain the same until populateCategories]

// Populate categories in the dropdown
function populateCategories() {
  // Get unique categories
  const categories = ["All", ...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  // Add new category options
  categories.slice(1).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Set the selected category
  categoryFilter.value = currentCategory;
}

// [Rest of the functions remain the same, just replace any instances of 
// categorySelect with categoryFilter]