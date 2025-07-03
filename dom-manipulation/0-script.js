// Initial quotes data (will be overwritten by localStorage if available)
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
const exportQuotesBtn = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from localStorage if available
  loadQuotes();
  
  // Store last viewed time in sessionStorage
  sessionStorage.setItem('lastVisited', new Date().toLocaleString());
  
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  showAddFormBtn.addEventListener('click', toggleAddForm);
  exportQuotesBtn.addEventListener('click', exportQuotes);
  importFileInput.addEventListener('change', importFromJsonFile);
  
  updateCategoryButtons();
  
  // Display last visited time if available
  const lastVisited = sessionStorage.getItem('lastVisited');
  if (lastVisited) {
    console.log(`Last visited: ${lastVisited}`);
  }
});

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

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
  
  // Store last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  
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
  saveQuotes(); // Save to localStorage
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

// Export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
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
      const validQuotes = importedQuotes.filter(quote => 
        quote.text && quote.category && 
        typeof quote.text === 'string' && 
        typeof quote.category === 'string'
      );
      
      if (validQuotes.length === 0) {
        throw new Error('No valid quotes found in the file');
      }
      
      quotes.push(...validQuotes);
      saveQuotes();
      updateCategoryButtons();
      showRandomQuote();
      alert(`Successfully imported ${validQuotes.length} quotes!`);
      
    } catch (error) {
      alert(`Error importing quotes: ${error.message}`);
      console.error(error);
    }
    
    // Reset the file input
    event.target.value = '';
  };
  
  fileReader.onerror = () => {
    alert('Error reading file');
    event.target.value = '';
  };
  
  fileReader.readAsText(file);
}