// Initial quotes data
let quotes = [];
let currentCategory = "all";
let addFormVisible = false;

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const formContainer = document.getElementById('formContainer');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importQuotesBtn = document.getElementById('importQuotes');
const importFileInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const clearFilterBtn = document.getElementById('clearFilter');
const categorySelector = document.getElementById('categorySelector');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  
  // Load last selected category from localStorage
  const savedCategory = localStorage.getItem('lastCategoryFilter');
  if (savedCategory) {
    currentCategory = savedCategory;
  }
  
  populateCategoryFilter();
  showRandomQuote();
  
  // Event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  showAddFormBtn.addEventListener('click', toggleAddForm);
  exportQuotesBtn.addEventListener('click', exportToJson);
  importQuotesBtn.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);
  clearFilterBtn.addEventListener('click', clearFilter);
  
  updateCategoryButtons();
  
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

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    // Default quotes if none in storage
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
      { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
      { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
    ];
    saveQuotes();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate the category filter dropdown
function populateCategoryFilter() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.sort();
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Set the selected category from storage
  if (currentCategory && currentCategory !== "all") {
    categoryFilter.value = currentCategory;
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  currentCategory = categoryFilter.value;
  localStorage.setItem('lastCategoryFilter', currentCategory);
  
  // Update UI to reflect active filter
  updateCategoryButtons();
  showRandomQuote();
}

// Clear the current filter
function clearFilter() {
  currentCategory = "all";
  localStorage.setItem('lastCategoryFilter', currentCategory);
  categoryFilter.value = "all";
  updateCategoryButtons();
  showRandomQuote();
}

// Display a random quote from the current category
function showRandomQuote() {
  let filteredQuotes = currentCategory === "all" 
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
  
  // Store last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Update category buttons with active state
function updateCategoryButtons() {
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];
  categorySelector.innerHTML = '<h3>Or select a category:</h3>';
  
  categories.forEach(category => {
    const displayName = category === "all" ? "All" : category;
    const button = document.createElement('button');
    button.textContent = displayName;
    
    if (category === currentCategory) {
      button.classList.add('active-category');
    }
    
    button.addEventListener('click', () => {
      currentCategory = category;
      localStorage.setItem('lastCategoryFilter', currentCategory);
      categoryFilter.value = category;
      updateCategoryButtons();
      showRandomQuote();
    });
    
    categorySelector.appendChild(button);
  });
}

// Create the add quote form dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.id = 'addQuoteForm';
  
  formDiv.innerHTML = `
    <h3>Add a New Quote</h3>
    <textarea id="newQuoteText" placeholder="Enter a new quote" rows="3"></textarea>
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
  saveQuotes();
  toggleAddForm();
  
  // Update category filters if this is a new category
  const categories = [...new Set(quotes.map(quote => quote.category))];
  if (!categories.includes(category)) {
    populateCategoryFilter();
  }
  
  updateCategoryButtons();
  showRandomQuote();
  alert('Quote added successfully!');
}

// Export quotes to JSON file
function exportToJson() {
  if (quotes.length === 0) {
    alert('No quotes to export!');
    return;
  }
  
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Invalid format: Expected an array of quotes');
      }
      
      // Validate each quote
      for (const quote of importedQuotes) {
        if (!quote.text || !quote.category) {
          throw new Error('Invalid quote format: Each quote must have text and category');
        }
      }
      
      quotes = importedQuotes;
      saveQuotes();
      populateCategoryFilter();
      updateCategoryButtons();
      showRandomQuote();
      alert(`Successfully imported ${importedQuotes.length} quotes!`);
    } catch (error) {
      alert(`Error importing quotes: ${error.message}`);
    }
  };
  
  fileReader.onerror = function() {
    alert('Error reading file');
  };
  
  fileReader.readAsText(file);
  
  // Reset the file input
  event.target.value = '';
}