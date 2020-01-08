var http = require('http');

var handleRequest = function(request, response) {
  console.log('收到网址请求 ' + request.url);
  response.writeHead(200);
  response.end('你好，世界');
};
var www = http.createServer(handleRequest);
www.listen(8080);
