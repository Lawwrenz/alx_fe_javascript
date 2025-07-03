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