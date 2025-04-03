const jsonServer = require('json-server');
const path =require('path')
const server = jsonServer.create();
const fs = require('fs')
const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')))
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = 8080;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
