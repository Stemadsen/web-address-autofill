// Load API token from config
import {API_TOKEN, API_URL} from './config.js';

// Elements
const input = document.getElementById('addressInput');
const suggestionsList = document.getElementById('suggestions');

// Auto-complete logic
input.addEventListener('input', async () => {
  console.log('Input changed:', input.value);
  const query = input.value.trim();
  suggestionsList.innerHTML = '';
  if (query.length < 2) return;

  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&limit=10&srid=25832`, {
      headers: {
        'token': API_TOKEN
      }
    });
    const data = await response.json();
    const suggestions = data || [];

    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion.visningstekst;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => selectAddress(suggestion));
      suggestionsList.appendChild(li);
    });
  } catch (e) {
    console.error('Error fetching suggestions:', e);
  }
});

// Handle address selection
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
