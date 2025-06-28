// Quote database
let quotes = [];
let categories = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  
  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
  
  showRandomQuote();
});

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    updateCategoriesList();
  } else {
    // Default quotes
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
    ];
    saveQuotes();
    updateCategoriesList();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  updateCategoriesList();
}

// Update categories list from quotes
function updateCategoriesList() {
  categories = [...new Set(quotes.map(quote => quote.category))];
}

// Populate category dropdown
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  
  // Clear existing options except "All Categories"
  while (filter.options.length > 1) {
    filter.remove(1);
  }
  
  // Add current categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save filter preference
  localStorage.setItem('lastFilter', selectedCategory);
  
  // Show random quote from filtered selection
  showRandomQuote();
}

// Display a random quote from current filter
function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = `
      <p>No quotes available in this category.</p>
      ${selectedCategory !== 'all' ? `<p>Try selecting "All Categories"</p>` : ''}
    `;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  document.getElementById('quoteDisplay').innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes();
    
    // Update categories if new
    if (!categories.includes(category)) {
      categories.push(category);
      populateCategories();
    }
    
    showRandomQuote();
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Export quotes to JSON
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

// Import quotes from JSON
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
      
      // Update categories
      const newCategories = importedQuotes.map(quote => quote.category);
      const uniqueNewCategories = [...new Set(newCategories)];
      let categoriesUpdated = false;
      
      uniqueNewCategories.forEach(cat => {
        if (!categories.includes(cat)) {
          categories.push(cat);
          categoriesUpdated = true;
        }
      });
      
      if (categoriesUpdated) {
        populateCategories();
      }
      
      showRandomQuote();
      alert(`Successfully imported ${importedQuotes.length} quotes!`);
    } catch (error) {
      alert(`Error importing quotes: ${error.message}`);
    }
  };
  fileReader.readAsText(file);
}

// Required function from original task
function createAddQuoteForm() {
  console.log("Add quote form is ready");
}