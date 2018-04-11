class FavWords {
	constructor(bench, yours) {
		this.bench = bench;
		this.yours = yours;

		this.dictionary = {
			bench: {},
			yours: {},
		};

		this.reindex('bench', bench.value);
		this.reindex('yours', yours.value);
	}

	printMost(dict, words) {
		document.querySelector('#most-' + dict).textContent = words.map(([word, total, pct]) => {
			return `${word} (${Math.round(pct * 1000)/10}%)`;
		}).join(', ');
	}

	set(dict, text) {
		this[dict].value = text;
		this.reindex(dict, text);
	}

	reindex(dict, text) {
		const words = this.makeWords(text);
		this.dictionary[dict] = this.countWords(words);

		this.printMost(dict, this.dictionary[dict].slice(0, 10));
	}

	makeWords(text) {
		return text.split(/[^a-z0-9-]+/i).filter((frag) => {
			return frag != '' && !/^[0-9-]$/.test(frag) && !/^[sd]$/.test(frag);
		});
	}

	countWords(words) {
		const total = words.length;

		const map = words.reduce((dict, word) => {
			word = word.toLowerCase();
			dict[word] || (dict[word] = 0);
			dict[word]++;
			return dict;
		}, {});

		const cols = Object.keys(map).map((word) => [word, map[word], map[word] / total]);

		cols.sort((a, b) => b[1] - a[1]);

		return cols;
	}

	listen() {
		this.bench.addEventListener('input', (e) => this.reindex('bench', e.target.value));
		this.yours.addEventListener('input', (e) => this.reindex('yours', e.target.value));
	}
}
