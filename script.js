// Load API token from config
import {API_TOKEN, API_URL} from './config.js';

const input = document.getElementById('addressInput');
const suggestionsList = document.getElementById('suggestions');

let selectedIndex = -1;
let suggestions = [];

addInputEventListener();
addKeyboardNavigation();

function addInputEventListener() {
    input.addEventListener('input', async () => {
        selectedIndex = -1;
        const query = input.value.trim();
        if (query.length < 3) return;

        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&limit=10&srid=25832`, {
            headers: {
                'token': API_TOKEN
            }
        });
        suggestions = await response.json() || [];
        suggestionsList.innerHTML = '';
        if (suggestions.length === 0) return

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion.visningstekst;
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => selectAddress(suggestion));
            suggestionsList.appendChild(li);
        });

        // Select first suggestion by default
        selectedIndex = 0;
        highlightSuggestion();
    });
}

function addKeyboardNavigation() {
    input.addEventListener('keydown', (e) => {
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % suggestions.length;
                highlightSuggestion();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
                highlightSuggestion();
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    selectAddress(suggestions[selectedIndex]);
                }
                break;
        }
    });
}

function highlightSuggestion() {
    Array.from(suggestionsList.children).forEach((li, index) => {
        if (index === selectedIndex) {
            li.style.backgroundColor = '#e0e0e0';
        } else {
            li.style.backgroundColor = '';
        }
    });
}

function selectAddress(address) {
    input.value = address.visningstekst;
    suggestionsList.innerHTML = '';

    document.getElementById('vejnavn').value = address.vejnavn || '';
    document.getElementById('husnummer').value = address.husnummer || '';
    document.getElementById('etage').value = address.etagebetegnelse || '';
    document.getElementById('doer').value = address.doerbetegnelse || '';
    document.getElementById('postnr').value = address.postnummer || '';
    document.getElementById('bynavn').value = address.postnummernavn || '';
}
