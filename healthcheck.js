// Simple healthcheck endpoint
const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: port,
        HAS_DATABASE_URL: !!process.env.DATABASE_URL,
        HAS_CLERK_KEY: !!process.env.CLERK_SECRET_KEY,
      }
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found - Try /health');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Healthcheck server running on port ${port}`);
  console.log(`Environment variables check:`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
  console.log(`- CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`- PORT: ${port}`);
});
