var re = /^[a-z]{5,10}$/i;

var $letters = document.querySelector('#letters');
var $num_results = document.querySelector('#num_results');
var $results = document.querySelector('#results');

$letters.onkeyup = function(e, callback) {
	if (this.value === this._value) {
		return;
	}
	this._value = this.value;

	if (re.test(this.value)) {
		var letters = this.value.toLowerCase();
		setTimeout(function() {
			var words = test(letters);
			$num_results.textContent = words.length;
			var ll = 0;
			$results.innerHTML = words.map(function(word) {
				var pref = word.length != ll ? '<li>' + (ll ? '<br></li><li>' : '') + word.length + ':</li>' : '';
				ll = word.length;
				return pref + '<li>' + word + '</li>';
			}).join('');

			callback && callback();
		});
	}
};

function count(letters) {
	var count = {};
	for (var i = 0; i < letters.length; i++) {
		var letter = letters[i];
		if (!count[letter]) count[letter] = 0;
		count[letter]++;
	}

	return count;
}

function test(letters) {
	console.time('search');

	var done = {};
	var words = [];

	for (var i = 0; i < letters.length; i++) {
		for (var j = 0; j < letters.length; j++) {
			for (var k = 0; k < letters.length; k++) {
				var short = letters[i] + letters[j] + letters[k];
				if (!done[short]) {
					done[short] = 1;

					var index = sessionStorage.getItem('w_' + short);
					if (index) {
						index.split(',').forEach(function(word) {
							words.push(word);
						});
					}
				}
			}
		}
	}

	var available = count(letters);
	words = words.filter(function(word) {
		word = count(word);
		for (var l in word) {
			if (!available[l] || available[l] < word[l]) {
				return false;
			}
		}

		return true;
	});

	console.timeEnd('search');

	words.sort(function(a, b) {
		if (b.length == a.length) {
			return a < b ? -1 : 1;
		}

		return b.length - a.length;
	});

	return words;
}

function ready() {
	console.debug('ready');

	setTimeout(function() {
		$letters.onkeyup({}, function() {
			document.body.classList.remove('loading');
			$letters.focus();
		});
	}, 100);
}

function load() {
	console.debug('load');

	if (!sessionStorage.w_ass) {
		Object.keys(sessionStorage).filter(function(key) {
			return key.substr(0, 2) == 'w_';
		}).forEach(function(key) {
			sessionStorage.removeItem(key);
		});
		return loadWords(ready);
	}

	setTimeout(ready, 100);
}

function loadWords(callback) {
	console.debug('loadWords');

	console.time('fetch');
	var xhr = new XMLHttpRequest;
	xhr.open('get', 'https://raw.githubusercontent.com/dwyl/english-words/master/words.txt', true);
	xhr.send();
	xhr.onload = function(e) {
		console.timeEnd('fetch');

		var txt = this.responseText;
		var words = txt.toLowerCase().split(/[\r\n|\r|\n]+/).filter(function(word) {
			return re.test(word);
		});

		console.time('save words');
		var index = [], lastShort;
		words.forEach(function(word, i) {
			var short = word.substr(0, 3);
			if (short != lastShort) {
				if (index.length) {
					sessionStorage.setItem('w_' + lastShort, index.join(','));
				}

				index.length = 0;
			}

			index.push(word);
			lastShort = short;
		});
		console.timeEnd('save words');

		callback();
	};
}
