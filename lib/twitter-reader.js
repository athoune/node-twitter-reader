var TwitterNode = require('twitter-node').TwitterNode,
	util = require('util'),
	events = require('events');

var Reader = function(txt, callback) {
	events.EventEmitter.call(this);
	txt.split(/[\s,".]+/).forEach(function(word) {
		util.debug(word);
	});
};

util.inherits(Reader, events.EventEmitter);
exports.Reader = Reader;