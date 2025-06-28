// [Previous constants and variables remain the same...]

// New syncQuotes function to handle the complete synchronization process
async function syncQuotes() {
  showSyncStatus("Starting quote synchronization...", "syncing");
  
  try {
    // Step 1: Fetch server quotes
    const fetchSuccess = await fetchQuotesFromServer();
    if (!fetchSuccess) {
      throw new Error("Failed to fetch quotes from server");
    }

    // Step 2: Post local changes if any
    if (pendingChanges) {
      const postSuccess = await postQuotesToServer(quotes);
      if (!postSuccess) {
        throw new Error("Failed to post quotes to server");
      }
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

// Updated syncWithServer to use syncQuotes
async function syncWithServer() {
  return await syncQuotes();
}

// [Rest of your existing functions remain unchanged...]
// fetchQuotesFromServer, postQuotesToServer, loadQuotes, saveQuotes, etc.

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('syncNowBtn').addEventListener('click', syncQuotes); // Updated to use syncQuotes
  
  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
  
  showRandomQuote();
  
  // Start periodic sync
  setInterval(syncQuotes, syncInterval); // Updated to use syncQuotes
  
  // Initial sync
  setTimeout(syncQuotes, 2000); // Updated to use syncQuotes
});