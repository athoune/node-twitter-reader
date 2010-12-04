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

function ngram(word, min, max) {
	var ngrams = [];
	word = '_' + word + '_';
	for(var i=0; i < word.length; i++) {
		for(var s=min; s <=max; s++) {
			if(i+s <= word.length) {
				var ngram = word.substr(i,s);
				if(ngram != '_')
					ngrams.push(ngram);
			}
		}
	}
	return ngrams;
}

exports.ngram = ngram;

var Ngrams = function() {
	this.keys = [];
	this.stats = {};
	this.min = 1;
	this.max = 4;
}

Ngrams.prototype.feed = function(word) {
	var g = this;
	ngram(word, this.min, this.max).forEach(function(n) {
		if(g.stats[n] == null) {
			g.stats[n] = 1;
			g.keys.push(n);
		}else{
			g.stats[n] += 1;
		}
	});
}

Ngrams.prototype.ranks = function() {
	var g = this;
	this.keys.sort(function(a,b) {
		if(g.stats[a] != g.stats[b]) {
			return g.stats[a] - g.stats[b];
		}
		if(a == b) {
			return 0;
		}
		if(a > b) {
			return 1;
		}
		return -1;
	});
	return this.keys;
}

exports.Ngrams = Ngrams;