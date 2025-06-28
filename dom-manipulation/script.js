// 

// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Save quotes to localStorage
function saveQuotes() {
  // Explicit localStorage.setItem for quotes
  localStorage.setItem('quotes', JSON.stringify(quotes));
  console.log("Quotes saved to localStorage");
}

// Save last sync time to localStorage
function saveLastSyncTime() {
  // Explicit localStorage.setItem for sync time
  localStorage.setItem('lastSyncTime', new Date().toISOString());
  console.log("Sync time saved to localStorage");
}

// Save category filter preference to localStorage
function saveCategoryFilter(category) {
  // Explicit localStorage.setItem for filter preference
  localStorage.setItem('lastCategoryFilter', category);
  console.log(`Filter preference "${category}" saved to localStorage`);
}

// Load quotes from localStorage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    console.log("Quotes loaded from localStorage");
  } else {
    // Default quotes with initial save
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
    ];
    saveQuotes(); // This calls localStorage.setItem
  }
}

// Main synchronization function
async function syncQuotes() {
  showSyncStatus("Starting synchronization...", "syncing");
  
  try {
    await fetchQuotesFromServer();
    
    if (pendingChanges) {
      await postQuotesToServer(quotes);
      pendingChanges = false;
      saveQuotes(); // Save after successful sync
    }
    
    lastSyncTime = new Date().toISOString();
    saveLastSyncTime(); // Save sync time
    showSyncStatus("Sync completed successfully", "success");
    
  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }

  // Save filter preference when changed
  document.getElementById('categoryFilter').addEventListener('change', function(e) {
    saveCategoryFilter(e.target.value);
    filterQuotes();
  });

  // Set up periodic sync
  setInterval(syncQuotes, syncInterval);
  
  // Initial sync
  syncQuotes();
});

// [Rest of your existing functions (fetchQuotesFromServer, postQuotesToServer, 
// showRandomQuote, addQuote, etc.) remain unchanged]