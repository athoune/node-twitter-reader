var conf = require('./conf').conf,
	TwitterNode = require('twitter-node').TwitterNode,
	sys = require('sys'),
	colors = require('colors'),
	fs = require('fs'),
	ngram = require('ngram'),
	Reader = require('../lib/twitter-reader').Reader;

var fp = new ngram.FingerPrint();
fs.readdirSync('/Applications/LibreOffice.app/Contents/basis-link/share/fingerprint/').forEach(function(lm) {
	fp.register(lm.split('.')[0], '/Applications/LibreOffice.app/Contents/basis-link/share/fingerprint/' + lm);
});

var twit = new TwitterNode(conf);

twit.addListener('error', function(error) {
	console.log(error.message);
});


twit.track('football');

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
	})
	.stream();
