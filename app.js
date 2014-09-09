var http = require('http');
var fs = require('fs');
var path = require('path');

var markdown = require("markdown").markdown;

var config = {
	port: 1080,
	fileRoot: 'd:/dev/notes'
};

http.createServer(function (req, res) {

	var filePath = path.join(config.fileRoot, req.url);

	fs.readFile(filePath, function(err, data) {

		if (err) {

			res.writeHeader(404, {"Content-Type": "text/html"});
			res.write("Cannot find file '" + req.url + "'");

		} else {

			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(markdown.toHTML(data.toString()));

		}

		res.end();

	});

}).listen(config.port);

console.log("Listening on port " + config.port + ".");
