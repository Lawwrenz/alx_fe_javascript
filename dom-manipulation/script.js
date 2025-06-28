// Quote database and configuration
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server with Content-Type header
async function fetchQuotesFromServer() {
  showSyncStatus("Fetching quotes from server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json' // Explicit Content-Type
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const posts = await response.json();
    const serverQuotes = posts.slice(0, 5).map(post => ({
      text: post.title,
      category: `Category ${post.id % 3 + 1}`
    }));
    
    return mergeQuotes(serverQuotes);
  } catch (error) {
    showSyncStatus(`Fetch failed: ${error.message}`, "error");
    return false;
  }
}

// Post quotes to server with Content-Type header
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
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    showSyncStatus(`Post failed: ${error.message}`, "error");
    return false;
  }
}

// Main sync function with Content-Type in all requests
async function syncQuotes() {
  showSyncStatus("Starting synchronization...", "syncing");
  
  try {
    // Fetch with Content-Type
    const serverQuotes = await fetchQuotesFromServer();
    if (!serverQuotes) throw new Error("Fetch failed");
    
    // Post with Content-Type if changes exist
    if (pendingChanges) {
      const postResult = await postQuotesToServer(quotes);
      if (!postResult) throw new Error("Post failed");
      pendingChanges = false;
    }
    
    lastSyncTime = new Date().toISOString();
    showSyncStatus("Synchronization complete", "success");
    return true;
  } catch (error) {
    showSyncStatus(`Sync error: ${error.message}`, "error");
    return false;
  }
}

// Helper function to merge quotes
function mergeQuotes(newQuotes) {
  const merged = [...quotes];
  newQuotes.forEach(newQuote => {
    if (!quotes.some(q => q.text === newQuote.text)) {
      merged.push(newQuote);
    }
  });
  
  if (merged.length !== quotes.length) {
    quotes = merged;
    saveQuotes();
    updateCategories();
    return true;
  }
  return false;
}

// [Rest of the existing functions remain unchanged...]