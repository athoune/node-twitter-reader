var conf = require('./conf').conf,
	TwitterNode = require('twitter-node').TwitterNode,
	sys = require('sys'),
	Reader = require('../lib/twitter-reader').Reader;

var twit = new TwitterNode(conf);

twit.addListener('error', function(error) {
  console.log(error.message);
});


twit.track('movie');

twit
  .addListener('tweet', function(tweet) {
    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
		var r  = new Reader(tweet.text, function() {
			
		});
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
