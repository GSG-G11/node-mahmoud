const fs = require('fs');
const path = require('path');

const handler = ((url, response) => {
    const filePath = path.join(__dirname, url === '/' ? 'public/index.html' : url);
    let ext = path.extname(filePath);;
    console.log(filePath);
    const end = {
        ".html": "text/html",
        ".css": "text/css",
        ".png": "text/png",
        ".js": "text/javascript"
    }
    fs.readFile(filePath, (error, file) => {
        if (error) {
            response.writeHead(500);
            response.end('SERVER ERROR');
        } else {
            response.writeHead(200, { 'Content-Type': end[ext] })
            response.end(file);
        }
    })
})

module.exports = handler;