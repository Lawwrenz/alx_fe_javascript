// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint with .json
const API_URL = 'https://jsonplaceholder.typicode.com/posts.json';

// Main synchronization function
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
      localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to localStorage
      updateCategories();
    }
    
    // 3. Push local changes to server if any
    if (pendingChanges) {
      const result = await postQuotesToServer(quotes);
      if (!result) throw new Error("Failed to post quotes");
      pendingChanges = false;
    }
    
    // 4. Update sync time
    lastSyncTime = new Date().toISOString();
    localStorage.setItem('lastSyncTime', lastSyncTime); // Save sync time
    showSyncStatus("Synchronization complete!", "success");
    
  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
  }
}

// Fetch quotes with Content-Type header
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json(); // Parse .json response
    
    return posts.slice(0, 5).map(post => ({
      text: post.title,
      category: `Server-${post.id % 3 + 1}`
    }));
    
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Post quotes with Content-Type header
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(quotesToPost), // Convert to .json
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json(); // Parse .json response
    
  } catch (error) {
    console.error("Post error:", error);
    return null;
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Load from localStorage
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) quotes = JSON.parse(savedQuotes);
  
  // Set up UI
  populateCategories();
  document.getElementById('syncNowBtn').addEventListener('click', syncQuotes);
  setInterval(syncQuotes, syncInterval);
  
  // Initial sync
  syncQuotes();
});

// [Other existing functions (saveQuotes, loadQuotes, etc.) remain unchanged]