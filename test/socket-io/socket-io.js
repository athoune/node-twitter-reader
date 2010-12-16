var TwitterNode = require('twitter-node').TwitterNode,
	http = require('http'),
	io = require('socket.io'),
	fs = require('fs'),
	url = require('url'),
	sys = require('sys'),
	colors = require('colors'),
	ngram = require('ngram'),
	Reader = require('../../lib/twitter-reader').Reader,
	conf = require('../conf').conf;

var fp = new ngram.FingerPrint();
fp.registerFolder('/Applications/LibreOffice.app/Contents/basis-link/share/fingerprint/');

var twit = new TwitterNode(conf);
twit.addListener('error', function(error) {
	console.log(error.message);
});
twit.track('wikileaks');

var server = http.createServer(function(req, res){ 
	var path = url.parse(req.url).pathname;
	switch (path) {
	case '/':
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		res.write(fs.readFileSync('index.html')); 
		res.end(); 
	break;
	
}
 // your normal server code 
});
server.listen(8000);


// socket.io 
var ws = io.listen(server); 
ws.on('connection', function(client){
	client.broadcast({ announcement: client.sessionId + ' connected' });
	// new client is here! 
	client.on('message', function(){
		
	});
	client.on('disconnect', function(){
		
	});
});

twit
	.addListener('tweet', function(tweet) {
		//sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
		var reader = new Reader();
		var n = new ngram.Ngrams();
		reader.addListener('url', function(url) {
			sys.debug(url.red);
		});
		reader.addListener('word', function(word) {
			n.feed(word);
		});
		reader.addListener('end', function() {
			var language = fp.guess(n);
			if(language != 'english' && language != 'scots') {
				sys.debug(language.yellow + ' : ' + ("@" + tweet.user.screen_name).blue + ' ' + tweet.text);
				ws.broadcast(language + ' : @' + tweet.user.screen_name + '<p>' + tweet.text + '</p>');
			}
		});
		reader.feed(tweet.text);
		
	})
	.addListener('limit', function(limit) {
		sys.puts("LIMIT: " + sys.inspect(limit));
	})
	.addListener('delete', function(del) {
		sys.puts("DELETE: " + sys.inspect(del));
	})
	.addListener('end', function(resp) {
		sys.puts("wave goodbye... " + resp.statusCode);
		//sys.puts(sys.inspect(resp));
	});
twit.stream();
