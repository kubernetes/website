var http = require('http');

var handleRequest = function(request, response) {
  console.log('URLのリクエストを受信しました ' + request.url);
  response.writeHead(200);
  response.end('こんにちは世界');
};
var www = http.createServer(handleRequest);
www.listen(8080);
