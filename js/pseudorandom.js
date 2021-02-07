class PseudoRandom {
	constructor(seed=1) {
		this.seed = seed;
	}

	random() {
		var x = Math.sin(this.seed++) * 10000;
		return x - Math.floor(x);
	}

	randomInt(max) {
		return Math.floor(max * this.random(this.seed));
	}
	
	randomIntRange(min,max) {
		return this.randomInt(max - min) + min;
	}
	
	randomArray(length) {
		var array = [...Array(length).keys()];
		for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
		}
		return array;
	}
}

function seedFromString(str) {
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = 1 + (Math.abs(hash) % 6857);
  return hash;
}