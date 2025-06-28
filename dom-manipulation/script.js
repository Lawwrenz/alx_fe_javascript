// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Main synchronization function
async function syncQuotes() {
  showSyncStatus("Starting quote synchronization...", "syncing");
  
  try {
    // Step 1: Fetch server quotes
    const fetchSuccess = await fetchQuotesFromServer();
    if (!fetchSuccess) throw new Error("Failed to fetch quotes from server");

    // Step 2: Post local changes if any exist
    if (pendingChanges) {
      const postSuccess = await postQuotesToServer(quotes);
      if (!postSuccess) throw new Error("Failed to post quotes to server");
      pendingChanges = false;
    }

    // Step 3: Update last sync time
    lastSyncTime = new Date().toISOString();
    showSyncStatus("Quote synchronization completed", "success");
    return true;
    
  } catch (error) {
    showSyncStatus(`Synchronization failed: ${error.message}`, "error");
    return false;
  }
}

// Fetch quotes from JSONPlaceholder API
async function fetchQuotesFromServer() {
  showSyncStatus("Fetching quotes from server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json'
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

// Post quotes to JSONPlaceholder
async function postQuotesToServer(quotesToPost) {
  showSyncStatus("Posting quotes to server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(quotesToPost),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('syncNowBtn').addEventListener('click', syncQuotes);
  
  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
  
  showRandomQuote();
  
  // Start periodic sync
  setInterval(syncQuotes, syncInterval);
  
  // Initial sync
  setTimeout(syncQuotes, 2000);
});

// [Rest of your existing functions remain unchanged...]