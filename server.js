// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db-music.json')
const middlewares = jsonServer.defaults()
const path = require('path');

const port = process.env.PORT || 3004;

server.use('/artist/:id', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.use(middlewares);
server.use(router);

server.listen(port);
