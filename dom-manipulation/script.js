// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Main synchronization function with alert
async function syncQuotes() {
  showSyncStatus("Starting quote synchronization...", "syncing");
  
  try {
    // 1. Fetch latest quotes from server
    const serverQuotes = await fetchQuotesFromServer();
    if (!serverQuotes) throw new Error("Failed to fetch quotes");
    
    // 2. Merge with local quotes
    const mergedQuotes = [...new Set([...quotes, ...serverQuotes])];
    if (mergedQuotes.length !== quotes.length) {
      quotes = mergedQuotes;
      localStorage.setItem('quotes', JSON.stringify(quotes));
      updateCategories();
    }
    
    // 3. Push local changes to server if any
    if (pendingChanges) {
      const result = await postQuotesToServer(quotes);
      if (!result) throw new Error("Failed to post quotes");
      pendingChanges = false;
    }
    
    // 4. Update sync time and show success alert
    lastSyncTime = new Date().toISOString();
    localStorage.setItem('lastSyncTime', lastSyncTime);
    showSyncStatus("Synchronization complete!", "success");
    alert("Quotes synced with server!"); // Added alert notification
    
  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
    alert("Sync failed: " + error.message); // Also alert on errors
  }
}

// [Rest of your existing functions remain unchanged...]