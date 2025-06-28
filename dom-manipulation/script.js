// Quote database
let quotes = [];
let categories = [];
let pendingChanges = false;
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

// UI Elements
const notificationArea = document.createElement('div');
notificationArea.id = 'notification-area';
notificationArea.style.position = 'fixed';
notificationArea.style.top = '20px';
notificationArea.style.right = '20px';
notificationArea.style.zIndex = '1000';
document.body.appendChild(notificationArea);

// JSONPlaceholder API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Show UI notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <p>${message}</p>
    <button class="close-btn">&times;</button>
  `;
  
  notification.querySelector('.close-btn').addEventListener('click', () => {
    notification.remove();
  });

  notificationArea.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Conflict detection and resolution
function detectConflicts(serverQuotes) {
  const conflicts = [];
  const localQuoteMap = new Map(quotes.map(q => [q.text, q]));
  
  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuoteMap.get(serverQuote.text);
    if (localQuote && localQuote.category !== serverQuote.category) {
      conflicts.push({
        text: serverQuote.text,
        localCategory: localQuote.category,
        serverCategory: serverQuote.category
      });
    }
  });

  return conflicts;
}

// Main synchronization function with conflict handling
async function syncQuotes() {
  showSyncStatus("Starting synchronization...", "syncing");
  showNotification("Starting quote synchronization...", "info");

  try {
    // 1. Fetch server quotes
    const serverQuotes = await fetchQuotesFromServer();
    if (!serverQuotes) throw new Error("Failed to fetch quotes");

    // 2. Check for conflicts
    const conflicts = detectConflicts(serverQuotes);
    if (conflicts.length > 0) {
      showNotification(`${conflicts.length} conflicts detected!`, "warning");
      conflicts.forEach(conflict => {
        showNotification(
          `Conflict: "${conflict.text}" (Local: ${conflict.localCategory}, Server: ${conflict.serverCategory})`,
          "warning"
        );
      });
    }

    // 3. Merge quotes (server version wins conflicts)
    const mergedQuotes = [...quotes];
    const serverQuoteMap = new Map(serverQuotes.map(q => [q.text, q]));
    
    quotes.forEach((quote, index) => {
      if (serverQuoteMap.has(quote.text)) {
        mergedQuotes[index] = serverQuoteMap.get(quote.text);
      }
    });
    
    // Add new quotes from server
    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(q => q.text === serverQuote.text)) {
        mergedQuotes.push(serverQuote);
      }
    });

    // 4. Update if changes were made
    if (mergedQuotes.length !== quotes.length || conflicts.length > 0) {
      quotes = mergedQuotes;
      localStorage.setItem('quotes', JSON.stringify(quotes));
      updateCategories();
      showNotification("Quotes updated from server", "success");
    }

    // 5. Push local changes if any
    if (pendingChanges) {
      const result = await postQuotesToServer(quotes);
      if (!result) throw new Error("Failed to post quotes");
      pendingChanges = false;
      showNotification("Local changes pushed to server", "success");
    }

    // 6. Final status
    lastSyncTime = new Date().toISOString();
    localStorage.setItem('lastSyncTime', lastSyncTime);
    showSyncStatus("Synchronization complete!", "success");
    showNotification("Quotes synced with server!", "success");
    alert("Quotes synced with server!");

  } catch (error) {
    showSyncStatus(`Sync failed: ${error.message}`, "error");
    showNotification(`Sync failed: ${error.message}`, "error");
    alert(`Sync failed: ${error.message}`);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Load from localStorage
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    showNotification("Quotes loaded from local storage", "info");
  }

  // Set up UI
  populateCategories();
  document.getElementById('syncNowBtn').addEventListener('click', syncQuotes);
  setInterval(syncQuotes, syncInterval);
  
  // Initial sync
  syncQuotes();
});

// [Rest of your existing functions remain unchanged...]