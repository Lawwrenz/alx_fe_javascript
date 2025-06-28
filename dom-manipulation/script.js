// [Previous code remains the same until the mock server section]

// Simulate server API
const mockServer = {
  data: [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" }
  ],
  lastUpdated: new Date().toISOString(),
  
  // Renamed to match requirement
  fetchQuotesFromServer: async function() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: this.data,
      lastUpdated: this.lastUpdated
    };
  },
  
  postQuotes: async function(newQuotes) {
    // [Previous implementation remains the same]
  }
};

// [Add this new function to fetch quotes]
async function fetchQuotesFromServer() {
  showSyncStatus("Fetching quotes from server...", "syncing");
  try {
    const response = await mockServer.fetchQuotesFromServer();
    if (!response.success) {
      throw new Error("Failed to fetch from server");
    }
    
    // Merge with local quotes
    const mergedQuotes = mergeQuoteArrays(quotes, response.data);
    
    // Only update if there are changes
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

// Helper function to merge quote arrays
function mergeQuoteArrays(localQuotes, serverQuotes) {
  const quoteMap = new Map();
  
  // Add all server quotes first (server wins policy)
  serverQuotes.forEach(quote => {
    quoteMap.set(quote.text, quote);
  });
  
  // Add local quotes only if they don't exist on server
  localQuotes.forEach(quote => {
    if (!quoteMap.has(quote.text)) {
      quoteMap.set(quote.text, quote);
    }
  });
  
  return Array.from(quoteMap.values());
}

// Update syncWithServer to use the new function
async function syncWithServer() {
  showSyncStatus("Syncing with server...", "syncing");
  
  try {
    // First fetch any server updates
    await fetchQuotesFromServer();
    
    // Then push our local changes if we have any
    if (pendingChanges) {
      const postResponse = await mockServer.postQuotes(quotes);
      
      if (!postResponse.success) {
        throw new Error("Failed to update server data");
      }
      
      // Update with server's merged data
      quotes = postResponse.data;
      saveQuotes();
      updateCategoriesList();
      populateCategories();
    }
    
    lastSyncTime = new Date().toISOString();
    pendingChanges = false;
    showSyncStatus("Sync completed successfully", "success");
    
  } catch (error) {
    console.error("Sync error:", error);
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}

// [Rest of your existing functions remain unchanged]