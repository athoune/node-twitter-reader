var sys = require('sys'),
colors = require('colors'),
Ngrams = require('../lib/twitter-reader').Ngrams;

var n = new Ngrams();
n.min = 3;

n.feed('je');
n.feed('mange');
n.feed('des');
n.feed('carottes');

sys.debug(n.ranks());