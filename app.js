var http = require('http');
var fs = require('fs');
var path = require('path');

var router = require('router')();
var markdown = require("markdown").markdown;
var walk = require('walk');

var config = {
	port: 1080,
	fileRoot: 'd:/dev/notes'
};

var beginHtml = function() {
	return "<!DOCTYPE html>\r\n<html>\r\n<head><title>Simple File Host</title></head>\r\n<body>\r\n"
};

var endHtml = function() {
	return "\r\n</body></html>"
};

router.get('/', function(req, res) {

	var files = [];
	var walker = walk.walk(config.fileRoot, { followLinks: false });

	walker.on('file', function(root, stat, next) {

		if (path.extname(stat.name) == ".md") {

			var completePath = root + '/' + stat.name;
			files.push(completePath.replace(config.fileRoot, ''));
		}

		next();

	});

	walker.on('end', function() {

		res.writeHeader(200, {"Content-Type": "text/html"});

		res.write(beginHtml());
		res.write("<ul>\r\n");

		files.forEach(function(file) {
			res.write("<li><a href='files" + file + "'>" + file + "</a></li>\r\n");
		});

		res.write("</ul>");
		res.write(endHtml());

		res.end();
	});

});

router.get('/files/*', function (req, res) {

	var filePath = path.join(config.fileRoot, req.params.wildcard);

	if (path.extname(filePath) != ".md")
	{
		res.writeHeader(404, {"Content-Type": "text/html"});
		res.write("Cannot find file '" + req.params.wildcard + "'");

		return;
	}

	fs.readFile(filePath, function(err, data) {

		if (err) {

			res.writeHeader(404, {"Content-Type": "text/html"});
			res.write("Cannot find file '" + req.params.wildcard + "'");

		} else {

			res.writeHeader(200, {"Content-Type": "text/html"});

			res.write(beginHtml());
			res.write(markdown.toHTML(data.toString()));
			res.write(endHtml());

		}

		res.end();

	});

});

http.createServer(router).listen(config.port);

console.log("Listening on port " + config.port + ".");
