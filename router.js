const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const handler = require('./handler.js');


const router = (request, response) => {
    const endpoint = request.url;
    const method = request.method;
    if (endpoint === '/') {
        handler('/public/index.html', response);
    } else if (endpoint.includes('public')) {
        handler(endpoint, response);
    } else if (endpoint === '/posts' && method === 'GET') {
        const filePath = path.join(__dirname, 'src/posts.json')
        fs.readFile(filePath, (error, file) => {
            if (error) {
                response.writeHead(500);
                response.end('SERVER ERROR');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/javascript' })
                response.end(file);
            }
        })
    } else if (endpoint === '/create-post' && method === 'POST') {
        let allData = "";
        request.on('data', chunkOfData => {
            allData += chunkOfData;
        });
        request.on('end', () => {
            let convertedData = querystring.parse(allData);
            const postsPath = path.join(__dirname, 'src/posts.json')
            fs.readFile(postsPath, 'UTF8', (error, data) => {
                if (error) {
                    response.writeHead(500);
                    response.end('SERVER ERROR');
                } else {
                    let obj = JSON.parse(data);
                    obj[Date.now()] = convertedData.post
                    fs.writeFile(postsPath, JSON.stringify(obj), (err) => {
                        if (err) {
                            response.writeHead(500);
                            response.end('SERVER ERROR');
                        }
                    })
                }
            })
            response.writeHead(302, { Location: "/" });
            response.end();
        });
    } else {
        response.writeHead(404)
        response.end('Page Not Found!')
    }
}

module.exports = router;