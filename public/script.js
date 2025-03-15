document.getElementById('filter-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const price = document.getElementById('price').value;
  const area = document.getElementById('area').value;

  const response = await fetch('/.netlify/functions/filter-apartments', {
    method: 'POST',
    body: JSON.stringify({ price, area }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  document.getElementById('results').innerText = JSON.stringify(data, null, 2);
});