Read the tweets
===============

A nodejs tool for reading tweets.

Functions
---------

 * keyword (starting with #) and user (starting with @)
 * url
 * language guessing.

Testing it
----------

You need to bring your own conf.js in test folder :

		conf = {
			'user' : 'bob',
			'password' : 'sponge'
		};

		exports.conf = conf;

For testing, I use a word used in many differents languages : **wikileaks**

Test use *colors* :

		npm install colors

For now, differents english variant is not usable, scotish can be seen as english. English tweets are not displayed.

Ideogram languages is broken, the tokenization doesn't work.

		cd test
		vi conf.js
		node test-filter.js
		
Testing it with socket.io
-------------------------

		npm install socket.io
		cd test/websocket
		node server.js

Open your browser : http://localhost:8000