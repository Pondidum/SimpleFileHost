var http = require('http');
var fs = require('fs');
var markdown = require("markdown").markdown;

var file = fs.readFileSync('d:/dev/notes/tech-talks.md');

http.createServer(function (req, res) {
	res.writeHeader(200, {"Content-Type": "text/html"});
	res.write(markdown.toHTML(file.toString()));
	res.end();
}).listen(10304);
