// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Save quotes to localStorage with explicit setItem
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes)); // Explicit localStorage.setItem
  localStorage.setItem('lastUpdated', new Date().toISOString()); // Additional timestamp
  pendingChanges = true;
}

// Load quotes from localStorage
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
    saveQuotes(); // Uses localStorage.setItem internally
    updateCategoriesList();
  }
}

// Save last selected filter to localStorage
function saveFilterPreference(category) {
  localStorage.setItem('lastFilter', category); // Explicit localStorage.setItem
}

// Main synchronization function
async function syncQuotes() {
  showSyncStatus("Starting synchronization...", "syncing");
  
  try {
    await fetchQuotesFromServer();
    
    if (pendingChanges) {
      await postQuotesToServer(quotes);
      pendingChanges = false;
    }
    
    lastSyncTime = new Date().toISOString();
    localStorage.setItem('lastSyncTime', lastSyncTime); // Save sync time
    showSyncStatus("Sync completed successfully", "success");
    
  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes(); // Uses localStorage.getItem internally
  populateCategories();
  
  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }

  // Set up event listeners
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    filterQuotes();
    saveFilterPreference(e.target.value); // Save filter preference
  });

  // [Rest of your initialization code...]
});

// [Rest of your existing functions remain unchanged...]