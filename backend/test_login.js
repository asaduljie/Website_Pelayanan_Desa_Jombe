import http from 'http';

const data = JSON.stringify({
  nik: '3512345678900009',
  password: 'password123',
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => console.log('Login Test Response:', res.statusCode, JSON.parse(body)));
  }
);

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
