// 

// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// JSONPlaceholder API endpoint with explicit .json extension
const API_URL = 'https://jsonplaceholder.typicode.com/posts.json';

// Convert data to JSON format
function convertToJson(data) {
  return JSON.stringify(data, null, 2); // Explicit JSON conversion
}

// Fetch quotes from JSONPlaceholder API
async function fetchQuotesFromServer() {
  showSyncStatus("Fetching quotes from server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // Explicit .json() call to parse response
    const posts = await response.json();
    const serverQuotes = posts.slice(0, 5).map(post => ({
      text: post.title,
      category: `Category ${post.id % 3 + 1}`
    }));
    
    return serverQuotes;
  } catch (error) {
    showSyncStatus(`Fetch failed: ${error.message}`, "error");
    return null;
  }
}

// Post quotes to server
async function postQuotesToServer(quotesToPost) {
  showSyncStatus("Posting quotes to server...", "syncing");
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: convertToJson(quotesToPost), // Explicit JSON conversion
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // Explicit .json() call to parse response
    return await response.json();
  } catch (error) {
    showSyncStatus(`Post failed: ${error.message}`, "error");
    return null;
  }
}

// Save quotes to localStorage with explicit JSON conversion
function saveQuotes() {
  localStorage.setItem('quotes', convertToJson(quotes));
}

// Export quotes to JSON file
function exportToJson() {
  const dataStr = convertToJson(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json'; // Explicit .json filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file || !file.name.endsWith('.json')) { // Check .json extension
    showSyncStatus("Please select a valid .json file", "error");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result); // Explicit JSON parsing
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Invalid JSON format: Expected array of quotes');
      }
      
      quotes = [...quotes, ...importedQuotes];
      saveQuotes();
      showSyncStatus(`Imported ${importedQuotes.length} quotes`, "success");
    } catch (error) {
      showSyncStatus(`Import failed: ${error.message}`, "error");
    }
  };
  fileReader.readAsText(file);
}

// [Rest of your existing functions remain unchanged...]