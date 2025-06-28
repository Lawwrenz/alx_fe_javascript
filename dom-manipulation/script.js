// Quote database and configuration
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
const SYNC_INTERVAL = 30000; // 30 seconds sync interval

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Initialize the application with setInterval for periodic sync
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('syncNowBtn').addEventListener('click', syncQuotes);
  
  // Set up periodic synchronization using setInterval
  setInterval(syncQuotes, SYNC_INTERVAL); // Clear setInterval usage here
  
  // Initial sync
  syncQuotes();
});

// Sync quotes function
async function syncQuotes() {
  showSyncStatus("Starting synchronization...", "syncing");
  
  try {
    // Fetch with Content-Type
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    
    const posts = await response.json();
    const serverQuotes = posts.slice(0, 5).map(post => ({
      text: post.title,
      category: `Category ${post.id % 3 + 1}`
    }));
    
    if (mergeQuotes(serverQuotes)) {
      updateCategories();
    }
    
    lastSyncTime = new Date().toISOString();
    showSyncStatus("Sync complete", "success");
  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}

// [Rest of your existing functions remain unchanged...]
// fetchQuotesFromServer, postQuotesToServer, loadQuotes, saveQuotes, 
// showRandomQuote, addQuote, exportToJson, importFromJsonFile, etc.