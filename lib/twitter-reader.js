var TwitterNode = require('twitter-node').TwitterNode,
	util = require('util'),
	events = require('events');

function cleanup(txt) {
	return txt.replace(/[,:;.?!]+$/, '');
}
var Reader = function(txt, callback) {
	events.EventEmitter.call(this);
	txt.split(/[\s,"]+/).forEach(function(word) {
		if(word[0] == '#') {
			util.debug('TAG: ' + cleanup(word.substr(1)));
			return;
		}
		if(word[0] == '@') {
			util.debug('BUDDY: ' + cleanup(word.substr(1)));
			return;
		}
		if(word.substr(0,7) == 'http://') {
			util.debug('URL: ' + word.substr(7));
			return;
		}
		util.debug(cleanup(word));
	});
};

util.inherits(Reader, events.EventEmitter);
exports.Reader = Reader;