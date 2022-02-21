const http = require('http');
const router = require('./router.js');

const server = http.createServer(router);

const port = 3000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}.  Ready to accept requests!`);
});