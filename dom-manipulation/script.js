// Quote database
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
];

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
}

// Add a new quote to the database
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Create form for adding quotes (already in HTML as per instructions)
function createAddQuoteForm() {
  // Form is already in HTML as per instructions
  // This function is maintained for consistency with requirements
  console.log("Add quote form is ready");
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Show initial random quote
  showRandomQuote();
  
  // Set up event listener for new quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize add quote form
  createAddQuoteForm();
});