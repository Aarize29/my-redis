const http = require("http");
const url = require("url");

const store = {};

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  console.log(`Received Request: ${req.method} ${req.url}`);

  // Handle "set" command using POST
  if (req.method === 'POST' && pathname === '/set') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Accumulate the body data
    });

    req.on('end', () => {
      console.log("Raw Body Received:", body); // Log the raw body for debugging

      try {
        const { key, value } = JSON.parse(body); // Expect JSON data with key and value
        store[key] = value; // Store the value
        console.log(`Set ${key} = ${value}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', message: 'Value set successfully' }));
      } catch (error) {
        console.error('JSON parsing error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
  }

  // Handle "get" command using GET
  else if (req.method === 'GET' && pathname === '/get') {
    const { key } = query;
    const value = store[key];
    console.log(`Get ${key}:`, value);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (value) {
      res.end(JSON.stringify({ key, value }));
    } else {
      res.end(JSON.stringify({ key, value: null, message: 'Key not found' }));
    }
  } 
  
  // Handle unknown routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
server.listen(6371, () => {
  console.log("myredis HTTP server is running on port 6371");
});
