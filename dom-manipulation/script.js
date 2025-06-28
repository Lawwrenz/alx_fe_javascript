// Quote database
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const importFileInput = document.createElement('input');
importFileInput.type = 'file';
importFileInput.id = 'importFile';
importFileInput.accept = '.json';
importFileInput.style.display = 'none';

// Create export button
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export Quotes';
exportBtn.style.marginLeft = '10px';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from local storage
  loadQuotes();
  
  // Set up event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  exportBtn.addEventListener('click', exportToJson);
  importFileInput.addEventListener('change', importFromJsonFile);
  
  // Add export button and hidden import input
  document.querySelector('body').appendChild(exportBtn);
  document.querySelector('body').appendChild(importFileInput);
  
  // Show initial random quote
  showRandomQuote();
});

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    // Default quotes if nothing in storage
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
    ];
    saveQuotes();
  }
  
  // Store last loaded time in session storage
  sessionStorage.setItem('lastLoad', new Date().toISOString());
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available. Please add some quotes.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Store last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
}

// Add a new quote to the database
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes();
    showRandomQuote();
    
    // Show success message
    const successMsg = document.createElement('p');
    successMsg.textContent = 'Quote added successfully!';
    successMsg.style.color = 'green';
    quoteDisplay.appendChild(successMsg);
    
    setTimeout(() => {
      quoteDisplay.removeChild(successMsg);
    }, 2000);
  } else {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Please enter both a quote and a category.';
    errorMsg.style.color = 'red';
    quoteDisplay.appendChild(errorMsg);
    
    setTimeout(() => {
      quoteDisplay.removeChild(errorMsg);
    }, 2000);
  }
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
      
      quotes.push(...importedQuotes);
      saveQuotes();
      showRandomQuote();
      
      // Show success message
      const successMsg = document.createElement('p');
      successMsg.textContent = `Successfully imported ${importedQuotes.length} quotes!`;
      successMsg.style.color = 'green';
      quoteDisplay.appendChild(successMsg);
      
      setTimeout(() => {
        quoteDisplay.removeChild(successMsg);
      }, 3000);
      
    } catch (error) {
      alert(`Error importing quotes: ${error.message}`);
    }
  };
  fileReader.readAsText(file);
}

// Initialize the add quote form (from original requirements)
function createAddQuoteForm() {
  // Form already exists in HTML
  console.log("Add quote form is ready");
}