// Quote data management
let quotes = [];
let currentCategory = "All";
let addFormVisible = false;

// DOM elements
const elements = {
    quoteDisplay: document.getElementById('quoteDisplay'),
    newQuoteBtn: document.getElementById('newQuote'),
    showAddFormBtn: document.getElementById('showAddForm'),
    formContainer: document.getElementById('formContainer'),
    exportQuotesBtn: document.getElementById('exportQuotes'),
    importFileInput: document.getElementById('importFile'),
    categorySelector: document.getElementById('categorySelector')
};

// Initialize the application
function initApp() {
    // Load quotes from localStorage
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
        console.log('Loaded quotes from localStorage:', quotes.length);
    } else {
        // Default quotes if none in storage
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
        ];
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Set session timestamp
    sessionStorage.setItem('sessionStart', new Date().toISOString());

    // Set up event listeners
    elements.newQuoteBtn.addEventListener('click', showRandomQuote);
    elements.showAddFormBtn.addEventListener('click', toggleAddForm);
    elements.exportQuotesBtn.addEventListener('click', exportQuotes);
    elements.importFileInput.addEventListener('change', importFromJsonFile);

    // Initial display
    showRandomQuote();
    updateCategoryButtons();
}

// Show random quote from current category
function showRandomQuote() {
    const filteredQuotes = currentCategory === "All" 
        ? quotes 
        : quotes.filter(q => q.category === currentCategory);

    if (filteredQuotes.length === 0) {
        elements.quoteDisplay.innerHTML = `<p>No quotes in ${currentCategory} category</p>`;
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    displayQuote(randomQuote);
    
    // Store last viewed quote in sessionStorage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Display a quote
function displayQuote(quote) {
    elements.quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <p><em>— ${quote.category}</em></p>
    `;
}

// Create and manage the add quote form
function toggleAddForm() {
    if (addFormVisible) {
        elements.formContainer.innerHTML = '';
        addFormVisible = false;
    } else {
        const formHTML = `
            <div id="addQuoteForm">
                <h3>Add New Quote</h3>
                <textarea id="newQuoteText" placeholder="Enter quote text" rows="3"></textarea>
                <input id="newQuoteCategory" type="text" placeholder="Category">
                <button id="submitQuote">Add Quote</button>
                <button id="cancelAdd">Cancel</button>
            </div>
        `;
        elements.formContainer.innerHTML = formHTML;
        
        document.getElementById('submitQuote').addEventListener('click', addQuote);
        document.getElementById('cancelAdd').addEventListener('click', toggleAddForm);
        
        addFormVisible = true;
    }
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    
    // Save to localStorage
    localStorage.setItem('quotes', JSON.stringify(quotes));
    
    toggleAddForm();
    updateCategoryButtons();
    showRandomQuote();
    alert('Quote added successfully!');
}

// Update category selection UI
function updateCategoryButtons() {
    const categories = ["All", ...new Set(quotes.map(q => q.category))];
    elements.categorySelector.innerHTML = '<h3>Select a category:</h3>';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.className = category === currentCategory ? 'active' : '';
        btn.addEventListener('click', () => {
            currentCategory = category;
            updateCategoryButtons();
            showRandomQuote();
        });
        elements.categorySelector.appendChild(btn);
    });
}

// Export quotes to JSON file
function exportQuotes() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) throw new Error('Invalid format: Expected array');
            
            const validQuotes = imported.filter(q => 
                q.text && q.category && 
                typeof q.text === 'string' && 
                typeof q.category === 'string'
            );
            
            if (validQuotes.length === 0) throw new Error('No valid quotes found');
            
            quotes.push(...validQuotes);
            localStorage.setItem('quotes', JSON.stringify(quotes));
            
            updateCategoryButtons();
            showRandomQuote();
            alert(`Imported ${validQuotes.length} quotes successfully!`);
            
        } catch (error) {
            alert(`Import failed: ${error.message}`);
            console.error('Import error:', error);
        }
        event.target.value = '';
    };
    reader.onerror = () => {
        alert('Error reading file');
        event.target.value = '';
    };
    reader.readAsText(file);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);