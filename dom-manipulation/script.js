// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// DOM elements
const syncStatus = document.getElementById('syncStatus');
const syncNowBtn = document.getElementById('syncNowBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  // Set up event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  syncNowBtn.addEventListener('click', syncWithServer);
  
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

// Simulate server API
const mockServer = {
  data: [],
  lastUpdated: null,
  
  fetchQuotes: async function() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: this.data,
      lastUpdated: this.lastUpdated
    };
  },
  
  postQuotes: async function(newQuotes) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate random server errors (10% chance)
    if (Math.random() < 0.1) {
      return { success: false, error: "Server error occurred" };
    }
    
    // Merge with existing server data
    const uniqueQuotes = [...new Set([...this.data, ...newQuotes])];
    this.data = uniqueQuotes;
    this.lastUpdated = new Date().toISOString();
    
    return {
      success: true,
      data: this.data,
      lastUpdated: this.lastUpdated
    };
  }
};

// Sync with server
async function syncWithServer() {
  showSyncStatus("Syncing with server...", "syncing");
  
  try {
    // Get current server state
    const serverResponse = await mockServer.fetchQuotes();
    
    if (!serverResponse.success) {
      throw new Error("Failed to fetch server data");
    }
    
    // Check for conflicts
    const conflicts = findConflicts(quotes, serverResponse.data);
    
    if (conflicts.length > 0) {
      showSyncStatus(`Found ${conflicts.length} conflicts. Resolving...`, "conflict");
      await resolveConflicts(conflicts, serverResponse.data);
    }
    
    // Send our local changes if we have any
    if (pendingChanges || quotes.length !== serverResponse.data.length) {
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

// Find conflicts between local and server data
function findConflicts(localQuotes, serverQuotes) {
  const conflicts = [];
  
  // For simplicity, we'll consider quotes with same text but different categories as conflicts
  const serverQuoteMap = new Map(serverQuotes.map(q => [q.text, q]));
  
  localQuotes.forEach(localQuote => {
    const serverQuote = serverQuoteMap.get(localQuote.text);
    if (serverQuote && serverQuote.category !== localQuote.category) {
      conflicts.push({
        text: localQuote.text,
        localCategory: localQuote.category,
        serverCategory: serverQuote.category
      });
    }
  });
  
  return conflicts;
}

// Resolve conflicts (simple strategy: server wins)
async function resolveConflicts(conflicts, serverData) {
  // For demo purposes, we'll just take server's version
  // In a real app, you might show UI to let user choose
  
  // Create a map of server quotes for quick lookup
  const serverQuoteMap = new Map(serverData.map(q => [q.text, q]));
  
  // Update local quotes to match server versions
  quotes = quotes.map(quote => {
    const serverQuote = serverQuoteMap.get(quote.text);
    return serverQuote || quote;
  });
  
  saveQuotes();
  return true;
}

// Show sync status
function showSyncStatus(message, type) {
  syncStatus.textContent = message;
  syncStatus.className = `sync-status ${type}`;
  syncStatus.style.display = 'block';
  
  // Hide after 5 seconds if not error
  if (type !== 'error') {
    setTimeout(() => {
      if (syncStatus.textContent === message) {
        syncStatus.style.display = 'none';
      }
    }, 5000);
  }
}

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    updateCategoriesList();
  } else {
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
  pendingChanges = true;
  updateCategoriesList();
}

// [Rest of your existing functions (populateCategories, filterQuotes, showRandomQuote, 
// addQuote, exportToJson, importFromJsonFile, createAddQuoteForm) remain unchanged]