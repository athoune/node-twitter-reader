var TwitterNode = require('twitter-node').TwitterNode,
	util = require('util'),
	events = require('events');

function cleanup(txt) {
	return txt.replace(/(^[\\("']+)|([,:;.?!)"'|\\]+$)/, '').toLowerCase();
}
var Reader = function() {
	events.EventEmitter.call(this);
};

util.inherits(Reader, events.EventEmitter);
exports.Reader = Reader;

Reader.prototype.feed = function(txt) {
	var reader = this;
	txt.split(/[\s,"]+/).forEach(function(word) {
		if(word[0] == '#') {
			reader.emit('tag', cleanup(word.substr(1)));
			return;
		}
		if(word[0] == '@') {
			reader.emit('buddy', cleanup(word.substr(1)));
			return;
		}
		if(word.substr(0,7) == 'http://') {
			reader.emit('url', word);
			return;
		}
		reader.emit('word', cleanup(word));
	});
};

