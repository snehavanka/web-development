const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const querystring = require('querystring');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sneha@123',  
  database: 'application_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL!');
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    
    fs.readFile(path.join(__dirname, 'applicationform.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading applicationform');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });

  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = querystring.parse(body);
      console.log('Form data received:', formData);  

      if (formData.password !== formData.confirm_password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Passwords do not match');
      }

      
      const languages = Array.isArray(formData.languages)
        ? formData.languages.join(', ')
        : formData.languages || '';

      const sql = `INSERT INTO application_db
        (first_name, last_name, dob, age, gender, email, position, languages, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        formData.first_name,
        formData.last_name,
        formData.dob,
        formData.age,
        formData.gender,
        formData.email,
        formData.position,
        languages,
        formData.password  
      ];

      db.query(sql, values, (err) => {
        if (err) {
          console.error('SQL error:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Database error: ' + err.message);
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Application submitted successfully!');
      });
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
