// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from JSONPlaceholder API with explicit Content-Type
async function fetchQuotesFromServer() {
  showSyncStatus("Fetching quotes from server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json' // Explicit Content-Type header
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    const serverQuotes = convertToQuoteFormat(posts.slice(0, 10));
    
    const mergedQuotes = mergeQuoteArrays(quotes, serverQuotes);
    
    if (mergedQuotes.length !== quotes.length) {
      quotes = mergedQuotes;
      saveQuotes();
      updateCategoriesList();
      populateCategories();
      showSyncStatus("Updated quotes from server", "success");
    }
    
    return true;
  } catch (error) {
    showSyncStatus(`Fetch failed: ${error.message}`, "error");
    return false;
  }
}

// Post quotes to JSONPlaceholder with explicit Content-Type
async function postQuotesToServer(quotesToPost) {
  showSyncStatus("Posting quotes to server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(quotesToPost),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8' // Explicit Content-Type with charset
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    showSyncStatus("Quotes posted to server (simulated)", "success");
    return { success: true, data: result };
  } catch (error) {
    showSyncStatus(`Post failed: ${error.message}`, "error");
    return { success: false, error: error.message };
  }
}

// [Rest of your existing functions remain unchanged...]

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('syncNowBtn').addEventListener('click', syncWithServer);
  
  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
  
  showRandomQuote();
  
  // Start periodic sync
  setInterval(syncWithServer, syncInterval);
  
  // Initial sync
  setTimeout(syncWithServer, 2000);
});

// Sync with server
async function syncWithServer() {
  showSyncStatus("Syncing with server...", "syncing");
  
  try {
    await fetchQuotesFromServer();
    
    if (pendingChanges) {
      const postResponse = await postQuotesToServer(quotes);
      if (!postResponse.success) {
        throw new Error("Failed to update server data");
      }
      pendingChanges = false;
    }
    
    lastSyncTime = new Date().toISOString();
    showSyncStatus("Sync completed successfully", "success");
    
  } catch (error) {
    console.error("Sync error:", error);
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}