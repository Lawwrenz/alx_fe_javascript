// Quote database
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
];

// Display a random quote using DOM methods
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Clear previous quote
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  
  // Create elements using createElement
  const blockquote = document.createElement('blockquote');
  const quoteText = document.createTextNode(`"${quote.text}"`);
  const categoryPara = document.createElement('p');
  const categoryEm = document.createElement('em');
  const categoryText = document.createTextNode(`- ${quote.category}`);
  
  // Build structure using appendChild
  blockquote.appendChild(quoteText);
  categoryEm.appendChild(categoryText);
  categoryPara.appendChild(categoryEm);
  quoteDisplay.appendChild(blockquote);
  quoteDisplay.appendChild(categoryPara);
}

// Create form for adding quotes using DOM methods
function createAddQuoteForm() {
  // Form already exists in HTML, but we'll enhance it with DOM methods
  const formDiv = document.querySelector('body > div:nth-child(4)');
  
  // Create heading element
  const heading = document.createElement('h3');
  heading.textContent = 'Add New Quote';
  
  // Insert heading before the form inputs
  formDiv.insertBefore(heading, formDiv.firstChild);
  
  // Style the button using DOM properties
  const addButton = formDiv.querySelector('button');
  addButton.style.marginTop = '10px';
  addButton.style.padding = '5px 15px';
}

// Add a new quote to the database
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Create success message element
    const successMsg = document.createElement('p');
    successMsg.textContent = 'Quote added successfully!';
    successMsg.style.color = 'green';
    
    // Append message to quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.appendChild(successMsg);
    
    // Remove message after 2 seconds
    setTimeout(() => {
      quoteDisplay.removeChild(successMsg);
    }, 2000);
    
    showRandomQuote();
  } else {
    // Create error message element
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Please enter both a quote and a category.';
    errorMsg.style.color = 'red';
    
    // Append message to quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(errorMsg);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Show initial random quote
  showRandomQuote();
  
  // Set up event listener for new quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize the add quote form
  createAddQuoteForm();
});