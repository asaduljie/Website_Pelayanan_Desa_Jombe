import http from 'http';

http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => console.log('Backend Healthcheck Output:', JSON.parse(data)));
}).on('error', (err) => console.error('Error:', err.message));
