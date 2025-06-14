const name = "espresso-chartjs-card";
const version$1 = "1.0.0";
const dependencies = {
	"chart.js": "^4.4.9"};
var pkg = {
	name: name,
	version: version$1,
	dependencies: dependencies};

/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function round(v) {
  return v + 0.5 | 0;
}
const lim = (v, l, h) => Math.max(Math.min(v, h), l);
function p2b(v) {
  return lim(round(v * 2.55), 0, 255);
}
function n2b(v) {
  return lim(round(v * 255), 0, 255);
}
function b2n(v) {
  return lim(round(v / 2.55) / 100, 0, 1);
}
function n2p(v) {
  return lim(round(v * 100), 0, 100);
}

const map$1 = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
const hex = [...'0123456789ABCDEF'];
const h1 = b => hex[b & 0xF];
const h2 = b => hex[(b & 0xF0) >> 4] + hex[b & 0xF];
const eq = b => ((b & 0xF0) >> 4) === (b & 0xF);
const isShort = v => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
function hexParse(str) {
  var len = str.length;
  var ret;
  if (str[0] === '#') {
    if (len === 4 || len === 5) {
      ret = {
        r: 255 & map$1[str[1]] * 17,
        g: 255 & map$1[str[2]] * 17,
        b: 255 & map$1[str[3]] * 17,
        a: len === 5 ? map$1[str[4]] * 17 : 255
      };
    } else if (len === 7 || len === 9) {
      ret = {
        r: map$1[str[1]] << 4 | map$1[str[2]],
        g: map$1[str[3]] << 4 | map$1[str[4]],
        b: map$1[str[5]] << 4 | map$1[str[6]],
        a: len === 9 ? (map$1[str[7]] << 4 | map$1[str[8]]) : 255
      };
    }
  }
  return ret;
}
const alpha = (a, f) => a < 255 ? f(a) : '';
function hexString(v) {
  var f = isShort(v) ? h1 : h2;
  return v
    ? '#' + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f)
    : undefined;
}

const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
}
function hsv2rgbn(h, s, v) {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}
function hwb2rgbn(h, w, b) {
  const rgb = hsl2rgbn(h, 1, 0.5);
  let i;
  if (w + b > 1) {
    i = 1 / (w + b);
    w *= i;
    b *= i;
  }
  for (i = 0; i < 3; i++) {
    rgb[i] *= 1 - w - b;
    rgb[i] += w;
  }
  return rgb;
}
function hueValue(r, g, b, d, max) {
  if (r === max) {
    return ((g - b) / d) + (g < b ? 6 : 0);
  }
  if (g === max) {
    return (b - r) / d + 2;
  }
  return (r - g) / d + 4;
}
function rgb2hsl(v) {
  const range = 255;
  const r = v.r / range;
  const g = v.g / range;
  const b = v.b / range;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s, d;
  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = hueValue(r, g, b, d, max);
    h = h * 60 + 0.5;
  }
  return [h | 0, s || 0, l];
}
function calln(f, a, b, c) {
  return (
    Array.isArray(a)
      ? f(a[0], a[1], a[2])
      : f(a, b, c)
  ).map(n2b);
}
function hsl2rgb(h, s, l) {
  return calln(hsl2rgbn, h, s, l);
}
function hwb2rgb(h, w, b) {
  return calln(hwb2rgbn, h, w, b);
}
function hsv2rgb(h, s, v) {
  return calln(hsv2rgbn, h, s, v);
}
function hue(h) {
  return (h % 360 + 360) % 360;
}
function hueParse(str) {
  const m = HUE_RE.exec(str);
  let a = 255;
  let v;
  if (!m) {
    return;
  }
  if (m[5] !== v) {
    a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
  }
  const h = hue(+m[2]);
  const p1 = +m[3] / 100;
  const p2 = +m[4] / 100;
  if (m[1] === 'hwb') {
    v = hwb2rgb(h, p1, p2);
  } else if (m[1] === 'hsv') {
    v = hsv2rgb(h, p1, p2);
  } else {
    v = hsl2rgb(h, p1, p2);
  }
  return {
    r: v[0],
    g: v[1],
    b: v[2],
    a: a
  };
}
function rotate(v, deg) {
  var h = rgb2hsl(v);
  h[0] = hue(h[0] + deg);
  h = hsl2rgb(h);
  v.r = h[0];
  v.g = h[1];
  v.b = h[2];
}
function hslString(v) {
  if (!v) {
    return;
  }
  const a = rgb2hsl(v);
  const h = a[0];
  const s = n2p(a[1]);
  const l = n2p(a[2]);
  return v.a < 255
    ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
    : `hsl(${h}, ${s}%, ${l}%)`;
}

const map = {
	x: 'dark',
	Z: 'light',
	Y: 're',
	X: 'blu',
	W: 'gr',
	V: 'medium',
	U: 'slate',
	A: 'ee',
	T: 'ol',
	S: 'or',
	B: 'ra',
	C: 'lateg',
	D: 'ights',
	R: 'in',
	Q: 'turquois',
	E: 'hi',
	P: 'ro',
	O: 'al',
	N: 'le',
	M: 'de',
	L: 'yello',
	F: 'en',
	K: 'ch',
	G: 'arks',
	H: 'ea',
	I: 'ightg',
	J: 'wh'
};
const names$1 = {
	OiceXe: 'f0f8ff',
	antiquewEte: 'faebd7',
	aqua: 'ffff',
	aquamarRe: '7fffd4',
	azuY: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '0',
	blanKedOmond: 'ffebcd',
	Xe: 'ff',
	XeviTet: '8a2be2',
	bPwn: 'a52a2a',
	burlywood: 'deb887',
	caMtXe: '5f9ea0',
	KartYuse: '7fff00',
	KocTate: 'd2691e',
	cSO: 'ff7f50',
	cSnflowerXe: '6495ed',
	cSnsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: 'ffff',
	xXe: '8b',
	xcyan: '8b8b',
	xgTMnPd: 'b8860b',
	xWay: 'a9a9a9',
	xgYF: '6400',
	xgYy: 'a9a9a9',
	xkhaki: 'bdb76b',
	xmagFta: '8b008b',
	xTivegYF: '556b2f',
	xSange: 'ff8c00',
	xScEd: '9932cc',
	xYd: '8b0000',
	xsOmon: 'e9967a',
	xsHgYF: '8fbc8f',
	xUXe: '483d8b',
	xUWay: '2f4f4f',
	xUgYy: '2f4f4f',
	xQe: 'ced1',
	xviTet: '9400d3',
	dAppRk: 'ff1493',
	dApskyXe: 'bfff',
	dimWay: '696969',
	dimgYy: '696969',
	dodgerXe: '1e90ff',
	fiYbrick: 'b22222',
	flSOwEte: 'fffaf0',
	foYstWAn: '228b22',
	fuKsia: 'ff00ff',
	gaRsbSo: 'dcdcdc',
	ghostwEte: 'f8f8ff',
	gTd: 'ffd700',
	gTMnPd: 'daa520',
	Way: '808080',
	gYF: '8000',
	gYFLw: 'adff2f',
	gYy: '808080',
	honeyMw: 'f0fff0',
	hotpRk: 'ff69b4',
	RdianYd: 'cd5c5c',
	Rdigo: '4b0082',
	ivSy: 'fffff0',
	khaki: 'f0e68c',
	lavFMr: 'e6e6fa',
	lavFMrXsh: 'fff0f5',
	lawngYF: '7cfc00',
	NmoncEffon: 'fffacd',
	ZXe: 'add8e6',
	ZcSO: 'f08080',
	Zcyan: 'e0ffff',
	ZgTMnPdLw: 'fafad2',
	ZWay: 'd3d3d3',
	ZgYF: '90ee90',
	ZgYy: 'd3d3d3',
	ZpRk: 'ffb6c1',
	ZsOmon: 'ffa07a',
	ZsHgYF: '20b2aa',
	ZskyXe: '87cefa',
	ZUWay: '778899',
	ZUgYy: '778899',
	ZstAlXe: 'b0c4de',
	ZLw: 'ffffe0',
	lime: 'ff00',
	limegYF: '32cd32',
	lRF: 'faf0e6',
	magFta: 'ff00ff',
	maPon: '800000',
	VaquamarRe: '66cdaa',
	VXe: 'cd',
	VScEd: 'ba55d3',
	VpurpN: '9370db',
	VsHgYF: '3cb371',
	VUXe: '7b68ee',
	VsprRggYF: 'fa9a',
	VQe: '48d1cc',
	VviTetYd: 'c71585',
	midnightXe: '191970',
	mRtcYam: 'f5fffa',
	mistyPse: 'ffe4e1',
	moccasR: 'ffe4b5',
	navajowEte: 'ffdead',
	navy: '80',
	Tdlace: 'fdf5e6',
	Tive: '808000',
	TivedBb: '6b8e23',
	Sange: 'ffa500',
	SangeYd: 'ff4500',
	ScEd: 'da70d6',
	pOegTMnPd: 'eee8aa',
	pOegYF: '98fb98',
	pOeQe: 'afeeee',
	pOeviTetYd: 'db7093',
	papayawEp: 'ffefd5',
	pHKpuff: 'ffdab9',
	peru: 'cd853f',
	pRk: 'ffc0cb',
	plum: 'dda0dd',
	powMrXe: 'b0e0e6',
	purpN: '800080',
	YbeccapurpN: '663399',
	Yd: 'ff0000',
	Psybrown: 'bc8f8f',
	PyOXe: '4169e1',
	saddNbPwn: '8b4513',
	sOmon: 'fa8072',
	sandybPwn: 'f4a460',
	sHgYF: '2e8b57',
	sHshell: 'fff5ee',
	siFna: 'a0522d',
	silver: 'c0c0c0',
	skyXe: '87ceeb',
	UXe: '6a5acd',
	UWay: '708090',
	UgYy: '708090',
	snow: 'fffafa',
	sprRggYF: 'ff7f',
	stAlXe: '4682b4',
	tan: 'd2b48c',
	teO: '8080',
	tEstN: 'd8bfd8',
	tomato: 'ff6347',
	Qe: '40e0d0',
	viTet: 'ee82ee',
	JHt: 'f5deb3',
	wEte: 'ffffff',
	wEtesmoke: 'f5f5f5',
	Lw: 'ffff00',
	LwgYF: '9acd32'
};
function unpack() {
  const unpacked = {};
  const keys = Object.keys(names$1);
  const tkeys = Object.keys(map);
  let i, j, k, ok, nk;
  for (i = 0; i < keys.length; i++) {
    ok = nk = keys[i];
    for (j = 0; j < tkeys.length; j++) {
      k = tkeys[j];
      nk = nk.replace(k, map[k]);
    }
    k = parseInt(names$1[ok], 16);
    unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
  }
  return unpacked;
}

let names;
function nameParse(str) {
  if (!names) {
    names = unpack();
    names.transparent = [0, 0, 0, 0];
  }
  const a = names[str.toLowerCase()];
  return a && {
    r: a[0],
    g: a[1],
    b: a[2],
    a: a.length === 4 ? a[3] : 255
  };
}

const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
  const m = RGB_RE.exec(str);
  let a = 255;
  let r, g, b;
  if (!m) {
    return;
  }
  if (m[7] !== r) {
    const v = +m[7];
    a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
  }
  r = +m[1];
  g = +m[3];
  b = +m[5];
  r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
  g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
  b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
}
function rgbString(v) {
  return v && (
    v.a < 255
      ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
      : `rgb(${v.r}, ${v.g}, ${v.b})`
  );
}

const to = v => v <= 0.0031308 ? v * 12.92 : Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055;
const from = v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
function interpolate$1(rgb1, rgb2, t) {
  const r = from(b2n(rgb1.r));
  const g = from(b2n(rgb1.g));
  const b = from(b2n(rgb1.b));
  return {
    r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
    g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
    b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
    a: rgb1.a + t * (rgb2.a - rgb1.a)
  };
}

function modHSL(v, i, ratio) {
  if (v) {
    let tmp = rgb2hsl(v);
    tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
    tmp = hsl2rgb(tmp);
    v.r = tmp[0];
    v.g = tmp[1];
    v.b = tmp[2];
  }
}
function clone$1(v, proto) {
  return v ? Object.assign(proto || {}, v) : v;
}
function fromObject(input) {
  var v = {r: 0, g: 0, b: 0, a: 255};
  if (Array.isArray(input)) {
    if (input.length >= 3) {
      v = {r: input[0], g: input[1], b: input[2], a: 255};
      if (input.length > 3) {
        v.a = n2b(input[3]);
      }
    }
  } else {
    v = clone$1(input, {r: 0, g: 0, b: 0, a: 1});
    v.a = n2b(v.a);
  }
  return v;
}
function functionParse(str) {
  if (str.charAt(0) === 'r') {
    return rgbParse(str);
  }
  return hueParse(str);
}
class Color {
  constructor(input) {
    if (input instanceof Color) {
      return input;
    }
    const type = typeof input;
    let v;
    if (type === 'object') {
      v = fromObject(input);
    } else if (type === 'string') {
      v = hexParse(input) || nameParse(input) || functionParse(input);
    }
    this._rgb = v;
    this._valid = !!v;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var v = clone$1(this._rgb);
    if (v) {
      v.a = b2n(v.a);
    }
    return v;
  }
  set rgb(obj) {
    this._rgb = fromObject(obj);
  }
  rgbString() {
    return this._valid ? rgbString(this._rgb) : undefined;
  }
  hexString() {
    return this._valid ? hexString(this._rgb) : undefined;
  }
  hslString() {
    return this._valid ? hslString(this._rgb) : undefined;
  }
  mix(color, weight) {
    if (color) {
      const c1 = this.rgb;
      const c2 = color.rgb;
      let w2;
      const p = weight === w2 ? 0.5 : weight;
      const w = 2 * p - 1;
      const a = c1.a - c2.a;
      const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      w2 = 1 - w1;
      c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
      c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
      c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
      c1.a = p * c1.a + (1 - p) * c2.a;
      this.rgb = c1;
    }
    return this;
  }
  interpolate(color, t) {
    if (color) {
      this._rgb = interpolate$1(this._rgb, color._rgb, t);
    }
    return this;
  }
  clone() {
    return new Color(this.rgb);
  }
  alpha(a) {
    this._rgb.a = n2b(a);
    return this;
  }
  clearer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 - ratio;
    return this;
  }
  greyscale() {
    const rgb = this._rgb;
    const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    rgb.r = rgb.g = rgb.b = val;
    return this;
  }
  opaquer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 + ratio;
    return this;
  }
  negate() {
    const v = this._rgb;
    v.r = 255 - v.r;
    v.g = 255 - v.g;
    v.b = 255 - v.b;
    return this;
  }
  lighten(ratio) {
    modHSL(this._rgb, 2, ratio);
    return this;
  }
  darken(ratio) {
    modHSL(this._rgb, 2, -ratio);
    return this;
  }
  saturate(ratio) {
    modHSL(this._rgb, 1, ratio);
    return this;
  }
  desaturate(ratio) {
    modHSL(this._rgb, 1, -ratio);
    return this;
  }
  rotate(deg) {
    rotate(this._rgb, deg);
    return this;
  }
}

/*!
 * Chart.js v4.4.9
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
/**
 * Returns a unique id, sequentially generated from a global variable.
 */ const uid = (()=>{
    let id = 0;
    return ()=>id++;
})();
/**
 * Returns true if `value` is neither null nor undefined, else returns false.
 * @param value - The value to test.
 * @since 2.7.0
 */ function isNullOrUndef(value) {
    return value === null || value === undefined;
}
/**
 * Returns true if `value` is an array (including typed arrays), else returns false.
 * @param value - The value to test.
 * @function
 */ function isArray(value) {
    if (Array.isArray && Array.isArray(value)) {
        return true;
    }
    const type = Object.prototype.toString.call(value);
    if (type.slice(0, 7) === '[object' && type.slice(-6) === 'Array]') {
        return true;
    }
    return false;
}
/**
 * Returns true if `value` is an object (excluding null), else returns false.
 * @param value - The value to test.
 * @since 2.7.0
 */ function isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}
/**
 * Returns true if `value` is a finite number, else returns false
 * @param value  - The value to test.
 */ function isNumberFinite(value) {
    return (typeof value === 'number' || value instanceof Number) && isFinite(+value);
}
/**
 * Returns `value` if finite, else returns `defaultValue`.
 * @param value - The value to return if defined.
 * @param defaultValue - The value to return if `value` is not finite.
 */ function finiteOrDefault(value, defaultValue) {
    return isNumberFinite(value) ? value : defaultValue;
}
/**
 * Returns `value` if defined, else returns `defaultValue`.
 * @param value - The value to return if defined.
 * @param defaultValue - The value to return if `value` is undefined.
 */ function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
}
const toDimension = (value, dimension)=>typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;
/**
 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
 * value returned by `fn`. If `fn` is not a function, this method returns undefined.
 * @param fn - The function to call.
 * @param args - The arguments with which `fn` should be called.
 * @param [thisArg] - The value of `this` provided for the call to `fn`.
 */ function callback(fn, args, thisArg) {
    if (fn && typeof fn.call === 'function') {
        return fn.apply(thisArg, args);
    }
}
function each(loopable, fn, thisArg, reverse) {
    let i, len, keys;
    if (isArray(loopable)) {
        len = loopable.length;
        {
            for(i = 0; i < len; i++){
                fn.call(thisArg, loopable[i], i);
            }
        }
    } else if (isObject(loopable)) {
        keys = Object.keys(loopable);
        len = keys.length;
        for(i = 0; i < len; i++){
            fn.call(thisArg, loopable[keys[i]], keys[i]);
        }
    }
}
/**
 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
 * @param a0 - The array to compare
 * @param a1 - The array to compare
 * @private
 */ function _elementsEqual(a0, a1) {
    let i, ilen, v0, v1;
    if (!a0 || !a1 || a0.length !== a1.length) {
        return false;
    }
    for(i = 0, ilen = a0.length; i < ilen; ++i){
        v0 = a0[i];
        v1 = a1[i];
        if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
            return false;
        }
    }
    return true;
}
/**
 * Returns a deep copy of `source` without keeping references on objects and arrays.
 * @param source - The value to clone.
 */ function clone(source) {
    if (isArray(source)) {
        return source.map(clone);
    }
    if (isObject(source)) {
        const target = Object.create(null);
        const keys = Object.keys(source);
        const klen = keys.length;
        let k = 0;
        for(; k < klen; ++k){
            target[keys[k]] = clone(source[keys[k]]);
        }
        return target;
    }
    return source;
}
function isValidKey(key) {
    return [
        '__proto__',
        'prototype',
        'constructor'
    ].indexOf(key) === -1;
}
/**
 * The default merger when Chart.helpers.merge is called without merger option.
 * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
 * @private
 */ function _merger(key, target, source, options) {
    if (!isValidKey(key)) {
        return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        merge(tval, sval, options);
    } else {
        target[key] = clone(sval);
    }
}
function merge(target, source, options) {
    const sources = isArray(source) ? source : [
        source
    ];
    const ilen = sources.length;
    if (!isObject(target)) {
        return target;
    }
    options = options || {};
    const merger = options.merger || _merger;
    let current;
    for(let i = 0; i < ilen; ++i){
        current = sources[i];
        if (!isObject(current)) {
            continue;
        }
        const keys = Object.keys(current);
        for(let k = 0, klen = keys.length; k < klen; ++k){
            merger(keys[k], target, current, options);
        }
    }
    return target;
}
function mergeIf(target, source) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return merge(target, source, {
        merger: _mergerIf
    });
}
/**
 * Merges source[key] in target[key] only if target[key] is undefined.
 * @private
 */ function _mergerIf(key, target, source) {
    if (!isValidKey(key)) {
        return;
    }
    const tval = target[key];
    const sval = source[key];
    if (isObject(tval) && isObject(sval)) {
        mergeIf(tval, sval);
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = clone(sval);
    }
}
// resolveObjectKey resolver cache
const keyResolvers = {
    // Chart.helpers.core resolveObjectKey should resolve empty key to root object
    '': (v)=>v,
    // default resolvers
    x: (o)=>o.x,
    y: (o)=>o.y
};
/**
 * @private
 */ function _splitKey(key) {
    const parts = key.split('.');
    const keys = [];
    let tmp = '';
    for (const part of parts){
        tmp += part;
        if (tmp.endsWith('\\')) {
            tmp = tmp.slice(0, -1) + '.';
        } else {
            keys.push(tmp);
            tmp = '';
        }
    }
    return keys;
}
function _getKeyResolver(key) {
    const keys = _splitKey(key);
    return (obj)=>{
        for (const k of keys){
            if (k === '') {
                break;
            }
            obj = obj && obj[k];
        }
        return obj;
    };
}
function resolveObjectKey(obj, key) {
    const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
    return resolver(obj);
}
/**
 * @private
 */ function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const defined = (value)=>typeof value !== 'undefined';
const isFunction = (value)=>typeof value === 'function';
// Adapted from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality#31129384
const setsEqual = (a, b)=>{
    if (a.size !== b.size) {
        return false;
    }
    for (const item of a){
        if (!b.has(item)) {
            return false;
        }
    }
    return true;
};
/**
 * @param e - The event
 * @private
 */ function _isClickEvent(e) {
    return e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu';
}

/**
 * @alias Chart.helpers.math
 * @namespace
 */ const PI = Math.PI;
const TAU = 2 * PI;
const PITAU = TAU + PI;
const INFINITY = Number.POSITIVE_INFINITY;
const RAD_PER_DEG = PI / 180;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;
const TWO_THIRDS_PI = PI * 2 / 3;
const log10 = Math.log10;
const sign = Math.sign;
function almostEquals(x, y, epsilon) {
    return Math.abs(x - y) < epsilon;
}
/**
 * Implementation of the nice number algorithm used in determining where axis labels will go
 */ function niceNum(range) {
    const roundedRange = Math.round(range);
    range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
    const niceRange = Math.pow(10, Math.floor(log10(range)));
    const fraction = range / niceRange;
    const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
    return niceFraction * niceRange;
}
/**
 * Returns an array of factors sorted from 1 to sqrt(value)
 * @private
 */ function _factorize(value) {
    const result = [];
    const sqrt = Math.sqrt(value);
    let i;
    for(i = 1; i < sqrt; i++){
        if (value % i === 0) {
            result.push(i);
            result.push(value / i);
        }
    }
    if (sqrt === (sqrt | 0)) {
        result.push(sqrt);
    }
    result.sort((a, b)=>a - b).pop();
    return result;
}
/**
 * Verifies that attempting to coerce n to string or number won't throw a TypeError.
 */ function isNonPrimitive(n) {
    return typeof n === 'symbol' || typeof n === 'object' && n !== null && !(Symbol.toPrimitive in n || 'toString' in n || 'valueOf' in n);
}
function isNumber(n) {
    return !isNonPrimitive(n) && !isNaN(parseFloat(n)) && isFinite(n);
}
function almostWhole(x, epsilon) {
    const rounded = Math.round(x);
    return rounded - epsilon <= x && rounded + epsilon >= x;
}
/**
 * @private
 */ function _setMinAndMaxByKey(array, target, property) {
    let i, ilen, value;
    for(i = 0, ilen = array.length; i < ilen; i++){
        value = array[i][property];
        if (!isNaN(value)) {
            target.min = Math.min(target.min, value);
            target.max = Math.max(target.max, value);
        }
    }
}
function toRadians(degrees) {
    return degrees * (PI / 180);
}
function toDegrees(radians) {
    return radians * (180 / PI);
}
/**
 * Returns the number of decimal places
 * i.e. the number of digits after the decimal point, of the value of this Number.
 * @param x - A number.
 * @returns The number of decimal places.
 * @private
 */ function _decimalPlaces(x) {
    if (!isNumberFinite(x)) {
        return;
    }
    let e = 1;
    let p = 0;
    while(Math.round(x * e) / e !== x){
        e *= 10;
        p++;
    }
    return p;
}
// Gets the angle from vertical upright to the point about a centre.
function getAngleFromPoint(centrePoint, anglePoint) {
    const distanceFromXCenter = anglePoint.x - centrePoint.x;
    const distanceFromYCenter = anglePoint.y - centrePoint.y;
    const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
    let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
    if (angle < -0.5 * PI) {
        angle += TAU; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
    }
    return {
        angle,
        distance: radialDistanceFromCenter
    };
}
function distanceBetweenPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
/**
 * Shortest distance between angles, in either direction.
 * @private
 */ function _angleDiff(a, b) {
    return (a - b + PITAU) % TAU - PI;
}
/**
 * Normalize angle to be between 0 and 2*PI
 * @private
 */ function _normalizeAngle(a) {
    return (a % TAU + TAU) % TAU;
}
/**
 * @private
 */ function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
    const a = _normalizeAngle(angle);
    const s = _normalizeAngle(start);
    const e = _normalizeAngle(end);
    const angleToStart = _normalizeAngle(s - a);
    const angleToEnd = _normalizeAngle(e - a);
    const startToAngle = _normalizeAngle(a - s);
    const endToAngle = _normalizeAngle(a - e);
    return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
}
/**
 * Limit `value` between `min` and `max`
 * @param value
 * @param min
 * @param max
 * @private
 */ function _limitValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/**
 * @param {number} value
 * @private
 */ function _int16Range(value) {
    return _limitValue(value, -32768, 32767);
}
/**
 * @param value
 * @param start
 * @param end
 * @param [epsilon]
 * @private
 */ function _isBetween(value, start, end, epsilon = 1e-6) {
    return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
}

function _lookup(table, value, cmp) {
    cmp = cmp || ((index)=>table[index] < value);
    let hi = table.length - 1;
    let lo = 0;
    let mid;
    while(hi - lo > 1){
        mid = lo + hi >> 1;
        if (cmp(mid)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return {
        lo,
        hi
    };
}
/**
 * Binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @param last - lookup last index
 * @private
 */ const _lookupByKey = (table, key, value, last)=>_lookup(table, value, last ? (index)=>{
        const ti = table[index][key];
        return ti < value || ti === value && table[index + 1][key] === value;
    } : (index)=>table[index][key] < value);
/**
 * Reverse binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @private
 */ const _rlookupByKey = (table, key, value)=>_lookup(table, value, (index)=>table[index][key] >= value);
/**
 * Return subset of `values` between `min` and `max` inclusive.
 * Values are assumed to be in sorted order.
 * @param values - sorted array of values
 * @param min - min value
 * @param max - max value
 */ function _filterBetween(values, min, max) {
    let start = 0;
    let end = values.length;
    while(start < end && values[start] < min){
        start++;
    }
    while(end > start && values[end - 1] > max){
        end--;
    }
    return start > 0 || end < values.length ? values.slice(start, end) : values;
}
const arrayEvents = [
    'push',
    'pop',
    'shift',
    'splice',
    'unshift'
];
function listenArrayEvents(array, listener) {
    if (array._chartjs) {
        array._chartjs.listeners.push(listener);
        return;
    }
    Object.defineProperty(array, '_chartjs', {
        configurable: true,
        enumerable: false,
        value: {
            listeners: [
                listener
            ]
        }
    });
    arrayEvents.forEach((key)=>{
        const method = '_onData' + _capitalize(key);
        const base = array[key];
        Object.defineProperty(array, key, {
            configurable: true,
            enumerable: false,
            value (...args) {
                const res = base.apply(this, args);
                array._chartjs.listeners.forEach((object)=>{
                    if (typeof object[method] === 'function') {
                        object[method](...args);
                    }
                });
                return res;
            }
        });
    });
}
function unlistenArrayEvents(array, listener) {
    const stub = array._chartjs;
    if (!stub) {
        return;
    }
    const listeners = stub.listeners;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
    if (listeners.length > 0) {
        return;
    }
    arrayEvents.forEach((key)=>{
        delete array[key];
    });
    delete array._chartjs;
}
/**
 * @param items
 */ function _arrayUnique(items) {
    const set = new Set(items);
    if (set.size === items.length) {
        return items;
    }
    return Array.from(set);
}
/**
* Request animation polyfill
*/ const requestAnimFrame = function() {
    if (typeof window === 'undefined') {
        return function(callback) {
            return callback();
        };
    }
    return window.requestAnimationFrame;
}();
/**
 * Throttles calling `fn` once per animation frame
 * Latest arguments are used on the actual call
 */ function throttled(fn, thisArg) {
    let argsToUse = [];
    let ticking = false;
    return function(...args) {
        // Save the args for use later
        argsToUse = args;
        if (!ticking) {
            ticking = true;
            requestAnimFrame.call(window, ()=>{
                ticking = false;
                fn.apply(thisArg, argsToUse);
            });
        }
    };
}
/**
 * Debounces calling `fn` for `delay` ms
 */ function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        if (delay) {
            clearTimeout(timeout);
            timeout = setTimeout(fn, delay, args);
        } else {
            fn.apply(this, args);
        }
        return delay;
    };
}
/**
 * Converts 'start' to 'left', 'end' to 'right' and others to 'center'
 * @private
 */ const _toLeftRightCenter = (align)=>align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
/**
 * Returns `start`, `end` or `(start + end) / 2` depending on `align`. Defaults to `center`
 * @private
 */ const _alignStartEnd = (align, start, end)=>align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
/**
 * Returns `left`, `right` or `(left + right) / 2` depending on `align`. Defaults to `left`
 * @private
 */ const _textX = (align, left, right, rtl)=>{
    const check = rtl ? 'left' : 'right';
    return align === check ? right : align === 'center' ? (left + right) / 2 : left;
};
/**
 * Return start and count of visible points.
 * @private
 */ function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
    const pointCount = points.length;
    let start = 0;
    let count = pointCount;
    if (meta._sorted) {
        const { iScale , vScale , _parsed  } = meta;
        const spanGaps = meta.dataset ? meta.dataset.options ? meta.dataset.options.spanGaps : null : null;
        const axis = iScale.axis;
        const { min , max , minDefined , maxDefined  } = iScale.getUserBounds();
        if (minDefined) {
            start = Math.min(// @ts-expect-error Need to type _parsed
            _lookupByKey(_parsed, axis, min).lo, // @ts-expect-error Need to fix types on _lookupByKey
            animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo);
            if (spanGaps) {
                const distanceToDefinedLo = _parsed.slice(0, start + 1).reverse().findIndex((point)=>!isNullOrUndef(point[vScale.axis]));
                start -= Math.max(0, distanceToDefinedLo);
            }
            start = _limitValue(start, 0, pointCount - 1);
        }
        if (maxDefined) {
            let end = Math.max(// @ts-expect-error Need to type _parsed
            _lookupByKey(_parsed, iScale.axis, max, true).hi + 1, // @ts-expect-error Need to fix types on _lookupByKey
            animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1);
            if (spanGaps) {
                const distanceToDefinedHi = _parsed.slice(end - 1).findIndex((point)=>!isNullOrUndef(point[vScale.axis]));
                end += Math.max(0, distanceToDefinedHi);
            }
            count = _limitValue(end, start, pointCount) - start;
        } else {
            count = pointCount - start;
        }
    }
    return {
        start,
        count
    };
}
/**
 * Checks if the scale ranges have changed.
 * @param {object} meta - dataset meta.
 * @returns {boolean}
 * @private
 */ function _scaleRangesChanged(meta) {
    const { xScale , yScale , _scaleRanges  } = meta;
    const newRanges = {
        xmin: xScale.min,
        xmax: xScale.max,
        ymin: yScale.min,
        ymax: yScale.max
    };
    if (!_scaleRanges) {
        meta._scaleRanges = newRanges;
        return true;
    }
    const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
    Object.assign(_scaleRanges, newRanges);
    return changed;
}

const atEdge = (t)=>t === 0 || t === 1;
const elasticIn = (t, s, p)=>-(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
const elasticOut = (t, s, p)=>Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easing.effects
 * @see http://www.robertpenner.com/easing/
 */ const effects = {
    linear: (t)=>t,
    easeInQuad: (t)=>t * t,
    easeOutQuad: (t)=>-t * (t - 2),
    easeInOutQuad: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
    easeInCubic: (t)=>t * t * t,
    easeOutCubic: (t)=>(t -= 1) * t * t + 1,
    easeInOutCubic: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
    easeInQuart: (t)=>t * t * t * t,
    easeOutQuart: (t)=>-((t -= 1) * t * t * t - 1),
    easeInOutQuart: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
    easeInQuint: (t)=>t * t * t * t * t,
    easeOutQuint: (t)=>(t -= 1) * t * t * t * t + 1,
    easeInOutQuint: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
    easeInSine: (t)=>-Math.cos(t * HALF_PI) + 1,
    easeOutSine: (t)=>Math.sin(t * HALF_PI),
    easeInOutSine: (t)=>-0.5 * (Math.cos(PI * t) - 1),
    easeInExpo: (t)=>t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: (t)=>t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
    easeInOutExpo: (t)=>atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
    easeInCirc: (t)=>t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
    easeOutCirc: (t)=>Math.sqrt(1 - (t -= 1) * t),
    easeInOutCirc: (t)=>(t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
    easeInElastic: (t)=>atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
    easeOutElastic: (t)=>atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
    easeInOutElastic (t) {
        const s = 0.1125;
        const p = 0.45;
        return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
    },
    easeInBack (t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    easeOutBack (t) {
        const s = 1.70158;
        return (t -= 1) * t * ((s + 1) * t + s) + 1;
    },
    easeInOutBack (t) {
        let s = 1.70158;
        if ((t /= 0.5) < 1) {
            return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    },
    easeInBounce: (t)=>1 - effects.easeOutBounce(1 - t),
    easeOutBounce (t) {
        const m = 7.5625;
        const d = 2.75;
        if (t < 1 / d) {
            return m * t * t;
        }
        if (t < 2 / d) {
            return m * (t -= 1.5 / d) * t + 0.75;
        }
        if (t < 2.5 / d) {
            return m * (t -= 2.25 / d) * t + 0.9375;
        }
        return m * (t -= 2.625 / d) * t + 0.984375;
    },
    easeInOutBounce: (t)=>t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
};

function isPatternOrGradient(value) {
    if (value && typeof value === 'object') {
        const type = value.toString();
        return type === '[object CanvasPattern]' || type === '[object CanvasGradient]';
    }
    return false;
}
function color(value) {
    return isPatternOrGradient(value) ? value : new Color(value);
}
function getHoverColor(value) {
    return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
}

const numbers = [
    'x',
    'y',
    'borderWidth',
    'radius',
    'tension'
];
const colors = [
    'color',
    'borderColor',
    'backgroundColor'
];
function applyAnimationsDefaults(defaults) {
    defaults.set('animation', {
        delay: undefined,
        duration: 1000,
        easing: 'easeOutQuart',
        fn: undefined,
        from: undefined,
        loop: undefined,
        to: undefined,
        type: undefined
    });
    defaults.describe('animation', {
        _fallback: false,
        _indexable: false,
        _scriptable: (name)=>name !== 'onProgress' && name !== 'onComplete' && name !== 'fn'
    });
    defaults.set('animations', {
        colors: {
            type: 'color',
            properties: colors
        },
        numbers: {
            type: 'number',
            properties: numbers
        }
    });
    defaults.describe('animations', {
        _fallback: 'animation'
    });
    defaults.set('transitions', {
        active: {
            animation: {
                duration: 400
            }
        },
        resize: {
            animation: {
                duration: 0
            }
        },
        show: {
            animations: {
                colors: {
                    from: 'transparent'
                },
                visible: {
                    type: 'boolean',
                    duration: 0
                }
            }
        },
        hide: {
            animations: {
                colors: {
                    to: 'transparent'
                },
                visible: {
                    type: 'boolean',
                    easing: 'linear',
                    fn: (v)=>v | 0
                }
            }
        }
    });
}

function applyLayoutsDefaults(defaults) {
    defaults.set('layout', {
        autoPadding: true,
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    });
}

const intlCache = new Map();
function getNumberFormat(locale, options) {
    options = options || {};
    const cacheKey = locale + JSON.stringify(options);
    let formatter = intlCache.get(cacheKey);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        intlCache.set(cacheKey, formatter);
    }
    return formatter;
}
function formatNumber(num, locale, options) {
    return getNumberFormat(locale, options).format(num);
}

const formatters = {
 values (value) {
        return isArray(value) ?  value : '' + value;
    },
 numeric (tickValue, index, ticks) {
        if (tickValue === 0) {
            return '0';
        }
        const locale = this.chart.options.locale;
        let notation;
        let delta = tickValue;
        if (ticks.length > 1) {
            const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
            if (maxTick < 1e-4 || maxTick > 1e+15) {
                notation = 'scientific';
            }
            delta = calculateDelta(tickValue, ticks);
        }
        const logDelta = log10(Math.abs(delta));
        const numDecimal = isNaN(logDelta) ? 1 : Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
        const options = {
            notation,
            minimumFractionDigits: numDecimal,
            maximumFractionDigits: numDecimal
        };
        Object.assign(options, this.options.ticks.format);
        return formatNumber(tickValue, locale, options);
    }};
function calculateDelta(tickValue, ticks) {
    let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
    if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
        delta = tickValue - Math.floor(tickValue);
    }
    return delta;
}
 var Ticks = {
    formatters
};

function applyScaleDefaults(defaults) {
    defaults.set('scale', {
        display: true,
        offset: false,
        reverse: false,
        beginAtZero: false,
 bounds: 'ticks',
        clip: true,
 grace: 0,
        grid: {
            display: true,
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            tickLength: 8,
            tickWidth: (_ctx, options)=>options.lineWidth,
            tickColor: (_ctx, options)=>options.color,
            offset: false
        },
        border: {
            display: true,
            dash: [],
            dashOffset: 0.0,
            width: 1
        },
        title: {
            display: false,
            text: '',
            padding: {
                top: 4,
                bottom: 4
            }
        },
        ticks: {
            minRotation: 0,
            maxRotation: 50,
            mirror: false,
            textStrokeWidth: 0,
            textStrokeColor: '',
            padding: 3,
            display: true,
            autoSkip: true,
            autoSkipPadding: 3,
            labelOffset: 0,
            callback: Ticks.formatters.values,
            minor: {},
            major: {},
            align: 'center',
            crossAlign: 'near',
            showLabelBackdrop: false,
            backdropColor: 'rgba(255, 255, 255, 0.75)',
            backdropPadding: 2
        }
    });
    defaults.route('scale.ticks', 'color', '', 'color');
    defaults.route('scale.grid', 'color', '', 'borderColor');
    defaults.route('scale.border', 'color', '', 'borderColor');
    defaults.route('scale.title', 'color', '', 'color');
    defaults.describe('scale', {
        _fallback: false,
        _scriptable: (name)=>!name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
        _indexable: (name)=>name !== 'borderDash' && name !== 'tickBorderDash' && name !== 'dash'
    });
    defaults.describe('scales', {
        _fallback: 'scale'
    });
    defaults.describe('scale.ticks', {
        _scriptable: (name)=>name !== 'backdropPadding' && name !== 'callback',
        _indexable: (name)=>name !== 'backdropPadding'
    });
}

const overrides = Object.create(null);
const descriptors = Object.create(null);
 function getScope$1(node, key) {
    if (!key) {
        return node;
    }
    const keys = key.split('.');
    for(let i = 0, n = keys.length; i < n; ++i){
        const k = keys[i];
        node = node[k] || (node[k] = Object.create(null));
    }
    return node;
}
function set(root, scope, values) {
    if (typeof scope === 'string') {
        return merge(getScope$1(root, scope), values);
    }
    return merge(getScope$1(root, ''), scope);
}
 class Defaults {
    constructor(_descriptors, _appliers){
        this.animation = undefined;
        this.backgroundColor = 'rgba(0,0,0,0.1)';
        this.borderColor = 'rgba(0,0,0,0.1)';
        this.color = '#666';
        this.datasets = {};
        this.devicePixelRatio = (context)=>context.chart.platform.getDevicePixelRatio();
        this.elements = {};
        this.events = [
            'mousemove',
            'mouseout',
            'click',
            'touchstart',
            'touchmove'
        ];
        this.font = {
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            size: 12,
            style: 'normal',
            lineHeight: 1.2,
            weight: null
        };
        this.hover = {};
        this.hoverBackgroundColor = (ctx, options)=>getHoverColor(options.backgroundColor);
        this.hoverBorderColor = (ctx, options)=>getHoverColor(options.borderColor);
        this.hoverColor = (ctx, options)=>getHoverColor(options.color);
        this.indexAxis = 'x';
        this.interaction = {
            mode: 'nearest',
            intersect: true,
            includeInvisible: false
        };
        this.maintainAspectRatio = true;
        this.onHover = null;
        this.onClick = null;
        this.parsing = true;
        this.plugins = {};
        this.responsive = true;
        this.scale = undefined;
        this.scales = {};
        this.showLine = true;
        this.drawActiveElementsOnTop = true;
        this.describe(_descriptors);
        this.apply(_appliers);
    }
 set(scope, values) {
        return set(this, scope, values);
    }
 get(scope) {
        return getScope$1(this, scope);
    }
 describe(scope, values) {
        return set(descriptors, scope, values);
    }
    override(scope, values) {
        return set(overrides, scope, values);
    }
 route(scope, name, targetScope, targetName) {
        const scopeObject = getScope$1(this, scope);
        const targetScopeObject = getScope$1(this, targetScope);
        const privateName = '_' + name;
        Object.defineProperties(scopeObject, {
            [privateName]: {
                value: scopeObject[name],
                writable: true
            },
            [name]: {
                enumerable: true,
                get () {
                    const local = this[privateName];
                    const target = targetScopeObject[targetName];
                    if (isObject(local)) {
                        return Object.assign({}, target, local);
                    }
                    return valueOrDefault(local, target);
                },
                set (value) {
                    this[privateName] = value;
                }
            }
        });
    }
    apply(appliers) {
        appliers.forEach((apply)=>apply(this));
    }
}
var defaults = /* #__PURE__ */ new Defaults({
    _scriptable: (name)=>!name.startsWith('on'),
    _indexable: (name)=>name !== 'events',
    hover: {
        _fallback: 'interaction'
    },
    interaction: {
        _scriptable: false,
        _indexable: false
    }
}, [
    applyAnimationsDefaults,
    applyLayoutsDefaults,
    applyScaleDefaults
]);

/**
 * Converts the given font object into a CSS font string.
 * @param font - A font object.
 * @return The CSS font string. See https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @private
 */ function toFontString(font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
        return null;
    }
    return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
}
/**
 * @private
 */ function _measureText(ctx, data, gc, longest, string) {
    let textWidth = data[string];
    if (!textWidth) {
        textWidth = data[string] = ctx.measureText(string).width;
        gc.push(string);
    }
    if (textWidth > longest) {
        longest = textWidth;
    }
    return longest;
}
/**
 * Returns the aligned pixel value to avoid anti-aliasing blur
 * @param chart - The chart instance.
 * @param pixel - A pixel value.
 * @param width - The width of the element.
 * @returns The aligned pixel value.
 * @private
 */ function _alignPixel(chart, pixel, width) {
    const devicePixelRatio = chart.currentDevicePixelRatio;
    const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
    return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}
/**
 * Clears the entire canvas.
 */ function clearCanvas(canvas, ctx) {
    if (!ctx && !canvas) {
        return;
    }
    ctx = ctx || canvas.getContext('2d');
    ctx.save();
    // canvas.width and canvas.height do not consider the canvas transform,
    // while clearRect does
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}
function drawPoint(ctx, options, x, y) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    drawPointLegend(ctx, options, x, y, null);
}
// eslint-disable-next-line complexity
function drawPointLegend(ctx, options, x, y, w) {
    let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
    const style = options.pointStyle;
    const rotation = options.rotation;
    const radius = options.radius;
    let rad = (rotation || 0) * RAD_PER_DEG;
    if (style && typeof style === 'object') {
        type = style.toString();
        if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rad);
            ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
            ctx.restore();
            return;
        }
    }
    if (isNaN(radius) || radius <= 0) {
        return;
    }
    ctx.beginPath();
    switch(style){
        // Default includes circle
        default:
            if (w) {
                ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
            } else {
                ctx.arc(x, y, radius, 0, TAU);
            }
            ctx.closePath();
            break;
        case 'triangle':
            width = w ? w / 2 : radius;
            ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            rad += TWO_THIRDS_PI;
            ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
            ctx.closePath();
            break;
        case 'rectRounded':
            // NOTE: the rounded rect implementation changed to use `arc` instead of
            // `quadraticCurveTo` since it generates better results when rect is
            // almost a circle. 0.516 (instead of 0.5) produces results with visually
            // closer proportion to the previous impl and it is inscribed in the
            // circle with `radius`. For more details, see the following PRs:
            // https://github.com/chartjs/Chart.js/issues/5597
            // https://github.com/chartjs/Chart.js/issues/5858
            cornerRadius = radius * 0.516;
            size = radius - cornerRadius;
            xOffset = Math.cos(rad + QUARTER_PI) * size;
            xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            yOffset = Math.sin(rad + QUARTER_PI) * size;
            yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
            ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
            ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
            ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
            ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
            ctx.closePath();
            break;
        case 'rect':
            if (!rotation) {
                size = Math.SQRT1_2 * radius;
                width = w ? w / 2 : size;
                ctx.rect(x - width, y - size, 2 * width, 2 * size);
                break;
            }
            rad += QUARTER_PI;
        /* falls through */ case 'rectRot':
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            ctx.closePath();
            break;
        case 'crossRot':
            rad += QUARTER_PI;
        /* falls through */ case 'cross':
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            break;
        case 'star':
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            rad += QUARTER_PI;
            xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
            xOffset = Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
            ctx.moveTo(x - xOffsetW, y - yOffset);
            ctx.lineTo(x + xOffsetW, y + yOffset);
            ctx.moveTo(x + yOffsetW, y - xOffset);
            ctx.lineTo(x - yOffsetW, y + xOffset);
            break;
        case 'line':
            xOffset = w ? w / 2 : Math.cos(rad) * radius;
            yOffset = Math.sin(rad) * radius;
            ctx.moveTo(x - xOffset, y - yOffset);
            ctx.lineTo(x + xOffset, y + yOffset);
            break;
        case 'dash':
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
            break;
        case false:
            ctx.closePath();
            break;
    }
    ctx.fill();
    if (options.borderWidth > 0) {
        ctx.stroke();
    }
}
/**
 * Returns true if the point is inside the rectangle
 * @param point - The point to test
 * @param area - The rectangle
 * @param margin - allowed margin
 * @private
 */ function _isPointInArea(point, area, margin) {
    margin = margin || 0.5; // margin - default is to match rounded decimals
    return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}
function clipArea(ctx, area) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
    ctx.clip();
}
function unclipArea(ctx) {
    ctx.restore();
}
/**
 * @private
 */ function _steppedLineTo(ctx, previous, target, flip, mode) {
    if (!previous) {
        return ctx.lineTo(target.x, target.y);
    }
    if (mode === 'middle') {
        const midpoint = (previous.x + target.x) / 2.0;
        ctx.lineTo(midpoint, previous.y);
        ctx.lineTo(midpoint, target.y);
    } else if (mode === 'after' !== !!flip) {
        ctx.lineTo(previous.x, target.y);
    } else {
        ctx.lineTo(target.x, previous.y);
    }
    ctx.lineTo(target.x, target.y);
}
/**
 * @private
 */ function _bezierCurveTo(ctx, previous, target, flip) {
    if (!previous) {
        return ctx.lineTo(target.x, target.y);
    }
    ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
}
function setRenderOpts(ctx, opts) {
    if (opts.translation) {
        ctx.translate(opts.translation[0], opts.translation[1]);
    }
    if (!isNullOrUndef(opts.rotation)) {
        ctx.rotate(opts.rotation);
    }
    if (opts.color) {
        ctx.fillStyle = opts.color;
    }
    if (opts.textAlign) {
        ctx.textAlign = opts.textAlign;
    }
    if (opts.textBaseline) {
        ctx.textBaseline = opts.textBaseline;
    }
}
function decorateText(ctx, x, y, line, opts) {
    if (opts.strikethrough || opts.underline) {
        /**
     * Now that IE11 support has been dropped, we can use more
     * of the TextMetrics object. The actual bounding boxes
     * are unflagged in Chrome, Firefox, Edge, and Safari so they
     * can be safely used.
     * See https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics#Browser_compatibility
     */ const metrics = ctx.measureText(line);
        const left = x - metrics.actualBoundingBoxLeft;
        const right = x + metrics.actualBoundingBoxRight;
        const top = y - metrics.actualBoundingBoxAscent;
        const bottom = y + metrics.actualBoundingBoxDescent;
        const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.lineWidth = opts.decorationWidth || 2;
        ctx.moveTo(left, yDecoration);
        ctx.lineTo(right, yDecoration);
        ctx.stroke();
    }
}
function drawBackdrop(ctx, opts) {
    const oldColor = ctx.fillStyle;
    ctx.fillStyle = opts.color;
    ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
    ctx.fillStyle = oldColor;
}
/**
 * Render text onto the canvas
 */ function renderText(ctx, text, x, y, font, opts = {}) {
    const lines = isArray(text) ? text : [
        text
    ];
    const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
    let i, line;
    ctx.save();
    ctx.font = font.string;
    setRenderOpts(ctx, opts);
    for(i = 0; i < lines.length; ++i){
        line = lines[i];
        if (opts.backdrop) {
            drawBackdrop(ctx, opts.backdrop);
        }
        if (stroke) {
            if (opts.strokeColor) {
                ctx.strokeStyle = opts.strokeColor;
            }
            if (!isNullOrUndef(opts.strokeWidth)) {
                ctx.lineWidth = opts.strokeWidth;
            }
            ctx.strokeText(line, x, y, opts.maxWidth);
        }
        ctx.fillText(line, x, y, opts.maxWidth);
        decorateText(ctx, x, y, line, opts);
        y += Number(font.lineHeight);
    }
    ctx.restore();
}
/**
 * Add a path of a rectangle with rounded corners to the current sub-path
 * @param ctx - Context
 * @param rect - Bounding rect
 */ function addRoundedRectPath(ctx, rect) {
    const { x , y , w , h , radius  } = rect;
    // top left arc
    ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
    // line from top left to bottom left
    ctx.lineTo(x, y + h - radius.bottomLeft);
    // bottom left arc
    ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
    // line from bottom left to bottom right
    ctx.lineTo(x + w - radius.bottomRight, y + h);
    // bottom right arc
    ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
    // line from bottom right to top right
    ctx.lineTo(x + w, y + radius.topRight);
    // top right arc
    ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
    // line from top right to top left
    ctx.lineTo(x + radius.topLeft, y);
}

const LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
const FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
/**
 * @alias Chart.helpers.options
 * @namespace
 */ /**
 * Converts the given line height `value` in pixels for a specific font `size`.
 * @param value - The lineHeight to parse (eg. 1.6, '14px', '75%', '1.6em').
 * @param size - The font size (in pixels) used to resolve relative `value`.
 * @returns The effective line height in pixels (size * 1.2 if value is invalid).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
 * @since 2.7.0
 */ function toLineHeight(value, size) {
    const matches = ('' + value).match(LINE_HEIGHT);
    if (!matches || matches[1] === 'normal') {
        return size * 1.2;
    }
    value = +matches[2];
    switch(matches[3]){
        case 'px':
            return value;
        case '%':
            value /= 100;
            break;
    }
    return size * value;
}
const numberOrZero = (v)=>+v || 0;
function _readValueToProps(value, props) {
    const ret = {};
    const objProps = isObject(props);
    const keys = objProps ? Object.keys(props) : props;
    const read = isObject(value) ? objProps ? (prop)=>valueOrDefault(value[prop], value[props[prop]]) : (prop)=>value[prop] : ()=>value;
    for (const prop of keys){
        ret[prop] = numberOrZero(read(prop));
    }
    return ret;
}
/**
 * Converts the given value into a TRBL object.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  x / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left)
 * @since 3.0.0
 */ function toTRBL(value) {
    return _readValueToProps(value, {
        top: 'y',
        right: 'x',
        bottom: 'y',
        left: 'x'
    });
}
/**
 * Converts the given value into a TRBL corners object (similar with css border-radius).
 * @param value - If a number, set the value to all TRBL corner components,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 * @returns The TRBL corner values (topLeft, topRight, bottomLeft, bottomRight)
 * @since 3.0.0
 */ function toTRBLCorners(value) {
    return _readValueToProps(value, [
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight'
    ]);
}
/**
 * Converts the given value into a padding object with pre-computed width/height.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  x / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left, width, height)
 * @since 2.7.0
 */ function toPadding(value) {
    const obj = toTRBL(value);
    obj.width = obj.left + obj.right;
    obj.height = obj.top + obj.bottom;
    return obj;
}
/**
 * Parses font options and returns the font object.
 * @param options - A object that contains font options to be parsed.
 * @param fallback - A object that contains fallback font options.
 * @return The font object.
 * @private
 */ function toFont(options, fallback) {
    options = options || {};
    fallback = fallback || defaults.font;
    let size = valueOrDefault(options.size, fallback.size);
    if (typeof size === 'string') {
        size = parseInt(size, 10);
    }
    let style = valueOrDefault(options.style, fallback.style);
    if (style && !('' + style).match(FONT_STYLE)) {
        console.warn('Invalid font style specified: "' + style + '"');
        style = undefined;
    }
    const font = {
        family: valueOrDefault(options.family, fallback.family),
        lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
        size,
        style,
        weight: valueOrDefault(options.weight, fallback.weight),
        string: ''
    };
    font.string = toFontString(font);
    return font;
}
/**
 * Evaluates the given `inputs` sequentially and returns the first defined value.
 * @param inputs - An array of values, falling back to the last value.
 * @param context - If defined and the current value is a function, the value
 * is called with `context` as first argument and the result becomes the new input.
 * @param index - If defined and the current value is an array, the value
 * at `index` become the new input.
 * @param info - object to return information about resolution in
 * @param info.cacheable - Will be set to `false` if option is not cacheable.
 * @since 2.7.0
 */ function resolve(inputs, context, index, info) {
    let i, ilen, value;
    for(i = 0, ilen = inputs.length; i < ilen; ++i){
        value = inputs[i];
        if (value === undefined) {
            continue;
        }
        if (value !== undefined) {
            return value;
        }
    }
}
/**
 * @param minmax
 * @param grace
 * @param beginAtZero
 * @private
 */ function _addGrace(minmax, grace, beginAtZero) {
    const { min , max  } = minmax;
    const change = toDimension(grace, (max - min) / 2);
    const keepZero = (value, add)=>beginAtZero && value === 0 ? 0 : value + add;
    return {
        min: keepZero(min, -Math.abs(change)),
        max: keepZero(max, change)
    };
}
function createContext(parentContext, context) {
    return Object.assign(Object.create(parentContext), context);
}

/**
 * Creates a Proxy for resolving raw values for options.
 * @param scopes - The option scopes to look for values, in resolution order
 * @param prefixes - The prefixes for values, in resolution order.
 * @param rootScopes - The root option scopes
 * @param fallback - Parent scopes fallback
 * @param getTarget - callback for getting the target for changed values
 * @returns Proxy
 * @private
 */ function _createResolver(scopes, prefixes = [
    ''
], rootScopes, fallback, getTarget = ()=>scopes[0]) {
    const finalRootScopes = rootScopes || scopes;
    if (typeof fallback === 'undefined') {
        fallback = _resolve('_fallback', scopes);
    }
    const cache = {
        [Symbol.toStringTag]: 'Object',
        _cacheable: true,
        _scopes: scopes,
        _rootScopes: finalRootScopes,
        _fallback: fallback,
        _getTarget: getTarget,
        override: (scope)=>_createResolver([
                scope,
                ...scopes
            ], prefixes, finalRootScopes, fallback)
    };
    return new Proxy(cache, {
        /**
     * A trap for the delete operator.
     */ deleteProperty (target, prop) {
            delete target[prop]; // remove from cache
            delete target._keys; // remove cached keys
            delete scopes[0][prop]; // remove from top level scope
            return true;
        },
        /**
     * A trap for getting property values.
     */ get (target, prop) {
            return _cached(target, prop, ()=>_resolveWithPrefixes(prop, prefixes, scopes, target));
        },
        /**
     * A trap for Object.getOwnPropertyDescriptor.
     * Also used by Object.hasOwnProperty.
     */ getOwnPropertyDescriptor (target, prop) {
            return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
        },
        /**
     * A trap for Object.getPrototypeOf.
     */ getPrototypeOf () {
            return Reflect.getPrototypeOf(scopes[0]);
        },
        /**
     * A trap for the in operator.
     */ has (target, prop) {
            return getKeysFromAllScopes(target).includes(prop);
        },
        /**
     * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
     */ ownKeys (target) {
            return getKeysFromAllScopes(target);
        },
        /**
     * A trap for setting property values.
     */ set (target, prop, value) {
            const storage = target._storage || (target._storage = getTarget());
            target[prop] = storage[prop] = value; // set to top level scope + cache
            delete target._keys; // remove cached keys
            return true;
        }
    });
}
/**
 * Returns an Proxy for resolving option values with context.
 * @param proxy - The Proxy returned by `_createResolver`
 * @param context - Context object for scriptable/indexable options
 * @param subProxy - The proxy provided for scriptable options
 * @param descriptorDefaults - Defaults for descriptors
 * @private
 */ function _attachContext(proxy, context, subProxy, descriptorDefaults) {
    const cache = {
        _cacheable: false,
        _proxy: proxy,
        _context: context,
        _subProxy: subProxy,
        _stack: new Set(),
        _descriptors: _descriptors(proxy, descriptorDefaults),
        setContext: (ctx)=>_attachContext(proxy, ctx, subProxy, descriptorDefaults),
        override: (scope)=>_attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
    };
    return new Proxy(cache, {
        /**
     * A trap for the delete operator.
     */ deleteProperty (target, prop) {
            delete target[prop]; // remove from cache
            delete proxy[prop]; // remove from proxy
            return true;
        },
        /**
     * A trap for getting property values.
     */ get (target, prop, receiver) {
            return _cached(target, prop, ()=>_resolveWithContext(target, prop, receiver));
        },
        /**
     * A trap for Object.getOwnPropertyDescriptor.
     * Also used by Object.hasOwnProperty.
     */ getOwnPropertyDescriptor (target, prop) {
            return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
                enumerable: true,
                configurable: true
            } : undefined : Reflect.getOwnPropertyDescriptor(proxy, prop);
        },
        /**
     * A trap for Object.getPrototypeOf.
     */ getPrototypeOf () {
            return Reflect.getPrototypeOf(proxy);
        },
        /**
     * A trap for the in operator.
     */ has (target, prop) {
            return Reflect.has(proxy, prop);
        },
        /**
     * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
     */ ownKeys () {
            return Reflect.ownKeys(proxy);
        },
        /**
     * A trap for setting property values.
     */ set (target, prop, value) {
            proxy[prop] = value; // set to proxy
            delete target[prop]; // remove from cache
            return true;
        }
    });
}
/**
 * @private
 */ function _descriptors(proxy, defaults = {
    scriptable: true,
    indexable: true
}) {
    const { _scriptable =defaults.scriptable , _indexable =defaults.indexable , _allKeys =defaults.allKeys  } = proxy;
    return {
        allKeys: _allKeys,
        scriptable: _scriptable,
        indexable: _indexable,
        isScriptable: isFunction(_scriptable) ? _scriptable : ()=>_scriptable,
        isIndexable: isFunction(_indexable) ? _indexable : ()=>_indexable
    };
}
const readKey = (prefix, name)=>prefix ? prefix + _capitalize(name) : name;
const needsSubResolver = (prop, value)=>isObject(value) && prop !== 'adapters' && (Object.getPrototypeOf(value) === null || value.constructor === Object);
function _cached(target, prop, resolve) {
    if (Object.prototype.hasOwnProperty.call(target, prop) || prop === 'constructor') {
        return target[prop];
    }
    const value = resolve();
    // cache the resolved value
    target[prop] = value;
    return value;
}
function _resolveWithContext(target, prop, receiver) {
    const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
    let value = _proxy[prop]; // resolve from proxy
    // resolve with context
    if (isFunction(value) && descriptors.isScriptable(prop)) {
        value = _resolveScriptable(prop, value, target, receiver);
    }
    if (isArray(value) && value.length) {
        value = _resolveArray(prop, value, target, descriptors.isIndexable);
    }
    if (needsSubResolver(prop, value)) {
        // if the resolved value is an object, create a sub resolver for it
        value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
    }
    return value;
}
function _resolveScriptable(prop, getValue, target, receiver) {
    const { _proxy , _context , _subProxy , _stack  } = target;
    if (_stack.has(prop)) {
        throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
    }
    _stack.add(prop);
    let value = getValue(_context, _subProxy || receiver);
    _stack.delete(prop);
    if (needsSubResolver(prop, value)) {
        // When scriptable option returns an object, create a resolver on that.
        value = createSubResolver(_proxy._scopes, _proxy, prop, value);
    }
    return value;
}
function _resolveArray(prop, value, target, isIndexable) {
    const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
    if (typeof _context.index !== 'undefined' && isIndexable(prop)) {
        return value[_context.index % value.length];
    } else if (isObject(value[0])) {
        // Array of objects, return array or resolvers
        const arr = value;
        const scopes = _proxy._scopes.filter((s)=>s !== arr);
        value = [];
        for (const item of arr){
            const resolver = createSubResolver(scopes, _proxy, prop, item);
            value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
        }
    }
    return value;
}
function resolveFallback(fallback, prop, value) {
    return isFunction(fallback) ? fallback(prop, value) : fallback;
}
const getScope = (key, parent)=>key === true ? parent : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
function addScopes(set, parentScopes, key, parentFallback, value) {
    for (const parent of parentScopes){
        const scope = getScope(key, parent);
        if (scope) {
            set.add(scope);
            const fallback = resolveFallback(scope._fallback, key, value);
            if (typeof fallback !== 'undefined' && fallback !== key && fallback !== parentFallback) {
                // When we reach the descriptor that defines a new _fallback, return that.
                // The fallback will resume to that new scope.
                return fallback;
            }
        } else if (scope === false && typeof parentFallback !== 'undefined' && key !== parentFallback) {
            // Fallback to `false` results to `false`, when falling back to different key.
            // For example `interaction` from `hover` or `plugins.tooltip` and `animation` from `animations`
            return null;
        }
    }
    return false;
}
function createSubResolver(parentScopes, resolver, prop, value) {
    const rootScopes = resolver._rootScopes;
    const fallback = resolveFallback(resolver._fallback, prop, value);
    const allScopes = [
        ...parentScopes,
        ...rootScopes
    ];
    const set = new Set();
    set.add(value);
    let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
    if (key === null) {
        return false;
    }
    if (typeof fallback !== 'undefined' && fallback !== prop) {
        key = addScopesFromKey(set, allScopes, fallback, key, value);
        if (key === null) {
            return false;
        }
    }
    return _createResolver(Array.from(set), [
        ''
    ], rootScopes, fallback, ()=>subGetTarget(resolver, prop, value));
}
function addScopesFromKey(set, allScopes, key, fallback, item) {
    while(key){
        key = addScopes(set, allScopes, key, fallback, item);
    }
    return key;
}
function subGetTarget(resolver, prop, value) {
    const parent = resolver._getTarget();
    if (!(prop in parent)) {
        parent[prop] = {};
    }
    const target = parent[prop];
    if (isArray(target) && isObject(value)) {
        // For array of objects, the object is used to store updated values
        return value;
    }
    return target || {};
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
    let value;
    for (const prefix of prefixes){
        value = _resolve(readKey(prefix, prop), scopes);
        if (typeof value !== 'undefined') {
            return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
        }
    }
}
function _resolve(key, scopes) {
    for (const scope of scopes){
        if (!scope) {
            continue;
        }
        const value = scope[key];
        if (typeof value !== 'undefined') {
            return value;
        }
    }
}
function getKeysFromAllScopes(target) {
    let keys = target._keys;
    if (!keys) {
        keys = target._keys = resolveKeysFromAllScopes(target._scopes);
    }
    return keys;
}
function resolveKeysFromAllScopes(scopes) {
    const set = new Set();
    for (const scope of scopes){
        for (const key of Object.keys(scope).filter((k)=>!k.startsWith('_'))){
            set.add(key);
        }
    }
    return Array.from(set);
}

const EPSILON = Number.EPSILON || 1e-14;
const getPoint = (points, i)=>i < points.length && !points[i].skip && points[i];
const getValueAxis = (indexAxis)=>indexAxis === 'x' ? 'y' : 'x';
function splineCurve(firstPoint, middlePoint, afterPoint, t) {
    // Props to Rob Spencer at scaled innovation for his post on splining between points
    // http://scaledinnovation.com/analytics/splines/aboutSplines.html
    // This function must also respect "skipped" points
    const previous = firstPoint.skip ? middlePoint : firstPoint;
    const current = middlePoint;
    const next = afterPoint.skip ? middlePoint : afterPoint;
    const d01 = distanceBetweenPoints(current, previous);
    const d12 = distanceBetweenPoints(next, current);
    let s01 = d01 / (d01 + d12);
    let s12 = d12 / (d01 + d12);
    // If all points are the same, s01 & s02 will be inf
    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;
    const fa = t * s01; // scaling factor for triangle Ta
    const fb = t * s12;
    return {
        previous: {
            x: current.x - fa * (next.x - previous.x),
            y: current.y - fa * (next.y - previous.y)
        },
        next: {
            x: current.x + fb * (next.x - previous.x),
            y: current.y + fb * (next.y - previous.y)
        }
    };
}
/**
 * Adjust tangents to ensure monotonic properties
 */ function monotoneAdjust(points, deltaK, mK) {
    const pointsLen = points.length;
    let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(let i = 0; i < pointsLen - 1; ++i){
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent || !pointAfter) {
            continue;
        }
        if (almostEquals(deltaK[i], 0, EPSILON)) {
            mK[i] = mK[i + 1] = 0;
            continue;
        }
        alphaK = mK[i] / deltaK[i];
        betaK = mK[i + 1] / deltaK[i];
        squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
        if (squaredMagnitude <= 9) {
            continue;
        }
        tauK = 3 / Math.sqrt(squaredMagnitude);
        mK[i] = alphaK * tauK * deltaK[i];
        mK[i + 1] = betaK * tauK * deltaK[i];
    }
}
function monotoneCompute(points, mK, indexAxis = 'x') {
    const valueAxis = getValueAxis(indexAxis);
    const pointsLen = points.length;
    let delta, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(let i = 0; i < pointsLen; ++i){
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
            continue;
        }
        const iPixel = pointCurrent[indexAxis];
        const vPixel = pointCurrent[valueAxis];
        if (pointBefore) {
            delta = (iPixel - pointBefore[indexAxis]) / 3;
            pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
            pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
        }
        if (pointAfter) {
            delta = (pointAfter[indexAxis] - iPixel) / 3;
            pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
            pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
        }
    }
}
/**
 * This function calculates Bézier control points in a similar way than |splineCurve|,
 * but preserves monotonicity of the provided data and ensures no local extremums are added
 * between the dataset discrete points due to the interpolation.
 * See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
 */ function splineCurveMonotone(points, indexAxis = 'x') {
    const valueAxis = getValueAxis(indexAxis);
    const pointsLen = points.length;
    const deltaK = Array(pointsLen).fill(0);
    const mK = Array(pointsLen);
    // Calculate slopes (deltaK) and initialize tangents (mK)
    let i, pointBefore, pointCurrent;
    let pointAfter = getPoint(points, 0);
    for(i = 0; i < pointsLen; ++i){
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
            continue;
        }
        if (pointAfter) {
            const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
            // In the case of two points that appear at the same x pixel, slopeDeltaX is 0
            deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
        }
        mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
    }
    monotoneAdjust(points, deltaK, mK);
    monotoneCompute(points, mK, indexAxis);
}
function capControlPoint(pt, min, max) {
    return Math.max(Math.min(pt, max), min);
}
function capBezierPoints(points, area) {
    let i, ilen, point, inArea, inAreaPrev;
    let inAreaNext = _isPointInArea(points[0], area);
    for(i = 0, ilen = points.length; i < ilen; ++i){
        inAreaPrev = inArea;
        inArea = inAreaNext;
        inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
        if (!inArea) {
            continue;
        }
        point = points[i];
        if (inAreaPrev) {
            point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
            point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
        }
        if (inAreaNext) {
            point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
            point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
        }
    }
}
/**
 * @private
 */ function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
    let i, ilen, point, controlPoints;
    // Only consider points that are drawn in case the spanGaps option is used
    if (options.spanGaps) {
        points = points.filter((pt)=>!pt.skip);
    }
    if (options.cubicInterpolationMode === 'monotone') {
        splineCurveMonotone(points, indexAxis);
    } else {
        let prev = loop ? points[points.length - 1] : points[0];
        for(i = 0, ilen = points.length; i < ilen; ++i){
            point = points[i];
            controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
            point.cp1x = controlPoints.previous.x;
            point.cp1y = controlPoints.previous.y;
            point.cp2x = controlPoints.next.x;
            point.cp2y = controlPoints.next.y;
            prev = point;
        }
    }
    if (options.capBezierPoints) {
        capBezierPoints(points, area);
    }
}

/**
 * @private
 */ function _isDomSupported() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * @private
 */ function _getParentNode(domNode) {
    let parent = domNode.parentNode;
    if (parent && parent.toString() === '[object ShadowRoot]') {
        parent = parent.host;
    }
    return parent;
}
/**
 * convert max-width/max-height values that may be percentages into a number
 * @private
 */ function parseMaxStyle(styleValue, node, parentProperty) {
    let valueInPixels;
    if (typeof styleValue === 'string') {
        valueInPixels = parseInt(styleValue, 10);
        if (styleValue.indexOf('%') !== -1) {
            // percentage * size in dimension
            valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
        }
    } else {
        valueInPixels = styleValue;
    }
    return valueInPixels;
}
const getComputedStyle$1 = (element)=>element.ownerDocument.defaultView.getComputedStyle(element, null);
function getStyle(el, property) {
    return getComputedStyle$1(el).getPropertyValue(property);
}
const positions = [
    'top',
    'right',
    'bottom',
    'left'
];
function getPositionedStyle(styles, style, suffix) {
    const result = {};
    suffix = suffix ? '-' + suffix : '';
    for(let i = 0; i < 4; i++){
        const pos = positions[i];
        result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
    }
    result.width = result.left + result.right;
    result.height = result.top + result.bottom;
    return result;
}
const useOffsetPos = (x, y, target)=>(x > 0 || y > 0) && (!target || !target.shadowRoot);
/**
 * @param e
 * @param canvas
 * @returns Canvas position
 */ function getCanvasPosition(e, canvas) {
    const touches = e.touches;
    const source = touches && touches.length ? touches[0] : e;
    const { offsetX , offsetY  } = source;
    let box = false;
    let x, y;
    if (useOffsetPos(offsetX, offsetY, e.target)) {
        x = offsetX;
        y = offsetY;
    } else {
        const rect = canvas.getBoundingClientRect();
        x = source.clientX - rect.left;
        y = source.clientY - rect.top;
        box = true;
    }
    return {
        x,
        y,
        box
    };
}
/**
 * Gets an event's x, y coordinates, relative to the chart area
 * @param event
 * @param chart
 * @returns x and y coordinates of the event
 */ function getRelativePosition(event, chart) {
    if ('native' in event) {
        return event;
    }
    const { canvas , currentDevicePixelRatio  } = chart;
    const style = getComputedStyle$1(canvas);
    const borderBox = style.boxSizing === 'border-box';
    const paddings = getPositionedStyle(style, 'padding');
    const borders = getPositionedStyle(style, 'border', 'width');
    const { x , y , box  } = getCanvasPosition(event, canvas);
    const xOffset = paddings.left + (box && borders.left);
    const yOffset = paddings.top + (box && borders.top);
    let { width , height  } = chart;
    if (borderBox) {
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
    }
    return {
        x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
        y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
    };
}
function getContainerSize(canvas, width, height) {
    let maxWidth, maxHeight;
    if (width === undefined || height === undefined) {
        const container = canvas && _getParentNode(canvas);
        if (!container) {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
        } else {
            const rect = container.getBoundingClientRect(); // this is the border box of the container
            const containerStyle = getComputedStyle$1(container);
            const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
            const containerPadding = getPositionedStyle(containerStyle, 'padding');
            width = rect.width - containerPadding.width - containerBorder.width;
            height = rect.height - containerPadding.height - containerBorder.height;
            maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
            maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
        }
    }
    return {
        width,
        height,
        maxWidth: maxWidth || INFINITY,
        maxHeight: maxHeight || INFINITY
    };
}
const round1 = (v)=>Math.round(v * 10) / 10;
// eslint-disable-next-line complexity
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
    const style = getComputedStyle$1(canvas);
    const margins = getPositionedStyle(style, 'margin');
    const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
    const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
    const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
    let { width , height  } = containerSize;
    if (style.boxSizing === 'content-box') {
        const borders = getPositionedStyle(style, 'border', 'width');
        const paddings = getPositionedStyle(style, 'padding');
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
    }
    width = Math.max(0, width - margins.width);
    height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
    width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
    height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
    if (width && !height) {
        // https://github.com/chartjs/Chart.js/issues/4659
        // If the canvas has width, but no height, default to aspectRatio of 2 (canvas default)
        height = round1(width / 2);
    }
    const maintainHeight = bbWidth !== undefined || bbHeight !== undefined;
    if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
        height = containerSize.height;
        width = round1(Math.floor(height * aspectRatio));
    }
    return {
        width,
        height
    };
}
/**
 * @param chart
 * @param forceRatio
 * @param forceStyle
 * @returns True if the canvas context size or transformation has changed.
 */ function retinaScale(chart, forceRatio, forceStyle) {
    const pixelRatio = forceRatio || 1;
    const deviceHeight = Math.floor(chart.height * pixelRatio);
    const deviceWidth = Math.floor(chart.width * pixelRatio);
    chart.height = Math.floor(chart.height);
    chart.width = Math.floor(chart.width);
    const canvas = chart.canvas;
    // If no style has been set on the canvas, the render size is used as display size,
    // making the chart visually bigger, so let's enforce it to the "correct" values.
    // See https://github.com/chartjs/Chart.js/issues/3575
    if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
        canvas.style.height = `${chart.height}px`;
        canvas.style.width = `${chart.width}px`;
    }
    if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
        chart.currentDevicePixelRatio = pixelRatio;
        canvas.height = deviceHeight;
        canvas.width = deviceWidth;
        chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        return true;
    }
    return false;
}
/**
 * Detects support for options object argument in addEventListener.
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
 * @private
 */ const supportsEventListenerOptions = function() {
    let passiveSupported = false;
    try {
        const options = {
            get passive () {
                passiveSupported = true;
                return false;
            }
        };
        if (_isDomSupported()) {
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        }
    } catch (e) {
    // continue regardless of error
    }
    return passiveSupported;
}();
/**
 * The "used" size is the final value of a dimension property after all calculations have
 * been performed. This method uses the computed style of `element` but returns undefined
 * if the computed style is not expressed in pixels. That can happen in some cases where
 * `element` has a size relative to its parent and this last one is not yet displayed,
 * for example because of `display: none` on a parent node.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
 * @returns Size in pixels or undefined if unknown.
 */ function readUsedSize(element, property) {
    const value = getStyle(element, property);
    const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
    return matches ? +matches[1] : undefined;
}

/**
 * @private
 */ function _pointInLine(p1, p2, t, mode) {
    return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
    };
}
/**
 * @private
 */ function _steppedInterpolation(p1, p2, t, mode) {
    return {
        x: p1.x + t * (p2.x - p1.x),
        y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y : mode === 'after' ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
    };
}
/**
 * @private
 */ function _bezierInterpolation(p1, p2, t, mode) {
    const cp1 = {
        x: p1.cp2x,
        y: p1.cp2y
    };
    const cp2 = {
        x: p2.cp1x,
        y: p2.cp1y
    };
    const a = _pointInLine(p1, cp1, t);
    const b = _pointInLine(cp1, cp2, t);
    const c = _pointInLine(cp2, p2, t);
    const d = _pointInLine(a, b, t);
    const e = _pointInLine(b, c, t);
    return _pointInLine(d, e, t);
}

const getRightToLeftAdapter = function(rectX, width) {
    return {
        x (x) {
            return rectX + rectX + width - x;
        },
        setWidth (w) {
            width = w;
        },
        textAlign (align) {
            if (align === 'center') {
                return align;
            }
            return align === 'right' ? 'left' : 'right';
        },
        xPlus (x, value) {
            return x - value;
        },
        leftForLtr (x, itemWidth) {
            return x - itemWidth;
        }
    };
};
const getLeftToRightAdapter = function() {
    return {
        x (x) {
            return x;
        },
        setWidth (w) {},
        textAlign (align) {
            return align;
        },
        xPlus (x, value) {
            return x + value;
        },
        leftForLtr (x, _itemWidth) {
            return x;
        }
    };
};
function getRtlAdapter(rtl, rectX, width) {
    return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTextDirection(ctx, direction) {
    let style, original;
    if (direction === 'ltr' || direction === 'rtl') {
        style = ctx.canvas.style;
        original = [
            style.getPropertyValue('direction'),
            style.getPropertyPriority('direction')
        ];
        style.setProperty('direction', direction, 'important');
        ctx.prevTextDirection = original;
    }
}
function restoreTextDirection(ctx, original) {
    if (original !== undefined) {
        delete ctx.prevTextDirection;
        ctx.canvas.style.setProperty('direction', original[0], original[1]);
    }
}

function propertyFn(property) {
    if (property === 'angle') {
        return {
            between: _angleBetween,
            compare: _angleDiff,
            normalize: _normalizeAngle
        };
    }
    return {
        between: _isBetween,
        compare: (a, b)=>a - b,
        normalize: (x)=>x
    };
}
function normalizeSegment({ start , end , count , loop , style  }) {
    return {
        start: start % count,
        end: end % count,
        loop: loop && (end - start + 1) % count === 0,
        style
    };
}
function getSegment(segment, points, bounds) {
    const { property , start: startBound , end: endBound  } = bounds;
    const { between , normalize  } = propertyFn(property);
    const count = points.length;
    let { start , end , loop  } = segment;
    let i, ilen;
    if (loop) {
        start += count;
        end += count;
        for(i = 0, ilen = count; i < ilen; ++i){
            if (!between(normalize(points[start % count][property]), startBound, endBound)) {
                break;
            }
            start--;
            end--;
        }
        start %= count;
        end %= count;
    }
    if (end < start) {
        end += count;
    }
    return {
        start,
        end,
        loop,
        style: segment.style
    };
}
 function _boundSegment(segment, points, bounds) {
    if (!bounds) {
        return [
            segment
        ];
    }
    const { property , start: startBound , end: endBound  } = bounds;
    const count = points.length;
    const { compare , between , normalize  } = propertyFn(property);
    const { start , end , loop , style  } = getSegment(segment, points, bounds);
    const result = [];
    let inside = false;
    let subStart = null;
    let value, point, prevValue;
    const startIsBefore = ()=>between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
    const endIsBefore = ()=>compare(endBound, value) === 0 || between(endBound, prevValue, value);
    const shouldStart = ()=>inside || startIsBefore();
    const shouldStop = ()=>!inside || endIsBefore();
    for(let i = start, prev = start; i <= end; ++i){
        point = points[i % count];
        if (point.skip) {
            continue;
        }
        value = normalize(point[property]);
        if (value === prevValue) {
            continue;
        }
        inside = between(value, startBound, endBound);
        if (subStart === null && shouldStart()) {
            subStart = compare(value, startBound) === 0 ? i : prev;
        }
        if (subStart !== null && shouldStop()) {
            result.push(normalizeSegment({
                start: subStart,
                end: i,
                loop,
                count,
                style
            }));
            subStart = null;
        }
        prev = i;
        prevValue = value;
    }
    if (subStart !== null) {
        result.push(normalizeSegment({
            start: subStart,
            end,
            loop,
            count,
            style
        }));
    }
    return result;
}
 function _boundSegments(line, bounds) {
    const result = [];
    const segments = line.segments;
    for(let i = 0; i < segments.length; i++){
        const sub = _boundSegment(segments[i], line.points, bounds);
        if (sub.length) {
            result.push(...sub);
        }
    }
    return result;
}
 function findStartAndEnd(points, count, loop, spanGaps) {
    let start = 0;
    let end = count - 1;
    if (loop && !spanGaps) {
        while(start < count && !points[start].skip){
            start++;
        }
    }
    while(start < count && points[start].skip){
        start++;
    }
    start %= count;
    if (loop) {
        end += start;
    }
    while(end > start && points[end % count].skip){
        end--;
    }
    end %= count;
    return {
        start,
        end
    };
}
 function solidSegments(points, start, max, loop) {
    const count = points.length;
    const result = [];
    let last = start;
    let prev = points[start];
    let end;
    for(end = start + 1; end <= max; ++end){
        const cur = points[end % count];
        if (cur.skip || cur.stop) {
            if (!prev.skip) {
                loop = false;
                result.push({
                    start: start % count,
                    end: (end - 1) % count,
                    loop
                });
                start = last = cur.stop ? end : null;
            }
        } else {
            last = end;
            if (prev.skip) {
                start = end;
            }
        }
        prev = cur;
    }
    if (last !== null) {
        result.push({
            start: start % count,
            end: last % count,
            loop
        });
    }
    return result;
}
 function _computeSegments(line, segmentOptions) {
    const points = line.points;
    const spanGaps = line.options.spanGaps;
    const count = points.length;
    if (!count) {
        return [];
    }
    const loop = !!line._loop;
    const { start , end  } = findStartAndEnd(points, count, loop, spanGaps);
    if (spanGaps === true) {
        return splitByStyles(line, [
            {
                start,
                end,
                loop
            }
        ], points, segmentOptions);
    }
    const max = end < start ? end + count : end;
    const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
    return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
}
 function splitByStyles(line, segments, points, segmentOptions) {
    if (!segmentOptions || !segmentOptions.setContext || !points) {
        return segments;
    }
    return doSplitByStyles(line, segments, points, segmentOptions);
}
 function doSplitByStyles(line, segments, points, segmentOptions) {
    const chartContext = line._chart.getContext();
    const baseStyle = readStyle(line.options);
    const { _datasetIndex: datasetIndex , options: { spanGaps  }  } = line;
    const count = points.length;
    const result = [];
    let prevStyle = baseStyle;
    let start = segments[0].start;
    let i = start;
    function addStyle(s, e, l, st) {
        const dir = spanGaps ? -1 : 1;
        if (s === e) {
            return;
        }
        s += count;
        while(points[s % count].skip){
            s -= dir;
        }
        while(points[e % count].skip){
            e += dir;
        }
        if (s % count !== e % count) {
            result.push({
                start: s % count,
                end: e % count,
                loop: l,
                style: st
            });
            prevStyle = st;
            start = e % count;
        }
    }
    for (const segment of segments){
        start = spanGaps ? start : segment.start;
        let prev = points[start % count];
        let style;
        for(i = start + 1; i <= segment.end; i++){
            const pt = points[i % count];
            style = readStyle(segmentOptions.setContext(createContext(chartContext, {
                type: 'segment',
                p0: prev,
                p1: pt,
                p0DataIndex: (i - 1) % count,
                p1DataIndex: i % count,
                datasetIndex
            })));
            if (styleChanged(style, prevStyle)) {
                addStyle(start, i - 1, segment.loop, prevStyle);
            }
            prev = pt;
            prevStyle = style;
        }
        if (start < i - 1) {
            addStyle(start, i - 1, segment.loop, prevStyle);
        }
    }
    return result;
}
function readStyle(options) {
    return {
        backgroundColor: options.backgroundColor,
        borderCapStyle: options.borderCapStyle,
        borderDash: options.borderDash,
        borderDashOffset: options.borderDashOffset,
        borderJoinStyle: options.borderJoinStyle,
        borderWidth: options.borderWidth,
        borderColor: options.borderColor
    };
}
function styleChanged(style, prevStyle) {
    if (!prevStyle) {
        return false;
    }
    const cache = [];
    const replacer = function(key, value) {
        if (!isPatternOrGradient(value)) {
            return value;
        }
        if (!cache.includes(value)) {
            cache.push(value);
        }
        return cache.indexOf(value);
    };
    return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
}

function getSizeForArea(scale, chartArea, field) {
    return scale.options.clip ? scale[field] : chartArea[field];
}
function getDatasetArea(meta, chartArea) {
    const { xScale , yScale  } = meta;
    if (xScale && yScale) {
        return {
            left: getSizeForArea(xScale, chartArea, 'left'),
            right: getSizeForArea(xScale, chartArea, 'right'),
            top: getSizeForArea(yScale, chartArea, 'top'),
            bottom: getSizeForArea(yScale, chartArea, 'bottom')
        };
    }
    return chartArea;
}
function getDatasetClipArea(chart, meta) {
    const clip = meta._clip;
    if (clip.disabled) {
        return false;
    }
    const area = getDatasetArea(meta, chart.chartArea);
    return {
        left: clip.left === false ? 0 : area.left - (clip.left === true ? 0 : clip.left),
        right: clip.right === false ? chart.width : area.right + (clip.right === true ? 0 : clip.right),
        top: clip.top === false ? 0 : area.top - (clip.top === true ? 0 : clip.top),
        bottom: clip.bottom === false ? chart.height : area.bottom + (clip.bottom === true ? 0 : clip.bottom)
    };
}

/*!
 * Chart.js v4.4.9
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */

class Animator {
    constructor(){
        this._request = null;
        this._charts = new Map();
        this._running = false;
        this._lastDate = undefined;
    }
 _notify(chart, anims, date, type) {
        const callbacks = anims.listeners[type];
        const numSteps = anims.duration;
        callbacks.forEach((fn)=>fn({
                chart,
                initial: anims.initial,
                numSteps,
                currentStep: Math.min(date - anims.start, numSteps)
            }));
    }
 _refresh() {
        if (this._request) {
            return;
        }
        this._running = true;
        this._request = requestAnimFrame.call(window, ()=>{
            this._update();
            this._request = null;
            if (this._running) {
                this._refresh();
            }
        });
    }
 _update(date = Date.now()) {
        let remaining = 0;
        this._charts.forEach((anims, chart)=>{
            if (!anims.running || !anims.items.length) {
                return;
            }
            const items = anims.items;
            let i = items.length - 1;
            let draw = false;
            let item;
            for(; i >= 0; --i){
                item = items[i];
                if (item._active) {
                    if (item._total > anims.duration) {
                        anims.duration = item._total;
                    }
                    item.tick(date);
                    draw = true;
                } else {
                    items[i] = items[items.length - 1];
                    items.pop();
                }
            }
            if (draw) {
                chart.draw();
                this._notify(chart, anims, date, 'progress');
            }
            if (!items.length) {
                anims.running = false;
                this._notify(chart, anims, date, 'complete');
                anims.initial = false;
            }
            remaining += items.length;
        });
        this._lastDate = date;
        if (remaining === 0) {
            this._running = false;
        }
    }
 _getAnims(chart) {
        const charts = this._charts;
        let anims = charts.get(chart);
        if (!anims) {
            anims = {
                running: false,
                initial: true,
                items: [],
                listeners: {
                    complete: [],
                    progress: []
                }
            };
            charts.set(chart, anims);
        }
        return anims;
    }
 listen(chart, event, cb) {
        this._getAnims(chart).listeners[event].push(cb);
    }
 add(chart, items) {
        if (!items || !items.length) {
            return;
        }
        this._getAnims(chart).items.push(...items);
    }
 has(chart) {
        return this._getAnims(chart).items.length > 0;
    }
 start(chart) {
        const anims = this._charts.get(chart);
        if (!anims) {
            return;
        }
        anims.running = true;
        anims.start = Date.now();
        anims.duration = anims.items.reduce((acc, cur)=>Math.max(acc, cur._duration), 0);
        this._refresh();
    }
    running(chart) {
        if (!this._running) {
            return false;
        }
        const anims = this._charts.get(chart);
        if (!anims || !anims.running || !anims.items.length) {
            return false;
        }
        return true;
    }
 stop(chart) {
        const anims = this._charts.get(chart);
        if (!anims || !anims.items.length) {
            return;
        }
        const items = anims.items;
        let i = items.length - 1;
        for(; i >= 0; --i){
            items[i].cancel();
        }
        anims.items = [];
        this._notify(chart, anims, Date.now(), 'complete');
    }
 remove(chart) {
        return this._charts.delete(chart);
    }
}
var animator = /* #__PURE__ */ new Animator();

const transparent = 'transparent';
const interpolators = {
    boolean (from, to, factor) {
        return factor > 0.5 ? to : from;
    },
 color (from, to, factor) {
        const c0 = color(from || transparent);
        const c1 = c0.valid && color(to || transparent);
        return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
    },
    number (from, to, factor) {
        return from + (to - from) * factor;
    }
};
class Animation {
    constructor(cfg, target, prop, to){
        const currentValue = target[prop];
        to = resolve([
            cfg.to,
            to,
            currentValue,
            cfg.from
        ]);
        const from = resolve([
            cfg.from,
            currentValue,
            to
        ]);
        this._active = true;
        this._fn = cfg.fn || interpolators[cfg.type || typeof from];
        this._easing = effects[cfg.easing] || effects.linear;
        this._start = Math.floor(Date.now() + (cfg.delay || 0));
        this._duration = this._total = Math.floor(cfg.duration);
        this._loop = !!cfg.loop;
        this._target = target;
        this._prop = prop;
        this._from = from;
        this._to = to;
        this._promises = undefined;
    }
    active() {
        return this._active;
    }
    update(cfg, to, date) {
        if (this._active) {
            this._notify(false);
            const currentValue = this._target[this._prop];
            const elapsed = date - this._start;
            const remain = this._duration - elapsed;
            this._start = date;
            this._duration = Math.floor(Math.max(remain, cfg.duration));
            this._total += elapsed;
            this._loop = !!cfg.loop;
            this._to = resolve([
                cfg.to,
                to,
                currentValue,
                cfg.from
            ]);
            this._from = resolve([
                cfg.from,
                currentValue,
                to
            ]);
        }
    }
    cancel() {
        if (this._active) {
            this.tick(Date.now());
            this._active = false;
            this._notify(false);
        }
    }
    tick(date) {
        const elapsed = date - this._start;
        const duration = this._duration;
        const prop = this._prop;
        const from = this._from;
        const loop = this._loop;
        const to = this._to;
        let factor;
        this._active = from !== to && (loop || elapsed < duration);
        if (!this._active) {
            this._target[prop] = to;
            this._notify(true);
            return;
        }
        if (elapsed < 0) {
            this._target[prop] = from;
            return;
        }
        factor = elapsed / duration % 2;
        factor = loop && factor > 1 ? 2 - factor : factor;
        factor = this._easing(Math.min(1, Math.max(0, factor)));
        this._target[prop] = this._fn(from, to, factor);
    }
    wait() {
        const promises = this._promises || (this._promises = []);
        return new Promise((res, rej)=>{
            promises.push({
                res,
                rej
            });
        });
    }
    _notify(resolved) {
        const method = resolved ? 'res' : 'rej';
        const promises = this._promises || [];
        for(let i = 0; i < promises.length; i++){
            promises[i][method]();
        }
    }
}

class Animations {
    constructor(chart, config){
        this._chart = chart;
        this._properties = new Map();
        this.configure(config);
    }
    configure(config) {
        if (!isObject(config)) {
            return;
        }
        const animationOptions = Object.keys(defaults.animation);
        const animatedProps = this._properties;
        Object.getOwnPropertyNames(config).forEach((key)=>{
            const cfg = config[key];
            if (!isObject(cfg)) {
                return;
            }
            const resolved = {};
            for (const option of animationOptions){
                resolved[option] = cfg[option];
            }
            (isArray(cfg.properties) && cfg.properties || [
                key
            ]).forEach((prop)=>{
                if (prop === key || !animatedProps.has(prop)) {
                    animatedProps.set(prop, resolved);
                }
            });
        });
    }
 _animateOptions(target, values) {
        const newOptions = values.options;
        const options = resolveTargetOptions(target, newOptions);
        if (!options) {
            return [];
        }
        const animations = this._createAnimations(options, newOptions);
        if (newOptions.$shared) {
            awaitAll(target.options.$animations, newOptions).then(()=>{
                target.options = newOptions;
            }, ()=>{
            });
        }
        return animations;
    }
 _createAnimations(target, values) {
        const animatedProps = this._properties;
        const animations = [];
        const running = target.$animations || (target.$animations = {});
        const props = Object.keys(values);
        const date = Date.now();
        let i;
        for(i = props.length - 1; i >= 0; --i){
            const prop = props[i];
            if (prop.charAt(0) === '$') {
                continue;
            }
            if (prop === 'options') {
                animations.push(...this._animateOptions(target, values));
                continue;
            }
            const value = values[prop];
            let animation = running[prop];
            const cfg = animatedProps.get(prop);
            if (animation) {
                if (cfg && animation.active()) {
                    animation.update(cfg, value, date);
                    continue;
                } else {
                    animation.cancel();
                }
            }
            if (!cfg || !cfg.duration) {
                target[prop] = value;
                continue;
            }
            running[prop] = animation = new Animation(cfg, target, prop, value);
            animations.push(animation);
        }
        return animations;
    }
 update(target, values) {
        if (this._properties.size === 0) {
            Object.assign(target, values);
            return;
        }
        const animations = this._createAnimations(target, values);
        if (animations.length) {
            animator.add(this._chart, animations);
            return true;
        }
    }
}
function awaitAll(animations, properties) {
    const running = [];
    const keys = Object.keys(properties);
    for(let i = 0; i < keys.length; i++){
        const anim = animations[keys[i]];
        if (anim && anim.active()) {
            running.push(anim.wait());
        }
    }
    return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
    if (!newOptions) {
        return;
    }
    let options = target.options;
    if (!options) {
        target.options = newOptions;
        return;
    }
    if (options.$shared) {
        target.options = options = Object.assign({}, options, {
            $shared: false,
            $animations: {}
        });
    }
    return options;
}

function scaleClip(scale, allowedOverflow) {
    const opts = scale && scale.options || {};
    const reverse = opts.reverse;
    const min = opts.min === undefined ? allowedOverflow : 0;
    const max = opts.max === undefined ? allowedOverflow : 0;
    return {
        start: reverse ? max : min,
        end: reverse ? min : max
    };
}
function defaultClip(xScale, yScale, allowedOverflow) {
    if (allowedOverflow === false) {
        return false;
    }
    const x = scaleClip(xScale, allowedOverflow);
    const y = scaleClip(yScale, allowedOverflow);
    return {
        top: y.end,
        right: x.end,
        bottom: y.start,
        left: x.start
    };
}
function toClip(value) {
    let t, r, b, l;
    if (isObject(value)) {
        t = value.top;
        r = value.right;
        b = value.bottom;
        l = value.left;
    } else {
        t = r = b = l = value;
    }
    return {
        top: t,
        right: r,
        bottom: b,
        left: l,
        disabled: value === false
    };
}
function getSortedDatasetIndices(chart, filterVisible) {
    const keys = [];
    const metasets = chart._getSortedDatasetMetas(filterVisible);
    let i, ilen;
    for(i = 0, ilen = metasets.length; i < ilen; ++i){
        keys.push(metasets[i].index);
    }
    return keys;
}
function applyStack(stack, value, dsIndex, options = {}) {
    const keys = stack.keys;
    const singleMode = options.mode === 'single';
    let i, ilen, datasetIndex, otherValue;
    if (value === null) {
        return;
    }
    let found = false;
    for(i = 0, ilen = keys.length; i < ilen; ++i){
        datasetIndex = +keys[i];
        if (datasetIndex === dsIndex) {
            found = true;
            if (options.all) {
                continue;
            }
            break;
        }
        otherValue = stack.values[datasetIndex];
        if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
            value += otherValue;
        }
    }
    if (!found && !options.all) {
        return 0;
    }
    return value;
}
function convertObjectDataToArray(data, meta) {
    const { iScale , vScale  } = meta;
    const iAxisKey = iScale.axis === 'x' ? 'x' : 'y';
    const vAxisKey = vScale.axis === 'x' ? 'x' : 'y';
    const keys = Object.keys(data);
    const adata = new Array(keys.length);
    let i, ilen, key;
    for(i = 0, ilen = keys.length; i < ilen; ++i){
        key = keys[i];
        adata[i] = {
            [iAxisKey]: key,
            [vAxisKey]: data[key]
        };
    }
    return adata;
}
function isStacked(scale, meta) {
    const stacked = scale && scale.options.stacked;
    return stacked || stacked === undefined && meta.stack !== undefined;
}
function getStackKey(indexScale, valueScale, meta) {
    return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
    const { min , max , minDefined , maxDefined  } = scale.getUserBounds();
    return {
        min: minDefined ? min : Number.NEGATIVE_INFINITY,
        max: maxDefined ? max : Number.POSITIVE_INFINITY
    };
}
function getOrCreateStack(stacks, stackKey, indexValue) {
    const subStack = stacks[stackKey] || (stacks[stackKey] = {});
    return subStack[indexValue] || (subStack[indexValue] = {});
}
function getLastIndexInStack(stack, vScale, positive, type) {
    for (const meta of vScale.getMatchingVisibleMetas(type).reverse()){
        const value = stack[meta.index];
        if (positive && value > 0 || !positive && value < 0) {
            return meta.index;
        }
    }
    return null;
}
function updateStacks(controller, parsed) {
    const { chart , _cachedMeta: meta  } = controller;
    const stacks = chart._stacks || (chart._stacks = {});
    const { iScale , vScale , index: datasetIndex  } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const key = getStackKey(iScale, vScale, meta);
    const ilen = parsed.length;
    let stack;
    for(let i = 0; i < ilen; ++i){
        const item = parsed[i];
        const { [iAxis]: index , [vAxis]: value  } = item;
        const itemStacks = item._stacks || (item._stacks = {});
        stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
        stack[datasetIndex] = value;
        stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
        stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
        const visualValues = stack._visualValues || (stack._visualValues = {});
        visualValues[datasetIndex] = value;
    }
}
function getFirstScaleId(chart, axis) {
    const scales = chart.scales;
    return Object.keys(scales).filter((key)=>scales[key].axis === axis).shift();
}
function createDatasetContext(parent, index) {
    return createContext(parent, {
        active: false,
        dataset: undefined,
        datasetIndex: index,
        index,
        mode: 'default',
        type: 'dataset'
    });
}
function createDataContext(parent, index, element) {
    return createContext(parent, {
        active: false,
        dataIndex: index,
        parsed: undefined,
        raw: undefined,
        element,
        index,
        mode: 'default',
        type: 'data'
    });
}
function clearStacks(meta, items) {
    const datasetIndex = meta.controller.index;
    const axis = meta.vScale && meta.vScale.axis;
    if (!axis) {
        return;
    }
    items = items || meta._parsed;
    for (const parsed of items){
        const stacks = parsed._stacks;
        if (!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
            return;
        }
        delete stacks[axis][datasetIndex];
        if (stacks[axis]._visualValues !== undefined && stacks[axis]._visualValues[datasetIndex] !== undefined) {
            delete stacks[axis]._visualValues[datasetIndex];
        }
    }
}
const isDirectUpdateMode = (mode)=>mode === 'reset' || mode === 'none';
const cloneIfNotShared = (cached, shared)=>shared ? cached : Object.assign({}, cached);
const createStack = (canStack, meta, chart)=>canStack && !meta.hidden && meta._stacked && {
        keys: getSortedDatasetIndices(chart, true),
        values: null
    };
class DatasetController {
 static defaults = {};
 static datasetElementType = null;
 static dataElementType = null;
 constructor(chart, datasetIndex){
        this.chart = chart;
        this._ctx = chart.ctx;
        this.index = datasetIndex;
        this._cachedDataOpts = {};
        this._cachedMeta = this.getMeta();
        this._type = this._cachedMeta.type;
        this.options = undefined;
         this._parsing = false;
        this._data = undefined;
        this._objectData = undefined;
        this._sharedOptions = undefined;
        this._drawStart = undefined;
        this._drawCount = undefined;
        this.enableOptionSharing = false;
        this.supportsDecimation = false;
        this.$context = undefined;
        this._syncList = [];
        this.datasetElementType = new.target.datasetElementType;
        this.dataElementType = new.target.dataElementType;
        this.initialize();
    }
    initialize() {
        const meta = this._cachedMeta;
        this.configure();
        this.linkScales();
        meta._stacked = isStacked(meta.vScale, meta);
        this.addElements();
        if (this.options.fill && !this.chart.isPluginEnabled('filler')) {
            console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
        }
    }
    updateIndex(datasetIndex) {
        if (this.index !== datasetIndex) {
            clearStacks(this._cachedMeta);
        }
        this.index = datasetIndex;
    }
    linkScales() {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        const chooseId = (axis, x, y, r)=>axis === 'x' ? x : axis === 'r' ? r : y;
        const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
        const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
        const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
        const indexAxis = meta.indexAxis;
        const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
        const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
        meta.xScale = this.getScaleForId(xid);
        meta.yScale = this.getScaleForId(yid);
        meta.rScale = this.getScaleForId(rid);
        meta.iScale = this.getScaleForId(iid);
        meta.vScale = this.getScaleForId(vid);
    }
    getDataset() {
        return this.chart.data.datasets[this.index];
    }
    getMeta() {
        return this.chart.getDatasetMeta(this.index);
    }
 getScaleForId(scaleID) {
        return this.chart.scales[scaleID];
    }
 _getOtherScale(scale) {
        const meta = this._cachedMeta;
        return scale === meta.iScale ? meta.vScale : meta.iScale;
    }
    reset() {
        this._update('reset');
    }
 _destroy() {
        const meta = this._cachedMeta;
        if (this._data) {
            unlistenArrayEvents(this._data, this);
        }
        if (meta._stacked) {
            clearStacks(meta);
        }
    }
 _dataCheck() {
        const dataset = this.getDataset();
        const data = dataset.data || (dataset.data = []);
        const _data = this._data;
        if (isObject(data)) {
            const meta = this._cachedMeta;
            this._data = convertObjectDataToArray(data, meta);
        } else if (_data !== data) {
            if (_data) {
                unlistenArrayEvents(_data, this);
                const meta = this._cachedMeta;
                clearStacks(meta);
                meta._parsed = [];
            }
            if (data && Object.isExtensible(data)) {
                listenArrayEvents(data, this);
            }
            this._syncList = [];
            this._data = data;
        }
    }
    addElements() {
        const meta = this._cachedMeta;
        this._dataCheck();
        if (this.datasetElementType) {
            meta.dataset = new this.datasetElementType();
        }
    }
    buildOrUpdateElements(resetNewElements) {
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        let stackChanged = false;
        this._dataCheck();
        const oldStacked = meta._stacked;
        meta._stacked = isStacked(meta.vScale, meta);
        if (meta.stack !== dataset.stack) {
            stackChanged = true;
            clearStacks(meta);
            meta.stack = dataset.stack;
        }
        this._resyncElements(resetNewElements);
        if (stackChanged || oldStacked !== meta._stacked) {
            updateStacks(this, meta._parsed);
            meta._stacked = isStacked(meta.vScale, meta);
        }
    }
 configure() {
        const config = this.chart.config;
        const scopeKeys = config.datasetScopeKeys(this._type);
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
        this.options = config.createResolver(scopes, this.getContext());
        this._parsing = this.options.parsing;
        this._cachedDataOpts = {};
    }
 parse(start, count) {
        const { _cachedMeta: meta , _data: data  } = this;
        const { iScale , _stacked  } = meta;
        const iAxis = iScale.axis;
        let sorted = start === 0 && count === data.length ? true : meta._sorted;
        let prev = start > 0 && meta._parsed[start - 1];
        let i, cur, parsed;
        if (this._parsing === false) {
            meta._parsed = data;
            meta._sorted = true;
            parsed = data;
        } else {
            if (isArray(data[start])) {
                parsed = this.parseArrayData(meta, data, start, count);
            } else if (isObject(data[start])) {
                parsed = this.parseObjectData(meta, data, start, count);
            } else {
                parsed = this.parsePrimitiveData(meta, data, start, count);
            }
            const isNotInOrderComparedToPrev = ()=>cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
            for(i = 0; i < count; ++i){
                meta._parsed[i + start] = cur = parsed[i];
                if (sorted) {
                    if (isNotInOrderComparedToPrev()) {
                        sorted = false;
                    }
                    prev = cur;
                }
            }
            meta._sorted = sorted;
        }
        if (_stacked) {
            updateStacks(this, parsed);
        }
    }
 parsePrimitiveData(meta, data, start, count) {
        const { iScale , vScale  } = meta;
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const labels = iScale.getLabels();
        const singleScale = iScale === vScale;
        const parsed = new Array(count);
        let i, ilen, index;
        for(i = 0, ilen = count; i < ilen; ++i){
            index = i + start;
            parsed[i] = {
                [iAxis]: singleScale || iScale.parse(labels[index], index),
                [vAxis]: vScale.parse(data[index], index)
            };
        }
        return parsed;
    }
 parseArrayData(meta, data, start, count) {
        const { xScale , yScale  } = meta;
        const parsed = new Array(count);
        let i, ilen, index, item;
        for(i = 0, ilen = count; i < ilen; ++i){
            index = i + start;
            item = data[index];
            parsed[i] = {
                x: xScale.parse(item[0], index),
                y: yScale.parse(item[1], index)
            };
        }
        return parsed;
    }
 parseObjectData(meta, data, start, count) {
        const { xScale , yScale  } = meta;
        const { xAxisKey ='x' , yAxisKey ='y'  } = this._parsing;
        const parsed = new Array(count);
        let i, ilen, index, item;
        for(i = 0, ilen = count; i < ilen; ++i){
            index = i + start;
            item = data[index];
            parsed[i] = {
                x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
                y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
            };
        }
        return parsed;
    }
 getParsed(index) {
        return this._cachedMeta._parsed[index];
    }
 getDataElement(index) {
        return this._cachedMeta.data[index];
    }
 applyStack(scale, parsed, mode) {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const value = parsed[scale.axis];
        const stack = {
            keys: getSortedDatasetIndices(chart, true),
            values: parsed._stacks[scale.axis]._visualValues
        };
        return applyStack(stack, value, meta.index, {
            mode
        });
    }
 updateRangeFromParsed(range, scale, parsed, stack) {
        const parsedValue = parsed[scale.axis];
        let value = parsedValue === null ? NaN : parsedValue;
        const values = stack && parsed._stacks[scale.axis];
        if (stack && values) {
            stack.values = values;
            value = applyStack(stack, parsedValue, this._cachedMeta.index);
        }
        range.min = Math.min(range.min, value);
        range.max = Math.max(range.max, value);
    }
 getMinMax(scale, canStack) {
        const meta = this._cachedMeta;
        const _parsed = meta._parsed;
        const sorted = meta._sorted && scale === meta.iScale;
        const ilen = _parsed.length;
        const otherScale = this._getOtherScale(scale);
        const stack = createStack(canStack, meta, this.chart);
        const range = {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
        };
        const { min: otherMin , max: otherMax  } = getUserBounds(otherScale);
        let i, parsed;
        function _skip() {
            parsed = _parsed[i];
            const otherValue = parsed[otherScale.axis];
            return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
        }
        for(i = 0; i < ilen; ++i){
            if (_skip()) {
                continue;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            if (sorted) {
                break;
            }
        }
        if (sorted) {
            for(i = ilen - 1; i >= 0; --i){
                if (_skip()) {
                    continue;
                }
                this.updateRangeFromParsed(range, scale, parsed, stack);
                break;
            }
        }
        return range;
    }
    getAllParsedValues(scale) {
        const parsed = this._cachedMeta._parsed;
        const values = [];
        let i, ilen, value;
        for(i = 0, ilen = parsed.length; i < ilen; ++i){
            value = parsed[i][scale.axis];
            if (isNumberFinite(value)) {
                values.push(value);
            }
        }
        return values;
    }
 getMaxOverflow() {
        return false;
    }
 getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const vScale = meta.vScale;
        const parsed = this.getParsed(index);
        return {
            label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
            value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
        };
    }
 _update(mode) {
        const meta = this._cachedMeta;
        this.update(mode || 'default');
        meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
    }
 update(mode) {}
    draw() {
        const ctx = this._ctx;
        const chart = this.chart;
        const meta = this._cachedMeta;
        const elements = meta.data || [];
        const area = chart.chartArea;
        const active = [];
        const start = this._drawStart || 0;
        const count = this._drawCount || elements.length - start;
        const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
        let i;
        if (meta.dataset) {
            meta.dataset.draw(ctx, area, start, count);
        }
        for(i = start; i < start + count; ++i){
            const element = elements[i];
            if (element.hidden) {
                continue;
            }
            if (element.active && drawActiveElementsOnTop) {
                active.push(element);
            } else {
                element.draw(ctx, area);
            }
        }
        for(i = 0; i < active.length; ++i){
            active[i].draw(ctx, area);
        }
    }
 getStyle(index, active) {
        const mode = active ? 'active' : 'default';
        return index === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
    }
 getContext(index, active, mode) {
        const dataset = this.getDataset();
        let context;
        if (index >= 0 && index < this._cachedMeta.data.length) {
            const element = this._cachedMeta.data[index];
            context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
            context.parsed = this.getParsed(index);
            context.raw = dataset.data[index];
            context.index = context.dataIndex = index;
        } else {
            context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
            context.dataset = dataset;
            context.index = context.datasetIndex = this.index;
        }
        context.active = !!active;
        context.mode = mode;
        return context;
    }
 resolveDatasetElementOptions(mode) {
        return this._resolveElementOptions(this.datasetElementType.id, mode);
    }
 resolveDataElementOptions(index, mode) {
        return this._resolveElementOptions(this.dataElementType.id, mode, index);
    }
 _resolveElementOptions(elementType, mode = 'default', index) {
        const active = mode === 'active';
        const cache = this._cachedDataOpts;
        const cacheKey = elementType + '-' + mode;
        const cached = cache[cacheKey];
        const sharing = this.enableOptionSharing && defined(index);
        if (cached) {
            return cloneIfNotShared(cached, sharing);
        }
        const config = this.chart.config;
        const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
        const prefixes = active ? [
            `${elementType}Hover`,
            'hover',
            elementType,
            ''
        ] : [
            elementType,
            ''
        ];
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        const names = Object.keys(defaults.elements[elementType]);
        const context = ()=>this.getContext(index, active, mode);
        const values = config.resolveNamedOptions(scopes, names, context, prefixes);
        if (values.$shared) {
            values.$shared = sharing;
            cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
        }
        return values;
    }
 _resolveAnimations(index, transition, active) {
        const chart = this.chart;
        const cache = this._cachedDataOpts;
        const cacheKey = `animation-${transition}`;
        const cached = cache[cacheKey];
        if (cached) {
            return cached;
        }
        let options;
        if (chart.options.animation !== false) {
            const config = this.chart.config;
            const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
            options = config.createResolver(scopes, this.getContext(index, active, transition));
        }
        const animations = new Animations(chart, options && options.animations);
        if (options && options._cacheable) {
            cache[cacheKey] = Object.freeze(animations);
        }
        return animations;
    }
 getSharedOptions(options) {
        if (!options.$shared) {
            return;
        }
        return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
    }
 includeOptions(mode, sharedOptions) {
        return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
    }
 _getSharedOptions(start, mode) {
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const previouslySharedOptions = this._sharedOptions;
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
        return {
            sharedOptions,
            includeOptions
        };
    }
 updateElement(element, index, properties, mode) {
        if (isDirectUpdateMode(mode)) {
            Object.assign(element, properties);
        } else {
            this._resolveAnimations(index, mode).update(element, properties);
        }
    }
 updateSharedOptions(sharedOptions, mode, newOptions) {
        if (sharedOptions && !isDirectUpdateMode(mode)) {
            this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
        }
    }
 _setStyle(element, index, mode, active) {
        element.active = active;
        const options = this.getStyle(index, active);
        this._resolveAnimations(index, mode, active).update(element, {
            options: !active && this.getSharedOptions(options) || options
        });
    }
    removeHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', false);
    }
    setHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', true);
    }
 _removeDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
            this._setStyle(element, undefined, 'active', false);
        }
    }
 _setDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
            this._setStyle(element, undefined, 'active', true);
        }
    }
 _resyncElements(resetNewElements) {
        const data = this._data;
        const elements = this._cachedMeta.data;
        for (const [method, arg1, arg2] of this._syncList){
            this[method](arg1, arg2);
        }
        this._syncList = [];
        const numMeta = elements.length;
        const numData = data.length;
        const count = Math.min(numData, numMeta);
        if (count) {
            this.parse(0, count);
        }
        if (numData > numMeta) {
            this._insertElements(numMeta, numData - numMeta, resetNewElements);
        } else if (numData < numMeta) {
            this._removeElements(numData, numMeta - numData);
        }
    }
 _insertElements(start, count, resetNewElements = true) {
        const meta = this._cachedMeta;
        const data = meta.data;
        const end = start + count;
        let i;
        const move = (arr)=>{
            arr.length += count;
            for(i = arr.length - 1; i >= end; i--){
                arr[i] = arr[i - count];
            }
        };
        move(data);
        for(i = start; i < end; ++i){
            data[i] = new this.dataElementType();
        }
        if (this._parsing) {
            move(meta._parsed);
        }
        this.parse(start, count);
        if (resetNewElements) {
            this.updateElements(data, start, count, 'reset');
        }
    }
    updateElements(element, start, count, mode) {}
 _removeElements(start, count) {
        const meta = this._cachedMeta;
        if (this._parsing) {
            const removed = meta._parsed.splice(start, count);
            if (meta._stacked) {
                clearStacks(meta, removed);
            }
        }
        meta.data.splice(start, count);
    }
 _sync(args) {
        if (this._parsing) {
            this._syncList.push(args);
        } else {
            const [method, arg1, arg2] = args;
            this[method](arg1, arg2);
        }
        this.chart._dataChanges.push([
            this.index,
            ...args
        ]);
    }
    _onDataPush() {
        const count = arguments.length;
        this._sync([
            '_insertElements',
            this.getDataset().data.length - count,
            count
        ]);
    }
    _onDataPop() {
        this._sync([
            '_removeElements',
            this._cachedMeta.data.length - 1,
            1
        ]);
    }
    _onDataShift() {
        this._sync([
            '_removeElements',
            0,
            1
        ]);
    }
    _onDataSplice(start, count) {
        if (count) {
            this._sync([
                '_removeElements',
                start,
                count
            ]);
        }
        const newCount = arguments.length - 2;
        if (newCount) {
            this._sync([
                '_insertElements',
                start,
                newCount
            ]);
        }
    }
    _onDataUnshift() {
        this._sync([
            '_insertElements',
            0,
            arguments.length
        ]);
    }
}

class ScatterController extends DatasetController {
    static id = 'scatter';
 static defaults = {
        datasetElementType: false,
        dataElementType: 'point',
        showLine: false,
        fill: false
    };
 static overrides = {
        interaction: {
            mode: 'point'
        },
        scales: {
            x: {
                type: 'linear'
            },
            y: {
                type: 'linear'
            }
        }
    };
 getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const labels = this.chart.data.labels || [];
        const { xScale , yScale  } = meta;
        const parsed = this.getParsed(index);
        const x = xScale.getLabelForValue(parsed.x);
        const y = yScale.getLabelForValue(parsed.y);
        return {
            label: labels[index] || '',
            value: '(' + x + ', ' + y + ')'
        };
    }
    update(mode) {
        const meta = this._cachedMeta;
        const { data: points = []  } = meta;
        const animationsDisabled = this.chart._animationsDisabled;
        let { start , count  } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = start;
        this._drawCount = count;
        if (_scaleRangesChanged(meta)) {
            start = 0;
            count = points.length;
        }
        if (this.options.showLine) {
            if (!this.datasetElementType) {
                this.addElements();
            }
            const { dataset: line , _dataset  } = meta;
            line._chart = this.chart;
            line._datasetIndex = this.index;
            line._decimated = !!_dataset._decimated;
            line.points = points;
            const options = this.resolveDatasetElementOptions(mode);
            options.segment = this.options.segment;
            this.updateElement(line, undefined, {
                animated: !animationsDisabled,
                options
            }, mode);
        } else if (this.datasetElementType) {
            delete meta.dataset;
            this.datasetElementType = false;
        }
        this.updateElements(points, start, count, mode);
    }
    addElements() {
        const { showLine  } = this.options;
        if (!this.datasetElementType && showLine) {
            this.datasetElementType = this.chart.registry.getElement('line');
        }
        super.addElements();
    }
    updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const { iScale , vScale , _stacked , _dataset  } = this._cachedMeta;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const { spanGaps , segment  } = this.options;
        const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        let prevParsed = start > 0 && this.getParsed(start - 1);
        for(let i = start; i < start + count; ++i){
            const point = points[i];
            const parsed = this.getParsed(i);
            const properties = directUpdate ? point : {};
            const nullData = isNullOrUndef(parsed[vAxis]);
            const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
            const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
            properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
            properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
            if (segment) {
                properties.parsed = parsed;
                properties.raw = _dataset.data[i];
            }
            if (includeOptions) {
                properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            }
            if (!directUpdate) {
                this.updateElement(point, i, properties, mode);
            }
            prevParsed = parsed;
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
 getMaxOverflow() {
        const meta = this._cachedMeta;
        const data = meta.data || [];
        if (!this.options.showLine) {
            let max = 0;
            for(let i = data.length - 1; i >= 0; --i){
                max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
            }
            return max > 0 && max;
        }
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        if (!data.length) {
            return border;
        }
        const firstPoint = data[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.max(border, firstPoint, lastPoint) / 2;
    }
}

/**
 * @namespace Chart._adapters
 * @since 2.8.0
 * @private
 */ function abstract() {
    throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
}
/**
 * Date adapter (current used by the time scale)
 * @namespace Chart._adapters._date
 * @memberof Chart._adapters
 * @private
 */ class DateAdapterBase {
    /**
   * Override default date adapter methods.
   * Accepts type parameter to define options type.
   * @example
   * Chart._adapters._date.override<{myAdapterOption: string}>({
   *   init() {
   *     console.log(this.options.myAdapterOption);
   *   }
   * })
   */ static override(members) {
        Object.assign(DateAdapterBase.prototype, members);
    }
    options;
    constructor(options){
        this.options = options || {};
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}
    formats() {
        return abstract();
    }
    parse() {
        return abstract();
    }
    format() {
        return abstract();
    }
    add() {
        return abstract();
    }
    diff() {
        return abstract();
    }
    startOf() {
        return abstract();
    }
    endOf() {
        return abstract();
    }
}
var adapters = {
    _date: DateAdapterBase
};

function binarySearch(metaset, axis, value, intersect) {
    const { controller , data , _sorted  } = metaset;
    const iScale = controller._cachedMeta.iScale;
    const spanGaps = metaset.dataset ? metaset.dataset.options ? metaset.dataset.options.spanGaps : null : null;
    if (iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
        const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
        if (!intersect) {
            const result = lookupMethod(data, axis, value);
            if (spanGaps) {
                const { vScale  } = controller._cachedMeta;
                const { _parsed  } = metaset;
                const distanceToDefinedLo = _parsed.slice(0, result.lo + 1).reverse().findIndex((point)=>!isNullOrUndef(point[vScale.axis]));
                result.lo -= Math.max(0, distanceToDefinedLo);
                const distanceToDefinedHi = _parsed.slice(result.hi).findIndex((point)=>!isNullOrUndef(point[vScale.axis]));
                result.hi += Math.max(0, distanceToDefinedHi);
            }
            return result;
        } else if (controller._sharedOptions) {
            const el = data[0];
            const range = typeof el.getRange === 'function' && el.getRange(axis);
            if (range) {
                const start = lookupMethod(data, axis, value - range);
                const end = lookupMethod(data, axis, value + range);
                return {
                    lo: start.lo,
                    hi: end.hi
                };
            }
        }
    }
    return {
        lo: 0,
        hi: data.length - 1
    };
}
 function evaluateInteractionItems(chart, axis, position, handler, intersect) {
    const metasets = chart.getSortedVisibleDatasetMetas();
    const value = position[axis];
    for(let i = 0, ilen = metasets.length; i < ilen; ++i){
        const { index , data  } = metasets[i];
        const { lo , hi  } = binarySearch(metasets[i], axis, value, intersect);
        for(let j = lo; j <= hi; ++j){
            const element = data[j];
            if (!element.skip) {
                handler(element, index, j);
            }
        }
    }
}
 function getDistanceMetricForAxis(axis) {
    const useX = axis.indexOf('x') !== -1;
    const useY = axis.indexOf('y') !== -1;
    return function(pt1, pt2) {
        const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
        const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };
}
 function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
    const items = [];
    if (!includeInvisible && !chart.isPointInArea(position)) {
        return items;
    }
    const evaluationFunc = function(element, datasetIndex, index) {
        if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
            return;
        }
        if (element.inRange(position.x, position.y, useFinalPosition)) {
            items.push({
                element,
                datasetIndex,
                index
            });
        }
    };
    evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
    return items;
}
 function getNearestRadialItems(chart, position, axis, useFinalPosition) {
    let items = [];
    function evaluationFunc(element, datasetIndex, index) {
        const { startAngle , endAngle  } = element.getProps([
            'startAngle',
            'endAngle'
        ], useFinalPosition);
        const { angle  } = getAngleFromPoint(element, {
            x: position.x,
            y: position.y
        });
        if (_angleBetween(angle, startAngle, endAngle)) {
            items.push({
                element,
                datasetIndex,
                index
            });
        }
    }
    evaluateInteractionItems(chart, axis, position, evaluationFunc);
    return items;
}
 function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
    let items = [];
    const distanceMetric = getDistanceMetricForAxis(axis);
    let minDistance = Number.POSITIVE_INFINITY;
    function evaluationFunc(element, datasetIndex, index) {
        const inRange = element.inRange(position.x, position.y, useFinalPosition);
        if (intersect && !inRange) {
            return;
        }
        const center = element.getCenterPoint(useFinalPosition);
        const pointInArea = !!includeInvisible || chart.isPointInArea(center);
        if (!pointInArea && !inRange) {
            return;
        }
        const distance = distanceMetric(position, center);
        if (distance < minDistance) {
            items = [
                {
                    element,
                    datasetIndex,
                    index
                }
            ];
            minDistance = distance;
        } else if (distance === minDistance) {
            items.push({
                element,
                datasetIndex,
                index
            });
        }
    }
    evaluateInteractionItems(chart, axis, position, evaluationFunc);
    return items;
}
 function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
    if (!includeInvisible && !chart.isPointInArea(position)) {
        return [];
    }
    return axis === 'r' && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
}
 function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
    const items = [];
    const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
    let intersectsItem = false;
    evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index)=>{
        if (element[rangeMethod] && element[rangeMethod](position[axis], useFinalPosition)) {
            items.push({
                element,
                datasetIndex,
                index
            });
            intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
        }
    });
    if (intersect && !intersectsItem) {
        return [];
    }
    return items;
}
 var Interaction = {
    modes: {
 index (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || 'x';
            const includeInvisible = options.includeInvisible || false;
            const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
            const elements = [];
            if (!items.length) {
                return [];
            }
            chart.getSortedVisibleDatasetMetas().forEach((meta)=>{
                const index = items[0].index;
                const element = meta.data[index];
                if (element && !element.skip) {
                    elements.push({
                        element,
                        datasetIndex: meta.index,
                        index
                    });
                }
            });
            return elements;
        },
 dataset (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || 'xy';
            const includeInvisible = options.includeInvisible || false;
            let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
            if (items.length > 0) {
                const datasetIndex = items[0].datasetIndex;
                const data = chart.getDatasetMeta(datasetIndex).data;
                items = [];
                for(let i = 0; i < data.length; ++i){
                    items.push({
                        element: data[i],
                        datasetIndex,
                        index: i
                    });
                }
            }
            return items;
        },
 point (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || 'xy';
            const includeInvisible = options.includeInvisible || false;
            return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
        },
 nearest (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            const axis = options.axis || 'xy';
            const includeInvisible = options.includeInvisible || false;
            return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
        },
 x (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            return getAxisItems(chart, position, 'x', options.intersect, useFinalPosition);
        },
 y (chart, e, options, useFinalPosition) {
            const position = getRelativePosition(e, chart);
            return getAxisItems(chart, position, 'y', options.intersect, useFinalPosition);
        }
    }
};

const STATIC_POSITIONS = [
    'left',
    'top',
    'right',
    'bottom'
];
function filterByPosition(array, position) {
    return array.filter((v)=>v.pos === position);
}
function filterDynamicPositionByAxis(array, axis) {
    return array.filter((v)=>STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}
function sortByWeight(array, reverse) {
    return array.sort((a, b)=>{
        const v0 = reverse ? b : a;
        const v1 = reverse ? a : b;
        return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
    });
}
function wrapBoxes(boxes) {
    const layoutBoxes = [];
    let i, ilen, box, pos, stack, stackWeight;
    for(i = 0, ilen = (boxes || []).length; i < ilen; ++i){
        box = boxes[i];
        ({ position: pos , options: { stack , stackWeight =1  }  } = box);
        layoutBoxes.push({
            index: i,
            box,
            pos,
            horizontal: box.isHorizontal(),
            weight: box.weight,
            stack: stack && pos + stack,
            stackWeight
        });
    }
    return layoutBoxes;
}
function buildStacks(layouts) {
    const stacks = {};
    for (const wrap of layouts){
        const { stack , pos , stackWeight  } = wrap;
        if (!stack || !STATIC_POSITIONS.includes(pos)) {
            continue;
        }
        const _stack = stacks[stack] || (stacks[stack] = {
            count: 0,
            placed: 0,
            weight: 0,
            size: 0
        });
        _stack.count++;
        _stack.weight += stackWeight;
    }
    return stacks;
}
 function setLayoutDims(layouts, params) {
    const stacks = buildStacks(layouts);
    const { vBoxMaxWidth , hBoxMaxHeight  } = params;
    let i, ilen, layout;
    for(i = 0, ilen = layouts.length; i < ilen; ++i){
        layout = layouts[i];
        const { fullSize  } = layout.box;
        const stack = stacks[layout.stack];
        const factor = stack && layout.stackWeight / stack.weight;
        if (layout.horizontal) {
            layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
            layout.height = hBoxMaxHeight;
        } else {
            layout.width = vBoxMaxWidth;
            layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
        }
    }
    return stacks;
}
function buildLayoutBoxes(boxes) {
    const layoutBoxes = wrapBoxes(boxes);
    const fullSize = sortByWeight(layoutBoxes.filter((wrap)=>wrap.box.fullSize), true);
    const left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
    const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
    const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
    const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
    const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
    const centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
    return {
        fullSize,
        leftAndTop: left.concat(top),
        rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
        chartArea: filterByPosition(layoutBoxes, 'chartArea'),
        vertical: left.concat(right).concat(centerVertical),
        horizontal: top.concat(bottom).concat(centerHorizontal)
    };
}
function getCombinedMax(maxPadding, chartArea, a, b) {
    return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}
function updateMaxPadding(maxPadding, boxPadding) {
    maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
    maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
    maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
    maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
function updateDims(chartArea, params, layout, stacks) {
    const { pos , box  } = layout;
    const maxPadding = chartArea.maxPadding;
    if (!isObject(pos)) {
        if (layout.size) {
            chartArea[pos] -= layout.size;
        }
        const stack = stacks[layout.stack] || {
            size: 0,
            count: 1
        };
        stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
        layout.size = stack.size / stack.count;
        chartArea[pos] += layout.size;
    }
    if (box.getPadding) {
        updateMaxPadding(maxPadding, box.getPadding());
    }
    const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
    const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
    const widthChanged = newWidth !== chartArea.w;
    const heightChanged = newHeight !== chartArea.h;
    chartArea.w = newWidth;
    chartArea.h = newHeight;
    return layout.horizontal ? {
        same: widthChanged,
        other: heightChanged
    } : {
        same: heightChanged,
        other: widthChanged
    };
}
function handleMaxPadding(chartArea) {
    const maxPadding = chartArea.maxPadding;
    function updatePos(pos) {
        const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
        chartArea[pos] += change;
        return change;
    }
    chartArea.y += updatePos('top');
    chartArea.x += updatePos('left');
    updatePos('right');
    updatePos('bottom');
}
function getMargins(horizontal, chartArea) {
    const maxPadding = chartArea.maxPadding;
    function marginForPositions(positions) {
        const margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        positions.forEach((pos)=>{
            margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
        });
        return margin;
    }
    return horizontal ? marginForPositions([
        'left',
        'right'
    ]) : marginForPositions([
        'top',
        'bottom'
    ]);
}
function fitBoxes(boxes, chartArea, params, stacks) {
    const refitBoxes = [];
    let i, ilen, layout, box, refit, changed;
    for(i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i){
        layout = boxes[i];
        box = layout.box;
        box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
        const { same , other  } = updateDims(chartArea, params, layout, stacks);
        refit |= same && refitBoxes.length;
        changed = changed || other;
        if (!box.fullSize) {
            refitBoxes.push(layout);
        }
    }
    return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
}
function setBoxDims(box, left, top, width, height) {
    box.top = top;
    box.left = left;
    box.right = left + width;
    box.bottom = top + height;
    box.width = width;
    box.height = height;
}
function placeBoxes(boxes, chartArea, params, stacks) {
    const userPadding = params.padding;
    let { x , y  } = chartArea;
    for (const layout of boxes){
        const box = layout.box;
        const stack = stacks[layout.stack] || {
            placed: 0,
            weight: 1
        };
        const weight = layout.stackWeight / stack.weight || 1;
        if (layout.horizontal) {
            const width = chartArea.w * weight;
            const height = stack.size || box.height;
            if (defined(stack.start)) {
                y = stack.start;
            }
            if (box.fullSize) {
                setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
            } else {
                setBoxDims(box, chartArea.left + stack.placed, y, width, height);
            }
            stack.start = y;
            stack.placed += width;
            y = box.bottom;
        } else {
            const height = chartArea.h * weight;
            const width = stack.size || box.width;
            if (defined(stack.start)) {
                x = stack.start;
            }
            if (box.fullSize) {
                setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
            } else {
                setBoxDims(box, x, chartArea.top + stack.placed, width, height);
            }
            stack.start = x;
            stack.placed += height;
            x = box.right;
        }
    }
    chartArea.x = x;
    chartArea.y = y;
}
var layouts = {
 addBox (chart, item) {
        if (!chart.boxes) {
            chart.boxes = [];
        }
        item.fullSize = item.fullSize || false;
        item.position = item.position || 'top';
        item.weight = item.weight || 0;
        item._layers = item._layers || function() {
            return [
                {
                    z: 0,
                    draw (chartArea) {
                        item.draw(chartArea);
                    }
                }
            ];
        };
        chart.boxes.push(item);
    },
 removeBox (chart, layoutItem) {
        const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
        if (index !== -1) {
            chart.boxes.splice(index, 1);
        }
    },
 configure (chart, item, options) {
        item.fullSize = options.fullSize;
        item.position = options.position;
        item.weight = options.weight;
    },
 update (chart, width, height, minPadding) {
        if (!chart) {
            return;
        }
        const padding = toPadding(chart.options.layout.padding);
        const availableWidth = Math.max(width - padding.width, 0);
        const availableHeight = Math.max(height - padding.height, 0);
        const boxes = buildLayoutBoxes(chart.boxes);
        const verticalBoxes = boxes.vertical;
        const horizontalBoxes = boxes.horizontal;
        each(chart.boxes, (box)=>{
            if (typeof box.beforeLayout === 'function') {
                box.beforeLayout();
            }
        });
        const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap)=>wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
        const params = Object.freeze({
            outerWidth: width,
            outerHeight: height,
            padding,
            availableWidth,
            availableHeight,
            vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
            hBoxMaxHeight: availableHeight / 2
        });
        const maxPadding = Object.assign({}, padding);
        updateMaxPadding(maxPadding, toPadding(minPadding));
        const chartArea = Object.assign({
            maxPadding,
            w: availableWidth,
            h: availableHeight,
            x: padding.left,
            y: padding.top
        }, padding);
        const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
        fitBoxes(boxes.fullSize, chartArea, params, stacks);
        fitBoxes(verticalBoxes, chartArea, params, stacks);
        if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
            fitBoxes(verticalBoxes, chartArea, params, stacks);
        }
        handleMaxPadding(chartArea);
        placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
        chartArea.x += chartArea.w;
        chartArea.y += chartArea.h;
        placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
        chart.chartArea = {
            left: chartArea.left,
            top: chartArea.top,
            right: chartArea.left + chartArea.w,
            bottom: chartArea.top + chartArea.h,
            height: chartArea.h,
            width: chartArea.w
        };
        each(boxes.chartArea, (layout)=>{
            const box = layout.box;
            Object.assign(box, chart.chartArea);
            box.update(chartArea.w, chartArea.h, {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            });
        });
    }
};

class BasePlatform {
 acquireContext(canvas, aspectRatio) {}
 releaseContext(context) {
        return false;
    }
 addEventListener(chart, type, listener) {}
 removeEventListener(chart, type, listener) {}
 getDevicePixelRatio() {
        return 1;
    }
 getMaximumSize(element, width, height, aspectRatio) {
        width = Math.max(0, width || element.width);
        height = height || element.height;
        return {
            width,
            height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
        };
    }
 isAttached(canvas) {
        return true;
    }
 updateConfig(config) {
    }
}

class BasicPlatform extends BasePlatform {
    acquireContext(item) {
        return item && item.getContext && item.getContext('2d') || null;
    }
    updateConfig(config) {
        config.options.animation = false;
    }
}

const EXPANDO_KEY = '$chartjs';
 const EVENT_TYPES = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    pointerenter: 'mouseenter',
    pointerdown: 'mousedown',
    pointermove: 'mousemove',
    pointerup: 'mouseup',
    pointerleave: 'mouseout',
    pointerout: 'mouseout'
};
const isNullOrEmpty = (value)=>value === null || value === '';
 function initCanvas(canvas, aspectRatio) {
    const style = canvas.style;
    const renderHeight = canvas.getAttribute('height');
    const renderWidth = canvas.getAttribute('width');
    canvas[EXPANDO_KEY] = {
        initial: {
            height: renderHeight,
            width: renderWidth,
            style: {
                display: style.display,
                height: style.height,
                width: style.width
            }
        }
    };
    style.display = style.display || 'block';
    style.boxSizing = style.boxSizing || 'border-box';
    if (isNullOrEmpty(renderWidth)) {
        const displayWidth = readUsedSize(canvas, 'width');
        if (displayWidth !== undefined) {
            canvas.width = displayWidth;
        }
    }
    if (isNullOrEmpty(renderHeight)) {
        if (canvas.style.height === '') {
            canvas.height = canvas.width / (aspectRatio || 2);
        } else {
            const displayHeight = readUsedSize(canvas, 'height');
            if (displayHeight !== undefined) {
                canvas.height = displayHeight;
            }
        }
    }
    return canvas;
}
const eventListenerOptions = supportsEventListenerOptions ? {
    passive: true
} : false;
function addListener(node, type, listener) {
    if (node) {
        node.addEventListener(type, listener, eventListenerOptions);
    }
}
function removeListener(chart, type, listener) {
    if (chart && chart.canvas) {
        chart.canvas.removeEventListener(type, listener, eventListenerOptions);
    }
}
function fromNativeEvent(event, chart) {
    const type = EVENT_TYPES[event.type] || event.type;
    const { x , y  } = getRelativePosition(event, chart);
    return {
        type,
        chart,
        native: event,
        x: x !== undefined ? x : null,
        y: y !== undefined ? y : null
    };
}
function nodeListContains(nodeList, canvas) {
    for (const node of nodeList){
        if (node === canvas || node.contains(canvas)) {
            return true;
        }
    }
}
function createAttachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries)=>{
        let trigger = false;
        for (const entry of entries){
            trigger = trigger || nodeListContains(entry.addedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
        }
        if (trigger) {
            listener();
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    return observer;
}
function createDetachObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entries)=>{
        let trigger = false;
        for (const entry of entries){
            trigger = trigger || nodeListContains(entry.removedNodes, canvas);
            trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
        }
        if (trigger) {
            listener();
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    return observer;
}
const drpListeningCharts = new Map();
let oldDevicePixelRatio = 0;
function onWindowResize() {
    const dpr = window.devicePixelRatio;
    if (dpr === oldDevicePixelRatio) {
        return;
    }
    oldDevicePixelRatio = dpr;
    drpListeningCharts.forEach((resize, chart)=>{
        if (chart.currentDevicePixelRatio !== dpr) {
            resize();
        }
    });
}
function listenDevicePixelRatioChanges(chart, resize) {
    if (!drpListeningCharts.size) {
        window.addEventListener('resize', onWindowResize);
    }
    drpListeningCharts.set(chart, resize);
}
function unlistenDevicePixelRatioChanges(chart) {
    drpListeningCharts.delete(chart);
    if (!drpListeningCharts.size) {
        window.removeEventListener('resize', onWindowResize);
    }
}
function createResizeObserver(chart, type, listener) {
    const canvas = chart.canvas;
    const container = canvas && _getParentNode(canvas);
    if (!container) {
        return;
    }
    const resize = throttled((width, height)=>{
        const w = container.clientWidth;
        listener(width, height);
        if (w < container.clientWidth) {
            listener();
        }
    }, window);
    const observer = new ResizeObserver((entries)=>{
        const entry = entries[0];
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width === 0 && height === 0) {
            return;
        }
        resize(width, height);
    });
    observer.observe(container);
    listenDevicePixelRatioChanges(chart, resize);
    return observer;
}
function releaseObserver(chart, type, observer) {
    if (observer) {
        observer.disconnect();
    }
    if (type === 'resize') {
        unlistenDevicePixelRatioChanges(chart);
    }
}
function createProxyAndListen(chart, type, listener) {
    const canvas = chart.canvas;
    const proxy = throttled((event)=>{
        if (chart.ctx !== null) {
            listener(fromNativeEvent(event, chart));
        }
    }, chart);
    addListener(canvas, type, proxy);
    return proxy;
}
 class DomPlatform extends BasePlatform {
 acquireContext(canvas, aspectRatio) {
        const context = canvas && canvas.getContext && canvas.getContext('2d');
        if (context && context.canvas === canvas) {
            initCanvas(canvas, aspectRatio);
            return context;
        }
        return null;
    }
 releaseContext(context) {
        const canvas = context.canvas;
        if (!canvas[EXPANDO_KEY]) {
            return false;
        }
        const initial = canvas[EXPANDO_KEY].initial;
        [
            'height',
            'width'
        ].forEach((prop)=>{
            const value = initial[prop];
            if (isNullOrUndef(value)) {
                canvas.removeAttribute(prop);
            } else {
                canvas.setAttribute(prop, value);
            }
        });
        const style = initial.style || {};
        Object.keys(style).forEach((key)=>{
            canvas.style[key] = style[key];
        });
        canvas.width = canvas.width;
        delete canvas[EXPANDO_KEY];
        return true;
    }
 addEventListener(chart, type, listener) {
        this.removeEventListener(chart, type);
        const proxies = chart.$proxies || (chart.$proxies = {});
        const handlers = {
            attach: createAttachObserver,
            detach: createDetachObserver,
            resize: createResizeObserver
        };
        const handler = handlers[type] || createProxyAndListen;
        proxies[type] = handler(chart, type, listener);
    }
 removeEventListener(chart, type) {
        const proxies = chart.$proxies || (chart.$proxies = {});
        const proxy = proxies[type];
        if (!proxy) {
            return;
        }
        const handlers = {
            attach: releaseObserver,
            detach: releaseObserver,
            resize: releaseObserver
        };
        const handler = handlers[type] || removeListener;
        handler(chart, type, proxy);
        proxies[type] = undefined;
    }
    getDevicePixelRatio() {
        return window.devicePixelRatio;
    }
 getMaximumSize(canvas, width, height, aspectRatio) {
        return getMaximumSize(canvas, width, height, aspectRatio);
    }
 isAttached(canvas) {
        const container = canvas && _getParentNode(canvas);
        return !!(container && container.isConnected);
    }
}

function _detectPlatform(canvas) {
    if (!_isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
        return BasicPlatform;
    }
    return DomPlatform;
}

class Element {
    static defaults = {};
    static defaultRoutes = undefined;
    x;
    y;
    active = false;
    options;
    $animations;
    tooltipPosition(useFinalPosition) {
        const { x , y  } = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        return {
            x,
            y
        };
    }
    hasValue() {
        return isNumber(this.x) && isNumber(this.y);
    }
    getProps(props, final) {
        const anims = this.$animations;
        if (!final || !anims) {
            // let's not create an object, if not needed
            return this;
        }
        const ret = {};
        props.forEach((prop)=>{
            ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
        });
        return ret;
    }
}

function autoSkip(scale, ticks) {
    const tickOpts = scale.options.ticks;
    const determinedMaxTicks = determineMaxTicks(scale);
    const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
    const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
    const numMajorIndices = majorIndices.length;
    const first = majorIndices[0];
    const last = majorIndices[numMajorIndices - 1];
    const newTicks = [];
    if (numMajorIndices > ticksLimit) {
        skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
        return newTicks;
    }
    const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
    if (numMajorIndices > 0) {
        let i, ilen;
        const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
        skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
        for(i = 0, ilen = numMajorIndices - 1; i < ilen; i++){
            skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
        }
        skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
        return newTicks;
    }
    skip(ticks, newTicks, spacing);
    return newTicks;
}
function determineMaxTicks(scale) {
    const offset = scale.options.offset;
    const tickLength = scale._tickSize();
    const maxScale = scale._length / tickLength + (offset ? 0 : 1);
    const maxChart = scale._maxLength / tickLength;
    return Math.floor(Math.min(maxScale, maxChart));
}
 function calculateSpacing(majorIndices, ticks, ticksLimit) {
    const evenMajorSpacing = getEvenSpacing(majorIndices);
    const spacing = ticks.length / ticksLimit;
    if (!evenMajorSpacing) {
        return Math.max(spacing, 1);
    }
    const factors = _factorize(evenMajorSpacing);
    for(let i = 0, ilen = factors.length - 1; i < ilen; i++){
        const factor = factors[i];
        if (factor > spacing) {
            return factor;
        }
    }
    return Math.max(spacing, 1);
}
 function getMajorIndices(ticks) {
    const result = [];
    let i, ilen;
    for(i = 0, ilen = ticks.length; i < ilen; i++){
        if (ticks[i].major) {
            result.push(i);
        }
    }
    return result;
}
 function skipMajors(ticks, newTicks, majorIndices, spacing) {
    let count = 0;
    let next = majorIndices[0];
    let i;
    spacing = Math.ceil(spacing);
    for(i = 0; i < ticks.length; i++){
        if (i === next) {
            newTicks.push(ticks[i]);
            count++;
            next = majorIndices[count * spacing];
        }
    }
}
 function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    const start = valueOrDefault(majorStart, 0);
    const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
    let count = 0;
    let length, i, next;
    spacing = Math.ceil(spacing);
    if (majorEnd) {
        length = majorEnd - majorStart;
        spacing = length / Math.floor(length / spacing);
    }
    next = start;
    while(next < 0){
        count++;
        next = Math.round(start + count * spacing);
    }
    for(i = Math.max(start, 0); i < end; i++){
        if (i === next) {
            newTicks.push(ticks[i]);
            count++;
            next = Math.round(start + count * spacing);
        }
    }
}
 function getEvenSpacing(arr) {
    const len = arr.length;
    let i, diff;
    if (len < 2) {
        return false;
    }
    for(diff = arr[0], i = 1; i < len; ++i){
        if (arr[i] - arr[i - 1] !== diff) {
            return false;
        }
    }
    return diff;
}

const reverseAlign = (align)=>align === 'left' ? 'right' : align === 'right' ? 'left' : align;
const offsetFromEdge = (scale, edge, offset)=>edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
const getTicksLimit = (ticksLength, maxTicksLimit)=>Math.min(maxTicksLimit || ticksLength, ticksLength);
 function sample(arr, numItems) {
    const result = [];
    const increment = arr.length / numItems;
    const len = arr.length;
    let i = 0;
    for(; i < len; i += increment){
        result.push(arr[Math.floor(i)]);
    }
    return result;
}
 function getPixelForGridLine(scale, index, offsetGridLines) {
    const length = scale.ticks.length;
    const validIndex = Math.min(index, length - 1);
    const start = scale._startPixel;
    const end = scale._endPixel;
    const epsilon = 1e-6;
    let lineValue = scale.getPixelForTick(validIndex);
    let offset;
    if (offsetGridLines) {
        if (length === 1) {
            offset = Math.max(lineValue - start, end - lineValue);
        } else if (index === 0) {
            offset = (scale.getPixelForTick(1) - lineValue) / 2;
        } else {
            offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
        }
        lineValue += validIndex < index ? offset : -offset;
        if (lineValue < start - epsilon || lineValue > end + epsilon) {
            return;
        }
    }
    return lineValue;
}
 function garbageCollect(caches, length) {
    each(caches, (cache)=>{
        const gc = cache.gc;
        const gcLen = gc.length / 2;
        let i;
        if (gcLen > length) {
            for(i = 0; i < gcLen; ++i){
                delete cache.data[gc[i]];
            }
            gc.splice(0, gcLen);
        }
    });
}
 function getTickMarkLength(options) {
    return options.drawTicks ? options.tickLength : 0;
}
 function getTitleHeight(options, fallback) {
    if (!options.display) {
        return 0;
    }
    const font = toFont(options.font, fallback);
    const padding = toPadding(options.padding);
    const lines = isArray(options.text) ? options.text.length : 1;
    return lines * font.lineHeight + padding.height;
}
function createScaleContext(parent, scale) {
    return createContext(parent, {
        scale,
        type: 'scale'
    });
}
function createTickContext(parent, index, tick) {
    return createContext(parent, {
        tick,
        index,
        type: 'tick'
    });
}
function titleAlign(align, position, reverse) {
     let ret = _toLeftRightCenter(align);
    if (reverse && position !== 'right' || !reverse && position === 'right') {
        ret = reverseAlign(ret);
    }
    return ret;
}
function titleArgs(scale, offset, position, align) {
    const { top , left , bottom , right , chart  } = scale;
    const { chartArea , scales  } = chart;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    const height = bottom - top;
    const width = right - left;
    if (scale.isHorizontal()) {
        titleX = _alignStartEnd(align, left, right);
        if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
        } else if (position === 'center') {
            titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
        } else {
            titleY = offsetFromEdge(scale, position, offset);
        }
        maxWidth = right - left;
    } else {
        if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            titleX = scales[positionAxisID].getPixelForValue(value) - width + offset;
        } else if (position === 'center') {
            titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
        } else {
            titleX = offsetFromEdge(scale, position, offset);
        }
        titleY = _alignStartEnd(align, bottom, top);
        rotation = position === 'left' ? -HALF_PI : HALF_PI;
    }
    return {
        titleX,
        titleY,
        maxWidth,
        rotation
    };
}
class Scale extends Element {
    constructor(cfg){
        super();
         this.id = cfg.id;
         this.type = cfg.type;
         this.options = undefined;
         this.ctx = cfg.ctx;
         this.chart = cfg.chart;
         this.top = undefined;
         this.bottom = undefined;
         this.left = undefined;
         this.right = undefined;
         this.width = undefined;
         this.height = undefined;
        this._margins = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
         this.maxWidth = undefined;
         this.maxHeight = undefined;
         this.paddingTop = undefined;
         this.paddingBottom = undefined;
         this.paddingLeft = undefined;
         this.paddingRight = undefined;
         this.axis = undefined;
         this.labelRotation = undefined;
        this.min = undefined;
        this.max = undefined;
        this._range = undefined;
         this.ticks = [];
         this._gridLineItems = null;
         this._labelItems = null;
         this._labelSizes = null;
        this._length = 0;
        this._maxLength = 0;
        this._longestTextCache = {};
         this._startPixel = undefined;
         this._endPixel = undefined;
        this._reversePixels = false;
        this._userMax = undefined;
        this._userMin = undefined;
        this._suggestedMax = undefined;
        this._suggestedMin = undefined;
        this._ticksLength = 0;
        this._borderValue = 0;
        this._cache = {};
        this._dataLimitsCached = false;
        this.$context = undefined;
    }
 init(options) {
        this.options = options.setContext(this.getContext());
        this.axis = options.axis;
        this._userMin = this.parse(options.min);
        this._userMax = this.parse(options.max);
        this._suggestedMin = this.parse(options.suggestedMin);
        this._suggestedMax = this.parse(options.suggestedMax);
    }
 parse(raw, index) {
        return raw;
    }
 getUserBounds() {
        let { _userMin , _userMax , _suggestedMin , _suggestedMax  } = this;
        _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
        _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
        _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
        _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
        return {
            min: finiteOrDefault(_userMin, _suggestedMin),
            max: finiteOrDefault(_userMax, _suggestedMax),
            minDefined: isNumberFinite(_userMin),
            maxDefined: isNumberFinite(_userMax)
        };
    }
 getMinMax(canStack) {
        let { min , max , minDefined , maxDefined  } = this.getUserBounds();
        let range;
        if (minDefined && maxDefined) {
            return {
                min,
                max
            };
        }
        const metas = this.getMatchingVisibleMetas();
        for(let i = 0, ilen = metas.length; i < ilen; ++i){
            range = metas[i].controller.getMinMax(this, canStack);
            if (!minDefined) {
                min = Math.min(min, range.min);
            }
            if (!maxDefined) {
                max = Math.max(max, range.max);
            }
        }
        min = maxDefined && min > max ? max : min;
        max = minDefined && min > max ? min : max;
        return {
            min: finiteOrDefault(min, finiteOrDefault(max, min)),
            max: finiteOrDefault(max, finiteOrDefault(min, max))
        };
    }
 getPadding() {
        return {
            left: this.paddingLeft || 0,
            top: this.paddingTop || 0,
            right: this.paddingRight || 0,
            bottom: this.paddingBottom || 0
        };
    }
 getTicks() {
        return this.ticks;
    }
 getLabels() {
        const data = this.chart.data;
        return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
    }
 getLabelItems(chartArea = this.chart.chartArea) {
        const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
        return items;
    }
    beforeLayout() {
        this._cache = {};
        this._dataLimitsCached = false;
    }
    beforeUpdate() {
        callback(this.options.beforeUpdate, [
            this
        ]);
    }
 update(maxWidth, maxHeight, margins) {
        const { beginAtZero , grace , ticks: tickOpts  } = this.options;
        const sampleSize = tickOpts.sampleSize;
        this.beforeUpdate();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins = Object.assign({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }, margins);
        this.ticks = null;
        this._labelSizes = null;
        this._gridLineItems = null;
        this._labelItems = null;
        this.beforeSetDimensions();
        this.setDimensions();
        this.afterSetDimensions();
        this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
        if (!this._dataLimitsCached) {
            this.beforeDataLimits();
            this.determineDataLimits();
            this.afterDataLimits();
            this._range = _addGrace(this, grace, beginAtZero);
            this._dataLimitsCached = true;
        }
        this.beforeBuildTicks();
        this.ticks = this.buildTicks() || [];
        this.afterBuildTicks();
        const samplingEnabled = sampleSize < this.ticks.length;
        this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
        this.configure();
        this.beforeCalculateLabelRotation();
        this.calculateLabelRotation();
        this.afterCalculateLabelRotation();
        if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
            this.ticks = autoSkip(this, this.ticks);
            this._labelSizes = null;
            this.afterAutoSkip();
        }
        if (samplingEnabled) {
            this._convertTicksToLabels(this.ticks);
        }
        this.beforeFit();
        this.fit();
        this.afterFit();
        this.afterUpdate();
    }
 configure() {
        let reversePixels = this.options.reverse;
        let startPixel, endPixel;
        if (this.isHorizontal()) {
            startPixel = this.left;
            endPixel = this.right;
        } else {
            startPixel = this.top;
            endPixel = this.bottom;
            reversePixels = !reversePixels;
        }
        this._startPixel = startPixel;
        this._endPixel = endPixel;
        this._reversePixels = reversePixels;
        this._length = endPixel - startPixel;
        this._alignToPixels = this.options.alignToPixels;
    }
    afterUpdate() {
        callback(this.options.afterUpdate, [
            this
        ]);
    }
    beforeSetDimensions() {
        callback(this.options.beforeSetDimensions, [
            this
        ]);
    }
    setDimensions() {
        if (this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = 0;
            this.right = this.width;
        } else {
            this.height = this.maxHeight;
            this.top = 0;
            this.bottom = this.height;
        }
        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;
    }
    afterSetDimensions() {
        callback(this.options.afterSetDimensions, [
            this
        ]);
    }
    _callHooks(name) {
        this.chart.notifyPlugins(name, this.getContext());
        callback(this.options[name], [
            this
        ]);
    }
    beforeDataLimits() {
        this._callHooks('beforeDataLimits');
    }
    determineDataLimits() {}
    afterDataLimits() {
        this._callHooks('afterDataLimits');
    }
    beforeBuildTicks() {
        this._callHooks('beforeBuildTicks');
    }
 buildTicks() {
        return [];
    }
    afterBuildTicks() {
        this._callHooks('afterBuildTicks');
    }
    beforeTickToLabelConversion() {
        callback(this.options.beforeTickToLabelConversion, [
            this
        ]);
    }
 generateTickLabels(ticks) {
        const tickOpts = this.options.ticks;
        let i, ilen, tick;
        for(i = 0, ilen = ticks.length; i < ilen; i++){
            tick = ticks[i];
            tick.label = callback(tickOpts.callback, [
                tick.value,
                i,
                ticks
            ], this);
        }
    }
    afterTickToLabelConversion() {
        callback(this.options.afterTickToLabelConversion, [
            this
        ]);
    }
    beforeCalculateLabelRotation() {
        callback(this.options.beforeCalculateLabelRotation, [
            this
        ]);
    }
    calculateLabelRotation() {
        const options = this.options;
        const tickOpts = options.ticks;
        const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
        const minRotation = tickOpts.minRotation || 0;
        const maxRotation = tickOpts.maxRotation;
        let labelRotation = minRotation;
        let tickWidth, maxHeight, maxLabelDiagonal;
        if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
            this.labelRotation = minRotation;
            return;
        }
        const labelSizes = this._getLabelSizes();
        const maxLabelWidth = labelSizes.widest.width;
        const maxLabelHeight = labelSizes.highest.height;
        const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
        tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
        if (maxLabelWidth + 6 > tickWidth) {
            tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
            maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
            maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
            labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
            labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
        }
        this.labelRotation = labelRotation;
    }
    afterCalculateLabelRotation() {
        callback(this.options.afterCalculateLabelRotation, [
            this
        ]);
    }
    afterAutoSkip() {}
    beforeFit() {
        callback(this.options.beforeFit, [
            this
        ]);
    }
    fit() {
        const minSize = {
            width: 0,
            height: 0
        };
        const { chart , options: { ticks: tickOpts , title: titleOpts , grid: gridOpts  }  } = this;
        const display = this._isVisible();
        const isHorizontal = this.isHorizontal();
        if (display) {
            const titleHeight = getTitleHeight(titleOpts, chart.options.font);
            if (isHorizontal) {
                minSize.width = this.maxWidth;
                minSize.height = getTickMarkLength(gridOpts) + titleHeight;
            } else {
                minSize.height = this.maxHeight;
                minSize.width = getTickMarkLength(gridOpts) + titleHeight;
            }
            if (tickOpts.display && this.ticks.length) {
                const { first , last , widest , highest  } = this._getLabelSizes();
                const tickPadding = tickOpts.padding * 2;
                const angleRadians = toRadians(this.labelRotation);
                const cos = Math.cos(angleRadians);
                const sin = Math.sin(angleRadians);
                if (isHorizontal) {
                    const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                    minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
                } else {
                    const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                    minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
                }
                this._calculatePadding(first, last, sin, cos);
            }
        }
        this._handleMargins();
        if (isHorizontal) {
            this.width = this._length = chart.width - this._margins.left - this._margins.right;
            this.height = minSize.height;
        } else {
            this.width = minSize.width;
            this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
        }
    }
    _calculatePadding(first, last, sin, cos) {
        const { ticks: { align , padding  } , position  } = this.options;
        const isRotated = this.labelRotation !== 0;
        const labelsBelowTicks = position !== 'top' && this.axis === 'x';
        if (this.isHorizontal()) {
            const offsetLeft = this.getPixelForTick(0) - this.left;
            const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
            let paddingLeft = 0;
            let paddingRight = 0;
            if (isRotated) {
                if (labelsBelowTicks) {
                    paddingLeft = cos * first.width;
                    paddingRight = sin * last.height;
                } else {
                    paddingLeft = sin * first.height;
                    paddingRight = cos * last.width;
                }
            } else if (align === 'start') {
                paddingRight = last.width;
            } else if (align === 'end') {
                paddingLeft = first.width;
            } else if (align !== 'inner') {
                paddingLeft = first.width / 2;
                paddingRight = last.width / 2;
            }
            this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
            this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
        } else {
            let paddingTop = last.height / 2;
            let paddingBottom = first.height / 2;
            if (align === 'start') {
                paddingTop = 0;
                paddingBottom = first.height;
            } else if (align === 'end') {
                paddingTop = last.height;
                paddingBottom = 0;
            }
            this.paddingTop = paddingTop + padding;
            this.paddingBottom = paddingBottom + padding;
        }
    }
 _handleMargins() {
        if (this._margins) {
            this._margins.left = Math.max(this.paddingLeft, this._margins.left);
            this._margins.top = Math.max(this.paddingTop, this._margins.top);
            this._margins.right = Math.max(this.paddingRight, this._margins.right);
            this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
        }
    }
    afterFit() {
        callback(this.options.afterFit, [
            this
        ]);
    }
 isHorizontal() {
        const { axis , position  } = this.options;
        return position === 'top' || position === 'bottom' || axis === 'x';
    }
 isFullSize() {
        return this.options.fullSize;
    }
 _convertTicksToLabels(ticks) {
        this.beforeTickToLabelConversion();
        this.generateTickLabels(ticks);
        let i, ilen;
        for(i = 0, ilen = ticks.length; i < ilen; i++){
            if (isNullOrUndef(ticks[i].label)) {
                ticks.splice(i, 1);
                ilen--;
                i--;
            }
        }
        this.afterTickToLabelConversion();
    }
 _getLabelSizes() {
        let labelSizes = this._labelSizes;
        if (!labelSizes) {
            const sampleSize = this.options.ticks.sampleSize;
            let ticks = this.ticks;
            if (sampleSize < ticks.length) {
                ticks = sample(ticks, sampleSize);
            }
            this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
        }
        return labelSizes;
    }
 _computeLabelSizes(ticks, length, maxTicksLimit) {
        const { ctx , _longestTextCache: caches  } = this;
        const widths = [];
        const heights = [];
        const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
        let widestLabelSize = 0;
        let highestLabelSize = 0;
        let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
        for(i = 0; i < length; i += increment){
            label = ticks[i].label;
            tickFont = this._resolveTickFontOptions(i);
            ctx.font = fontString = tickFont.string;
            cache = caches[fontString] = caches[fontString] || {
                data: {},
                gc: []
            };
            lineHeight = tickFont.lineHeight;
            width = height = 0;
            if (!isNullOrUndef(label) && !isArray(label)) {
                width = _measureText(ctx, cache.data, cache.gc, width, label);
                height = lineHeight;
            } else if (isArray(label)) {
                for(j = 0, jlen = label.length; j < jlen; ++j){
                    nestedLabel =  label[j];
                    if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                        width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                        height += lineHeight;
                    }
                }
            }
            widths.push(width);
            heights.push(height);
            widestLabelSize = Math.max(width, widestLabelSize);
            highestLabelSize = Math.max(height, highestLabelSize);
        }
        garbageCollect(caches, length);
        const widest = widths.indexOf(widestLabelSize);
        const highest = heights.indexOf(highestLabelSize);
        const valueAt = (idx)=>({
                width: widths[idx] || 0,
                height: heights[idx] || 0
            });
        return {
            first: valueAt(0),
            last: valueAt(length - 1),
            widest: valueAt(widest),
            highest: valueAt(highest),
            widths,
            heights
        };
    }
 getLabelForValue(value) {
        return value;
    }
 getPixelForValue(value, index) {
        return NaN;
    }
 getValueForPixel(pixel) {}
 getPixelForTick(index) {
        const ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
            return null;
        }
        return this.getPixelForValue(ticks[index].value);
    }
 getPixelForDecimal(decimal) {
        if (this._reversePixels) {
            decimal = 1 - decimal;
        }
        const pixel = this._startPixel + decimal * this._length;
        return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
    }
 getDecimalForPixel(pixel) {
        const decimal = (pixel - this._startPixel) / this._length;
        return this._reversePixels ? 1 - decimal : decimal;
    }
 getBasePixel() {
        return this.getPixelForValue(this.getBaseValue());
    }
 getBaseValue() {
        const { min , max  } = this;
        return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
    }
 getContext(index) {
        const ticks = this.ticks || [];
        if (index >= 0 && index < ticks.length) {
            const tick = ticks[index];
            return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
        }
        return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
    }
 _tickSize() {
        const optionTicks = this.options.ticks;
        const rot = toRadians(this.labelRotation);
        const cos = Math.abs(Math.cos(rot));
        const sin = Math.abs(Math.sin(rot));
        const labelSizes = this._getLabelSizes();
        const padding = optionTicks.autoSkipPadding || 0;
        const w = labelSizes ? labelSizes.widest.width + padding : 0;
        const h = labelSizes ? labelSizes.highest.height + padding : 0;
        return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
    }
 _isVisible() {
        const display = this.options.display;
        if (display !== 'auto') {
            return !!display;
        }
        return this.getMatchingVisibleMetas().length > 0;
    }
 _computeGridLineItems(chartArea) {
        const axis = this.axis;
        const chart = this.chart;
        const options = this.options;
        const { grid , position , border  } = options;
        const offset = grid.offset;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const ticksLength = ticks.length + (offset ? 1 : 0);
        const tl = getTickMarkLength(grid);
        const items = [];
        const borderOpts = border.setContext(this.getContext());
        const axisWidth = borderOpts.display ? borderOpts.width : 0;
        const axisHalfWidth = axisWidth / 2;
        const alignBorderValue = function(pixel) {
            return _alignPixel(chart, pixel, axisWidth);
        };
        let borderValue, i, lineValue, alignedLineValue;
        let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
        if (position === 'top') {
            borderValue = alignBorderValue(this.bottom);
            ty1 = this.bottom - tl;
            ty2 = borderValue - axisHalfWidth;
            y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
            y2 = chartArea.bottom;
        } else if (position === 'bottom') {
            borderValue = alignBorderValue(this.top);
            y1 = chartArea.top;
            y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
            ty1 = borderValue + axisHalfWidth;
            ty2 = this.top + tl;
        } else if (position === 'left') {
            borderValue = alignBorderValue(this.right);
            tx1 = this.right - tl;
            tx2 = borderValue - axisHalfWidth;
            x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
            x2 = chartArea.right;
        } else if (position === 'right') {
            borderValue = alignBorderValue(this.left);
            x1 = chartArea.left;
            x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
            tx1 = borderValue + axisHalfWidth;
            tx2 = this.left + tl;
        } else if (axis === 'x') {
            if (position === 'center') {
                borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
            } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
            }
            y1 = chartArea.top;
            y2 = chartArea.bottom;
            ty1 = borderValue + axisHalfWidth;
            ty2 = ty1 + tl;
        } else if (axis === 'y') {
            if (position === 'center') {
                borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
            } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
            }
            tx1 = borderValue - axisHalfWidth;
            tx2 = tx1 - tl;
            x1 = chartArea.left;
            x2 = chartArea.right;
        }
        const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
        const step = Math.max(1, Math.ceil(ticksLength / limit));
        for(i = 0; i < ticksLength; i += step){
            const context = this.getContext(i);
            const optsAtIndex = grid.setContext(context);
            const optsAtIndexBorder = border.setContext(context);
            const lineWidth = optsAtIndex.lineWidth;
            const lineColor = optsAtIndex.color;
            const borderDash = optsAtIndexBorder.dash || [];
            const borderDashOffset = optsAtIndexBorder.dashOffset;
            const tickWidth = optsAtIndex.tickWidth;
            const tickColor = optsAtIndex.tickColor;
            const tickBorderDash = optsAtIndex.tickBorderDash || [];
            const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
            lineValue = getPixelForGridLine(this, i, offset);
            if (lineValue === undefined) {
                continue;
            }
            alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
            if (isHorizontal) {
                tx1 = tx2 = x1 = x2 = alignedLineValue;
            } else {
                ty1 = ty2 = y1 = y2 = alignedLineValue;
            }
            items.push({
                tx1,
                ty1,
                tx2,
                ty2,
                x1,
                y1,
                x2,
                y2,
                width: lineWidth,
                color: lineColor,
                borderDash,
                borderDashOffset,
                tickWidth,
                tickColor,
                tickBorderDash,
                tickBorderDashOffset
            });
        }
        this._ticksLength = ticksLength;
        this._borderValue = borderValue;
        return items;
    }
 _computeLabelItems(chartArea) {
        const axis = this.axis;
        const options = this.options;
        const { position , ticks: optionTicks  } = options;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const { align , crossAlign , padding , mirror  } = optionTicks;
        const tl = getTickMarkLength(options.grid);
        const tickAndPadding = tl + padding;
        const hTickAndPadding = mirror ? -padding : tickAndPadding;
        const rotation = -toRadians(this.labelRotation);
        const items = [];
        let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
        let textBaseline = 'middle';
        if (position === 'top') {
            y = this.bottom - hTickAndPadding;
            textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'bottom') {
            y = this.top + hTickAndPadding;
            textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'left') {
            const ret = this._getYAxisLabelAlignment(tl);
            textAlign = ret.textAlign;
            x = ret.x;
        } else if (position === 'right') {
            const ret = this._getYAxisLabelAlignment(tl);
            textAlign = ret.textAlign;
            x = ret.x;
        } else if (axis === 'x') {
            if (position === 'center') {
                y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
            } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
            }
            textAlign = this._getXAxisLabelAlignment();
        } else if (axis === 'y') {
            if (position === 'center') {
                x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
            } else if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                x = this.chart.scales[positionAxisID].getPixelForValue(value);
            }
            textAlign = this._getYAxisLabelAlignment(tl).textAlign;
        }
        if (axis === 'y') {
            if (align === 'start') {
                textBaseline = 'top';
            } else if (align === 'end') {
                textBaseline = 'bottom';
            }
        }
        const labelSizes = this._getLabelSizes();
        for(i = 0, ilen = ticks.length; i < ilen; ++i){
            tick = ticks[i];
            label = tick.label;
            const optsAtIndex = optionTicks.setContext(this.getContext(i));
            pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
            font = this._resolveTickFontOptions(i);
            lineHeight = font.lineHeight;
            lineCount = isArray(label) ? label.length : 1;
            const halfCount = lineCount / 2;
            const color = optsAtIndex.color;
            const strokeColor = optsAtIndex.textStrokeColor;
            const strokeWidth = optsAtIndex.textStrokeWidth;
            let tickTextAlign = textAlign;
            if (isHorizontal) {
                x = pixel;
                if (textAlign === 'inner') {
                    if (i === ilen - 1) {
                        tickTextAlign = !this.options.reverse ? 'right' : 'left';
                    } else if (i === 0) {
                        tickTextAlign = !this.options.reverse ? 'left' : 'right';
                    } else {
                        tickTextAlign = 'center';
                    }
                }
                if (position === 'top') {
                    if (crossAlign === 'near' || rotation !== 0) {
                        textOffset = -lineCount * lineHeight + lineHeight / 2;
                    } else if (crossAlign === 'center') {
                        textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                    } else {
                        textOffset = -labelSizes.highest.height + lineHeight / 2;
                    }
                } else {
                    if (crossAlign === 'near' || rotation !== 0) {
                        textOffset = lineHeight / 2;
                    } else if (crossAlign === 'center') {
                        textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                    } else {
                        textOffset = labelSizes.highest.height - lineCount * lineHeight;
                    }
                }
                if (mirror) {
                    textOffset *= -1;
                }
                if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
                    x += lineHeight / 2 * Math.sin(rotation);
                }
            } else {
                y = pixel;
                textOffset = (1 - lineCount) * lineHeight / 2;
            }
            let backdrop;
            if (optsAtIndex.showLabelBackdrop) {
                const labelPadding = toPadding(optsAtIndex.backdropPadding);
                const height = labelSizes.heights[i];
                const width = labelSizes.widths[i];
                let top = textOffset - labelPadding.top;
                let left = 0 - labelPadding.left;
                switch(textBaseline){
                    case 'middle':
                        top -= height / 2;
                        break;
                    case 'bottom':
                        top -= height;
                        break;
                }
                switch(textAlign){
                    case 'center':
                        left -= width / 2;
                        break;
                    case 'right':
                        left -= width;
                        break;
                    case 'inner':
                        if (i === ilen - 1) {
                            left -= width;
                        } else if (i > 0) {
                            left -= width / 2;
                        }
                        break;
                }
                backdrop = {
                    left,
                    top,
                    width: width + labelPadding.width,
                    height: height + labelPadding.height,
                    color: optsAtIndex.backdropColor
                };
            }
            items.push({
                label,
                font,
                textOffset,
                options: {
                    rotation,
                    color,
                    strokeColor,
                    strokeWidth,
                    textAlign: tickTextAlign,
                    textBaseline,
                    translation: [
                        x,
                        y
                    ],
                    backdrop
                }
            });
        }
        return items;
    }
    _getXAxisLabelAlignment() {
        const { position , ticks  } = this.options;
        const rotation = -toRadians(this.labelRotation);
        if (rotation) {
            return position === 'top' ? 'left' : 'right';
        }
        let align = 'center';
        if (ticks.align === 'start') {
            align = 'left';
        } else if (ticks.align === 'end') {
            align = 'right';
        } else if (ticks.align === 'inner') {
            align = 'inner';
        }
        return align;
    }
    _getYAxisLabelAlignment(tl) {
        const { position , ticks: { crossAlign , mirror , padding  }  } = this.options;
        const labelSizes = this._getLabelSizes();
        const tickAndPadding = tl + padding;
        const widest = labelSizes.widest.width;
        let textAlign;
        let x;
        if (position === 'left') {
            if (mirror) {
                x = this.right + padding;
                if (crossAlign === 'near') {
                    textAlign = 'left';
                } else if (crossAlign === 'center') {
                    textAlign = 'center';
                    x += widest / 2;
                } else {
                    textAlign = 'right';
                    x += widest;
                }
            } else {
                x = this.right - tickAndPadding;
                if (crossAlign === 'near') {
                    textAlign = 'right';
                } else if (crossAlign === 'center') {
                    textAlign = 'center';
                    x -= widest / 2;
                } else {
                    textAlign = 'left';
                    x = this.left;
                }
            }
        } else if (position === 'right') {
            if (mirror) {
                x = this.left + padding;
                if (crossAlign === 'near') {
                    textAlign = 'right';
                } else if (crossAlign === 'center') {
                    textAlign = 'center';
                    x -= widest / 2;
                } else {
                    textAlign = 'left';
                    x -= widest;
                }
            } else {
                x = this.left + tickAndPadding;
                if (crossAlign === 'near') {
                    textAlign = 'left';
                } else if (crossAlign === 'center') {
                    textAlign = 'center';
                    x += widest / 2;
                } else {
                    textAlign = 'right';
                    x = this.right;
                }
            }
        } else {
            textAlign = 'right';
        }
        return {
            textAlign,
            x
        };
    }
 _computeLabelArea() {
        if (this.options.ticks.mirror) {
            return;
        }
        const chart = this.chart;
        const position = this.options.position;
        if (position === 'left' || position === 'right') {
            return {
                top: 0,
                left: this.left,
                bottom: chart.height,
                right: this.right
            };
        }
        if (position === 'top' || position === 'bottom') {
            return {
                top: this.top,
                left: 0,
                bottom: this.bottom,
                right: chart.width
            };
        }
    }
 drawBackground() {
        const { ctx , options: { backgroundColor  } , left , top , width , height  } = this;
        if (backgroundColor) {
            ctx.save();
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(left, top, width, height);
            ctx.restore();
        }
    }
    getLineWidthForValue(value) {
        const grid = this.options.grid;
        if (!this._isVisible() || !grid.display) {
            return 0;
        }
        const ticks = this.ticks;
        const index = ticks.findIndex((t)=>t.value === value);
        if (index >= 0) {
            const opts = grid.setContext(this.getContext(index));
            return opts.lineWidth;
        }
        return 0;
    }
 drawGrid(chartArea) {
        const grid = this.options.grid;
        const ctx = this.ctx;
        const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
        let i, ilen;
        const drawLine = (p1, p2, style)=>{
            if (!style.width || !style.color) {
                return;
            }
            ctx.save();
            ctx.lineWidth = style.width;
            ctx.strokeStyle = style.color;
            ctx.setLineDash(style.borderDash || []);
            ctx.lineDashOffset = style.borderDashOffset;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
        };
        if (grid.display) {
            for(i = 0, ilen = items.length; i < ilen; ++i){
                const item = items[i];
                if (grid.drawOnChartArea) {
                    drawLine({
                        x: item.x1,
                        y: item.y1
                    }, {
                        x: item.x2,
                        y: item.y2
                    }, item);
                }
                if (grid.drawTicks) {
                    drawLine({
                        x: item.tx1,
                        y: item.ty1
                    }, {
                        x: item.tx2,
                        y: item.ty2
                    }, {
                        color: item.tickColor,
                        width: item.tickWidth,
                        borderDash: item.tickBorderDash,
                        borderDashOffset: item.tickBorderDashOffset
                    });
                }
            }
        }
    }
 drawBorder() {
        const { chart , ctx , options: { border , grid  }  } = this;
        const borderOpts = border.setContext(this.getContext());
        const axisWidth = border.display ? borderOpts.width : 0;
        if (!axisWidth) {
            return;
        }
        const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
        const borderValue = this._borderValue;
        let x1, x2, y1, y2;
        if (this.isHorizontal()) {
            x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
            x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
            y1 = y2 = borderValue;
        } else {
            y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
            y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
            x1 = x2 = borderValue;
        }
        ctx.save();
        ctx.lineWidth = borderOpts.width;
        ctx.strokeStyle = borderOpts.color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
 drawLabels(chartArea) {
        const optionTicks = this.options.ticks;
        if (!optionTicks.display) {
            return;
        }
        const ctx = this.ctx;
        const area = this._computeLabelArea();
        if (area) {
            clipArea(ctx, area);
        }
        const items = this.getLabelItems(chartArea);
        for (const item of items){
            const renderTextOptions = item.options;
            const tickFont = item.font;
            const label = item.label;
            const y = item.textOffset;
            renderText(ctx, label, 0, y, tickFont, renderTextOptions);
        }
        if (area) {
            unclipArea(ctx);
        }
    }
 drawTitle() {
        const { ctx , options: { position , title , reverse  }  } = this;
        if (!title.display) {
            return;
        }
        const font = toFont(title.font);
        const padding = toPadding(title.padding);
        const align = title.align;
        let offset = font.lineHeight / 2;
        if (position === 'bottom' || position === 'center' || isObject(position)) {
            offset += padding.bottom;
            if (isArray(title.text)) {
                offset += font.lineHeight * (title.text.length - 1);
            }
        } else {
            offset += padding.top;
        }
        const { titleX , titleY , maxWidth , rotation  } = titleArgs(this, offset, position, align);
        renderText(ctx, title.text, 0, 0, font, {
            color: title.color,
            maxWidth,
            rotation,
            textAlign: titleAlign(align, position, reverse),
            textBaseline: 'middle',
            translation: [
                titleX,
                titleY
            ]
        });
    }
    draw(chartArea) {
        if (!this._isVisible()) {
            return;
        }
        this.drawBackground();
        this.drawGrid(chartArea);
        this.drawBorder();
        this.drawTitle();
        this.drawLabels(chartArea);
    }
 _layers() {
        const opts = this.options;
        const tz = opts.ticks && opts.ticks.z || 0;
        const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
        const bz = valueOrDefault(opts.border && opts.border.z, 0);
        if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
            return [
                {
                    z: tz,
                    draw: (chartArea)=>{
                        this.draw(chartArea);
                    }
                }
            ];
        }
        return [
            {
                z: gz,
                draw: (chartArea)=>{
                    this.drawBackground();
                    this.drawGrid(chartArea);
                    this.drawTitle();
                }
            },
            {
                z: bz,
                draw: ()=>{
                    this.drawBorder();
                }
            },
            {
                z: tz,
                draw: (chartArea)=>{
                    this.drawLabels(chartArea);
                }
            }
        ];
    }
 getMatchingVisibleMetas(type) {
        const metas = this.chart.getSortedVisibleDatasetMetas();
        const axisID = this.axis + 'AxisID';
        const result = [];
        let i, ilen;
        for(i = 0, ilen = metas.length; i < ilen; ++i){
            const meta = metas[i];
            if (meta[axisID] === this.id && (!type || meta.type === type)) {
                result.push(meta);
            }
        }
        return result;
    }
 _resolveTickFontOptions(index) {
        const opts = this.options.ticks.setContext(this.getContext(index));
        return toFont(opts.font);
    }
 _maxDigits() {
        const fontSize = this._resolveTickFontOptions(0).lineHeight;
        return (this.isHorizontal() ? this.width : this.height) / fontSize;
    }
}

class TypedRegistry {
    constructor(type, scope, override){
        this.type = type;
        this.scope = scope;
        this.override = override;
        this.items = Object.create(null);
    }
    isForType(type) {
        return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
    }
 register(item) {
        const proto = Object.getPrototypeOf(item);
        let parentScope;
        if (isIChartComponent(proto)) {
            parentScope = this.register(proto);
        }
        const items = this.items;
        const id = item.id;
        const scope = this.scope + '.' + id;
        if (!id) {
            throw new Error('class does not have id: ' + item);
        }
        if (id in items) {
            return scope;
        }
        items[id] = item;
        registerDefaults(item, scope, parentScope);
        if (this.override) {
            defaults.override(item.id, item.overrides);
        }
        return scope;
    }
 get(id) {
        return this.items[id];
    }
 unregister(item) {
        const items = this.items;
        const id = item.id;
        const scope = this.scope;
        if (id in items) {
            delete items[id];
        }
        if (scope && id in defaults[scope]) {
            delete defaults[scope][id];
            if (this.override) {
                delete overrides[id];
            }
        }
    }
}
function registerDefaults(item, scope, parentScope) {
    const itemDefaults = merge(Object.create(null), [
        parentScope ? defaults.get(parentScope) : {},
        defaults.get(scope),
        item.defaults
    ]);
    defaults.set(scope, itemDefaults);
    if (item.defaultRoutes) {
        routeDefaults(scope, item.defaultRoutes);
    }
    if (item.descriptors) {
        defaults.describe(scope, item.descriptors);
    }
}
function routeDefaults(scope, routes) {
    Object.keys(routes).forEach((property)=>{
        const propertyParts = property.split('.');
        const sourceName = propertyParts.pop();
        const sourceScope = [
            scope
        ].concat(propertyParts).join('.');
        const parts = routes[property].split('.');
        const targetName = parts.pop();
        const targetScope = parts.join('.');
        defaults.route(sourceScope, sourceName, targetScope, targetName);
    });
}
function isIChartComponent(proto) {
    return 'id' in proto && 'defaults' in proto;
}

class Registry {
    constructor(){
        this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
        this.elements = new TypedRegistry(Element, 'elements');
        this.plugins = new TypedRegistry(Object, 'plugins');
        this.scales = new TypedRegistry(Scale, 'scales');
        this._typedRegistries = [
            this.controllers,
            this.scales,
            this.elements
        ];
    }
 add(...args) {
        this._each('register', args);
    }
    remove(...args) {
        this._each('unregister', args);
    }
 addControllers(...args) {
        this._each('register', args, this.controllers);
    }
 addElements(...args) {
        this._each('register', args, this.elements);
    }
 addPlugins(...args) {
        this._each('register', args, this.plugins);
    }
 addScales(...args) {
        this._each('register', args, this.scales);
    }
 getController(id) {
        return this._get(id, this.controllers, 'controller');
    }
 getElement(id) {
        return this._get(id, this.elements, 'element');
    }
 getPlugin(id) {
        return this._get(id, this.plugins, 'plugin');
    }
 getScale(id) {
        return this._get(id, this.scales, 'scale');
    }
 removeControllers(...args) {
        this._each('unregister', args, this.controllers);
    }
 removeElements(...args) {
        this._each('unregister', args, this.elements);
    }
 removePlugins(...args) {
        this._each('unregister', args, this.plugins);
    }
 removeScales(...args) {
        this._each('unregister', args, this.scales);
    }
 _each(method, args, typedRegistry) {
        [
            ...args
        ].forEach((arg)=>{
            const reg = typedRegistry || this._getRegistryForType(arg);
            if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
                this._exec(method, reg, arg);
            } else {
                each(arg, (item)=>{
                    const itemReg = typedRegistry || this._getRegistryForType(item);
                    this._exec(method, itemReg, item);
                });
            }
        });
    }
 _exec(method, registry, component) {
        const camelMethod = _capitalize(method);
        callback(component['before' + camelMethod], [], component);
        registry[method](component);
        callback(component['after' + camelMethod], [], component);
    }
 _getRegistryForType(type) {
        for(let i = 0; i < this._typedRegistries.length; i++){
            const reg = this._typedRegistries[i];
            if (reg.isForType(type)) {
                return reg;
            }
        }
        return this.plugins;
    }
 _get(id, typedRegistry, type) {
        const item = typedRegistry.get(id);
        if (item === undefined) {
            throw new Error('"' + id + '" is not a registered ' + type + '.');
        }
        return item;
    }
}
var registry = /* #__PURE__ */ new Registry();

class PluginService {
    constructor(){
        this._init = [];
    }
 notify(chart, hook, args, filter) {
        if (hook === 'beforeInit') {
            this._init = this._createDescriptors(chart, true);
            this._notify(this._init, chart, 'install');
        }
        const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
        const result = this._notify(descriptors, chart, hook, args);
        if (hook === 'afterDestroy') {
            this._notify(descriptors, chart, 'stop');
            this._notify(this._init, chart, 'uninstall');
        }
        return result;
    }
 _notify(descriptors, chart, hook, args) {
        args = args || {};
        for (const descriptor of descriptors){
            const plugin = descriptor.plugin;
            const method = plugin[hook];
            const params = [
                chart,
                args,
                descriptor.options
            ];
            if (callback(method, params, plugin) === false && args.cancelable) {
                return false;
            }
        }
        return true;
    }
    invalidate() {
        if (!isNullOrUndef(this._cache)) {
            this._oldCache = this._cache;
            this._cache = undefined;
        }
    }
 _descriptors(chart) {
        if (this._cache) {
            return this._cache;
        }
        const descriptors = this._cache = this._createDescriptors(chart);
        this._notifyStateChanges(chart);
        return descriptors;
    }
    _createDescriptors(chart, all) {
        const config = chart && chart.config;
        const options = valueOrDefault(config.options && config.options.plugins, {});
        const plugins = allPlugins(config);
        return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
    }
 _notifyStateChanges(chart) {
        const previousDescriptors = this._oldCache || [];
        const descriptors = this._cache;
        const diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.plugin.id === y.plugin.id));
        this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
        this._notify(diff(descriptors, previousDescriptors), chart, 'start');
    }
}
 function allPlugins(config) {
    const localIds = {};
    const plugins = [];
    const keys = Object.keys(registry.plugins.items);
    for(let i = 0; i < keys.length; i++){
        plugins.push(registry.getPlugin(keys[i]));
    }
    const local = config.plugins || [];
    for(let i = 0; i < local.length; i++){
        const plugin = local[i];
        if (plugins.indexOf(plugin) === -1) {
            plugins.push(plugin);
            localIds[plugin.id] = true;
        }
    }
    return {
        plugins,
        localIds
    };
}
function getOpts(options, all) {
    if (!all && options === false) {
        return null;
    }
    if (options === true) {
        return {};
    }
    return options;
}
function createDescriptors(chart, { plugins , localIds  }, options, all) {
    const result = [];
    const context = chart.getContext();
    for (const plugin of plugins){
        const id = plugin.id;
        const opts = getOpts(options[id], all);
        if (opts === null) {
            continue;
        }
        result.push({
            plugin,
            options: pluginOpts(chart.config, {
                plugin,
                local: localIds[id]
            }, opts, context)
        });
    }
    return result;
}
function pluginOpts(config, { plugin , local  }, opts, context) {
    const keys = config.pluginScopeKeys(plugin);
    const scopes = config.getOptionScopes(opts, keys);
    if (local && plugin.defaults) {
        scopes.push(plugin.defaults);
    }
    return config.createResolver(scopes, context, [
        ''
    ], {
        scriptable: false,
        indexable: false,
        allKeys: true
    });
}

function getIndexAxis(type, options) {
    const datasetDefaults = defaults.datasets[type] || {};
    const datasetOptions = (options.datasets || {})[type] || {};
    return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
}
function getAxisFromDefaultScaleID(id, indexAxis) {
    let axis = id;
    if (id === '_index_') {
        axis = indexAxis;
    } else if (id === '_value_') {
        axis = indexAxis === 'x' ? 'y' : 'x';
    }
    return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
    return axis === indexAxis ? '_index_' : '_value_';
}
function idMatchesAxis(id) {
    if (id === 'x' || id === 'y' || id === 'r') {
        return id;
    }
}
function axisFromPosition(position) {
    if (position === 'top' || position === 'bottom') {
        return 'x';
    }
    if (position === 'left' || position === 'right') {
        return 'y';
    }
}
function determineAxis(id, ...scaleOptions) {
    if (idMatchesAxis(id)) {
        return id;
    }
    for (const opts of scaleOptions){
        const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
        if (axis) {
            return axis;
        }
    }
    throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
}
function getAxisFromDataset(id, axis, dataset) {
    if (dataset[axis + 'AxisID'] === id) {
        return {
            axis
        };
    }
}
function retrieveAxisFromDatasets(id, config) {
    if (config.data && config.data.datasets) {
        const boundDs = config.data.datasets.filter((d)=>d.xAxisID === id || d.yAxisID === id);
        if (boundDs.length) {
            return getAxisFromDataset(id, 'x', boundDs[0]) || getAxisFromDataset(id, 'y', boundDs[0]);
        }
    }
    return {};
}
function mergeScaleConfig(config, options) {
    const chartDefaults = overrides[config.type] || {
        scales: {}
    };
    const configScales = options.scales || {};
    const chartIndexAxis = getIndexAxis(config.type, options);
    const scales = Object.create(null);
    Object.keys(configScales).forEach((id)=>{
        const scaleConf = configScales[id];
        if (!isObject(scaleConf)) {
            return console.error(`Invalid scale configuration for scale: ${id}`);
        }
        if (scaleConf._proxy) {
            return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
        }
        const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
        const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
        const defaultScaleOptions = chartDefaults.scales || {};
        scales[id] = mergeIf(Object.create(null), [
            {
                axis
            },
            scaleConf,
            defaultScaleOptions[axis],
            defaultScaleOptions[defaultId]
        ]);
    });
    config.data.datasets.forEach((dataset)=>{
        const type = dataset.type || config.type;
        const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
        const datasetDefaults = overrides[type] || {};
        const defaultScaleOptions = datasetDefaults.scales || {};
        Object.keys(defaultScaleOptions).forEach((defaultID)=>{
            const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
            const id = dataset[axis + 'AxisID'] || axis;
            scales[id] = scales[id] || Object.create(null);
            mergeIf(scales[id], [
                {
                    axis
                },
                configScales[id],
                defaultScaleOptions[defaultID]
            ]);
        });
    });
    Object.keys(scales).forEach((key)=>{
        const scale = scales[key];
        mergeIf(scale, [
            defaults.scales[scale.type],
            defaults.scale
        ]);
    });
    return scales;
}
function initOptions(config) {
    const options = config.options || (config.options = {});
    options.plugins = valueOrDefault(options.plugins, {});
    options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
    data = data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    return data;
}
function initConfig(config) {
    config = config || {};
    config.data = initData(config.data);
    initOptions(config);
    return config;
}
const keyCache = new Map();
const keysCached = new Set();
function cachedKeys(cacheKey, generate) {
    let keys = keyCache.get(cacheKey);
    if (!keys) {
        keys = generate();
        keyCache.set(cacheKey, keys);
        keysCached.add(keys);
    }
    return keys;
}
const addIfFound = (set, obj, key)=>{
    const opts = resolveObjectKey(obj, key);
    if (opts !== undefined) {
        set.add(opts);
    }
};
class Config {
    constructor(config){
        this._config = initConfig(config);
        this._scopeCache = new Map();
        this._resolverCache = new Map();
    }
    get platform() {
        return this._config.platform;
    }
    get type() {
        return this._config.type;
    }
    set type(type) {
        this._config.type = type;
    }
    get data() {
        return this._config.data;
    }
    set data(data) {
        this._config.data = initData(data);
    }
    get options() {
        return this._config.options;
    }
    set options(options) {
        this._config.options = options;
    }
    get plugins() {
        return this._config.plugins;
    }
    update() {
        const config = this._config;
        this.clearCache();
        initOptions(config);
    }
    clearCache() {
        this._scopeCache.clear();
        this._resolverCache.clear();
    }
 datasetScopeKeys(datasetType) {
        return cachedKeys(datasetType, ()=>[
                [
                    `datasets.${datasetType}`,
                    ''
                ]
            ]);
    }
 datasetAnimationScopeKeys(datasetType, transition) {
        return cachedKeys(`${datasetType}.transition.${transition}`, ()=>[
                [
                    `datasets.${datasetType}.transitions.${transition}`,
                    `transitions.${transition}`
                ],
                [
                    `datasets.${datasetType}`,
                    ''
                ]
            ]);
    }
 datasetElementScopeKeys(datasetType, elementType) {
        return cachedKeys(`${datasetType}-${elementType}`, ()=>[
                [
                    `datasets.${datasetType}.elements.${elementType}`,
                    `datasets.${datasetType}`,
                    `elements.${elementType}`,
                    ''
                ]
            ]);
    }
 pluginScopeKeys(plugin) {
        const id = plugin.id;
        const type = this.type;
        return cachedKeys(`${type}-plugin-${id}`, ()=>[
                [
                    `plugins.${id}`,
                    ...plugin.additionalOptionScopes || []
                ]
            ]);
    }
 _cachedScopes(mainScope, resetCache) {
        const _scopeCache = this._scopeCache;
        let cache = _scopeCache.get(mainScope);
        if (!cache || resetCache) {
            cache = new Map();
            _scopeCache.set(mainScope, cache);
        }
        return cache;
    }
 getOptionScopes(mainScope, keyLists, resetCache) {
        const { options , type  } = this;
        const cache = this._cachedScopes(mainScope, resetCache);
        const cached = cache.get(keyLists);
        if (cached) {
            return cached;
        }
        const scopes = new Set();
        keyLists.forEach((keys)=>{
            if (mainScope) {
                scopes.add(mainScope);
                keys.forEach((key)=>addIfFound(scopes, mainScope, key));
            }
            keys.forEach((key)=>addIfFound(scopes, options, key));
            keys.forEach((key)=>addIfFound(scopes, overrides[type] || {}, key));
            keys.forEach((key)=>addIfFound(scopes, defaults, key));
            keys.forEach((key)=>addIfFound(scopes, descriptors, key));
        });
        const array = Array.from(scopes);
        if (array.length === 0) {
            array.push(Object.create(null));
        }
        if (keysCached.has(keyLists)) {
            cache.set(keyLists, array);
        }
        return array;
    }
 chartOptionScopes() {
        const { options , type  } = this;
        return [
            options,
            overrides[type] || {},
            defaults.datasets[type] || {},
            {
                type
            },
            defaults,
            descriptors
        ];
    }
 resolveNamedOptions(scopes, names, context, prefixes = [
        ''
    ]) {
        const result = {
            $shared: true
        };
        const { resolver , subPrefixes  } = getResolver(this._resolverCache, scopes, prefixes);
        let options = resolver;
        if (needContext(resolver, names)) {
            result.$shared = false;
            context = isFunction(context) ? context() : context;
            const subResolver = this.createResolver(scopes, context, subPrefixes);
            options = _attachContext(resolver, context, subResolver);
        }
        for (const prop of names){
            result[prop] = options[prop];
        }
        return result;
    }
 createResolver(scopes, context, prefixes = [
        ''
    ], descriptorDefaults) {
        const { resolver  } = getResolver(this._resolverCache, scopes, prefixes);
        return isObject(context) ? _attachContext(resolver, context, undefined, descriptorDefaults) : resolver;
    }
}
function getResolver(resolverCache, scopes, prefixes) {
    let cache = resolverCache.get(scopes);
    if (!cache) {
        cache = new Map();
        resolverCache.set(scopes, cache);
    }
    const cacheKey = prefixes.join();
    let cached = cache.get(cacheKey);
    if (!cached) {
        const resolver = _createResolver(scopes, prefixes);
        cached = {
            resolver,
            subPrefixes: prefixes.filter((p)=>!p.toLowerCase().includes('hover'))
        };
        cache.set(cacheKey, cached);
    }
    return cached;
}
const hasFunction = (value)=>isObject(value) && Object.getOwnPropertyNames(value).some((key)=>isFunction(value[key]));
function needContext(proxy, names) {
    const { isScriptable , isIndexable  } = _descriptors(proxy);
    for (const prop of names){
        const scriptable = isScriptable(prop);
        const indexable = isIndexable(prop);
        const value = (indexable || scriptable) && proxy[prop];
        if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
            return true;
        }
    }
    return false;
}

var version = "4.4.9";

const KNOWN_POSITIONS = [
    'top',
    'bottom',
    'left',
    'right',
    'chartArea'
];
function positionIsHorizontal(position, axis) {
    return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x';
}
function compare2Level(l1, l2) {
    return function(a, b) {
        return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
    };
}
function onAnimationsComplete(context) {
    const chart = context.chart;
    const animationOptions = chart.options.animation;
    chart.notifyPlugins('afterRender');
    callback(animationOptions && animationOptions.onComplete, [
        context
    ], chart);
}
function onAnimationProgress(context) {
    const chart = context.chart;
    const animationOptions = chart.options.animation;
    callback(animationOptions && animationOptions.onProgress, [
        context
    ], chart);
}
 function getCanvas(item) {
    if (_isDomSupported() && typeof item === 'string') {
        item = document.getElementById(item);
    } else if (item && item.length) {
        item = item[0];
    }
    if (item && item.canvas) {
        item = item.canvas;
    }
    return item;
}
const instances = {};
const getChart = (key)=>{
    const canvas = getCanvas(key);
    return Object.values(instances).filter((c)=>c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
    const keys = Object.keys(obj);
    for (const key of keys){
        const intKey = +key;
        if (intKey >= start) {
            const value = obj[key];
            delete obj[key];
            if (move > 0 || intKey > start) {
                obj[intKey + move] = value;
            }
        }
    }
}
 function determineLastEvent(e, lastEvent, inChartArea, isClick) {
    if (!inChartArea || e.type === 'mouseout') {
        return null;
    }
    if (isClick) {
        return lastEvent;
    }
    return e;
}
class Chart {
    static defaults = defaults;
    static instances = instances;
    static overrides = overrides;
    static registry = registry;
    static version = version;
    static getChart = getChart;
    static register(...items) {
        registry.add(...items);
        invalidatePlugins();
    }
    static unregister(...items) {
        registry.remove(...items);
        invalidatePlugins();
    }
    constructor(item, userConfig){
        const config = this.config = new Config(userConfig);
        const initialCanvas = getCanvas(item);
        const existingChart = getChart(initialCanvas);
        if (existingChart) {
            throw new Error('Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' + ' must be destroyed before the canvas with ID \'' + existingChart.canvas.id + '\' can be reused.');
        }
        const options = config.createResolver(config.chartOptionScopes(), this.getContext());
        this.platform = new (config.platform || _detectPlatform(initialCanvas))();
        this.platform.updateConfig(config);
        const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
        const canvas = context && context.canvas;
        const height = canvas && canvas.height;
        const width = canvas && canvas.width;
        this.id = uid();
        this.ctx = context;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this._options = options;
        this._aspectRatio = this.aspectRatio;
        this._layers = [];
        this._metasets = [];
        this._stacks = undefined;
        this.boxes = [];
        this.currentDevicePixelRatio = undefined;
        this.chartArea = undefined;
        this._active = [];
        this._lastEvent = undefined;
        this._listeners = {};
         this._responsiveListeners = undefined;
        this._sortedMetasets = [];
        this.scales = {};
        this._plugins = new PluginService();
        this.$proxies = {};
        this._hiddenIndices = {};
        this.attached = false;
        this._animationsDisabled = undefined;
        this.$context = undefined;
        this._doResize = debounce((mode)=>this.update(mode), options.resizeDelay || 0);
        this._dataChanges = [];
        instances[this.id] = this;
        if (!context || !canvas) {
            console.error("Failed to create chart: can't acquire context from the given item");
            return;
        }
        animator.listen(this, 'complete', onAnimationsComplete);
        animator.listen(this, 'progress', onAnimationProgress);
        this._initialize();
        if (this.attached) {
            this.update();
        }
    }
    get aspectRatio() {
        const { options: { aspectRatio , maintainAspectRatio  } , width , height , _aspectRatio  } = this;
        if (!isNullOrUndef(aspectRatio)) {
            return aspectRatio;
        }
        if (maintainAspectRatio && _aspectRatio) {
            return _aspectRatio;
        }
        return height ? width / height : null;
    }
    get data() {
        return this.config.data;
    }
    set data(data) {
        this.config.data = data;
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this.config.options = options;
    }
    get registry() {
        return registry;
    }
 _initialize() {
        this.notifyPlugins('beforeInit');
        if (this.options.responsive) {
            this.resize();
        } else {
            retinaScale(this, this.options.devicePixelRatio);
        }
        this.bindEvents();
        this.notifyPlugins('afterInit');
        return this;
    }
    clear() {
        clearCanvas(this.canvas, this.ctx);
        return this;
    }
    stop() {
        animator.stop(this);
        return this;
    }
 resize(width, height) {
        if (!animator.running(this)) {
            this._resize(width, height);
        } else {
            this._resizeBeforeDraw = {
                width,
                height
            };
        }
    }
    _resize(width, height) {
        const options = this.options;
        const canvas = this.canvas;
        const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
        const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
        const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
        const mode = this.width ? 'resize' : 'attach';
        this.width = newSize.width;
        this.height = newSize.height;
        this._aspectRatio = this.aspectRatio;
        if (!retinaScale(this, newRatio, true)) {
            return;
        }
        this.notifyPlugins('resize', {
            size: newSize
        });
        callback(options.onResize, [
            this,
            newSize
        ], this);
        if (this.attached) {
            if (this._doResize(mode)) {
                this.render();
            }
        }
    }
    ensureScalesHaveIDs() {
        const options = this.options;
        const scalesOptions = options.scales || {};
        each(scalesOptions, (axisOptions, axisID)=>{
            axisOptions.id = axisID;
        });
    }
 buildOrUpdateScales() {
        const options = this.options;
        const scaleOpts = options.scales;
        const scales = this.scales;
        const updated = Object.keys(scales).reduce((obj, id)=>{
            obj[id] = false;
            return obj;
        }, {});
        let items = [];
        if (scaleOpts) {
            items = items.concat(Object.keys(scaleOpts).map((id)=>{
                const scaleOptions = scaleOpts[id];
                const axis = determineAxis(id, scaleOptions);
                const isRadial = axis === 'r';
                const isHorizontal = axis === 'x';
                return {
                    options: scaleOptions,
                    dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                    dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
                };
            }));
        }
        each(items, (item)=>{
            const scaleOptions = item.options;
            const id = scaleOptions.id;
            const axis = determineAxis(id, scaleOptions);
            const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
            if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
                scaleOptions.position = item.dposition;
            }
            updated[id] = true;
            let scale = null;
            if (id in scales && scales[id].type === scaleType) {
                scale = scales[id];
            } else {
                const scaleClass = registry.getScale(scaleType);
                scale = new scaleClass({
                    id,
                    type: scaleType,
                    ctx: this.ctx,
                    chart: this
                });
                scales[scale.id] = scale;
            }
            scale.init(scaleOptions, options);
        });
        each(updated, (hasUpdated, id)=>{
            if (!hasUpdated) {
                delete scales[id];
            }
        });
        each(scales, (scale)=>{
            layouts.configure(this, scale, scale.options);
            layouts.addBox(this, scale);
        });
    }
 _updateMetasets() {
        const metasets = this._metasets;
        const numData = this.data.datasets.length;
        const numMeta = metasets.length;
        metasets.sort((a, b)=>a.index - b.index);
        if (numMeta > numData) {
            for(let i = numData; i < numMeta; ++i){
                this._destroyDatasetMeta(i);
            }
            metasets.splice(numData, numMeta - numData);
        }
        this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
    }
 _removeUnreferencedMetasets() {
        const { _metasets: metasets , data: { datasets  }  } = this;
        if (metasets.length > datasets.length) {
            delete this._stacks;
        }
        metasets.forEach((meta, index)=>{
            if (datasets.filter((x)=>x === meta._dataset).length === 0) {
                this._destroyDatasetMeta(index);
            }
        });
    }
    buildOrUpdateControllers() {
        const newControllers = [];
        const datasets = this.data.datasets;
        let i, ilen;
        this._removeUnreferencedMetasets();
        for(i = 0, ilen = datasets.length; i < ilen; i++){
            const dataset = datasets[i];
            let meta = this.getDatasetMeta(i);
            const type = dataset.type || this.config.type;
            if (meta.type && meta.type !== type) {
                this._destroyDatasetMeta(i);
                meta = this.getDatasetMeta(i);
            }
            meta.type = type;
            meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
            meta.order = dataset.order || 0;
            meta.index = i;
            meta.label = '' + dataset.label;
            meta.visible = this.isDatasetVisible(i);
            if (meta.controller) {
                meta.controller.updateIndex(i);
                meta.controller.linkScales();
            } else {
                const ControllerClass = registry.getController(type);
                const { datasetElementType , dataElementType  } = defaults.datasets[type];
                Object.assign(ControllerClass, {
                    dataElementType: registry.getElement(dataElementType),
                    datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                });
                meta.controller = new ControllerClass(this, i);
                newControllers.push(meta.controller);
            }
        }
        this._updateMetasets();
        return newControllers;
    }
 _resetElements() {
        each(this.data.datasets, (dataset, datasetIndex)=>{
            this.getDatasetMeta(datasetIndex).controller.reset();
        }, this);
    }
 reset() {
        this._resetElements();
        this.notifyPlugins('reset');
    }
    update(mode) {
        const config = this.config;
        config.update();
        const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
        const animsDisabled = this._animationsDisabled = !options.animation;
        this._updateScales();
        this._checkEventBindings();
        this._updateHiddenIndices();
        this._plugins.invalidate();
        if (this.notifyPlugins('beforeUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        const newControllers = this.buildOrUpdateControllers();
        this.notifyPlugins('beforeElementsUpdate');
        let minPadding = 0;
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; i++){
            const { controller  } = this.getDatasetMeta(i);
            const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
            controller.buildOrUpdateElements(reset);
            minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
        }
        minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
        this._updateLayout(minPadding);
        if (!animsDisabled) {
            each(newControllers, (controller)=>{
                controller.reset();
            });
        }
        this._updateDatasets(mode);
        this.notifyPlugins('afterUpdate', {
            mode
        });
        this._layers.sort(compare2Level('z', '_idx'));
        const { _active , _lastEvent  } = this;
        if (_lastEvent) {
            this._eventHandler(_lastEvent, true);
        } else if (_active.length) {
            this._updateHoverStyles(_active, _active, true);
        }
        this.render();
    }
 _updateScales() {
        each(this.scales, (scale)=>{
            layouts.removeBox(this, scale);
        });
        this.ensureScalesHaveIDs();
        this.buildOrUpdateScales();
    }
 _checkEventBindings() {
        const options = this.options;
        const existingEvents = new Set(Object.keys(this._listeners));
        const newEvents = new Set(options.events);
        if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
            this.unbindEvents();
            this.bindEvents();
        }
    }
 _updateHiddenIndices() {
        const { _hiddenIndices  } = this;
        const changes = this._getUniformDataChanges() || [];
        for (const { method , start , count  } of changes){
            const move = method === '_removeElements' ? -count : count;
            moveNumericKeys(_hiddenIndices, start, move);
        }
    }
 _getUniformDataChanges() {
        const _dataChanges = this._dataChanges;
        if (!_dataChanges || !_dataChanges.length) {
            return;
        }
        this._dataChanges = [];
        const datasetCount = this.data.datasets.length;
        const makeSet = (idx)=>new Set(_dataChanges.filter((c)=>c[0] === idx).map((c, i)=>i + ',' + c.splice(1).join(',')));
        const changeSet = makeSet(0);
        for(let i = 1; i < datasetCount; i++){
            if (!setsEqual(changeSet, makeSet(i))) {
                return;
            }
        }
        return Array.from(changeSet).map((c)=>c.split(',')).map((a)=>({
                method: a[1],
                start: +a[2],
                count: +a[3]
            }));
    }
 _updateLayout(minPadding) {
        if (this.notifyPlugins('beforeLayout', {
            cancelable: true
        }) === false) {
            return;
        }
        layouts.update(this, this.width, this.height, minPadding);
        const area = this.chartArea;
        const noArea = area.width <= 0 || area.height <= 0;
        this._layers = [];
        each(this.boxes, (box)=>{
            if (noArea && box.position === 'chartArea') {
                return;
            }
            if (box.configure) {
                box.configure();
            }
            this._layers.push(...box._layers());
        }, this);
        this._layers.forEach((item, index)=>{
            item._idx = index;
        });
        this.notifyPlugins('afterLayout');
    }
 _updateDatasets(mode) {
        if (this.notifyPlugins('beforeDatasetsUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this.getDatasetMeta(i).controller.configure();
        }
        for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this._updateDataset(i, isFunction(mode) ? mode({
                datasetIndex: i
            }) : mode);
        }
        this.notifyPlugins('afterDatasetsUpdate', {
            mode
        });
    }
 _updateDataset(index, mode) {
        const meta = this.getDatasetMeta(index);
        const args = {
            meta,
            index,
            mode,
            cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
            return;
        }
        meta.controller._update(mode);
        args.cancelable = false;
        this.notifyPlugins('afterDatasetUpdate', args);
    }
    render() {
        if (this.notifyPlugins('beforeRender', {
            cancelable: true
        }) === false) {
            return;
        }
        if (animator.has(this)) {
            if (this.attached && !animator.running(this)) {
                animator.start(this);
            }
        } else {
            this.draw();
            onAnimationsComplete({
                chart: this
            });
        }
    }
    draw() {
        let i;
        if (this._resizeBeforeDraw) {
            const { width , height  } = this._resizeBeforeDraw;
            this._resizeBeforeDraw = null;
            this._resize(width, height);
        }
        this.clear();
        if (this.width <= 0 || this.height <= 0) {
            return;
        }
        if (this.notifyPlugins('beforeDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const layers = this._layers;
        for(i = 0; i < layers.length && layers[i].z <= 0; ++i){
            layers[i].draw(this.chartArea);
        }
        this._drawDatasets();
        for(; i < layers.length; ++i){
            layers[i].draw(this.chartArea);
        }
        this.notifyPlugins('afterDraw');
    }
 _getSortedDatasetMetas(filterVisible) {
        const metasets = this._sortedMetasets;
        const result = [];
        let i, ilen;
        for(i = 0, ilen = metasets.length; i < ilen; ++i){
            const meta = metasets[i];
            if (!filterVisible || meta.visible) {
                result.push(meta);
            }
        }
        return result;
    }
 getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(true);
    }
 _drawDatasets() {
        if (this.notifyPlugins('beforeDatasetsDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const metasets = this.getSortedVisibleDatasetMetas();
        for(let i = metasets.length - 1; i >= 0; --i){
            this._drawDataset(metasets[i]);
        }
        this.notifyPlugins('afterDatasetsDraw');
    }
 _drawDataset(meta) {
        const ctx = this.ctx;
        const args = {
            meta,
            index: meta.index,
            cancelable: true
        };
        const clip = getDatasetClipArea(this, meta);
        if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
            return;
        }
        if (clip) {
            clipArea(ctx, clip);
        }
        meta.controller.draw();
        if (clip) {
            unclipArea(ctx);
        }
        args.cancelable = false;
        this.notifyPlugins('afterDatasetDraw', args);
    }
 isPointInArea(point) {
        return _isPointInArea(point, this.chartArea, this._minPadding);
    }
    getElementsAtEventForMode(e, mode, options, useFinalPosition) {
        const method = Interaction.modes[mode];
        if (typeof method === 'function') {
            return method(this, e, options, useFinalPosition);
        }
        return [];
    }
    getDatasetMeta(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        const metasets = this._metasets;
        let meta = metasets.filter((x)=>x && x._dataset === dataset).pop();
        if (!meta) {
            meta = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                xAxisID: null,
                yAxisID: null,
                order: dataset && dataset.order || 0,
                index: datasetIndex,
                _dataset: dataset,
                _parsed: [],
                _sorted: false
            };
            metasets.push(meta);
        }
        return meta;
    }
    getContext() {
        return this.$context || (this.$context = createContext(null, {
            chart: this,
            type: 'chart'
        }));
    }
    getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
    }
    isDatasetVisible(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        if (!dataset) {
            return false;
        }
        const meta = this.getDatasetMeta(datasetIndex);
        return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
    }
    setDatasetVisibility(datasetIndex, visible) {
        const meta = this.getDatasetMeta(datasetIndex);
        meta.hidden = !visible;
    }
    toggleDataVisibility(index) {
        this._hiddenIndices[index] = !this._hiddenIndices[index];
    }
    getDataVisibility(index) {
        return !this._hiddenIndices[index];
    }
 _updateVisibility(datasetIndex, dataIndex, visible) {
        const mode = visible ? 'show' : 'hide';
        const meta = this.getDatasetMeta(datasetIndex);
        const anims = meta.controller._resolveAnimations(undefined, mode);
        if (defined(dataIndex)) {
            meta.data[dataIndex].hidden = !visible;
            this.update();
        } else {
            this.setDatasetVisibility(datasetIndex, visible);
            anims.update(meta, {
                visible
            });
            this.update((ctx)=>ctx.datasetIndex === datasetIndex ? mode : undefined);
        }
    }
    hide(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, false);
    }
    show(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, true);
    }
 _destroyDatasetMeta(datasetIndex) {
        const meta = this._metasets[datasetIndex];
        if (meta && meta.controller) {
            meta.controller._destroy();
        }
        delete this._metasets[datasetIndex];
    }
    _stop() {
        let i, ilen;
        this.stop();
        animator.remove(this);
        for(i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
            this._destroyDatasetMeta(i);
        }
    }
    destroy() {
        this.notifyPlugins('beforeDestroy');
        const { canvas , ctx  } = this;
        this._stop();
        this.config.clearCache();
        if (canvas) {
            this.unbindEvents();
            clearCanvas(canvas, ctx);
            this.platform.releaseContext(ctx);
            this.canvas = null;
            this.ctx = null;
        }
        delete instances[this.id];
        this.notifyPlugins('afterDestroy');
    }
    toBase64Image(...args) {
        return this.canvas.toDataURL(...args);
    }
 bindEvents() {
        this.bindUserEvents();
        if (this.options.responsive) {
            this.bindResponsiveEvents();
        } else {
            this.attached = true;
        }
    }
 bindUserEvents() {
        const listeners = this._listeners;
        const platform = this.platform;
        const _add = (type, listener)=>{
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const listener = (e, x, y)=>{
            e.offsetX = x;
            e.offsetY = y;
            this._eventHandler(e);
        };
        each(this.options.events, (type)=>_add(type, listener));
    }
 bindResponsiveEvents() {
        if (!this._responsiveListeners) {
            this._responsiveListeners = {};
        }
        const listeners = this._responsiveListeners;
        const platform = this.platform;
        const _add = (type, listener)=>{
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const _remove = (type, listener)=>{
            if (listeners[type]) {
                platform.removeEventListener(this, type, listener);
                delete listeners[type];
            }
        };
        const listener = (width, height)=>{
            if (this.canvas) {
                this.resize(width, height);
            }
        };
        let detached;
        const attached = ()=>{
            _remove('attach', attached);
            this.attached = true;
            this.resize();
            _add('resize', listener);
            _add('detach', detached);
        };
        detached = ()=>{
            this.attached = false;
            _remove('resize', listener);
            this._stop();
            this._resize(0, 0);
            _add('attach', attached);
        };
        if (platform.isAttached(this.canvas)) {
            attached();
        } else {
            detached();
        }
    }
 unbindEvents() {
        each(this._listeners, (listener, type)=>{
            this.platform.removeEventListener(this, type, listener);
        });
        this._listeners = {};
        each(this._responsiveListeners, (listener, type)=>{
            this.platform.removeEventListener(this, type, listener);
        });
        this._responsiveListeners = undefined;
    }
    updateHoverStyle(items, mode, enabled) {
        const prefix = enabled ? 'set' : 'remove';
        let meta, item, i, ilen;
        if (mode === 'dataset') {
            meta = this.getDatasetMeta(items[0].datasetIndex);
            meta.controller['_' + prefix + 'DatasetHoverStyle']();
        }
        for(i = 0, ilen = items.length; i < ilen; ++i){
            item = items[i];
            const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
            if (controller) {
                controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
            }
        }
    }
 getActiveElements() {
        return this._active || [];
    }
 setActiveElements(activeElements) {
        const lastActive = this._active || [];
        const active = activeElements.map(({ datasetIndex , index  })=>{
            const meta = this.getDatasetMeta(datasetIndex);
            if (!meta) {
                throw new Error('No dataset found at index ' + datasetIndex);
            }
            return {
                datasetIndex,
                element: meta.data[index],
                index
            };
        });
        const changed = !_elementsEqual(active, lastActive);
        if (changed) {
            this._active = active;
            this._lastEvent = null;
            this._updateHoverStyles(active, lastActive);
        }
    }
 notifyPlugins(hook, args, filter) {
        return this._plugins.notify(this, hook, args, filter);
    }
 isPluginEnabled(pluginId) {
        return this._plugins._cache.filter((p)=>p.plugin.id === pluginId).length === 1;
    }
 _updateHoverStyles(active, lastActive, replay) {
        const hoverOptions = this.options.hover;
        const diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.datasetIndex === y.datasetIndex && x.index === y.index));
        const deactivated = diff(lastActive, active);
        const activated = replay ? active : diff(active, lastActive);
        if (deactivated.length) {
            this.updateHoverStyle(deactivated, hoverOptions.mode, false);
        }
        if (activated.length && hoverOptions.mode) {
            this.updateHoverStyle(activated, hoverOptions.mode, true);
        }
    }
 _eventHandler(e, replay) {
        const args = {
            event: e,
            replay,
            cancelable: true,
            inChartArea: this.isPointInArea(e)
        };
        const eventFilter = (plugin)=>(plugin.options.events || this.options.events).includes(e.native.type);
        if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
            return;
        }
        const changed = this._handleEvent(e, replay, args.inChartArea);
        args.cancelable = false;
        this.notifyPlugins('afterEvent', args, eventFilter);
        if (changed || args.changed) {
            this.render();
        }
        return this;
    }
 _handleEvent(e, replay, inChartArea) {
        const { _active: lastActive = [] , options  } = this;
        const useFinalPosition = replay;
        const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
        const isClick = _isClickEvent(e);
        const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
        if (inChartArea) {
            this._lastEvent = null;
            callback(options.onHover, [
                e,
                active,
                this
            ], this);
            if (isClick) {
                callback(options.onClick, [
                    e,
                    active,
                    this
                ], this);
            }
        }
        const changed = !_elementsEqual(active, lastActive);
        if (changed || replay) {
            this._active = active;
            this._updateHoverStyles(active, lastActive, replay);
        }
        this._lastEvent = lastEvent;
        return changed;
    }
 _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
        if (e.type === 'mouseout') {
            return [];
        }
        if (!inChartArea) {
            return lastActive;
        }
        const hoverOptions = this.options.hover;
        return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
    }
}
function invalidatePlugins() {
    return each(Chart.instances, (chart)=>chart._plugins.invalidate());
}

function setStyle(ctx, options, style = options) {
    ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
    ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
    ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
    ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
    ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
    ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
    ctx.lineTo(target.x, target.y);
}
 function getLineMethod(options) {
    if (options.stepped) {
        return _steppedLineTo;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierCurveTo;
    }
    return lineTo;
}
function pathVars(points, segment, params = {}) {
    const count = points.length;
    const { start: paramsStart = 0 , end: paramsEnd = count - 1  } = params;
    const { start: segmentStart , end: segmentEnd  } = segment;
    const start = Math.max(paramsStart, segmentStart);
    const end = Math.min(paramsEnd, segmentEnd);
    const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
    return {
        count,
        start,
        loop: segment.loop,
        ilen: end < start && !outside ? count + end - start : end - start
    };
}
 function pathSegment(ctx, line, segment, params) {
    const { points , options  } = line;
    const { count , start , loop , ilen  } = pathVars(points, segment, params);
    const lineMethod = getLineMethod(options);
    let { move =true , reverse  } = params || {};
    let i, point, prev;
    for(i = 0; i <= ilen; ++i){
        point = points[(start + (reverse ? ilen - i : i)) % count];
        if (point.skip) {
            continue;
        } else if (move) {
            ctx.moveTo(point.x, point.y);
            move = false;
        } else {
            lineMethod(ctx, prev, point, reverse, options.stepped);
        }
        prev = point;
    }
    if (loop) {
        point = points[(start + (reverse ? ilen : 0)) % count];
        lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    return !!loop;
}
 function fastPathSegment(ctx, line, segment, params) {
    const points = line.points;
    const { count , start , ilen  } = pathVars(points, segment, params);
    const { move =true , reverse  } = params || {};
    let avgX = 0;
    let countX = 0;
    let i, point, prevX, minY, maxY, lastY;
    const pointIndex = (index)=>(start + (reverse ? ilen - index : index)) % count;
    const drawX = ()=>{
        if (minY !== maxY) {
            ctx.lineTo(avgX, maxY);
            ctx.lineTo(avgX, minY);
            ctx.lineTo(avgX, lastY);
        }
    };
    if (move) {
        point = points[pointIndex(0)];
        ctx.moveTo(point.x, point.y);
    }
    for(i = 0; i <= ilen; ++i){
        point = points[pointIndex(i)];
        if (point.skip) {
            continue;
        }
        const x = point.x;
        const y = point.y;
        const truncX = x | 0;
        if (truncX === prevX) {
            if (y < minY) {
                minY = y;
            } else if (y > maxY) {
                maxY = y;
            }
            avgX = (countX * avgX + x) / ++countX;
        } else {
            drawX();
            ctx.lineTo(x, y);
            prevX = truncX;
            countX = 0;
            minY = maxY = y;
        }
        lastY = y;
    }
    drawX();
}
 function _getSegmentMethod(line) {
    const opts = line.options;
    const borderDash = opts.borderDash && opts.borderDash.length;
    const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
    return useFastPath ? fastPathSegment : pathSegment;
}
 function _getInterpolationMethod(options) {
    if (options.stepped) {
        return _steppedInterpolation;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierInterpolation;
    }
    return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
    let path = line._path;
    if (!path) {
        path = line._path = new Path2D();
        if (line.path(path, start, count)) {
            path.closePath();
        }
    }
    setStyle(ctx, line.options);
    ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
    const { segments , options  } = line;
    const segmentMethod = _getSegmentMethod(line);
    for (const segment of segments){
        setStyle(ctx, options, segment.style);
        ctx.beginPath();
        if (segmentMethod(ctx, line, segment, {
            start,
            end: start + count - 1
        })) {
            ctx.closePath();
        }
        ctx.stroke();
    }
}
const usePath2D = typeof Path2D === 'function';
function draw(ctx, line, start, count) {
    if (usePath2D && !line.options.segment) {
        strokePathWithCache(ctx, line, start, count);
    } else {
        strokePathDirect(ctx, line, start, count);
    }
}
class LineElement extends Element {
    static id = 'line';
 static defaults = {
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        borderWidth: 3,
        capBezierPoints: true,
        cubicInterpolationMode: 'default',
        fill: false,
        spanGaps: false,
        stepped: false,
        tension: 0
    };
 static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    static descriptors = {
        _scriptable: true,
        _indexable: (name)=>name !== 'borderDash' && name !== 'fill'
    };
    constructor(cfg){
        super();
        this.animated = true;
        this.options = undefined;
        this._chart = undefined;
        this._loop = undefined;
        this._fullLoop = undefined;
        this._path = undefined;
        this._points = undefined;
        this._segments = undefined;
        this._decimated = false;
        this._pointsUpdated = false;
        this._datasetIndex = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    updateControlPoints(chartArea, indexAxis) {
        const options = this.options;
        if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
            const loop = options.spanGaps ? this._loop : this._fullLoop;
            _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
            this._pointsUpdated = true;
        }
    }
    set points(points) {
        this._points = points;
        delete this._segments;
        delete this._path;
        this._pointsUpdated = false;
    }
    get points() {
        return this._points;
    }
    get segments() {
        return this._segments || (this._segments = _computeSegments(this, this.options.segment));
    }
 first() {
        const segments = this.segments;
        const points = this.points;
        return segments.length && points[segments[0].start];
    }
 last() {
        const segments = this.segments;
        const points = this.points;
        const count = segments.length;
        return count && points[segments[count - 1].end];
    }
 interpolate(point, property) {
        const options = this.options;
        const value = point[property];
        const points = this.points;
        const segments = _boundSegments(this, {
            property,
            start: value,
            end: value
        });
        if (!segments.length) {
            return;
        }
        const result = [];
        const _interpolate = _getInterpolationMethod(options);
        let i, ilen;
        for(i = 0, ilen = segments.length; i < ilen; ++i){
            const { start , end  } = segments[i];
            const p1 = points[start];
            const p2 = points[end];
            if (p1 === p2) {
                result.push(p1);
                continue;
            }
            const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
            const interpolated = _interpolate(p1, p2, t, options.stepped);
            interpolated[property] = point[property];
            result.push(interpolated);
        }
        return result.length === 1 ? result[0] : result;
    }
 pathSegment(ctx, segment, params) {
        const segmentMethod = _getSegmentMethod(this);
        return segmentMethod(ctx, this, segment, params);
    }
 path(ctx, start, count) {
        const segments = this.segments;
        const segmentMethod = _getSegmentMethod(this);
        let loop = this._loop;
        start = start || 0;
        count = count || this.points.length - start;
        for (const segment of segments){
            loop &= segmentMethod(ctx, this, segment, {
                start,
                end: start + count - 1
            });
        }
        return !!loop;
    }
 draw(ctx, chartArea, start, count) {
        const options = this.options || {};
        const points = this.points || [];
        if (points.length && options.borderWidth) {
            ctx.save();
            draw(ctx, this, start, count);
            ctx.restore();
        }
        if (this.animated) {
            this._pointsUpdated = false;
            this._path = undefined;
        }
    }
}

function inRange$1(el, pos, axis, useFinalPosition) {
    const options = el.options;
    const { [axis]: value  } = el.getProps([
        axis
    ], useFinalPosition);
    return Math.abs(pos - value) < options.radius + options.hitRadius;
}
class PointElement extends Element {
    static id = 'point';
    parsed;
    skip;
    stop;
    /**
   * @type {any}
   */ static defaults = {
        borderWidth: 1,
        hitRadius: 1,
        hoverBorderWidth: 1,
        hoverRadius: 4,
        pointStyle: 'circle',
        radius: 3,
        rotation: 0
    };
    /**
   * @type {any}
   */ static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    constructor(cfg){
        super();
        this.options = undefined;
        this.parsed = undefined;
        this.skip = undefined;
        this.stop = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        const options = this.options;
        const { x , y  } = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, 'x', useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
        const { x , y  } = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        return {
            x,
            y
        };
    }
    size(options) {
        options = options || this.options || {};
        let radius = options.radius || 0;
        radius = Math.max(radius, radius && options.hoverRadius || 0);
        const borderWidth = radius && options.borderWidth || 0;
        return (radius + borderWidth) * 2;
    }
    draw(ctx, area) {
        const options = this.options;
        if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
            return;
        }
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.fillStyle = options.backgroundColor;
        drawPoint(ctx, options, this.x, this.y);
    }
    getRange() {
        const options = this.options || {};
        // @ts-expect-error Fallbacks should never be hit in practice
        return options.radius + options.hitRadius;
    }
}

function _segments(line, target, property) {
    const segments = line.segments;
    const points = line.points;
    const tpoints = target.points;
    const parts = [];
    for (const segment of segments){
        let { start , end  } = segment;
        end = _findSegmentEnd(start, end, points);
        const bounds = _getBounds(property, points[start], points[end], segment.loop);
        if (!target.segments) {
            parts.push({
                source: segment,
                target: bounds,
                start: points[start],
                end: points[end]
            });
            continue;
        }
        const targetSegments = _boundSegments(target, bounds);
        for (const tgt of targetSegments){
            const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
            const fillSources = _boundSegment(segment, points, subBounds);
            for (const fillSource of fillSources){
                parts.push({
                    source: fillSource,
                    target: tgt,
                    start: {
                        [property]: _getEdge(bounds, subBounds, 'start', Math.max)
                    },
                    end: {
                        [property]: _getEdge(bounds, subBounds, 'end', Math.min)
                    }
                });
            }
        }
    }
    return parts;
}
function _getBounds(property, first, last, loop) {
    if (loop) {
        return;
    }
    let start = first[property];
    let end = last[property];
    if (property === 'angle') {
        start = _normalizeAngle(start);
        end = _normalizeAngle(end);
    }
    return {
        property,
        start,
        end
    };
}
function _pointsFromSegments(boundary, line) {
    const { x =null , y =null  } = boundary || {};
    const linePoints = line.points;
    const points = [];
    line.segments.forEach(({ start , end  })=>{
        end = _findSegmentEnd(start, end, linePoints);
        const first = linePoints[start];
        const last = linePoints[end];
        if (y !== null) {
            points.push({
                x: first.x,
                y
            });
            points.push({
                x: last.x,
                y
            });
        } else if (x !== null) {
            points.push({
                x,
                y: first.y
            });
            points.push({
                x,
                y: last.y
            });
        }
    });
    return points;
}
function _findSegmentEnd(start, end, points) {
    for(; end > start; end--){
        const point = points[end];
        if (!isNaN(point.x) && !isNaN(point.y)) {
            break;
        }
    }
    return end;
}
function _getEdge(a, b, prop, fn) {
    if (a && b) {
        return fn(a[prop], b[prop]);
    }
    return a ? a[prop] : b ? b[prop] : 0;
}

function _createBoundaryLine(boundary, line) {
    let points = [];
    let _loop = false;
    if (isArray(boundary)) {
        _loop = true;
        points = boundary;
    } else {
        points = _pointsFromSegments(boundary, line);
    }
    return points.length ? new LineElement({
        points,
        options: {
            tension: 0
        },
        _loop,
        _fullLoop: _loop
    }) : null;
}
function _shouldApplyFill(source) {
    return source && source.fill !== false;
}

function _resolveTarget(sources, index, propagate) {
    const source = sources[index];
    let fill = source.fill;
    const visited = [
        index
    ];
    let target;
    if (!propagate) {
        return fill;
    }
    while(fill !== false && visited.indexOf(fill) === -1){
        if (!isNumberFinite(fill)) {
            return fill;
        }
        target = sources[fill];
        if (!target) {
            return false;
        }
        if (target.visible) {
            return fill;
        }
        visited.push(fill);
        fill = target.fill;
    }
    return false;
}
 function _decodeFill(line, index, count) {
     const fill = parseFillOption(line);
    if (isObject(fill)) {
        return isNaN(fill.value) ? false : fill;
    }
    let target = parseFloat(fill);
    if (isNumberFinite(target) && Math.floor(target) === target) {
        return decodeTargetIndex(fill[0], index, target, count);
    }
    return [
        'origin',
        'start',
        'end',
        'stack',
        'shape'
    ].indexOf(fill) >= 0 && fill;
}
function decodeTargetIndex(firstCh, index, target, count) {
    if (firstCh === '-' || firstCh === '+') {
        target = index + target;
    }
    if (target === index || target < 0 || target >= count) {
        return false;
    }
    return target;
}
 function _getTargetPixel(fill, scale) {
    let pixel = null;
    if (fill === 'start') {
        pixel = scale.bottom;
    } else if (fill === 'end') {
        pixel = scale.top;
    } else if (isObject(fill)) {
        pixel = scale.getPixelForValue(fill.value);
    } else if (scale.getBasePixel) {
        pixel = scale.getBasePixel();
    }
    return pixel;
}
 function _getTargetValue(fill, scale, startValue) {
    let value;
    if (fill === 'start') {
        value = startValue;
    } else if (fill === 'end') {
        value = scale.options.reverse ? scale.min : scale.max;
    } else if (isObject(fill)) {
        value = fill.value;
    } else {
        value = scale.getBaseValue();
    }
    return value;
}
 function parseFillOption(line) {
    const options = line.options;
    const fillOption = options.fill;
    let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
    if (fill === undefined) {
        fill = !!options.backgroundColor;
    }
    if (fill === false || fill === null) {
        return false;
    }
    if (fill === true) {
        return 'origin';
    }
    return fill;
}

function _buildStackLine(source) {
    const { scale , index , line  } = source;
    const points = [];
    const segments = line.segments;
    const sourcePoints = line.points;
    const linesBelow = getLinesBelow(scale, index);
    linesBelow.push(_createBoundaryLine({
        x: null,
        y: scale.bottom
    }, line));
    for(let i = 0; i < segments.length; i++){
        const segment = segments[i];
        for(let j = segment.start; j <= segment.end; j++){
            addPointsBelow(points, sourcePoints[j], linesBelow);
        }
    }
    return new LineElement({
        points,
        options: {}
    });
}
 function getLinesBelow(scale, index) {
    const below = [];
    const metas = scale.getMatchingVisibleMetas('line');
    for(let i = 0; i < metas.length; i++){
        const meta = metas[i];
        if (meta.index === index) {
            break;
        }
        if (!meta.hidden) {
            below.unshift(meta.dataset);
        }
    }
    return below;
}
 function addPointsBelow(points, sourcePoint, linesBelow) {
    const postponed = [];
    for(let j = 0; j < linesBelow.length; j++){
        const line = linesBelow[j];
        const { first , last , point  } = findPoint(line, sourcePoint, 'x');
        if (!point || first && last) {
            continue;
        }
        if (first) {
            postponed.unshift(point);
        } else {
            points.push(point);
            if (!last) {
                break;
            }
        }
    }
    points.push(...postponed);
}
 function findPoint(line, sourcePoint, property) {
    const point = line.interpolate(sourcePoint, property);
    if (!point) {
        return {};
    }
    const pointValue = point[property];
    const segments = line.segments;
    const linePoints = line.points;
    let first = false;
    let last = false;
    for(let i = 0; i < segments.length; i++){
        const segment = segments[i];
        const firstValue = linePoints[segment.start][property];
        const lastValue = linePoints[segment.end][property];
        if (_isBetween(pointValue, firstValue, lastValue)) {
            first = pointValue === firstValue;
            last = pointValue === lastValue;
            break;
        }
    }
    return {
        first,
        last,
        point
    };
}

class simpleArc {
    constructor(opts){
        this.x = opts.x;
        this.y = opts.y;
        this.radius = opts.radius;
    }
    pathSegment(ctx, bounds, opts) {
        const { x , y , radius  } = this;
        bounds = bounds || {
            start: 0,
            end: TAU
        };
        ctx.arc(x, y, radius, bounds.end, bounds.start, true);
        return !opts.bounds;
    }
    interpolate(point) {
        const { x , y , radius  } = this;
        const angle = point.angle;
        return {
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            angle
        };
    }
}

function _getTarget(source) {
    const { chart , fill , line  } = source;
    if (isNumberFinite(fill)) {
        return getLineByIndex(chart, fill);
    }
    if (fill === 'stack') {
        return _buildStackLine(source);
    }
    if (fill === 'shape') {
        return true;
    }
    const boundary = computeBoundary(source);
    if (boundary instanceof simpleArc) {
        return boundary;
    }
    return _createBoundaryLine(boundary, line);
}
 function getLineByIndex(chart, index) {
    const meta = chart.getDatasetMeta(index);
    const visible = meta && chart.isDatasetVisible(index);
    return visible ? meta.dataset : null;
}
function computeBoundary(source) {
    const scale = source.scale || {};
    if (scale.getPointPositionForValue) {
        return computeCircularBoundary(source);
    }
    return computeLinearBoundary(source);
}
function computeLinearBoundary(source) {
    const { scale ={} , fill  } = source;
    const pixel = _getTargetPixel(fill, scale);
    if (isNumberFinite(pixel)) {
        const horizontal = scale.isHorizontal();
        return {
            x: horizontal ? pixel : null,
            y: horizontal ? null : pixel
        };
    }
    return null;
}
function computeCircularBoundary(source) {
    const { scale , fill  } = source;
    const options = scale.options;
    const length = scale.getLabels().length;
    const start = options.reverse ? scale.max : scale.min;
    const value = _getTargetValue(fill, scale, start);
    const target = [];
    if (options.grid.circular) {
        const center = scale.getPointPositionForValue(0, start);
        return new simpleArc({
            x: center.x,
            y: center.y,
            radius: scale.getDistanceFromCenterForValue(value)
        });
    }
    for(let i = 0; i < length; ++i){
        target.push(scale.getPointPositionForValue(i, value));
    }
    return target;
}

function _drawfill(ctx, source, area) {
    const target = _getTarget(source);
    const { chart , index , line , scale , axis  } = source;
    const lineOpts = line.options;
    const fillOption = lineOpts.fill;
    const color = lineOpts.backgroundColor;
    const { above =color , below =color  } = fillOption || {};
    const meta = chart.getDatasetMeta(index);
    const clip = getDatasetClipArea(chart, meta);
    if (target && line.points.length) {
        clipArea(ctx, area);
        doFill(ctx, {
            line,
            target,
            above,
            below,
            area,
            scale,
            axis,
            clip
        });
        unclipArea(ctx);
    }
}
function doFill(ctx, cfg) {
    const { line , target , above , below , area , scale , clip  } = cfg;
    const property = line._loop ? 'angle' : cfg.axis;
    ctx.save();
    if (property === 'x' && below !== above) {
        clipVertical(ctx, target, area.top);
        fill(ctx, {
            line,
            target,
            color: above,
            scale,
            property,
            clip
        });
        ctx.restore();
        ctx.save();
        clipVertical(ctx, target, area.bottom);
    }
    fill(ctx, {
        line,
        target,
        color: below,
        scale,
        property,
        clip
    });
    ctx.restore();
}
function clipVertical(ctx, target, clipY) {
    const { segments , points  } = target;
    let first = true;
    let lineLoop = false;
    ctx.beginPath();
    for (const segment of segments){
        const { start , end  } = segment;
        const firstPoint = points[start];
        const lastPoint = points[_findSegmentEnd(start, end, points)];
        if (first) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            first = false;
        } else {
            ctx.lineTo(firstPoint.x, clipY);
            ctx.lineTo(firstPoint.x, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ctx, segment, {
            move: lineLoop
        });
        if (lineLoop) {
            ctx.closePath();
        } else {
            ctx.lineTo(lastPoint.x, clipY);
        }
    }
    ctx.lineTo(target.first().x, clipY);
    ctx.closePath();
    ctx.clip();
}
function fill(ctx, cfg) {
    const { line , target , property , color , scale , clip  } = cfg;
    const segments = _segments(line, target, property);
    for (const { source: src , target: tgt , start , end  } of segments){
        const { style: { backgroundColor =color  } = {}  } = src;
        const notShape = target !== true;
        ctx.save();
        ctx.fillStyle = backgroundColor;
        clipBounds(ctx, scale, clip, notShape && _getBounds(property, start, end));
        ctx.beginPath();
        const lineLoop = !!line.pathSegment(ctx, src);
        let loop;
        if (notShape) {
            if (lineLoop) {
                ctx.closePath();
            } else {
                interpolatedLineTo(ctx, target, end, property);
            }
            const targetLoop = !!target.pathSegment(ctx, tgt, {
                move: lineLoop,
                reverse: true
            });
            loop = lineLoop && targetLoop;
            if (!loop) {
                interpolatedLineTo(ctx, target, start, property);
            }
        }
        ctx.closePath();
        ctx.fill(loop ? 'evenodd' : 'nonzero');
        ctx.restore();
    }
}
function clipBounds(ctx, scale, clip, bounds) {
    const chartArea = scale.chart.chartArea;
    const { property , start , end  } = bounds || {};
    if (property === 'x' || property === 'y') {
        let left, top, right, bottom;
        if (property === 'x') {
            left = start;
            top = chartArea.top;
            right = end;
            bottom = chartArea.bottom;
        } else {
            left = chartArea.left;
            top = start;
            right = chartArea.right;
            bottom = end;
        }
        ctx.beginPath();
        if (clip) {
            left = Math.max(left, clip.left);
            right = Math.min(right, clip.right);
            top = Math.max(top, clip.top);
            bottom = Math.min(bottom, clip.bottom);
        }
        ctx.rect(left, top, right - left, bottom - top);
        ctx.clip();
    }
}
function interpolatedLineTo(ctx, target, point, property) {
    const interpolatedPoint = target.interpolate(point, property);
    if (interpolatedPoint) {
        ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
    }
}

var index = {
    id: 'filler',
    afterDatasetsUpdate (chart, _args, options) {
        const count = (chart.data.datasets || []).length;
        const sources = [];
        let meta, i, line, source;
        for(i = 0; i < count; ++i){
            meta = chart.getDatasetMeta(i);
            line = meta.dataset;
            source = null;
            if (line && line.options && line instanceof LineElement) {
                source = {
                    visible: chart.isDatasetVisible(i),
                    index: i,
                    fill: _decodeFill(line, i, count),
                    chart,
                    axis: meta.controller.options.indexAxis,
                    scale: meta.vScale,
                    line
                };
            }
            meta.$filler = source;
            sources.push(source);
        }
        for(i = 0; i < count; ++i){
            source = sources[i];
            if (!source || source.fill === false) {
                continue;
            }
            source.fill = _resolveTarget(sources, i, options.propagate);
        }
    },
    beforeDraw (chart, _args, options) {
        const draw = options.drawTime === 'beforeDraw';
        const metasets = chart.getSortedVisibleDatasetMetas();
        const area = chart.chartArea;
        for(let i = metasets.length - 1; i >= 0; --i){
            const source = metasets[i].$filler;
            if (!source) {
                continue;
            }
            source.line.updateControlPoints(area, source.axis);
            if (draw && source.fill) {
                _drawfill(chart.ctx, source, area);
            }
        }
    },
    beforeDatasetsDraw (chart, _args, options) {
        if (options.drawTime !== 'beforeDatasetsDraw') {
            return;
        }
        const metasets = chart.getSortedVisibleDatasetMetas();
        for(let i = metasets.length - 1; i >= 0; --i){
            const source = metasets[i].$filler;
            if (_shouldApplyFill(source)) {
                _drawfill(chart.ctx, source, chart.chartArea);
            }
        }
    },
    beforeDatasetDraw (chart, args, options) {
        const source = args.meta.$filler;
        if (!_shouldApplyFill(source) || options.drawTime !== 'beforeDatasetDraw') {
            return;
        }
        _drawfill(chart.ctx, source, chart.chartArea);
    },
    defaults: {
        propagate: true,
        drawTime: 'beforeDatasetDraw'
    }
};

const getBoxSize = (labelOpts, fontSize)=>{
    let { boxHeight =fontSize , boxWidth =fontSize  } = labelOpts;
    if (labelOpts.usePointStyle) {
        boxHeight = Math.min(boxHeight, fontSize);
        boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
    }
    return {
        boxWidth,
        boxHeight,
        itemHeight: Math.max(fontSize, boxHeight)
    };
};
const itemsEqual = (a, b)=>a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
class Legend extends Element {
 constructor(config){
        super();
        this._added = false;
        this.legendHitBoxes = [];
 this._hoveredItem = null;
        this.doughnutMode = false;
        this.chart = config.chart;
        this.options = config.options;
        this.ctx = config.ctx;
        this.legendItems = undefined;
        this.columnSizes = undefined;
        this.lineWidths = undefined;
        this.maxHeight = undefined;
        this.maxWidth = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.height = undefined;
        this.width = undefined;
        this._margins = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
    }
    update(maxWidth, maxHeight, margins) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins;
        this.setDimensions();
        this.buildLabels();
        this.fit();
    }
    setDimensions() {
        if (this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = this._margins.left;
            this.right = this.width;
        } else {
            this.height = this.maxHeight;
            this.top = this._margins.top;
            this.bottom = this.height;
        }
    }
    buildLabels() {
        const labelOpts = this.options.labels || {};
        let legendItems = callback(labelOpts.generateLabels, [
            this.chart
        ], this) || [];
        if (labelOpts.filter) {
            legendItems = legendItems.filter((item)=>labelOpts.filter(item, this.chart.data));
        }
        if (labelOpts.sort) {
            legendItems = legendItems.sort((a, b)=>labelOpts.sort(a, b, this.chart.data));
        }
        if (this.options.reverse) {
            legendItems.reverse();
        }
        this.legendItems = legendItems;
    }
    fit() {
        const { options , ctx  } = this;
        if (!options.display) {
            this.width = this.height = 0;
            return;
        }
        const labelOpts = options.labels;
        const labelFont = toFont(labelOpts.font);
        const fontSize = labelFont.size;
        const titleHeight = this._computeTitleHeight();
        const { boxWidth , itemHeight  } = getBoxSize(labelOpts, fontSize);
        let width, height;
        ctx.font = labelFont.string;
        if (this.isHorizontal()) {
            width = this.maxWidth;
            height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
        } else {
            height = this.maxHeight;
            width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
        }
        this.width = Math.min(width, options.maxWidth || this.maxWidth);
        this.height = Math.min(height, options.maxHeight || this.maxHeight);
    }
 _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
        const { ctx , maxWidth , options: { labels: { padding  }  }  } = this;
        const hitboxes = this.legendHitBoxes = [];
        const lineWidths = this.lineWidths = [
            0
        ];
        const lineHeight = itemHeight + padding;
        let totalHeight = titleHeight;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let row = -1;
        let top = -lineHeight;
        this.legendItems.forEach((legendItem, i)=>{
            const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
            if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
                totalHeight += lineHeight;
                lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                top += lineHeight;
                row++;
            }
            hitboxes[i] = {
                left: 0,
                top,
                row,
                width: itemWidth,
                height: itemHeight
            };
            lineWidths[lineWidths.length - 1] += itemWidth + padding;
        });
        return totalHeight;
    }
    _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
        const { ctx , maxHeight , options: { labels: { padding  }  }  } = this;
        const hitboxes = this.legendHitBoxes = [];
        const columnSizes = this.columnSizes = [];
        const heightLimit = maxHeight - titleHeight;
        let totalWidth = padding;
        let currentColWidth = 0;
        let currentColHeight = 0;
        let left = 0;
        let col = 0;
        this.legendItems.forEach((legendItem, i)=>{
            const { itemWidth , itemHeight  } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
            if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
                totalWidth += currentColWidth + padding;
                columnSizes.push({
                    width: currentColWidth,
                    height: currentColHeight
                });
                left += currentColWidth + padding;
                col++;
                currentColWidth = currentColHeight = 0;
            }
            hitboxes[i] = {
                left,
                top: currentColHeight,
                col,
                width: itemWidth,
                height: itemHeight
            };
            currentColWidth = Math.max(currentColWidth, itemWidth);
            currentColHeight += itemHeight + padding;
        });
        totalWidth += currentColWidth;
        columnSizes.push({
            width: currentColWidth,
            height: currentColHeight
        });
        return totalWidth;
    }
    adjustHitBoxes() {
        if (!this.options.display) {
            return;
        }
        const titleHeight = this._computeTitleHeight();
        const { legendHitBoxes: hitboxes , options: { align , labels: { padding  } , rtl  }  } = this;
        const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
        if (this.isHorizontal()) {
            let row = 0;
            let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
            for (const hitbox of hitboxes){
                if (row !== hitbox.row) {
                    row = hitbox.row;
                    left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                }
                hitbox.top += this.top + titleHeight + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
                left += hitbox.width + padding;
            }
        } else {
            let col = 0;
            let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
            for (const hitbox of hitboxes){
                if (hitbox.col !== col) {
                    col = hitbox.col;
                    top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                }
                hitbox.top = top;
                hitbox.left += this.left + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
                top += hitbox.height + padding;
            }
        }
    }
    isHorizontal() {
        return this.options.position === 'top' || this.options.position === 'bottom';
    }
    draw() {
        if (this.options.display) {
            const ctx = this.ctx;
            clipArea(ctx, this);
            this._draw();
            unclipArea(ctx);
        }
    }
 _draw() {
        const { options: opts , columnSizes , lineWidths , ctx  } = this;
        const { align , labels: labelOpts  } = opts;
        const defaultColor = defaults.color;
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const labelFont = toFont(labelOpts.font);
        const { padding  } = labelOpts;
        const fontSize = labelFont.size;
        const halfFontSize = fontSize / 2;
        let cursor;
        this.drawTitle();
        ctx.textAlign = rtlHelper.textAlign('left');
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.5;
        ctx.font = labelFont.string;
        const { boxWidth , boxHeight , itemHeight  } = getBoxSize(labelOpts, fontSize);
        const drawLegendBox = function(x, y, legendItem) {
            if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
                return;
            }
            ctx.save();
            const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
            ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
            ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
            ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
            ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
            ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
            if (labelOpts.usePointStyle) {
                const drawOptions = {
                    radius: boxHeight * Math.SQRT2 / 2,
                    pointStyle: legendItem.pointStyle,
                    rotation: legendItem.rotation,
                    borderWidth: lineWidth
                };
                const centerX = rtlHelper.xPlus(x, boxWidth / 2);
                const centerY = y + halfFontSize;
                drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
            } else {
                const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
                const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
                const borderRadius = toTRBLCorners(legendItem.borderRadius);
                ctx.beginPath();
                if (Object.values(borderRadius).some((v)=>v !== 0)) {
                    addRoundedRectPath(ctx, {
                        x: xBoxLeft,
                        y: yBoxTop,
                        w: boxWidth,
                        h: boxHeight,
                        radius: borderRadius
                    });
                } else {
                    ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
                }
                ctx.fill();
                if (lineWidth !== 0) {
                    ctx.stroke();
                }
            }
            ctx.restore();
        };
        const fillText = function(x, y, legendItem) {
            renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
                strikethrough: legendItem.hidden,
                textAlign: rtlHelper.textAlign(legendItem.textAlign)
            });
        };
        const isHorizontal = this.isHorizontal();
        const titleHeight = this._computeTitleHeight();
        if (isHorizontal) {
            cursor = {
                x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
                y: this.top + padding + titleHeight,
                line: 0
            };
        } else {
            cursor = {
                x: this.left + padding,
                y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                line: 0
            };
        }
        overrideTextDirection(this.ctx, opts.textDirection);
        const lineHeight = itemHeight + padding;
        this.legendItems.forEach((legendItem, i)=>{
            ctx.strokeStyle = legendItem.fontColor;
            ctx.fillStyle = legendItem.fontColor;
            const textWidth = ctx.measureText(legendItem.text).width;
            const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
            const width = boxWidth + halfFontSize + textWidth;
            let x = cursor.x;
            let y = cursor.y;
            rtlHelper.setWidth(this.width);
            if (isHorizontal) {
                if (i > 0 && x + width + padding > this.right) {
                    y = cursor.y += lineHeight;
                    cursor.line++;
                    x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
                }
            } else if (i > 0 && y + lineHeight > this.bottom) {
                x = cursor.x = x + columnSizes[cursor.line].width + padding;
                cursor.line++;
                y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
            }
            const realX = rtlHelper.x(x);
            drawLegendBox(realX, y, legendItem);
            x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
            fillText(rtlHelper.x(x), y, legendItem);
            if (isHorizontal) {
                cursor.x += width + padding;
            } else if (typeof legendItem.text !== 'string') {
                const fontLineHeight = labelFont.lineHeight;
                cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
            } else {
                cursor.y += lineHeight;
            }
        });
        restoreTextDirection(this.ctx, opts.textDirection);
    }
 drawTitle() {
        const opts = this.options;
        const titleOpts = opts.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        if (!titleOpts.display) {
            return;
        }
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const ctx = this.ctx;
        const position = titleOpts.position;
        const halfFontSize = titleFont.size / 2;
        const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
        let y;
        let left = this.left;
        let maxWidth = this.width;
        if (this.isHorizontal()) {
            maxWidth = Math.max(...this.lineWidths);
            y = this.top + topPaddingPlusHalfFontSize;
            left = _alignStartEnd(opts.align, left, this.right - maxWidth);
        } else {
            const maxHeight = this.columnSizes.reduce((acc, size)=>Math.max(acc, size.height), 0);
            y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
        }
        const x = _alignStartEnd(position, left, left + maxWidth);
        ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = titleOpts.color;
        ctx.fillStyle = titleOpts.color;
        ctx.font = titleFont.string;
        renderText(ctx, titleOpts.text, x, y, titleFont);
    }
 _computeTitleHeight() {
        const titleOpts = this.options.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
    }
 _getLegendItemAt(x, y) {
        let i, hitBox, lh;
        if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
            lh = this.legendHitBoxes;
            for(i = 0; i < lh.length; ++i){
                hitBox = lh[i];
                if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
                    return this.legendItems[i];
                }
            }
        }
        return null;
    }
 handleEvent(e) {
        const opts = this.options;
        if (!isListened(e.type, opts)) {
            return;
        }
        const hoveredItem = this._getLegendItemAt(e.x, e.y);
        if (e.type === 'mousemove' || e.type === 'mouseout') {
            const previous = this._hoveredItem;
            const sameItem = itemsEqual(previous, hoveredItem);
            if (previous && !sameItem) {
                callback(opts.onLeave, [
                    e,
                    previous,
                    this
                ], this);
            }
            this._hoveredItem = hoveredItem;
            if (hoveredItem && !sameItem) {
                callback(opts.onHover, [
                    e,
                    hoveredItem,
                    this
                ], this);
            }
        } else if (hoveredItem) {
            callback(opts.onClick, [
                e,
                hoveredItem,
                this
            ], this);
        }
    }
}
function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
    const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
    const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
    return {
        itemWidth,
        itemHeight
    };
}
function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
    let legendItemText = legendItem.text;
    if (legendItemText && typeof legendItemText !== 'string') {
        legendItemText = legendItemText.reduce((a, b)=>a.length > b.length ? a : b);
    }
    return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
    let itemHeight = _itemHeight;
    if (typeof legendItem.text !== 'string') {
        itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
    }
    return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
    const labelHeight = legendItem.text ? legendItem.text.length : 0;
    return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
    if ((type === 'mousemove' || type === 'mouseout') && (opts.onHover || opts.onLeave)) {
        return true;
    }
    if (opts.onClick && (type === 'click' || type === 'mouseup')) {
        return true;
    }
    return false;
}
var plugin_legend = {
    id: 'legend',
 _element: Legend,
    start (chart, _args, options) {
        const legend = chart.legend = new Legend({
            ctx: chart.ctx,
            options,
            chart
        });
        layouts.configure(chart, legend, options);
        layouts.addBox(chart, legend);
    },
    stop (chart) {
        layouts.removeBox(chart, chart.legend);
        delete chart.legend;
    },
    beforeUpdate (chart, _args, options) {
        const legend = chart.legend;
        layouts.configure(chart, legend, options);
        legend.options = options;
    },
    afterUpdate (chart) {
        const legend = chart.legend;
        legend.buildLabels();
        legend.adjustHitBoxes();
    },
    afterEvent (chart, args) {
        if (!args.replay) {
            chart.legend.handleEvent(args.event);
        }
    },
    defaults: {
        display: true,
        position: 'top',
        align: 'center',
        fullSize: true,
        reverse: false,
        weight: 1000,
        onClick (e, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
                ci.hide(index);
                legendItem.hidden = true;
            } else {
                ci.show(index);
                legendItem.hidden = false;
            }
        },
        onHover: null,
        onLeave: null,
        labels: {
            color: (ctx)=>ctx.chart.options.color,
            boxWidth: 40,
            padding: 10,
            generateLabels (chart) {
                const datasets = chart.data.datasets;
                const { labels: { usePointStyle , pointStyle , textAlign , color , useBorderRadius , borderRadius  }  } = chart.legend.options;
                return chart._getSortedDatasetMetas().map((meta)=>{
                    const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                    const borderWidth = toPadding(style.borderWidth);
                    return {
                        text: datasets[meta.index].label,
                        fillStyle: style.backgroundColor,
                        fontColor: color,
                        hidden: !meta.visible,
                        lineCap: style.borderCapStyle,
                        lineDash: style.borderDash,
                        lineDashOffset: style.borderDashOffset,
                        lineJoin: style.borderJoinStyle,
                        lineWidth: (borderWidth.width + borderWidth.height) / 4,
                        strokeStyle: style.borderColor,
                        pointStyle: pointStyle || style.pointStyle,
                        rotation: style.rotation,
                        textAlign: textAlign || style.textAlign,
                        borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                        datasetIndex: meta.index
                    };
                }, this);
            }
        },
        title: {
            color: (ctx)=>ctx.chart.options.color,
            display: false,
            position: 'center',
            text: ''
        }
    },
    descriptors: {
        _scriptable: (name)=>!name.startsWith('on'),
        labels: {
            _scriptable: (name)=>![
                    'generateLabels',
                    'filter',
                    'sort'
                ].includes(name)
        }
    }
};

function generateTicks$1(generationOptions, dataRange) {
    const ticks = [];
    const MIN_SPACING = 1e-14;
    const { bounds , step , min , max , precision , count , maxTicks , maxDigits , includeBounds  } = generationOptions;
    const unit = step || 1;
    const maxSpaces = maxTicks - 1;
    const { min: rmin , max: rmax  } = dataRange;
    const minDefined = !isNullOrUndef(min);
    const maxDefined = !isNullOrUndef(max);
    const countDefined = !isNullOrUndef(count);
    const minSpacing = (rmax - rmin) / (maxDigits + 1);
    let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
    let factor, niceMin, niceMax, numSpaces;
    if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
        return [
            {
                value: rmin
            },
            {
                value: rmax
            }
        ];
    }
    numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > maxSpaces) {
        spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
    }
    if (!isNullOrUndef(precision)) {
        factor = Math.pow(10, precision);
        spacing = Math.ceil(spacing * factor) / factor;
    }
    if (bounds === 'ticks') {
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
    } else {
        niceMin = rmin;
        niceMax = rmax;
    }
    if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
        numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
        spacing = (max - min) / numSpaces;
        niceMin = min;
        niceMax = max;
    } else if (countDefined) {
        niceMin = minDefined ? min : niceMin;
        niceMax = maxDefined ? max : niceMax;
        numSpaces = count - 1;
        spacing = (niceMax - niceMin) / numSpaces;
    } else {
        numSpaces = (niceMax - niceMin) / spacing;
        if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
            numSpaces = Math.round(numSpaces);
        } else {
            numSpaces = Math.ceil(numSpaces);
        }
    }
    const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
    factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMax = Math.round(niceMax * factor) / factor;
    let j = 0;
    if (minDefined) {
        if (includeBounds && niceMin !== min) {
            ticks.push({
                value: min
            });
            if (niceMin < min) {
                j++;
            }
            if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
                j++;
            }
        } else if (niceMin < min) {
            j++;
        }
    }
    for(; j < numSpaces; ++j){
        const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
        if (maxDefined && tickValue > max) {
            break;
        }
        ticks.push({
            value: tickValue
        });
    }
    if (maxDefined && includeBounds && niceMax !== max) {
        if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
            ticks[ticks.length - 1].value = max;
        } else {
            ticks.push({
                value: max
            });
        }
    } else if (!maxDefined || niceMax === max) {
        ticks.push({
            value: niceMax
        });
    }
    return ticks;
}
function relativeLabelSize(value, minSpacing, { horizontal , minRotation  }) {
    const rad = toRadians(minRotation);
    const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
    const length = 0.75 * minSpacing * ('' + value).length;
    return Math.min(minSpacing / ratio, length);
}
class LinearScaleBase extends Scale {
    constructor(cfg){
        super(cfg);
         this.start = undefined;
         this.end = undefined;
         this._startValue = undefined;
         this._endValue = undefined;
        this._valueRange = 0;
    }
    parse(raw, index) {
        if (isNullOrUndef(raw)) {
            return null;
        }
        if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
            return null;
        }
        return +raw;
    }
    handleTickRangeOptions() {
        const { beginAtZero  } = this.options;
        const { minDefined , maxDefined  } = this.getUserBounds();
        let { min , max  } = this;
        const setMin = (v)=>min = minDefined ? min : v;
        const setMax = (v)=>max = maxDefined ? max : v;
        if (beginAtZero) {
            const minSign = sign(min);
            const maxSign = sign(max);
            if (minSign < 0 && maxSign < 0) {
                setMax(0);
            } else if (minSign > 0 && maxSign > 0) {
                setMin(0);
            }
        }
        if (min === max) {
            let offset = max === 0 ? 1 : Math.abs(max * 0.05);
            setMax(max + offset);
            if (!beginAtZero) {
                setMin(min - offset);
            }
        }
        this.min = min;
        this.max = max;
    }
    getTickLimit() {
        const tickOpts = this.options.ticks;
        let { maxTicksLimit , stepSize  } = tickOpts;
        let maxTicks;
        if (stepSize) {
            maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
            if (maxTicks > 1000) {
                console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
                maxTicks = 1000;
            }
        } else {
            maxTicks = this.computeTickLimit();
            maxTicksLimit = maxTicksLimit || 11;
        }
        if (maxTicksLimit) {
            maxTicks = Math.min(maxTicksLimit, maxTicks);
        }
        return maxTicks;
    }
 computeTickLimit() {
        return Number.POSITIVE_INFINITY;
    }
    buildTicks() {
        const opts = this.options;
        const tickOpts = opts.ticks;
        let maxTicks = this.getTickLimit();
        maxTicks = Math.max(2, maxTicks);
        const numericGeneratorOptions = {
            maxTicks,
            bounds: opts.bounds,
            min: opts.min,
            max: opts.max,
            precision: tickOpts.precision,
            step: tickOpts.stepSize,
            count: tickOpts.count,
            maxDigits: this._maxDigits(),
            horizontal: this.isHorizontal(),
            minRotation: tickOpts.minRotation || 0,
            includeBounds: tickOpts.includeBounds !== false
        };
        const dataRange = this._range || this;
        const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
        if (opts.bounds === 'ticks') {
            _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
            ticks.reverse();
            this.start = this.max;
            this.end = this.min;
        } else {
            this.start = this.min;
            this.end = this.max;
        }
        return ticks;
    }
 configure() {
        const ticks = this.ticks;
        let start = this.min;
        let end = this.max;
        super.configure();
        if (this.options.offset && ticks.length) {
            const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
            start -= offset;
            end += offset;
        }
        this._startValue = start;
        this._endValue = end;
        this._valueRange = end - start;
    }
    getLabelForValue(value) {
        return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
    }
}

class LinearScale extends LinearScaleBase {
    static id = 'linear';
 static defaults = {
        ticks: {
            callback: Ticks.formatters.numeric
        }
    };
    determineDataLimits() {
        const { min , max  } = this.getMinMax(true);
        this.min = isNumberFinite(min) ? min : 0;
        this.max = isNumberFinite(max) ? max : 1;
        this.handleTickRangeOptions();
    }
 computeTickLimit() {
        const horizontal = this.isHorizontal();
        const length = horizontal ? this.width : this.height;
        const minRotation = toRadians(this.options.ticks.minRotation);
        const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
        const tickFont = this._resolveTickFontOptions(0);
        return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
    }
    getPixelForValue(value) {
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
    }
    getValueForPixel(pixel) {
        return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
    }
}

const INTERVALS = {
    millisecond: {
        common: true,
        size: 1,
        steps: 1000
    },
    second: {
        common: true,
        size: 1000,
        steps: 60
    },
    minute: {
        common: true,
        size: 60000,
        steps: 60
    },
    hour: {
        common: true,
        size: 3600000,
        steps: 24
    },
    day: {
        common: true,
        size: 86400000,
        steps: 30
    },
    week: {
        common: false,
        size: 604800000,
        steps: 4
    },
    month: {
        common: true,
        size: 2.628e9,
        steps: 12
    },
    quarter: {
        common: false,
        size: 7.884e9,
        steps: 4
    },
    year: {
        common: true,
        size: 3.154e10
    }
};
 const UNITS =  /* #__PURE__ */ Object.keys(INTERVALS);
 function sorter(a, b) {
    return a - b;
}
 function parse(scale, input) {
    if (isNullOrUndef(input)) {
        return null;
    }
    const adapter = scale._adapter;
    const { parser , round , isoWeekday  } = scale._parseOpts;
    let value = input;
    if (typeof parser === 'function') {
        value = parser(value);
    }
    if (!isNumberFinite(value)) {
        value = typeof parser === 'string' ? adapter.parse(value, parser) : adapter.parse(value);
    }
    if (value === null) {
        return null;
    }
    if (round) {
        value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
    }
    return +value;
}
 function determineUnitForAutoTicks(minUnit, min, max, capacity) {
    const ilen = UNITS.length;
    for(let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i){
        const interval = INTERVALS[UNITS[i]];
        const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
        if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
            return UNITS[i];
        }
    }
    return UNITS[ilen - 1];
}
 function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
    for(let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--){
        const unit = UNITS[i];
        if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
            return unit;
        }
    }
    return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
 function determineMajorUnit(unit) {
    for(let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i){
        if (INTERVALS[UNITS[i]].common) {
            return UNITS[i];
        }
    }
}
 function addTick(ticks, time, timestamps) {
    if (!timestamps) {
        ticks[time] = true;
    } else if (timestamps.length) {
        const { lo , hi  } = _lookup(timestamps, time);
        const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
        ticks[timestamp] = true;
    }
}
 function setMajorTicks(scale, ticks, map, majorUnit) {
    const adapter = scale._adapter;
    const first = +adapter.startOf(ticks[0].value, majorUnit);
    const last = ticks[ticks.length - 1].value;
    let major, index;
    for(major = first; major <= last; major = +adapter.add(major, 1, majorUnit)){
        index = map[major];
        if (index >= 0) {
            ticks[index].major = true;
        }
    }
    return ticks;
}
 function ticksFromTimestamps(scale, values, majorUnit) {
    const ticks = [];
     const map = {};
    const ilen = values.length;
    let i, value;
    for(i = 0; i < ilen; ++i){
        value = values[i];
        map[value] = i;
        ticks.push({
            value,
            major: false
        });
    }
    return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
}
class TimeScale extends Scale {
    static id = 'time';
 static defaults = {
 bounds: 'data',
        adapters: {},
        time: {
            parser: false,
            unit: false,
            round: false,
            isoWeekday: false,
            minUnit: 'millisecond',
            displayFormats: {}
        },
        ticks: {
 source: 'auto',
            callback: false,
            major: {
                enabled: false
            }
        }
    };
 constructor(props){
        super(props);
         this._cache = {
            data: [],
            labels: [],
            all: []
        };
         this._unit = 'day';
         this._majorUnit = undefined;
        this._offsets = {};
        this._normalized = false;
        this._parseOpts = undefined;
    }
    init(scaleOpts, opts = {}) {
        const time = scaleOpts.time || (scaleOpts.time = {});
         const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
        adapter.init(opts);
        mergeIf(time.displayFormats, adapter.formats());
        this._parseOpts = {
            parser: time.parser,
            round: time.round,
            isoWeekday: time.isoWeekday
        };
        super.init(scaleOpts);
        this._normalized = opts.normalized;
    }
 parse(raw, index) {
        if (raw === undefined) {
            return null;
        }
        return parse(this, raw);
    }
    beforeLayout() {
        super.beforeLayout();
        this._cache = {
            data: [],
            labels: [],
            all: []
        };
    }
    determineDataLimits() {
        const options = this.options;
        const adapter = this._adapter;
        const unit = options.time.unit || 'day';
        let { min , max , minDefined , maxDefined  } = this.getUserBounds();
 function _applyBounds(bounds) {
            if (!minDefined && !isNaN(bounds.min)) {
                min = Math.min(min, bounds.min);
            }
            if (!maxDefined && !isNaN(bounds.max)) {
                max = Math.max(max, bounds.max);
            }
        }
        if (!minDefined || !maxDefined) {
            _applyBounds(this._getLabelBounds());
            if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
                _applyBounds(this.getMinMax(false));
            }
        }
        min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
        max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
        this.min = Math.min(min, max - 1);
        this.max = Math.max(min + 1, max);
    }
 _getLabelBounds() {
        const arr = this.getLabelTimestamps();
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        if (arr.length) {
            min = arr[0];
            max = arr[arr.length - 1];
        }
        return {
            min,
            max
        };
    }
 buildTicks() {
        const options = this.options;
        const timeOpts = options.time;
        const tickOpts = options.ticks;
        const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
        if (options.bounds === 'ticks' && timestamps.length) {
            this.min = this._userMin || timestamps[0];
            this.max = this._userMax || timestamps[timestamps.length - 1];
        }
        const min = this.min;
        const max = this.max;
        const ticks = _filterBetween(timestamps, min, max);
        this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
        this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined : determineMajorUnit(this._unit);
        this.initOffsets(timestamps);
        if (options.reverse) {
            ticks.reverse();
        }
        return ticksFromTimestamps(this, ticks, this._majorUnit);
    }
    afterAutoSkip() {
        if (this.options.offsetAfterAutoskip) {
            this.initOffsets(this.ticks.map((tick)=>+tick.value));
        }
    }
 initOffsets(timestamps = []) {
        let start = 0;
        let end = 0;
        let first, last;
        if (this.options.offset && timestamps.length) {
            first = this.getDecimalForValue(timestamps[0]);
            if (timestamps.length === 1) {
                start = 1 - first;
            } else {
                start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
            }
            last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
            if (timestamps.length === 1) {
                end = last;
            } else {
                end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
            }
        }
        const limit = timestamps.length < 3 ? 0.5 : 0.25;
        start = _limitValue(start, 0, limit);
        end = _limitValue(end, 0, limit);
        this._offsets = {
            start,
            end,
            factor: 1 / (start + 1 + end)
        };
    }
 _generate() {
        const adapter = this._adapter;
        const min = this.min;
        const max = this.max;
        const options = this.options;
        const timeOpts = options.time;
        const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
        const stepSize = valueOrDefault(options.ticks.stepSize, 1);
        const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        const hasWeekday = isNumber(weekday) || weekday === true;
        const ticks = {};
        let first = min;
        let time, count;
        if (hasWeekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
        if (adapter.diff(max, min, minor) > 100000 * stepSize) {
            throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
        }
        const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
        for(time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++){
            addTick(ticks, time, timestamps);
        }
        if (time === max || options.bounds === 'ticks' || count === 1) {
            addTick(ticks, time, timestamps);
        }
        return Object.keys(ticks).sort(sorter).map((x)=>+x);
    }
 getLabelForValue(value) {
        const adapter = this._adapter;
        const timeOpts = this.options.time;
        if (timeOpts.tooltipFormat) {
            return adapter.format(value, timeOpts.tooltipFormat);
        }
        return adapter.format(value, timeOpts.displayFormats.datetime);
    }
 format(value, format) {
        const options = this.options;
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const fmt = format || formats[unit];
        return this._adapter.format(value, fmt);
    }
 _tickFormatFunction(time, index, ticks, format) {
        const options = this.options;
        const formatter = options.ticks.callback;
        if (formatter) {
            return callback(formatter, [
                time,
                index,
                ticks
            ], this);
        }
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const majorUnit = this._majorUnit;
        const minorFormat = unit && formats[unit];
        const majorFormat = majorUnit && formats[majorUnit];
        const tick = ticks[index];
        const major = majorUnit && majorFormat && tick && tick.major;
        return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
    }
 generateTickLabels(ticks) {
        let i, ilen, tick;
        for(i = 0, ilen = ticks.length; i < ilen; ++i){
            tick = ticks[i];
            tick.label = this._tickFormatFunction(tick.value, i, ticks);
        }
    }
 getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.max - this.min);
    }
 getPixelForValue(value) {
        const offsets = this._offsets;
        const pos = this.getDecimalForValue(value);
        return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
    }
 getValueForPixel(pixel) {
        const offsets = this._offsets;
        const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return this.min + pos * (this.max - this.min);
    }
 _getLabelSize(label) {
        const ticksOpts = this.options.ticks;
        const tickLabelWidth = this.ctx.measureText(label).width;
        const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
        const cosRotation = Math.cos(angle);
        const sinRotation = Math.sin(angle);
        const tickFontSize = this._resolveTickFontOptions(0).size;
        return {
            w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
            h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
        };
    }
 _getLabelCapacity(exampleTime) {
        const timeOpts = this.options.time;
        const displayFormats = timeOpts.displayFormats;
        const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
        const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
            exampleTime
        ], this._majorUnit), format);
        const size = this._getLabelSize(exampleLabel);
        const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
        return capacity > 0 ? capacity : 1;
    }
 getDataTimestamps() {
        let timestamps = this._cache.data || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const metas = this.getMatchingVisibleMetas();
        if (this._normalized && metas.length) {
            return this._cache.data = metas[0].controller.getAllParsedValues(this);
        }
        for(i = 0, ilen = metas.length; i < ilen; ++i){
            timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
        }
        return this._cache.data = this.normalize(timestamps);
    }
 getLabelTimestamps() {
        const timestamps = this._cache.labels || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const labels = this.getLabels();
        for(i = 0, ilen = labels.length; i < ilen; ++i){
            timestamps.push(parse(this, labels[i]));
        }
        return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
    }
 normalize(values) {
        return _arrayUnique(values.sort(sorter));
    }
}

function interpolate(table, val, reverse) {
    let lo = 0;
    let hi = table.length - 1;
    let prevSource, nextSource, prevTarget, nextTarget;
    if (reverse) {
        if (val >= table[lo].pos && val <= table[hi].pos) {
            ({ lo , hi  } = _lookupByKey(table, 'pos', val));
        }
        ({ pos: prevSource , time: prevTarget  } = table[lo]);
        ({ pos: nextSource , time: nextTarget  } = table[hi]);
    } else {
        if (val >= table[lo].time && val <= table[hi].time) {
            ({ lo , hi  } = _lookupByKey(table, 'time', val));
        }
        ({ time: prevSource , pos: prevTarget  } = table[lo]);
        ({ time: nextSource , pos: nextTarget  } = table[hi]);
    }
    const span = nextSource - prevSource;
    return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
class TimeSeriesScale extends TimeScale {
    static id = 'timeseries';
 static defaults = TimeScale.defaults;
 constructor(props){
        super(props);
         this._table = [];
         this._minPos = undefined;
         this._tableRange = undefined;
    }
 initOffsets() {
        const timestamps = this._getTimestampsForTable();
        const table = this._table = this.buildLookupTable(timestamps);
        this._minPos = interpolate(table, this.min);
        this._tableRange = interpolate(table, this.max) - this._minPos;
        super.initOffsets(timestamps);
    }
 buildLookupTable(timestamps) {
        const { min , max  } = this;
        const items = [];
        const table = [];
        let i, ilen, prev, curr, next;
        for(i = 0, ilen = timestamps.length; i < ilen; ++i){
            curr = timestamps[i];
            if (curr >= min && curr <= max) {
                items.push(curr);
            }
        }
        if (items.length < 2) {
            return [
                {
                    time: min,
                    pos: 0
                },
                {
                    time: max,
                    pos: 1
                }
            ];
        }
        for(i = 0, ilen = items.length; i < ilen; ++i){
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (Math.round((next + prev) / 2) !== curr) {
                table.push({
                    time: curr,
                    pos: i / (ilen - 1)
                });
            }
        }
        return table;
    }
 _generate() {
        const min = this.min;
        const max = this.max;
        let timestamps = super.getDataTimestamps();
        if (!timestamps.includes(min) || !timestamps.length) {
            timestamps.splice(0, 0, min);
        }
        if (!timestamps.includes(max) || timestamps.length === 1) {
            timestamps.push(max);
        }
        return timestamps.sort((a, b)=>a - b);
    }
 _getTimestampsForTable() {
        let timestamps = this._cache.all || [];
        if (timestamps.length) {
            return timestamps;
        }
        const data = this.getDataTimestamps();
        const label = this.getLabelTimestamps();
        if (data.length && label.length) {
            timestamps = this.normalize(data.concat(label));
        } else {
            timestamps = data.length ? data : label;
        }
        timestamps = this._cache.all = timestamps;
        return timestamps;
    }
 getDecimalForValue(value) {
        return (interpolate(this._table, value) - this._minPos) / this._tableRange;
    }
 getValueForPixel(pixel) {
        const offsets = this._offsets;
        const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e,this[e]=h.fromAttribute(s,t.type)??this._$Ej?.get(e)??null,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$1="?"+h,n=`<${o$1}>`,r=document,l=()=>r.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_$1=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r.createTreeWalker(r,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_$1:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_$1?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$1)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.0");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.0");

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var lodash$1 = {exports: {}};

/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var lodash = lodash$1.exports;

var hasRequiredLodash;

function requireLodash () {
	if (hasRequiredLodash) return lodash$1.exports;
	hasRequiredLodash = 1;
	(function (module, exports) {
(function() {

		  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
		  var undefined$1;

		  /** Used as the semantic version number. */
		  var VERSION = '4.17.21';

		  /** Used as the size to enable large array optimizations. */
		  var LARGE_ARRAY_SIZE = 200;

		  /** Error message constants. */
		  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
		      FUNC_ERROR_TEXT = 'Expected a function',
		      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

		  /** Used to stand-in for `undefined` hash values. */
		  var HASH_UNDEFINED = '__lodash_hash_undefined__';

		  /** Used as the maximum memoize cache size. */
		  var MAX_MEMOIZE_SIZE = 500;

		  /** Used as the internal argument placeholder. */
		  var PLACEHOLDER = '__lodash_placeholder__';

		  /** Used to compose bitmasks for cloning. */
		  var CLONE_DEEP_FLAG = 1,
		      CLONE_FLAT_FLAG = 2,
		      CLONE_SYMBOLS_FLAG = 4;

		  /** Used to compose bitmasks for value comparisons. */
		  var COMPARE_PARTIAL_FLAG = 1,
		      COMPARE_UNORDERED_FLAG = 2;

		  /** Used to compose bitmasks for function metadata. */
		  var WRAP_BIND_FLAG = 1,
		      WRAP_BIND_KEY_FLAG = 2,
		      WRAP_CURRY_BOUND_FLAG = 4,
		      WRAP_CURRY_FLAG = 8,
		      WRAP_CURRY_RIGHT_FLAG = 16,
		      WRAP_PARTIAL_FLAG = 32,
		      WRAP_PARTIAL_RIGHT_FLAG = 64,
		      WRAP_ARY_FLAG = 128,
		      WRAP_REARG_FLAG = 256,
		      WRAP_FLIP_FLAG = 512;

		  /** Used as default options for `_.truncate`. */
		  var DEFAULT_TRUNC_LENGTH = 30,
		      DEFAULT_TRUNC_OMISSION = '...';

		  /** Used to detect hot functions by number of calls within a span of milliseconds. */
		  var HOT_COUNT = 800,
		      HOT_SPAN = 16;

		  /** Used to indicate the type of lazy iteratees. */
		  var LAZY_FILTER_FLAG = 1,
		      LAZY_MAP_FLAG = 2,
		      LAZY_WHILE_FLAG = 3;

		  /** Used as references for various `Number` constants. */
		  var INFINITY = 1 / 0,
		      MAX_SAFE_INTEGER = 9007199254740991,
		      MAX_INTEGER = 1.7976931348623157e+308,
		      NAN = 0 / 0;

		  /** Used as references for the maximum length and index of an array. */
		  var MAX_ARRAY_LENGTH = 4294967295,
		      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
		      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

		  /** Used to associate wrap methods with their bit flags. */
		  var wrapFlags = [
		    ['ary', WRAP_ARY_FLAG],
		    ['bind', WRAP_BIND_FLAG],
		    ['bindKey', WRAP_BIND_KEY_FLAG],
		    ['curry', WRAP_CURRY_FLAG],
		    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
		    ['flip', WRAP_FLIP_FLAG],
		    ['partial', WRAP_PARTIAL_FLAG],
		    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
		    ['rearg', WRAP_REARG_FLAG]
		  ];

		  /** `Object#toString` result references. */
		  var argsTag = '[object Arguments]',
		      arrayTag = '[object Array]',
		      asyncTag = '[object AsyncFunction]',
		      boolTag = '[object Boolean]',
		      dateTag = '[object Date]',
		      domExcTag = '[object DOMException]',
		      errorTag = '[object Error]',
		      funcTag = '[object Function]',
		      genTag = '[object GeneratorFunction]',
		      mapTag = '[object Map]',
		      numberTag = '[object Number]',
		      nullTag = '[object Null]',
		      objectTag = '[object Object]',
		      promiseTag = '[object Promise]',
		      proxyTag = '[object Proxy]',
		      regexpTag = '[object RegExp]',
		      setTag = '[object Set]',
		      stringTag = '[object String]',
		      symbolTag = '[object Symbol]',
		      undefinedTag = '[object Undefined]',
		      weakMapTag = '[object WeakMap]',
		      weakSetTag = '[object WeakSet]';

		  var arrayBufferTag = '[object ArrayBuffer]',
		      dataViewTag = '[object DataView]',
		      float32Tag = '[object Float32Array]',
		      float64Tag = '[object Float64Array]',
		      int8Tag = '[object Int8Array]',
		      int16Tag = '[object Int16Array]',
		      int32Tag = '[object Int32Array]',
		      uint8Tag = '[object Uint8Array]',
		      uint8ClampedTag = '[object Uint8ClampedArray]',
		      uint16Tag = '[object Uint16Array]',
		      uint32Tag = '[object Uint32Array]';

		  /** Used to match empty string literals in compiled template source. */
		  var reEmptyStringLeading = /\b__p \+= '';/g,
		      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
		      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

		  /** Used to match HTML entities and HTML characters. */
		  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
		      reUnescapedHtml = /[&<>"']/g,
		      reHasEscapedHtml = RegExp(reEscapedHtml.source),
		      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

		  /** Used to match template delimiters. */
		  var reEscape = /<%-([\s\S]+?)%>/g,
		      reEvaluate = /<%([\s\S]+?)%>/g,
		      reInterpolate = /<%=([\s\S]+?)%>/g;

		  /** Used to match property names within property paths. */
		  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
		      reIsPlainProp = /^\w*$/,
		      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

		  /**
		   * Used to match `RegExp`
		   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
		   */
		  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
		      reHasRegExpChar = RegExp(reRegExpChar.source);

		  /** Used to match leading whitespace. */
		  var reTrimStart = /^\s+/;

		  /** Used to match a single whitespace character. */
		  var reWhitespace = /\s/;

		  /** Used to match wrap detail comments. */
		  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
		      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
		      reSplitDetails = /,? & /;

		  /** Used to match words composed of alphanumeric characters. */
		  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

		  /**
		   * Used to validate the `validate` option in `_.template` variable.
		   *
		   * Forbids characters which could potentially change the meaning of the function argument definition:
		   * - "()," (modification of function parameters)
		   * - "=" (default value)
		   * - "[]{}" (destructuring of function parameters)
		   * - "/" (beginning of a comment)
		   * - whitespace
		   */
		  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

		  /** Used to match backslashes in property paths. */
		  var reEscapeChar = /\\(\\)?/g;

		  /**
		   * Used to match
		   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
		   */
		  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

		  /** Used to match `RegExp` flags from their coerced string values. */
		  var reFlags = /\w*$/;

		  /** Used to detect bad signed hexadecimal string values. */
		  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

		  /** Used to detect binary string values. */
		  var reIsBinary = /^0b[01]+$/i;

		  /** Used to detect host constructors (Safari). */
		  var reIsHostCtor = /^\[object .+?Constructor\]$/;

		  /** Used to detect octal string values. */
		  var reIsOctal = /^0o[0-7]+$/i;

		  /** Used to detect unsigned integer values. */
		  var reIsUint = /^(?:0|[1-9]\d*)$/;

		  /** Used to match Latin Unicode letters (excluding mathematical operators). */
		  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

		  /** Used to ensure capturing order of template delimiters. */
		  var reNoMatch = /($^)/;

		  /** Used to match unescaped characters in compiled string literals. */
		  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

		  /** Used to compose unicode character classes. */
		  var rsAstralRange = '\\ud800-\\udfff',
		      rsComboMarksRange = '\\u0300-\\u036f',
		      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
		      rsComboSymbolsRange = '\\u20d0-\\u20ff',
		      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
		      rsDingbatRange = '\\u2700-\\u27bf',
		      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
		      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
		      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
		      rsPunctuationRange = '\\u2000-\\u206f',
		      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
		      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
		      rsVarRange = '\\ufe0e\\ufe0f',
		      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

		  /** Used to compose unicode capture groups. */
		  var rsApos = "['\u2019]",
		      rsAstral = '[' + rsAstralRange + ']',
		      rsBreak = '[' + rsBreakRange + ']',
		      rsCombo = '[' + rsComboRange + ']',
		      rsDigits = '\\d+',
		      rsDingbat = '[' + rsDingbatRange + ']',
		      rsLower = '[' + rsLowerRange + ']',
		      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
		      rsFitz = '\\ud83c[\\udffb-\\udfff]',
		      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
		      rsNonAstral = '[^' + rsAstralRange + ']',
		      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
		      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
		      rsUpper = '[' + rsUpperRange + ']',
		      rsZWJ = '\\u200d';

		  /** Used to compose unicode regexes. */
		  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
		      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
		      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
		      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
		      reOptMod = rsModifier + '?',
		      rsOptVar = '[' + rsVarRange + ']?',
		      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
		      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
		      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
		      rsSeq = rsOptVar + reOptMod + rsOptJoin,
		      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
		      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

		  /** Used to match apostrophes. */
		  var reApos = RegExp(rsApos, 'g');

		  /**
		   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
		   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
		   */
		  var reComboMark = RegExp(rsCombo, 'g');

		  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
		  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

		  /** Used to match complex or compound words. */
		  var reUnicodeWord = RegExp([
		    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
		    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
		    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
		    rsUpper + '+' + rsOptContrUpper,
		    rsOrdUpper,
		    rsOrdLower,
		    rsDigits,
		    rsEmoji
		  ].join('|'), 'g');

		  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
		  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

		  /** Used to detect strings that need a more robust regexp to match words. */
		  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

		  /** Used to assign default `context` object properties. */
		  var contextProps = [
		    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
		    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
		    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
		    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
		    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
		  ];

		  /** Used to make template sourceURLs easier to identify. */
		  var templateCounter = -1;

		  /** Used to identify `toStringTag` values of typed arrays. */
		  var typedArrayTags = {};
		  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
		  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
		  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
		  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
		  typedArrayTags[uint32Tag] = true;
		  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
		  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
		  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
		  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
		  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
		  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
		  typedArrayTags[setTag] = typedArrayTags[stringTag] =
		  typedArrayTags[weakMapTag] = false;

		  /** Used to identify `toStringTag` values supported by `_.clone`. */
		  var cloneableTags = {};
		  cloneableTags[argsTag] = cloneableTags[arrayTag] =
		  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
		  cloneableTags[boolTag] = cloneableTags[dateTag] =
		  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
		  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
		  cloneableTags[int32Tag] = cloneableTags[mapTag] =
		  cloneableTags[numberTag] = cloneableTags[objectTag] =
		  cloneableTags[regexpTag] = cloneableTags[setTag] =
		  cloneableTags[stringTag] = cloneableTags[symbolTag] =
		  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
		  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
		  cloneableTags[errorTag] = cloneableTags[funcTag] =
		  cloneableTags[weakMapTag] = false;

		  /** Used to map Latin Unicode letters to basic Latin letters. */
		  var deburredLetters = {
		    // Latin-1 Supplement block.
		    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
		    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
		    '\xc7': 'C',  '\xe7': 'c',
		    '\xd0': 'D',  '\xf0': 'd',
		    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
		    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
		    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
		    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
		    '\xd1': 'N',  '\xf1': 'n',
		    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
		    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
		    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
		    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
		    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
		    '\xc6': 'Ae', '\xe6': 'ae',
		    '\xde': 'Th', '\xfe': 'th',
		    '\xdf': 'ss',
		    // Latin Extended-A block.
		    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
		    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
		    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
		    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
		    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
		    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
		    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
		    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
		    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
		    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
		    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
		    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
		    '\u0134': 'J',  '\u0135': 'j',
		    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
		    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
		    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
		    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
		    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
		    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
		    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
		    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
		    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
		    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
		    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
		    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
		    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
		    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
		    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
		    '\u0174': 'W',  '\u0175': 'w',
		    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
		    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
		    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
		    '\u0132': 'IJ', '\u0133': 'ij',
		    '\u0152': 'Oe', '\u0153': 'oe',
		    '\u0149': "'n", '\u017f': 's'
		  };

		  /** Used to map characters to HTML entities. */
		  var htmlEscapes = {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;',
		    '"': '&quot;',
		    "'": '&#39;'
		  };

		  /** Used to map HTML entities to characters. */
		  var htmlUnescapes = {
		    '&amp;': '&',
		    '&lt;': '<',
		    '&gt;': '>',
		    '&quot;': '"',
		    '&#39;': "'"
		  };

		  /** Used to escape characters for inclusion in compiled string literals. */
		  var stringEscapes = {
		    '\\': '\\',
		    "'": "'",
		    '\n': 'n',
		    '\r': 'r',
		    '\u2028': 'u2028',
		    '\u2029': 'u2029'
		  };

		  /** Built-in method references without a dependency on `root`. */
		  var freeParseFloat = parseFloat,
		      freeParseInt = parseInt;

		  /** Detect free variable `global` from Node.js. */
		  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

		  /** Detect free variable `self`. */
		  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

		  /** Used as a reference to the global object. */
		  var root = freeGlobal || freeSelf || Function('return this')();

		  /** Detect free variable `exports`. */
		  var freeExports = exports && !exports.nodeType && exports;

		  /** Detect free variable `module`. */
		  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		  /** Detect the popular CommonJS extension `module.exports`. */
		  var moduleExports = freeModule && freeModule.exports === freeExports;

		  /** Detect free variable `process` from Node.js. */
		  var freeProcess = moduleExports && freeGlobal.process;

		  /** Used to access faster Node.js helpers. */
		  var nodeUtil = (function() {
		    try {
		      // Use `util.types` for Node.js 10+.
		      var types = freeModule && freeModule.require && freeModule.require('util').types;

		      if (types) {
		        return types;
		      }

		      // Legacy `process.binding('util')` for Node.js < 10.
		      return freeProcess && freeProcess.binding && freeProcess.binding('util');
		    } catch (e) {}
		  }());

		  /* Node.js helper references. */
		  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
		      nodeIsDate = nodeUtil && nodeUtil.isDate,
		      nodeIsMap = nodeUtil && nodeUtil.isMap,
		      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
		      nodeIsSet = nodeUtil && nodeUtil.isSet,
		      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

		  /*--------------------------------------------------------------------------*/

		  /**
		   * A faster alternative to `Function#apply`, this function invokes `func`
		   * with the `this` binding of `thisArg` and the arguments of `args`.
		   *
		   * @private
		   * @param {Function} func The function to invoke.
		   * @param {*} thisArg The `this` binding of `func`.
		   * @param {Array} args The arguments to invoke `func` with.
		   * @returns {*} Returns the result of `func`.
		   */
		  function apply(func, thisArg, args) {
		    switch (args.length) {
		      case 0: return func.call(thisArg);
		      case 1: return func.call(thisArg, args[0]);
		      case 2: return func.call(thisArg, args[0], args[1]);
		      case 3: return func.call(thisArg, args[0], args[1], args[2]);
		    }
		    return func.apply(thisArg, args);
		  }

		  /**
		   * A specialized version of `baseAggregator` for arrays.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} setter The function to set `accumulator` values.
		   * @param {Function} iteratee The iteratee to transform keys.
		   * @param {Object} accumulator The initial aggregated object.
		   * @returns {Function} Returns `accumulator`.
		   */
		  function arrayAggregator(array, setter, iteratee, accumulator) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    while (++index < length) {
		      var value = array[index];
		      setter(accumulator, value, iteratee(value), array);
		    }
		    return accumulator;
		  }

		  /**
		   * A specialized version of `_.forEach` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {Array} Returns `array`.
		   */
		  function arrayEach(array, iteratee) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    while (++index < length) {
		      if (iteratee(array[index], index, array) === false) {
		        break;
		      }
		    }
		    return array;
		  }

		  /**
		   * A specialized version of `_.forEachRight` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {Array} Returns `array`.
		   */
		  function arrayEachRight(array, iteratee) {
		    var length = array == null ? 0 : array.length;

		    while (length--) {
		      if (iteratee(array[length], length, array) === false) {
		        break;
		      }
		    }
		    return array;
		  }

		  /**
		   * A specialized version of `_.every` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} predicate The function invoked per iteration.
		   * @returns {boolean} Returns `true` if all elements pass the predicate check,
		   *  else `false`.
		   */
		  function arrayEvery(array, predicate) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    while (++index < length) {
		      if (!predicate(array[index], index, array)) {
		        return false;
		      }
		    }
		    return true;
		  }

		  /**
		   * A specialized version of `_.filter` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} predicate The function invoked per iteration.
		   * @returns {Array} Returns the new filtered array.
		   */
		  function arrayFilter(array, predicate) {
		    var index = -1,
		        length = array == null ? 0 : array.length,
		        resIndex = 0,
		        result = [];

		    while (++index < length) {
		      var value = array[index];
		      if (predicate(value, index, array)) {
		        result[resIndex++] = value;
		      }
		    }
		    return result;
		  }

		  /**
		   * A specialized version of `_.includes` for arrays without support for
		   * specifying an index to search from.
		   *
		   * @private
		   * @param {Array} [array] The array to inspect.
		   * @param {*} target The value to search for.
		   * @returns {boolean} Returns `true` if `target` is found, else `false`.
		   */
		  function arrayIncludes(array, value) {
		    var length = array == null ? 0 : array.length;
		    return !!length && baseIndexOf(array, value, 0) > -1;
		  }

		  /**
		   * This function is like `arrayIncludes` except that it accepts a comparator.
		   *
		   * @private
		   * @param {Array} [array] The array to inspect.
		   * @param {*} target The value to search for.
		   * @param {Function} comparator The comparator invoked per element.
		   * @returns {boolean} Returns `true` if `target` is found, else `false`.
		   */
		  function arrayIncludesWith(array, value, comparator) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    while (++index < length) {
		      if (comparator(value, array[index])) {
		        return true;
		      }
		    }
		    return false;
		  }

		  /**
		   * A specialized version of `_.map` for arrays without support for iteratee
		   * shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {Array} Returns the new mapped array.
		   */
		  function arrayMap(array, iteratee) {
		    var index = -1,
		        length = array == null ? 0 : array.length,
		        result = Array(length);

		    while (++index < length) {
		      result[index] = iteratee(array[index], index, array);
		    }
		    return result;
		  }

		  /**
		   * Appends the elements of `values` to `array`.
		   *
		   * @private
		   * @param {Array} array The array to modify.
		   * @param {Array} values The values to append.
		   * @returns {Array} Returns `array`.
		   */
		  function arrayPush(array, values) {
		    var index = -1,
		        length = values.length,
		        offset = array.length;

		    while (++index < length) {
		      array[offset + index] = values[index];
		    }
		    return array;
		  }

		  /**
		   * A specialized version of `_.reduce` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @param {*} [accumulator] The initial value.
		   * @param {boolean} [initAccum] Specify using the first element of `array` as
		   *  the initial value.
		   * @returns {*} Returns the accumulated value.
		   */
		  function arrayReduce(array, iteratee, accumulator, initAccum) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    if (initAccum && length) {
		      accumulator = array[++index];
		    }
		    while (++index < length) {
		      accumulator = iteratee(accumulator, array[index], index, array);
		    }
		    return accumulator;
		  }

		  /**
		   * A specialized version of `_.reduceRight` for arrays without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @param {*} [accumulator] The initial value.
		   * @param {boolean} [initAccum] Specify using the last element of `array` as
		   *  the initial value.
		   * @returns {*} Returns the accumulated value.
		   */
		  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
		    var length = array == null ? 0 : array.length;
		    if (initAccum && length) {
		      accumulator = array[--length];
		    }
		    while (length--) {
		      accumulator = iteratee(accumulator, array[length], length, array);
		    }
		    return accumulator;
		  }

		  /**
		   * A specialized version of `_.some` for arrays without support for iteratee
		   * shorthands.
		   *
		   * @private
		   * @param {Array} [array] The array to iterate over.
		   * @param {Function} predicate The function invoked per iteration.
		   * @returns {boolean} Returns `true` if any element passes the predicate check,
		   *  else `false`.
		   */
		  function arraySome(array, predicate) {
		    var index = -1,
		        length = array == null ? 0 : array.length;

		    while (++index < length) {
		      if (predicate(array[index], index, array)) {
		        return true;
		      }
		    }
		    return false;
		  }

		  /**
		   * Gets the size of an ASCII `string`.
		   *
		   * @private
		   * @param {string} string The string inspect.
		   * @returns {number} Returns the string size.
		   */
		  var asciiSize = baseProperty('length');

		  /**
		   * Converts an ASCII `string` to an array.
		   *
		   * @private
		   * @param {string} string The string to convert.
		   * @returns {Array} Returns the converted array.
		   */
		  function asciiToArray(string) {
		    return string.split('');
		  }

		  /**
		   * Splits an ASCII `string` into an array of its words.
		   *
		   * @private
		   * @param {string} The string to inspect.
		   * @returns {Array} Returns the words of `string`.
		   */
		  function asciiWords(string) {
		    return string.match(reAsciiWord) || [];
		  }

		  /**
		   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
		   * without support for iteratee shorthands, which iterates over `collection`
		   * using `eachFunc`.
		   *
		   * @private
		   * @param {Array|Object} collection The collection to inspect.
		   * @param {Function} predicate The function invoked per iteration.
		   * @param {Function} eachFunc The function to iterate over `collection`.
		   * @returns {*} Returns the found element or its key, else `undefined`.
		   */
		  function baseFindKey(collection, predicate, eachFunc) {
		    var result;
		    eachFunc(collection, function(value, key, collection) {
		      if (predicate(value, key, collection)) {
		        result = key;
		        return false;
		      }
		    });
		    return result;
		  }

		  /**
		   * The base implementation of `_.findIndex` and `_.findLastIndex` without
		   * support for iteratee shorthands.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {Function} predicate The function invoked per iteration.
		   * @param {number} fromIndex The index to search from.
		   * @param {boolean} [fromRight] Specify iterating from right to left.
		   * @returns {number} Returns the index of the matched value, else `-1`.
		   */
		  function baseFindIndex(array, predicate, fromIndex, fromRight) {
		    var length = array.length,
		        index = fromIndex + (fromRight ? 1 : -1);

		    while ((fromRight ? index-- : ++index < length)) {
		      if (predicate(array[index], index, array)) {
		        return index;
		      }
		    }
		    return -1;
		  }

		  /**
		   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {*} value The value to search for.
		   * @param {number} fromIndex The index to search from.
		   * @returns {number} Returns the index of the matched value, else `-1`.
		   */
		  function baseIndexOf(array, value, fromIndex) {
		    return value === value
		      ? strictIndexOf(array, value, fromIndex)
		      : baseFindIndex(array, baseIsNaN, fromIndex);
		  }

		  /**
		   * This function is like `baseIndexOf` except that it accepts a comparator.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {*} value The value to search for.
		   * @param {number} fromIndex The index to search from.
		   * @param {Function} comparator The comparator invoked per element.
		   * @returns {number} Returns the index of the matched value, else `-1`.
		   */
		  function baseIndexOfWith(array, value, fromIndex, comparator) {
		    var index = fromIndex - 1,
		        length = array.length;

		    while (++index < length) {
		      if (comparator(array[index], value)) {
		        return index;
		      }
		    }
		    return -1;
		  }

		  /**
		   * The base implementation of `_.isNaN` without support for number objects.
		   *
		   * @private
		   * @param {*} value The value to check.
		   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
		   */
		  function baseIsNaN(value) {
		    return value !== value;
		  }

		  /**
		   * The base implementation of `_.mean` and `_.meanBy` without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} array The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {number} Returns the mean.
		   */
		  function baseMean(array, iteratee) {
		    var length = array == null ? 0 : array.length;
		    return length ? (baseSum(array, iteratee) / length) : NAN;
		  }

		  /**
		   * The base implementation of `_.property` without support for deep paths.
		   *
		   * @private
		   * @param {string} key The key of the property to get.
		   * @returns {Function} Returns the new accessor function.
		   */
		  function baseProperty(key) {
		    return function(object) {
		      return object == null ? undefined$1 : object[key];
		    };
		  }

		  /**
		   * The base implementation of `_.propertyOf` without support for deep paths.
		   *
		   * @private
		   * @param {Object} object The object to query.
		   * @returns {Function} Returns the new accessor function.
		   */
		  function basePropertyOf(object) {
		    return function(key) {
		      return object == null ? undefined$1 : object[key];
		    };
		  }

		  /**
		   * The base implementation of `_.reduce` and `_.reduceRight`, without support
		   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
		   *
		   * @private
		   * @param {Array|Object} collection The collection to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @param {*} accumulator The initial value.
		   * @param {boolean} initAccum Specify using the first or last element of
		   *  `collection` as the initial value.
		   * @param {Function} eachFunc The function to iterate over `collection`.
		   * @returns {*} Returns the accumulated value.
		   */
		  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
		    eachFunc(collection, function(value, index, collection) {
		      accumulator = initAccum
		        ? (initAccum = false, value)
		        : iteratee(accumulator, value, index, collection);
		    });
		    return accumulator;
		  }

		  /**
		   * The base implementation of `_.sortBy` which uses `comparer` to define the
		   * sort order of `array` and replaces criteria objects with their corresponding
		   * values.
		   *
		   * @private
		   * @param {Array} array The array to sort.
		   * @param {Function} comparer The function to define sort order.
		   * @returns {Array} Returns `array`.
		   */
		  function baseSortBy(array, comparer) {
		    var length = array.length;

		    array.sort(comparer);
		    while (length--) {
		      array[length] = array[length].value;
		    }
		    return array;
		  }

		  /**
		   * The base implementation of `_.sum` and `_.sumBy` without support for
		   * iteratee shorthands.
		   *
		   * @private
		   * @param {Array} array The array to iterate over.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {number} Returns the sum.
		   */
		  function baseSum(array, iteratee) {
		    var result,
		        index = -1,
		        length = array.length;

		    while (++index < length) {
		      var current = iteratee(array[index]);
		      if (current !== undefined$1) {
		        result = result === undefined$1 ? current : (result + current);
		      }
		    }
		    return result;
		  }

		  /**
		   * The base implementation of `_.times` without support for iteratee shorthands
		   * or max array length checks.
		   *
		   * @private
		   * @param {number} n The number of times to invoke `iteratee`.
		   * @param {Function} iteratee The function invoked per iteration.
		   * @returns {Array} Returns the array of results.
		   */
		  function baseTimes(n, iteratee) {
		    var index = -1,
		        result = Array(n);

		    while (++index < n) {
		      result[index] = iteratee(index);
		    }
		    return result;
		  }

		  /**
		   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
		   * of key-value pairs for `object` corresponding to the property names of `props`.
		   *
		   * @private
		   * @param {Object} object The object to query.
		   * @param {Array} props The property names to get values for.
		   * @returns {Object} Returns the key-value pairs.
		   */
		  function baseToPairs(object, props) {
		    return arrayMap(props, function(key) {
		      return [key, object[key]];
		    });
		  }

		  /**
		   * The base implementation of `_.trim`.
		   *
		   * @private
		   * @param {string} string The string to trim.
		   * @returns {string} Returns the trimmed string.
		   */
		  function baseTrim(string) {
		    return string
		      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
		      : string;
		  }

		  /**
		   * The base implementation of `_.unary` without support for storing metadata.
		   *
		   * @private
		   * @param {Function} func The function to cap arguments for.
		   * @returns {Function} Returns the new capped function.
		   */
		  function baseUnary(func) {
		    return function(value) {
		      return func(value);
		    };
		  }

		  /**
		   * The base implementation of `_.values` and `_.valuesIn` which creates an
		   * array of `object` property values corresponding to the property names
		   * of `props`.
		   *
		   * @private
		   * @param {Object} object The object to query.
		   * @param {Array} props The property names to get values for.
		   * @returns {Object} Returns the array of property values.
		   */
		  function baseValues(object, props) {
		    return arrayMap(props, function(key) {
		      return object[key];
		    });
		  }

		  /**
		   * Checks if a `cache` value for `key` exists.
		   *
		   * @private
		   * @param {Object} cache The cache to query.
		   * @param {string} key The key of the entry to check.
		   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		   */
		  function cacheHas(cache, key) {
		    return cache.has(key);
		  }

		  /**
		   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
		   * that is not found in the character symbols.
		   *
		   * @private
		   * @param {Array} strSymbols The string symbols to inspect.
		   * @param {Array} chrSymbols The character symbols to find.
		   * @returns {number} Returns the index of the first unmatched string symbol.
		   */
		  function charsStartIndex(strSymbols, chrSymbols) {
		    var index = -1,
		        length = strSymbols.length;

		    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
		    return index;
		  }

		  /**
		   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
		   * that is not found in the character symbols.
		   *
		   * @private
		   * @param {Array} strSymbols The string symbols to inspect.
		   * @param {Array} chrSymbols The character symbols to find.
		   * @returns {number} Returns the index of the last unmatched string symbol.
		   */
		  function charsEndIndex(strSymbols, chrSymbols) {
		    var index = strSymbols.length;

		    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
		    return index;
		  }

		  /**
		   * Gets the number of `placeholder` occurrences in `array`.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {*} placeholder The placeholder to search for.
		   * @returns {number} Returns the placeholder count.
		   */
		  function countHolders(array, placeholder) {
		    var length = array.length,
		        result = 0;

		    while (length--) {
		      if (array[length] === placeholder) {
		        ++result;
		      }
		    }
		    return result;
		  }

		  /**
		   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
		   * letters to basic Latin letters.
		   *
		   * @private
		   * @param {string} letter The matched letter to deburr.
		   * @returns {string} Returns the deburred letter.
		   */
		  var deburrLetter = basePropertyOf(deburredLetters);

		  /**
		   * Used by `_.escape` to convert characters to HTML entities.
		   *
		   * @private
		   * @param {string} chr The matched character to escape.
		   * @returns {string} Returns the escaped character.
		   */
		  var escapeHtmlChar = basePropertyOf(htmlEscapes);

		  /**
		   * Used by `_.template` to escape characters for inclusion in compiled string literals.
		   *
		   * @private
		   * @param {string} chr The matched character to escape.
		   * @returns {string} Returns the escaped character.
		   */
		  function escapeStringChar(chr) {
		    return '\\' + stringEscapes[chr];
		  }

		  /**
		   * Gets the value at `key` of `object`.
		   *
		   * @private
		   * @param {Object} [object] The object to query.
		   * @param {string} key The key of the property to get.
		   * @returns {*} Returns the property value.
		   */
		  function getValue(object, key) {
		    return object == null ? undefined$1 : object[key];
		  }

		  /**
		   * Checks if `string` contains Unicode symbols.
		   *
		   * @private
		   * @param {string} string The string to inspect.
		   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
		   */
		  function hasUnicode(string) {
		    return reHasUnicode.test(string);
		  }

		  /**
		   * Checks if `string` contains a word composed of Unicode symbols.
		   *
		   * @private
		   * @param {string} string The string to inspect.
		   * @returns {boolean} Returns `true` if a word is found, else `false`.
		   */
		  function hasUnicodeWord(string) {
		    return reHasUnicodeWord.test(string);
		  }

		  /**
		   * Converts `iterator` to an array.
		   *
		   * @private
		   * @param {Object} iterator The iterator to convert.
		   * @returns {Array} Returns the converted array.
		   */
		  function iteratorToArray(iterator) {
		    var data,
		        result = [];

		    while (!(data = iterator.next()).done) {
		      result.push(data.value);
		    }
		    return result;
		  }

		  /**
		   * Converts `map` to its key-value pairs.
		   *
		   * @private
		   * @param {Object} map The map to convert.
		   * @returns {Array} Returns the key-value pairs.
		   */
		  function mapToArray(map) {
		    var index = -1,
		        result = Array(map.size);

		    map.forEach(function(value, key) {
		      result[++index] = [key, value];
		    });
		    return result;
		  }

		  /**
		   * Creates a unary function that invokes `func` with its argument transformed.
		   *
		   * @private
		   * @param {Function} func The function to wrap.
		   * @param {Function} transform The argument transform.
		   * @returns {Function} Returns the new function.
		   */
		  function overArg(func, transform) {
		    return function(arg) {
		      return func(transform(arg));
		    };
		  }

		  /**
		   * Replaces all `placeholder` elements in `array` with an internal placeholder
		   * and returns an array of their indexes.
		   *
		   * @private
		   * @param {Array} array The array to modify.
		   * @param {*} placeholder The placeholder to replace.
		   * @returns {Array} Returns the new array of placeholder indexes.
		   */
		  function replaceHolders(array, placeholder) {
		    var index = -1,
		        length = array.length,
		        resIndex = 0,
		        result = [];

		    while (++index < length) {
		      var value = array[index];
		      if (value === placeholder || value === PLACEHOLDER) {
		        array[index] = PLACEHOLDER;
		        result[resIndex++] = index;
		      }
		    }
		    return result;
		  }

		  /**
		   * Converts `set` to an array of its values.
		   *
		   * @private
		   * @param {Object} set The set to convert.
		   * @returns {Array} Returns the values.
		   */
		  function setToArray(set) {
		    var index = -1,
		        result = Array(set.size);

		    set.forEach(function(value) {
		      result[++index] = value;
		    });
		    return result;
		  }

		  /**
		   * Converts `set` to its value-value pairs.
		   *
		   * @private
		   * @param {Object} set The set to convert.
		   * @returns {Array} Returns the value-value pairs.
		   */
		  function setToPairs(set) {
		    var index = -1,
		        result = Array(set.size);

		    set.forEach(function(value) {
		      result[++index] = [value, value];
		    });
		    return result;
		  }

		  /**
		   * A specialized version of `_.indexOf` which performs strict equality
		   * comparisons of values, i.e. `===`.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {*} value The value to search for.
		   * @param {number} fromIndex The index to search from.
		   * @returns {number} Returns the index of the matched value, else `-1`.
		   */
		  function strictIndexOf(array, value, fromIndex) {
		    var index = fromIndex - 1,
		        length = array.length;

		    while (++index < length) {
		      if (array[index] === value) {
		        return index;
		      }
		    }
		    return -1;
		  }

		  /**
		   * A specialized version of `_.lastIndexOf` which performs strict equality
		   * comparisons of values, i.e. `===`.
		   *
		   * @private
		   * @param {Array} array The array to inspect.
		   * @param {*} value The value to search for.
		   * @param {number} fromIndex The index to search from.
		   * @returns {number} Returns the index of the matched value, else `-1`.
		   */
		  function strictLastIndexOf(array, value, fromIndex) {
		    var index = fromIndex + 1;
		    while (index--) {
		      if (array[index] === value) {
		        return index;
		      }
		    }
		    return index;
		  }

		  /**
		   * Gets the number of symbols in `string`.
		   *
		   * @private
		   * @param {string} string The string to inspect.
		   * @returns {number} Returns the string size.
		   */
		  function stringSize(string) {
		    return hasUnicode(string)
		      ? unicodeSize(string)
		      : asciiSize(string);
		  }

		  /**
		   * Converts `string` to an array.
		   *
		   * @private
		   * @param {string} string The string to convert.
		   * @returns {Array} Returns the converted array.
		   */
		  function stringToArray(string) {
		    return hasUnicode(string)
		      ? unicodeToArray(string)
		      : asciiToArray(string);
		  }

		  /**
		   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
		   * character of `string`.
		   *
		   * @private
		   * @param {string} string The string to inspect.
		   * @returns {number} Returns the index of the last non-whitespace character.
		   */
		  function trimmedEndIndex(string) {
		    var index = string.length;

		    while (index-- && reWhitespace.test(string.charAt(index))) {}
		    return index;
		  }

		  /**
		   * Used by `_.unescape` to convert HTML entities to characters.
		   *
		   * @private
		   * @param {string} chr The matched character to unescape.
		   * @returns {string} Returns the unescaped character.
		   */
		  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

		  /**
		   * Gets the size of a Unicode `string`.
		   *
		   * @private
		   * @param {string} string The string inspect.
		   * @returns {number} Returns the string size.
		   */
		  function unicodeSize(string) {
		    var result = reUnicode.lastIndex = 0;
		    while (reUnicode.test(string)) {
		      ++result;
		    }
		    return result;
		  }

		  /**
		   * Converts a Unicode `string` to an array.
		   *
		   * @private
		   * @param {string} string The string to convert.
		   * @returns {Array} Returns the converted array.
		   */
		  function unicodeToArray(string) {
		    return string.match(reUnicode) || [];
		  }

		  /**
		   * Splits a Unicode `string` into an array of its words.
		   *
		   * @private
		   * @param {string} The string to inspect.
		   * @returns {Array} Returns the words of `string`.
		   */
		  function unicodeWords(string) {
		    return string.match(reUnicodeWord) || [];
		  }

		  /*--------------------------------------------------------------------------*/

		  /**
		   * Create a new pristine `lodash` function using the `context` object.
		   *
		   * @static
		   * @memberOf _
		   * @since 1.1.0
		   * @category Util
		   * @param {Object} [context=root] The context object.
		   * @returns {Function} Returns a new `lodash` function.
		   * @example
		   *
		   * _.mixin({ 'foo': _.constant('foo') });
		   *
		   * var lodash = _.runInContext();
		   * lodash.mixin({ 'bar': lodash.constant('bar') });
		   *
		   * _.isFunction(_.foo);
		   * // => true
		   * _.isFunction(_.bar);
		   * // => false
		   *
		   * lodash.isFunction(lodash.foo);
		   * // => false
		   * lodash.isFunction(lodash.bar);
		   * // => true
		   *
		   * // Create a suped-up `defer` in Node.js.
		   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
		   */
		  var runInContext = (function runInContext(context) {
		    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

		    /** Built-in constructor references. */
		    var Array = context.Array,
		        Date = context.Date,
		        Error = context.Error,
		        Function = context.Function,
		        Math = context.Math,
		        Object = context.Object,
		        RegExp = context.RegExp,
		        String = context.String,
		        TypeError = context.TypeError;

		    /** Used for built-in method references. */
		    var arrayProto = Array.prototype,
		        funcProto = Function.prototype,
		        objectProto = Object.prototype;

		    /** Used to detect overreaching core-js shims. */
		    var coreJsData = context['__core-js_shared__'];

		    /** Used to resolve the decompiled source of functions. */
		    var funcToString = funcProto.toString;

		    /** Used to check objects for own properties. */
		    var hasOwnProperty = objectProto.hasOwnProperty;

		    /** Used to generate unique IDs. */
		    var idCounter = 0;

		    /** Used to detect methods masquerading as native. */
		    var maskSrcKey = (function() {
		      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
		      return uid ? ('Symbol(src)_1.' + uid) : '';
		    }());

		    /**
		     * Used to resolve the
		     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
		     * of values.
		     */
		    var nativeObjectToString = objectProto.toString;

		    /** Used to infer the `Object` constructor. */
		    var objectCtorString = funcToString.call(Object);

		    /** Used to restore the original `_` reference in `_.noConflict`. */
		    var oldDash = root._;

		    /** Used to detect if a method is native. */
		    var reIsNative = RegExp('^' +
		      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
		      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
		    );

		    /** Built-in value references. */
		    var Buffer = moduleExports ? context.Buffer : undefined$1,
		        Symbol = context.Symbol,
		        Uint8Array = context.Uint8Array,
		        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
		        getPrototype = overArg(Object.getPrototypeOf, Object),
		        objectCreate = Object.create,
		        propertyIsEnumerable = objectProto.propertyIsEnumerable,
		        splice = arrayProto.splice,
		        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
		        symIterator = Symbol ? Symbol.iterator : undefined$1,
		        symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;

		    var defineProperty = (function() {
		      try {
		        var func = getNative(Object, 'defineProperty');
		        func({}, '', {});
		        return func;
		      } catch (e) {}
		    }());

		    /** Mocked built-ins. */
		    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
		        ctxNow = Date && Date.now !== root.Date.now && Date.now,
		        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

		    /* Built-in method references for those with the same name as other `lodash` methods. */
		    var nativeCeil = Math.ceil,
		        nativeFloor = Math.floor,
		        nativeGetSymbols = Object.getOwnPropertySymbols,
		        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
		        nativeIsFinite = context.isFinite,
		        nativeJoin = arrayProto.join,
		        nativeKeys = overArg(Object.keys, Object),
		        nativeMax = Math.max,
		        nativeMin = Math.min,
		        nativeNow = Date.now,
		        nativeParseInt = context.parseInt,
		        nativeRandom = Math.random,
		        nativeReverse = arrayProto.reverse;

		    /* Built-in method references that are verified to be native. */
		    var DataView = getNative(context, 'DataView'),
		        Map = getNative(context, 'Map'),
		        Promise = getNative(context, 'Promise'),
		        Set = getNative(context, 'Set'),
		        WeakMap = getNative(context, 'WeakMap'),
		        nativeCreate = getNative(Object, 'create');

		    /** Used to store function metadata. */
		    var metaMap = WeakMap && new WeakMap;

		    /** Used to lookup unminified function names. */
		    var realNames = {};

		    /** Used to detect maps, sets, and weakmaps. */
		    var dataViewCtorString = toSource(DataView),
		        mapCtorString = toSource(Map),
		        promiseCtorString = toSource(Promise),
		        setCtorString = toSource(Set),
		        weakMapCtorString = toSource(WeakMap);

		    /** Used to convert symbols to primitives and strings. */
		    var symbolProto = Symbol ? Symbol.prototype : undefined$1,
		        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
		        symbolToString = symbolProto ? symbolProto.toString : undefined$1;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a `lodash` object which wraps `value` to enable implicit method
		     * chain sequences. Methods that operate on and return arrays, collections,
		     * and functions can be chained together. Methods that retrieve a single value
		     * or may return a primitive value will automatically end the chain sequence
		     * and return the unwrapped value. Otherwise, the value must be unwrapped
		     * with `_#value`.
		     *
		     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
		     * enabled using `_.chain`.
		     *
		     * The execution of chained methods is lazy, that is, it's deferred until
		     * `_#value` is implicitly or explicitly called.
		     *
		     * Lazy evaluation allows several methods to support shortcut fusion.
		     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
		     * the creation of intermediate arrays and can greatly reduce the number of
		     * iteratee executions. Sections of a chain sequence qualify for shortcut
		     * fusion if the section is applied to an array and iteratees accept only
		     * one argument. The heuristic for whether a section qualifies for shortcut
		     * fusion is subject to change.
		     *
		     * Chaining is supported in custom builds as long as the `_#value` method is
		     * directly or indirectly included in the build.
		     *
		     * In addition to lodash methods, wrappers have `Array` and `String` methods.
		     *
		     * The wrapper `Array` methods are:
		     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
		     *
		     * The wrapper `String` methods are:
		     * `replace` and `split`
		     *
		     * The wrapper methods that support shortcut fusion are:
		     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
		     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
		     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
		     *
		     * The chainable wrapper methods are:
		     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
		     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
		     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
		     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
		     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
		     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
		     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
		     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
		     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
		     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
		     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
		     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
		     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
		     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
		     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
		     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
		     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
		     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
		     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
		     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
		     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
		     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
		     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
		     * `zipObject`, `zipObjectDeep`, and `zipWith`
		     *
		     * The wrapper methods that are **not** chainable by default are:
		     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
		     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
		     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
		     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
		     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
		     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
		     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
		     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
		     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
		     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
		     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
		     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
		     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
		     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
		     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
		     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
		     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
		     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
		     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
		     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
		     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
		     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
		     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
		     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
		     * `upperFirst`, `value`, and `words`
		     *
		     * @name _
		     * @constructor
		     * @category Seq
		     * @param {*} value The value to wrap in a `lodash` instance.
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * var wrapped = _([1, 2, 3]);
		     *
		     * // Returns an unwrapped value.
		     * wrapped.reduce(_.add);
		     * // => 6
		     *
		     * // Returns a wrapped value.
		     * var squares = wrapped.map(square);
		     *
		     * _.isArray(squares);
		     * // => false
		     *
		     * _.isArray(squares.value());
		     * // => true
		     */
		    function lodash(value) {
		      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
		        if (value instanceof LodashWrapper) {
		          return value;
		        }
		        if (hasOwnProperty.call(value, '__wrapped__')) {
		          return wrapperClone(value);
		        }
		      }
		      return new LodashWrapper(value);
		    }

		    /**
		     * The base implementation of `_.create` without support for assigning
		     * properties to the created object.
		     *
		     * @private
		     * @param {Object} proto The object to inherit from.
		     * @returns {Object} Returns the new object.
		     */
		    var baseCreate = (function() {
		      function object() {}
		      return function(proto) {
		        if (!isObject(proto)) {
		          return {};
		        }
		        if (objectCreate) {
		          return objectCreate(proto);
		        }
		        object.prototype = proto;
		        var result = new object;
		        object.prototype = undefined$1;
		        return result;
		      };
		    }());

		    /**
		     * The function whose prototype chain sequence wrappers inherit from.
		     *
		     * @private
		     */
		    function baseLodash() {
		      // No operation performed.
		    }

		    /**
		     * The base constructor for creating `lodash` wrapper objects.
		     *
		     * @private
		     * @param {*} value The value to wrap.
		     * @param {boolean} [chainAll] Enable explicit method chain sequences.
		     */
		    function LodashWrapper(value, chainAll) {
		      this.__wrapped__ = value;
		      this.__actions__ = [];
		      this.__chain__ = !!chainAll;
		      this.__index__ = 0;
		      this.__values__ = undefined$1;
		    }

		    /**
		     * By default, the template delimiters used by lodash are like those in
		     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
		     * following template settings to use alternative delimiters.
		     *
		     * @static
		     * @memberOf _
		     * @type {Object}
		     */
		    lodash.templateSettings = {

		      /**
		       * Used to detect `data` property values to be HTML-escaped.
		       *
		       * @memberOf _.templateSettings
		       * @type {RegExp}
		       */
		      'escape': reEscape,

		      /**
		       * Used to detect code to be evaluated.
		       *
		       * @memberOf _.templateSettings
		       * @type {RegExp}
		       */
		      'evaluate': reEvaluate,

		      /**
		       * Used to detect `data` property values to inject.
		       *
		       * @memberOf _.templateSettings
		       * @type {RegExp}
		       */
		      'interpolate': reInterpolate,

		      /**
		       * Used to reference the data object in the template text.
		       *
		       * @memberOf _.templateSettings
		       * @type {string}
		       */
		      'variable': '',

		      /**
		       * Used to import variables into the compiled template.
		       *
		       * @memberOf _.templateSettings
		       * @type {Object}
		       */
		      'imports': {

		        /**
		         * A reference to the `lodash` function.
		         *
		         * @memberOf _.templateSettings.imports
		         * @type {Function}
		         */
		        '_': lodash
		      }
		    };

		    // Ensure wrappers are instances of `baseLodash`.
		    lodash.prototype = baseLodash.prototype;
		    lodash.prototype.constructor = lodash;

		    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
		    LodashWrapper.prototype.constructor = LodashWrapper;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
		     *
		     * @private
		     * @constructor
		     * @param {*} value The value to wrap.
		     */
		    function LazyWrapper(value) {
		      this.__wrapped__ = value;
		      this.__actions__ = [];
		      this.__dir__ = 1;
		      this.__filtered__ = false;
		      this.__iteratees__ = [];
		      this.__takeCount__ = MAX_ARRAY_LENGTH;
		      this.__views__ = [];
		    }

		    /**
		     * Creates a clone of the lazy wrapper object.
		     *
		     * @private
		     * @name clone
		     * @memberOf LazyWrapper
		     * @returns {Object} Returns the cloned `LazyWrapper` object.
		     */
		    function lazyClone() {
		      var result = new LazyWrapper(this.__wrapped__);
		      result.__actions__ = copyArray(this.__actions__);
		      result.__dir__ = this.__dir__;
		      result.__filtered__ = this.__filtered__;
		      result.__iteratees__ = copyArray(this.__iteratees__);
		      result.__takeCount__ = this.__takeCount__;
		      result.__views__ = copyArray(this.__views__);
		      return result;
		    }

		    /**
		     * Reverses the direction of lazy iteration.
		     *
		     * @private
		     * @name reverse
		     * @memberOf LazyWrapper
		     * @returns {Object} Returns the new reversed `LazyWrapper` object.
		     */
		    function lazyReverse() {
		      if (this.__filtered__) {
		        var result = new LazyWrapper(this);
		        result.__dir__ = -1;
		        result.__filtered__ = true;
		      } else {
		        result = this.clone();
		        result.__dir__ *= -1;
		      }
		      return result;
		    }

		    /**
		     * Extracts the unwrapped value from its lazy wrapper.
		     *
		     * @private
		     * @name value
		     * @memberOf LazyWrapper
		     * @returns {*} Returns the unwrapped value.
		     */
		    function lazyValue() {
		      var array = this.__wrapped__.value(),
		          dir = this.__dir__,
		          isArr = isArray(array),
		          isRight = dir < 0,
		          arrLength = isArr ? array.length : 0,
		          view = getView(0, arrLength, this.__views__),
		          start = view.start,
		          end = view.end,
		          length = end - start,
		          index = isRight ? end : (start - 1),
		          iteratees = this.__iteratees__,
		          iterLength = iteratees.length,
		          resIndex = 0,
		          takeCount = nativeMin(length, this.__takeCount__);

		      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
		        return baseWrapperValue(array, this.__actions__);
		      }
		      var result = [];

		      outer:
		      while (length-- && resIndex < takeCount) {
		        index += dir;

		        var iterIndex = -1,
		            value = array[index];

		        while (++iterIndex < iterLength) {
		          var data = iteratees[iterIndex],
		              iteratee = data.iteratee,
		              type = data.type,
		              computed = iteratee(value);

		          if (type == LAZY_MAP_FLAG) {
		            value = computed;
		          } else if (!computed) {
		            if (type == LAZY_FILTER_FLAG) {
		              continue outer;
		            } else {
		              break outer;
		            }
		          }
		        }
		        result[resIndex++] = value;
		      }
		      return result;
		    }

		    // Ensure `LazyWrapper` is an instance of `baseLodash`.
		    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
		    LazyWrapper.prototype.constructor = LazyWrapper;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a hash object.
		     *
		     * @private
		     * @constructor
		     * @param {Array} [entries] The key-value pairs to cache.
		     */
		    function Hash(entries) {
		      var index = -1,
		          length = entries == null ? 0 : entries.length;

		      this.clear();
		      while (++index < length) {
		        var entry = entries[index];
		        this.set(entry[0], entry[1]);
		      }
		    }

		    /**
		     * Removes all key-value entries from the hash.
		     *
		     * @private
		     * @name clear
		     * @memberOf Hash
		     */
		    function hashClear() {
		      this.__data__ = nativeCreate ? nativeCreate(null) : {};
		      this.size = 0;
		    }

		    /**
		     * Removes `key` and its value from the hash.
		     *
		     * @private
		     * @name delete
		     * @memberOf Hash
		     * @param {Object} hash The hash to modify.
		     * @param {string} key The key of the value to remove.
		     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
		     */
		    function hashDelete(key) {
		      var result = this.has(key) && delete this.__data__[key];
		      this.size -= result ? 1 : 0;
		      return result;
		    }

		    /**
		     * Gets the hash value for `key`.
		     *
		     * @private
		     * @name get
		     * @memberOf Hash
		     * @param {string} key The key of the value to get.
		     * @returns {*} Returns the entry value.
		     */
		    function hashGet(key) {
		      var data = this.__data__;
		      if (nativeCreate) {
		        var result = data[key];
		        return result === HASH_UNDEFINED ? undefined$1 : result;
		      }
		      return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
		    }

		    /**
		     * Checks if a hash value for `key` exists.
		     *
		     * @private
		     * @name has
		     * @memberOf Hash
		     * @param {string} key The key of the entry to check.
		     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		     */
		    function hashHas(key) {
		      var data = this.__data__;
		      return nativeCreate ? (data[key] !== undefined$1) : hasOwnProperty.call(data, key);
		    }

		    /**
		     * Sets the hash `key` to `value`.
		     *
		     * @private
		     * @name set
		     * @memberOf Hash
		     * @param {string} key The key of the value to set.
		     * @param {*} value The value to set.
		     * @returns {Object} Returns the hash instance.
		     */
		    function hashSet(key, value) {
		      var data = this.__data__;
		      this.size += this.has(key) ? 0 : 1;
		      data[key] = (nativeCreate && value === undefined$1) ? HASH_UNDEFINED : value;
		      return this;
		    }

		    // Add methods to `Hash`.
		    Hash.prototype.clear = hashClear;
		    Hash.prototype['delete'] = hashDelete;
		    Hash.prototype.get = hashGet;
		    Hash.prototype.has = hashHas;
		    Hash.prototype.set = hashSet;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates an list cache object.
		     *
		     * @private
		     * @constructor
		     * @param {Array} [entries] The key-value pairs to cache.
		     */
		    function ListCache(entries) {
		      var index = -1,
		          length = entries == null ? 0 : entries.length;

		      this.clear();
		      while (++index < length) {
		        var entry = entries[index];
		        this.set(entry[0], entry[1]);
		      }
		    }

		    /**
		     * Removes all key-value entries from the list cache.
		     *
		     * @private
		     * @name clear
		     * @memberOf ListCache
		     */
		    function listCacheClear() {
		      this.__data__ = [];
		      this.size = 0;
		    }

		    /**
		     * Removes `key` and its value from the list cache.
		     *
		     * @private
		     * @name delete
		     * @memberOf ListCache
		     * @param {string} key The key of the value to remove.
		     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
		     */
		    function listCacheDelete(key) {
		      var data = this.__data__,
		          index = assocIndexOf(data, key);

		      if (index < 0) {
		        return false;
		      }
		      var lastIndex = data.length - 1;
		      if (index == lastIndex) {
		        data.pop();
		      } else {
		        splice.call(data, index, 1);
		      }
		      --this.size;
		      return true;
		    }

		    /**
		     * Gets the list cache value for `key`.
		     *
		     * @private
		     * @name get
		     * @memberOf ListCache
		     * @param {string} key The key of the value to get.
		     * @returns {*} Returns the entry value.
		     */
		    function listCacheGet(key) {
		      var data = this.__data__,
		          index = assocIndexOf(data, key);

		      return index < 0 ? undefined$1 : data[index][1];
		    }

		    /**
		     * Checks if a list cache value for `key` exists.
		     *
		     * @private
		     * @name has
		     * @memberOf ListCache
		     * @param {string} key The key of the entry to check.
		     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		     */
		    function listCacheHas(key) {
		      return assocIndexOf(this.__data__, key) > -1;
		    }

		    /**
		     * Sets the list cache `key` to `value`.
		     *
		     * @private
		     * @name set
		     * @memberOf ListCache
		     * @param {string} key The key of the value to set.
		     * @param {*} value The value to set.
		     * @returns {Object} Returns the list cache instance.
		     */
		    function listCacheSet(key, value) {
		      var data = this.__data__,
		          index = assocIndexOf(data, key);

		      if (index < 0) {
		        ++this.size;
		        data.push([key, value]);
		      } else {
		        data[index][1] = value;
		      }
		      return this;
		    }

		    // Add methods to `ListCache`.
		    ListCache.prototype.clear = listCacheClear;
		    ListCache.prototype['delete'] = listCacheDelete;
		    ListCache.prototype.get = listCacheGet;
		    ListCache.prototype.has = listCacheHas;
		    ListCache.prototype.set = listCacheSet;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a map cache object to store key-value pairs.
		     *
		     * @private
		     * @constructor
		     * @param {Array} [entries] The key-value pairs to cache.
		     */
		    function MapCache(entries) {
		      var index = -1,
		          length = entries == null ? 0 : entries.length;

		      this.clear();
		      while (++index < length) {
		        var entry = entries[index];
		        this.set(entry[0], entry[1]);
		      }
		    }

		    /**
		     * Removes all key-value entries from the map.
		     *
		     * @private
		     * @name clear
		     * @memberOf MapCache
		     */
		    function mapCacheClear() {
		      this.size = 0;
		      this.__data__ = {
		        'hash': new Hash,
		        'map': new (Map || ListCache),
		        'string': new Hash
		      };
		    }

		    /**
		     * Removes `key` and its value from the map.
		     *
		     * @private
		     * @name delete
		     * @memberOf MapCache
		     * @param {string} key The key of the value to remove.
		     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
		     */
		    function mapCacheDelete(key) {
		      var result = getMapData(this, key)['delete'](key);
		      this.size -= result ? 1 : 0;
		      return result;
		    }

		    /**
		     * Gets the map value for `key`.
		     *
		     * @private
		     * @name get
		     * @memberOf MapCache
		     * @param {string} key The key of the value to get.
		     * @returns {*} Returns the entry value.
		     */
		    function mapCacheGet(key) {
		      return getMapData(this, key).get(key);
		    }

		    /**
		     * Checks if a map value for `key` exists.
		     *
		     * @private
		     * @name has
		     * @memberOf MapCache
		     * @param {string} key The key of the entry to check.
		     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		     */
		    function mapCacheHas(key) {
		      return getMapData(this, key).has(key);
		    }

		    /**
		     * Sets the map `key` to `value`.
		     *
		     * @private
		     * @name set
		     * @memberOf MapCache
		     * @param {string} key The key of the value to set.
		     * @param {*} value The value to set.
		     * @returns {Object} Returns the map cache instance.
		     */
		    function mapCacheSet(key, value) {
		      var data = getMapData(this, key),
		          size = data.size;

		      data.set(key, value);
		      this.size += data.size == size ? 0 : 1;
		      return this;
		    }

		    // Add methods to `MapCache`.
		    MapCache.prototype.clear = mapCacheClear;
		    MapCache.prototype['delete'] = mapCacheDelete;
		    MapCache.prototype.get = mapCacheGet;
		    MapCache.prototype.has = mapCacheHas;
		    MapCache.prototype.set = mapCacheSet;

		    /*------------------------------------------------------------------------*/

		    /**
		     *
		     * Creates an array cache object to store unique values.
		     *
		     * @private
		     * @constructor
		     * @param {Array} [values] The values to cache.
		     */
		    function SetCache(values) {
		      var index = -1,
		          length = values == null ? 0 : values.length;

		      this.__data__ = new MapCache;
		      while (++index < length) {
		        this.add(values[index]);
		      }
		    }

		    /**
		     * Adds `value` to the array cache.
		     *
		     * @private
		     * @name add
		     * @memberOf SetCache
		     * @alias push
		     * @param {*} value The value to cache.
		     * @returns {Object} Returns the cache instance.
		     */
		    function setCacheAdd(value) {
		      this.__data__.set(value, HASH_UNDEFINED);
		      return this;
		    }

		    /**
		     * Checks if `value` is in the array cache.
		     *
		     * @private
		     * @name has
		     * @memberOf SetCache
		     * @param {*} value The value to search for.
		     * @returns {number} Returns `true` if `value` is found, else `false`.
		     */
		    function setCacheHas(value) {
		      return this.__data__.has(value);
		    }

		    // Add methods to `SetCache`.
		    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
		    SetCache.prototype.has = setCacheHas;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a stack cache object to store key-value pairs.
		     *
		     * @private
		     * @constructor
		     * @param {Array} [entries] The key-value pairs to cache.
		     */
		    function Stack(entries) {
		      var data = this.__data__ = new ListCache(entries);
		      this.size = data.size;
		    }

		    /**
		     * Removes all key-value entries from the stack.
		     *
		     * @private
		     * @name clear
		     * @memberOf Stack
		     */
		    function stackClear() {
		      this.__data__ = new ListCache;
		      this.size = 0;
		    }

		    /**
		     * Removes `key` and its value from the stack.
		     *
		     * @private
		     * @name delete
		     * @memberOf Stack
		     * @param {string} key The key of the value to remove.
		     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
		     */
		    function stackDelete(key) {
		      var data = this.__data__,
		          result = data['delete'](key);

		      this.size = data.size;
		      return result;
		    }

		    /**
		     * Gets the stack value for `key`.
		     *
		     * @private
		     * @name get
		     * @memberOf Stack
		     * @param {string} key The key of the value to get.
		     * @returns {*} Returns the entry value.
		     */
		    function stackGet(key) {
		      return this.__data__.get(key);
		    }

		    /**
		     * Checks if a stack value for `key` exists.
		     *
		     * @private
		     * @name has
		     * @memberOf Stack
		     * @param {string} key The key of the entry to check.
		     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		     */
		    function stackHas(key) {
		      return this.__data__.has(key);
		    }

		    /**
		     * Sets the stack `key` to `value`.
		     *
		     * @private
		     * @name set
		     * @memberOf Stack
		     * @param {string} key The key of the value to set.
		     * @param {*} value The value to set.
		     * @returns {Object} Returns the stack cache instance.
		     */
		    function stackSet(key, value) {
		      var data = this.__data__;
		      if (data instanceof ListCache) {
		        var pairs = data.__data__;
		        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
		          pairs.push([key, value]);
		          this.size = ++data.size;
		          return this;
		        }
		        data = this.__data__ = new MapCache(pairs);
		      }
		      data.set(key, value);
		      this.size = data.size;
		      return this;
		    }

		    // Add methods to `Stack`.
		    Stack.prototype.clear = stackClear;
		    Stack.prototype['delete'] = stackDelete;
		    Stack.prototype.get = stackGet;
		    Stack.prototype.has = stackHas;
		    Stack.prototype.set = stackSet;

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates an array of the enumerable property names of the array-like `value`.
		     *
		     * @private
		     * @param {*} value The value to query.
		     * @param {boolean} inherited Specify returning inherited property names.
		     * @returns {Array} Returns the array of property names.
		     */
		    function arrayLikeKeys(value, inherited) {
		      var isArr = isArray(value),
		          isArg = !isArr && isArguments(value),
		          isBuff = !isArr && !isArg && isBuffer(value),
		          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
		          skipIndexes = isArr || isArg || isBuff || isType,
		          result = skipIndexes ? baseTimes(value.length, String) : [],
		          length = result.length;

		      for (var key in value) {
		        if ((inherited || hasOwnProperty.call(value, key)) &&
		            !(skipIndexes && (
		               // Safari 9 has enumerable `arguments.length` in strict mode.
		               key == 'length' ||
		               // Node.js 0.10 has enumerable non-index properties on buffers.
		               (isBuff && (key == 'offset' || key == 'parent')) ||
		               // PhantomJS 2 has enumerable non-index properties on typed arrays.
		               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
		               // Skip index properties.
		               isIndex(key, length)
		            ))) {
		          result.push(key);
		        }
		      }
		      return result;
		    }

		    /**
		     * A specialized version of `_.sample` for arrays.
		     *
		     * @private
		     * @param {Array} array The array to sample.
		     * @returns {*} Returns the random element.
		     */
		    function arraySample(array) {
		      var length = array.length;
		      return length ? array[baseRandom(0, length - 1)] : undefined$1;
		    }

		    /**
		     * A specialized version of `_.sampleSize` for arrays.
		     *
		     * @private
		     * @param {Array} array The array to sample.
		     * @param {number} n The number of elements to sample.
		     * @returns {Array} Returns the random elements.
		     */
		    function arraySampleSize(array, n) {
		      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
		    }

		    /**
		     * A specialized version of `_.shuffle` for arrays.
		     *
		     * @private
		     * @param {Array} array The array to shuffle.
		     * @returns {Array} Returns the new shuffled array.
		     */
		    function arrayShuffle(array) {
		      return shuffleSelf(copyArray(array));
		    }

		    /**
		     * This function is like `assignValue` except that it doesn't assign
		     * `undefined` values.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {string} key The key of the property to assign.
		     * @param {*} value The value to assign.
		     */
		    function assignMergeValue(object, key, value) {
		      if ((value !== undefined$1 && !eq(object[key], value)) ||
		          (value === undefined$1 && !(key in object))) {
		        baseAssignValue(object, key, value);
		      }
		    }

		    /**
		     * Assigns `value` to `key` of `object` if the existing value is not equivalent
		     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {string} key The key of the property to assign.
		     * @param {*} value The value to assign.
		     */
		    function assignValue(object, key, value) {
		      var objValue = object[key];
		      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
		          (value === undefined$1 && !(key in object))) {
		        baseAssignValue(object, key, value);
		      }
		    }

		    /**
		     * Gets the index at which the `key` is found in `array` of key-value pairs.
		     *
		     * @private
		     * @param {Array} array The array to inspect.
		     * @param {*} key The key to search for.
		     * @returns {number} Returns the index of the matched value, else `-1`.
		     */
		    function assocIndexOf(array, key) {
		      var length = array.length;
		      while (length--) {
		        if (eq(array[length][0], key)) {
		          return length;
		        }
		      }
		      return -1;
		    }

		    /**
		     * Aggregates elements of `collection` on `accumulator` with keys transformed
		     * by `iteratee` and values set by `setter`.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} setter The function to set `accumulator` values.
		     * @param {Function} iteratee The iteratee to transform keys.
		     * @param {Object} accumulator The initial aggregated object.
		     * @returns {Function} Returns `accumulator`.
		     */
		    function baseAggregator(collection, setter, iteratee, accumulator) {
		      baseEach(collection, function(value, key, collection) {
		        setter(accumulator, value, iteratee(value), collection);
		      });
		      return accumulator;
		    }

		    /**
		     * The base implementation of `_.assign` without support for multiple sources
		     * or `customizer` functions.
		     *
		     * @private
		     * @param {Object} object The destination object.
		     * @param {Object} source The source object.
		     * @returns {Object} Returns `object`.
		     */
		    function baseAssign(object, source) {
		      return object && copyObject(source, keys(source), object);
		    }

		    /**
		     * The base implementation of `_.assignIn` without support for multiple sources
		     * or `customizer` functions.
		     *
		     * @private
		     * @param {Object} object The destination object.
		     * @param {Object} source The source object.
		     * @returns {Object} Returns `object`.
		     */
		    function baseAssignIn(object, source) {
		      return object && copyObject(source, keysIn(source), object);
		    }

		    /**
		     * The base implementation of `assignValue` and `assignMergeValue` without
		     * value checks.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {string} key The key of the property to assign.
		     * @param {*} value The value to assign.
		     */
		    function baseAssignValue(object, key, value) {
		      if (key == '__proto__' && defineProperty) {
		        defineProperty(object, key, {
		          'configurable': true,
		          'enumerable': true,
		          'value': value,
		          'writable': true
		        });
		      } else {
		        object[key] = value;
		      }
		    }

		    /**
		     * The base implementation of `_.at` without support for individual paths.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {string[]} paths The property paths to pick.
		     * @returns {Array} Returns the picked elements.
		     */
		    function baseAt(object, paths) {
		      var index = -1,
		          length = paths.length,
		          result = Array(length),
		          skip = object == null;

		      while (++index < length) {
		        result[index] = skip ? undefined$1 : get(object, paths[index]);
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.clamp` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {number} number The number to clamp.
		     * @param {number} [lower] The lower bound.
		     * @param {number} upper The upper bound.
		     * @returns {number} Returns the clamped number.
		     */
		    function baseClamp(number, lower, upper) {
		      if (number === number) {
		        if (upper !== undefined$1) {
		          number = number <= upper ? number : upper;
		        }
		        if (lower !== undefined$1) {
		          number = number >= lower ? number : lower;
		        }
		      }
		      return number;
		    }

		    /**
		     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
		     * traversed objects.
		     *
		     * @private
		     * @param {*} value The value to clone.
		     * @param {boolean} bitmask The bitmask flags.
		     *  1 - Deep clone
		     *  2 - Flatten inherited properties
		     *  4 - Clone symbols
		     * @param {Function} [customizer] The function to customize cloning.
		     * @param {string} [key] The key of `value`.
		     * @param {Object} [object] The parent object of `value`.
		     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
		     * @returns {*} Returns the cloned value.
		     */
		    function baseClone(value, bitmask, customizer, key, object, stack) {
		      var result,
		          isDeep = bitmask & CLONE_DEEP_FLAG,
		          isFlat = bitmask & CLONE_FLAT_FLAG,
		          isFull = bitmask & CLONE_SYMBOLS_FLAG;

		      if (customizer) {
		        result = object ? customizer(value, key, object, stack) : customizer(value);
		      }
		      if (result !== undefined$1) {
		        return result;
		      }
		      if (!isObject(value)) {
		        return value;
		      }
		      var isArr = isArray(value);
		      if (isArr) {
		        result = initCloneArray(value);
		        if (!isDeep) {
		          return copyArray(value, result);
		        }
		      } else {
		        var tag = getTag(value),
		            isFunc = tag == funcTag || tag == genTag;

		        if (isBuffer(value)) {
		          return cloneBuffer(value, isDeep);
		        }
		        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
		          result = (isFlat || isFunc) ? {} : initCloneObject(value);
		          if (!isDeep) {
		            return isFlat
		              ? copySymbolsIn(value, baseAssignIn(result, value))
		              : copySymbols(value, baseAssign(result, value));
		          }
		        } else {
		          if (!cloneableTags[tag]) {
		            return object ? value : {};
		          }
		          result = initCloneByTag(value, tag, isDeep);
		        }
		      }
		      // Check for circular references and return its corresponding clone.
		      stack || (stack = new Stack);
		      var stacked = stack.get(value);
		      if (stacked) {
		        return stacked;
		      }
		      stack.set(value, result);

		      if (isSet(value)) {
		        value.forEach(function(subValue) {
		          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
		        });
		      } else if (isMap(value)) {
		        value.forEach(function(subValue, key) {
		          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
		        });
		      }

		      var keysFunc = isFull
		        ? (isFlat ? getAllKeysIn : getAllKeys)
		        : (isFlat ? keysIn : keys);

		      var props = isArr ? undefined$1 : keysFunc(value);
		      arrayEach(props || value, function(subValue, key) {
		        if (props) {
		          key = subValue;
		          subValue = value[key];
		        }
		        // Recursively populate clone (susceptible to call stack limits).
		        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
		      });
		      return result;
		    }

		    /**
		     * The base implementation of `_.conforms` which doesn't clone `source`.
		     *
		     * @private
		     * @param {Object} source The object of property predicates to conform to.
		     * @returns {Function} Returns the new spec function.
		     */
		    function baseConforms(source) {
		      var props = keys(source);
		      return function(object) {
		        return baseConformsTo(object, source, props);
		      };
		    }

		    /**
		     * The base implementation of `_.conformsTo` which accepts `props` to check.
		     *
		     * @private
		     * @param {Object} object The object to inspect.
		     * @param {Object} source The object of property predicates to conform to.
		     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
		     */
		    function baseConformsTo(object, source, props) {
		      var length = props.length;
		      if (object == null) {
		        return !length;
		      }
		      object = Object(object);
		      while (length--) {
		        var key = props[length],
		            predicate = source[key],
		            value = object[key];

		        if ((value === undefined$1 && !(key in object)) || !predicate(value)) {
		          return false;
		        }
		      }
		      return true;
		    }

		    /**
		     * The base implementation of `_.delay` and `_.defer` which accepts `args`
		     * to provide to `func`.
		     *
		     * @private
		     * @param {Function} func The function to delay.
		     * @param {number} wait The number of milliseconds to delay invocation.
		     * @param {Array} args The arguments to provide to `func`.
		     * @returns {number|Object} Returns the timer id or timeout object.
		     */
		    function baseDelay(func, wait, args) {
		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      return setTimeout(function() { func.apply(undefined$1, args); }, wait);
		    }

		    /**
		     * The base implementation of methods like `_.difference` without support
		     * for excluding multiple arrays or iteratee shorthands.
		     *
		     * @private
		     * @param {Array} array The array to inspect.
		     * @param {Array} values The values to exclude.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of filtered values.
		     */
		    function baseDifference(array, values, iteratee, comparator) {
		      var index = -1,
		          includes = arrayIncludes,
		          isCommon = true,
		          length = array.length,
		          result = [],
		          valuesLength = values.length;

		      if (!length) {
		        return result;
		      }
		      if (iteratee) {
		        values = arrayMap(values, baseUnary(iteratee));
		      }
		      if (comparator) {
		        includes = arrayIncludesWith;
		        isCommon = false;
		      }
		      else if (values.length >= LARGE_ARRAY_SIZE) {
		        includes = cacheHas;
		        isCommon = false;
		        values = new SetCache(values);
		      }
		      outer:
		      while (++index < length) {
		        var value = array[index],
		            computed = iteratee == null ? value : iteratee(value);

		        value = (comparator || value !== 0) ? value : 0;
		        if (isCommon && computed === computed) {
		          var valuesIndex = valuesLength;
		          while (valuesIndex--) {
		            if (values[valuesIndex] === computed) {
		              continue outer;
		            }
		          }
		          result.push(value);
		        }
		        else if (!includes(values, computed, comparator)) {
		          result.push(value);
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.forEach` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @returns {Array|Object} Returns `collection`.
		     */
		    var baseEach = createBaseEach(baseForOwn);

		    /**
		     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @returns {Array|Object} Returns `collection`.
		     */
		    var baseEachRight = createBaseEach(baseForOwnRight, true);

		    /**
		     * The base implementation of `_.every` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} predicate The function invoked per iteration.
		     * @returns {boolean} Returns `true` if all elements pass the predicate check,
		     *  else `false`
		     */
		    function baseEvery(collection, predicate) {
		      var result = true;
		      baseEach(collection, function(value, index, collection) {
		        result = !!predicate(value, index, collection);
		        return result;
		      });
		      return result;
		    }

		    /**
		     * The base implementation of methods like `_.max` and `_.min` which accepts a
		     * `comparator` to determine the extremum value.
		     *
		     * @private
		     * @param {Array} array The array to iterate over.
		     * @param {Function} iteratee The iteratee invoked per iteration.
		     * @param {Function} comparator The comparator used to compare values.
		     * @returns {*} Returns the extremum value.
		     */
		    function baseExtremum(array, iteratee, comparator) {
		      var index = -1,
		          length = array.length;

		      while (++index < length) {
		        var value = array[index],
		            current = iteratee(value);

		        if (current != null && (computed === undefined$1
		              ? (current === current && !isSymbol(current))
		              : comparator(current, computed)
		            )) {
		          var computed = current,
		              result = value;
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.fill` without an iteratee call guard.
		     *
		     * @private
		     * @param {Array} array The array to fill.
		     * @param {*} value The value to fill `array` with.
		     * @param {number} [start=0] The start position.
		     * @param {number} [end=array.length] The end position.
		     * @returns {Array} Returns `array`.
		     */
		    function baseFill(array, value, start, end) {
		      var length = array.length;

		      start = toInteger(start);
		      if (start < 0) {
		        start = -start > length ? 0 : (length + start);
		      }
		      end = (end === undefined$1 || end > length) ? length : toInteger(end);
		      if (end < 0) {
		        end += length;
		      }
		      end = start > end ? 0 : toLength(end);
		      while (start < end) {
		        array[start++] = value;
		      }
		      return array;
		    }

		    /**
		     * The base implementation of `_.filter` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} predicate The function invoked per iteration.
		     * @returns {Array} Returns the new filtered array.
		     */
		    function baseFilter(collection, predicate) {
		      var result = [];
		      baseEach(collection, function(value, index, collection) {
		        if (predicate(value, index, collection)) {
		          result.push(value);
		        }
		      });
		      return result;
		    }

		    /**
		     * The base implementation of `_.flatten` with support for restricting flattening.
		     *
		     * @private
		     * @param {Array} array The array to flatten.
		     * @param {number} depth The maximum recursion depth.
		     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
		     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
		     * @param {Array} [result=[]] The initial result value.
		     * @returns {Array} Returns the new flattened array.
		     */
		    function baseFlatten(array, depth, predicate, isStrict, result) {
		      var index = -1,
		          length = array.length;

		      predicate || (predicate = isFlattenable);
		      result || (result = []);

		      while (++index < length) {
		        var value = array[index];
		        if (depth > 0 && predicate(value)) {
		          if (depth > 1) {
		            // Recursively flatten arrays (susceptible to call stack limits).
		            baseFlatten(value, depth - 1, predicate, isStrict, result);
		          } else {
		            arrayPush(result, value);
		          }
		        } else if (!isStrict) {
		          result[result.length] = value;
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `baseForOwn` which iterates over `object`
		     * properties returned by `keysFunc` and invokes `iteratee` for each property.
		     * Iteratee functions may exit iteration early by explicitly returning `false`.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @param {Function} keysFunc The function to get the keys of `object`.
		     * @returns {Object} Returns `object`.
		     */
		    var baseFor = createBaseFor();

		    /**
		     * This function is like `baseFor` except that it iterates over properties
		     * in the opposite order.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @param {Function} keysFunc The function to get the keys of `object`.
		     * @returns {Object} Returns `object`.
		     */
		    var baseForRight = createBaseFor(true);

		    /**
		     * The base implementation of `_.forOwn` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     */
		    function baseForOwn(object, iteratee) {
		      return object && baseFor(object, iteratee, keys);
		    }

		    /**
		     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     */
		    function baseForOwnRight(object, iteratee) {
		      return object && baseForRight(object, iteratee, keys);
		    }

		    /**
		     * The base implementation of `_.functions` which creates an array of
		     * `object` function property names filtered from `props`.
		     *
		     * @private
		     * @param {Object} object The object to inspect.
		     * @param {Array} props The property names to filter.
		     * @returns {Array} Returns the function names.
		     */
		    function baseFunctions(object, props) {
		      return arrayFilter(props, function(key) {
		        return isFunction(object[key]);
		      });
		    }

		    /**
		     * The base implementation of `_.get` without support for default values.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path of the property to get.
		     * @returns {*} Returns the resolved value.
		     */
		    function baseGet(object, path) {
		      path = castPath(path, object);

		      var index = 0,
		          length = path.length;

		      while (object != null && index < length) {
		        object = object[toKey(path[index++])];
		      }
		      return (index && index == length) ? object : undefined$1;
		    }

		    /**
		     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
		     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
		     * symbols of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {Function} keysFunc The function to get the keys of `object`.
		     * @param {Function} symbolsFunc The function to get the symbols of `object`.
		     * @returns {Array} Returns the array of property names and symbols.
		     */
		    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		      var result = keysFunc(object);
		      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
		    }

		    /**
		     * The base implementation of `getTag` without fallbacks for buggy environments.
		     *
		     * @private
		     * @param {*} value The value to query.
		     * @returns {string} Returns the `toStringTag`.
		     */
		    function baseGetTag(value) {
		      if (value == null) {
		        return value === undefined$1 ? undefinedTag : nullTag;
		      }
		      return (symToStringTag && symToStringTag in Object(value))
		        ? getRawTag(value)
		        : objectToString(value);
		    }

		    /**
		     * The base implementation of `_.gt` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is greater than `other`,
		     *  else `false`.
		     */
		    function baseGt(value, other) {
		      return value > other;
		    }

		    /**
		     * The base implementation of `_.has` without support for deep paths.
		     *
		     * @private
		     * @param {Object} [object] The object to query.
		     * @param {Array|string} key The key to check.
		     * @returns {boolean} Returns `true` if `key` exists, else `false`.
		     */
		    function baseHas(object, key) {
		      return object != null && hasOwnProperty.call(object, key);
		    }

		    /**
		     * The base implementation of `_.hasIn` without support for deep paths.
		     *
		     * @private
		     * @param {Object} [object] The object to query.
		     * @param {Array|string} key The key to check.
		     * @returns {boolean} Returns `true` if `key` exists, else `false`.
		     */
		    function baseHasIn(object, key) {
		      return object != null && key in Object(object);
		    }

		    /**
		     * The base implementation of `_.inRange` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {number} number The number to check.
		     * @param {number} start The start of the range.
		     * @param {number} end The end of the range.
		     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
		     */
		    function baseInRange(number, start, end) {
		      return number >= nativeMin(start, end) && number < nativeMax(start, end);
		    }

		    /**
		     * The base implementation of methods like `_.intersection`, without support
		     * for iteratee shorthands, that accepts an array of arrays to inspect.
		     *
		     * @private
		     * @param {Array} arrays The arrays to inspect.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of shared values.
		     */
		    function baseIntersection(arrays, iteratee, comparator) {
		      var includes = comparator ? arrayIncludesWith : arrayIncludes,
		          length = arrays[0].length,
		          othLength = arrays.length,
		          othIndex = othLength,
		          caches = Array(othLength),
		          maxLength = Infinity,
		          result = [];

		      while (othIndex--) {
		        var array = arrays[othIndex];
		        if (othIndex && iteratee) {
		          array = arrayMap(array, baseUnary(iteratee));
		        }
		        maxLength = nativeMin(array.length, maxLength);
		        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
		          ? new SetCache(othIndex && array)
		          : undefined$1;
		      }
		      array = arrays[0];

		      var index = -1,
		          seen = caches[0];

		      outer:
		      while (++index < length && result.length < maxLength) {
		        var value = array[index],
		            computed = iteratee ? iteratee(value) : value;

		        value = (comparator || value !== 0) ? value : 0;
		        if (!(seen
		              ? cacheHas(seen, computed)
		              : includes(result, computed, comparator)
		            )) {
		          othIndex = othLength;
		          while (--othIndex) {
		            var cache = caches[othIndex];
		            if (!(cache
		                  ? cacheHas(cache, computed)
		                  : includes(arrays[othIndex], computed, comparator))
		                ) {
		              continue outer;
		            }
		          }
		          if (seen) {
		            seen.push(computed);
		          }
		          result.push(value);
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.invert` and `_.invertBy` which inverts
		     * `object` with values transformed by `iteratee` and set by `setter`.
		     *
		     * @private
		     * @param {Object} object The object to iterate over.
		     * @param {Function} setter The function to set `accumulator` values.
		     * @param {Function} iteratee The iteratee to transform values.
		     * @param {Object} accumulator The initial inverted object.
		     * @returns {Function} Returns `accumulator`.
		     */
		    function baseInverter(object, setter, iteratee, accumulator) {
		      baseForOwn(object, function(value, key, object) {
		        setter(accumulator, iteratee(value), key, object);
		      });
		      return accumulator;
		    }

		    /**
		     * The base implementation of `_.invoke` without support for individual
		     * method arguments.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path of the method to invoke.
		     * @param {Array} args The arguments to invoke the method with.
		     * @returns {*} Returns the result of the invoked method.
		     */
		    function baseInvoke(object, path, args) {
		      path = castPath(path, object);
		      object = parent(object, path);
		      var func = object == null ? object : object[toKey(last(path))];
		      return func == null ? undefined$1 : apply(func, object, args);
		    }

		    /**
		     * The base implementation of `_.isArguments`.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
		     */
		    function baseIsArguments(value) {
		      return isObjectLike(value) && baseGetTag(value) == argsTag;
		    }

		    /**
		     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
		     */
		    function baseIsArrayBuffer(value) {
		      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
		    }

		    /**
		     * The base implementation of `_.isDate` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
		     */
		    function baseIsDate(value) {
		      return isObjectLike(value) && baseGetTag(value) == dateTag;
		    }

		    /**
		     * The base implementation of `_.isEqual` which supports partial comparisons
		     * and tracks traversed objects.
		     *
		     * @private
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @param {boolean} bitmask The bitmask flags.
		     *  1 - Unordered comparison
		     *  2 - Partial comparison
		     * @param {Function} [customizer] The function to customize comparisons.
		     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
		     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
		     */
		    function baseIsEqual(value, other, bitmask, customizer, stack) {
		      if (value === other) {
		        return true;
		      }
		      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
		        return value !== value && other !== other;
		      }
		      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
		    }

		    /**
		     * A specialized version of `baseIsEqual` for arrays and objects which performs
		     * deep comparisons and tracks traversed objects enabling objects with circular
		     * references to be compared.
		     *
		     * @private
		     * @param {Object} object The object to compare.
		     * @param {Object} other The other object to compare.
		     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
		     * @param {Function} customizer The function to customize comparisons.
		     * @param {Function} equalFunc The function to determine equivalents of values.
		     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
		     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
		     */
		    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
		      var objIsArr = isArray(object),
		          othIsArr = isArray(other),
		          objTag = objIsArr ? arrayTag : getTag(object),
		          othTag = othIsArr ? arrayTag : getTag(other);

		      objTag = objTag == argsTag ? objectTag : objTag;
		      othTag = othTag == argsTag ? objectTag : othTag;

		      var objIsObj = objTag == objectTag,
		          othIsObj = othTag == objectTag,
		          isSameTag = objTag == othTag;

		      if (isSameTag && isBuffer(object)) {
		        if (!isBuffer(other)) {
		          return false;
		        }
		        objIsArr = true;
		        objIsObj = false;
		      }
		      if (isSameTag && !objIsObj) {
		        stack || (stack = new Stack);
		        return (objIsArr || isTypedArray(object))
		          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
		          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
		      }
		      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
		        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
		            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

		        if (objIsWrapped || othIsWrapped) {
		          var objUnwrapped = objIsWrapped ? object.value() : object,
		              othUnwrapped = othIsWrapped ? other.value() : other;

		          stack || (stack = new Stack);
		          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		        }
		      }
		      if (!isSameTag) {
		        return false;
		      }
		      stack || (stack = new Stack);
		      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
		    }

		    /**
		     * The base implementation of `_.isMap` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
		     */
		    function baseIsMap(value) {
		      return isObjectLike(value) && getTag(value) == mapTag;
		    }

		    /**
		     * The base implementation of `_.isMatch` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Object} object The object to inspect.
		     * @param {Object} source The object of property values to match.
		     * @param {Array} matchData The property names, values, and compare flags to match.
		     * @param {Function} [customizer] The function to customize comparisons.
		     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
		     */
		    function baseIsMatch(object, source, matchData, customizer) {
		      var index = matchData.length,
		          length = index,
		          noCustomizer = !customizer;

		      if (object == null) {
		        return !length;
		      }
		      object = Object(object);
		      while (index--) {
		        var data = matchData[index];
		        if ((noCustomizer && data[2])
		              ? data[1] !== object[data[0]]
		              : !(data[0] in object)
		            ) {
		          return false;
		        }
		      }
		      while (++index < length) {
		        data = matchData[index];
		        var key = data[0],
		            objValue = object[key],
		            srcValue = data[1];

		        if (noCustomizer && data[2]) {
		          if (objValue === undefined$1 && !(key in object)) {
		            return false;
		          }
		        } else {
		          var stack = new Stack;
		          if (customizer) {
		            var result = customizer(objValue, srcValue, key, object, source, stack);
		          }
		          if (!(result === undefined$1
		                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
		                : result
		              )) {
		            return false;
		          }
		        }
		      }
		      return true;
		    }

		    /**
		     * The base implementation of `_.isNative` without bad shim checks.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a native function,
		     *  else `false`.
		     */
		    function baseIsNative(value) {
		      if (!isObject(value) || isMasked(value)) {
		        return false;
		      }
		      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
		      return pattern.test(toSource(value));
		    }

		    /**
		     * The base implementation of `_.isRegExp` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
		     */
		    function baseIsRegExp(value) {
		      return isObjectLike(value) && baseGetTag(value) == regexpTag;
		    }

		    /**
		     * The base implementation of `_.isSet` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
		     */
		    function baseIsSet(value) {
		      return isObjectLike(value) && getTag(value) == setTag;
		    }

		    /**
		     * The base implementation of `_.isTypedArray` without Node.js optimizations.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
		     */
		    function baseIsTypedArray(value) {
		      return isObjectLike(value) &&
		        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
		    }

		    /**
		     * The base implementation of `_.iteratee`.
		     *
		     * @private
		     * @param {*} [value=_.identity] The value to convert to an iteratee.
		     * @returns {Function} Returns the iteratee.
		     */
		    function baseIteratee(value) {
		      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
		      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
		      if (typeof value == 'function') {
		        return value;
		      }
		      if (value == null) {
		        return identity;
		      }
		      if (typeof value == 'object') {
		        return isArray(value)
		          ? baseMatchesProperty(value[0], value[1])
		          : baseMatches(value);
		      }
		      return property(value);
		    }

		    /**
		     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names.
		     */
		    function baseKeys(object) {
		      if (!isPrototype(object)) {
		        return nativeKeys(object);
		      }
		      var result = [];
		      for (var key in Object(object)) {
		        if (hasOwnProperty.call(object, key) && key != 'constructor') {
		          result.push(key);
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names.
		     */
		    function baseKeysIn(object) {
		      if (!isObject(object)) {
		        return nativeKeysIn(object);
		      }
		      var isProto = isPrototype(object),
		          result = [];

		      for (var key in object) {
		        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
		          result.push(key);
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.lt` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is less than `other`,
		     *  else `false`.
		     */
		    function baseLt(value, other) {
		      return value < other;
		    }

		    /**
		     * The base implementation of `_.map` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} iteratee The function invoked per iteration.
		     * @returns {Array} Returns the new mapped array.
		     */
		    function baseMap(collection, iteratee) {
		      var index = -1,
		          result = isArrayLike(collection) ? Array(collection.length) : [];

		      baseEach(collection, function(value, key, collection) {
		        result[++index] = iteratee(value, key, collection);
		      });
		      return result;
		    }

		    /**
		     * The base implementation of `_.matches` which doesn't clone `source`.
		     *
		     * @private
		     * @param {Object} source The object of property values to match.
		     * @returns {Function} Returns the new spec function.
		     */
		    function baseMatches(source) {
		      var matchData = getMatchData(source);
		      if (matchData.length == 1 && matchData[0][2]) {
		        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
		      }
		      return function(object) {
		        return object === source || baseIsMatch(object, source, matchData);
		      };
		    }

		    /**
		     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
		     *
		     * @private
		     * @param {string} path The path of the property to get.
		     * @param {*} srcValue The value to match.
		     * @returns {Function} Returns the new spec function.
		     */
		    function baseMatchesProperty(path, srcValue) {
		      if (isKey(path) && isStrictComparable(srcValue)) {
		        return matchesStrictComparable(toKey(path), srcValue);
		      }
		      return function(object) {
		        var objValue = get(object, path);
		        return (objValue === undefined$1 && objValue === srcValue)
		          ? hasIn(object, path)
		          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
		      };
		    }

		    /**
		     * The base implementation of `_.merge` without support for multiple sources.
		     *
		     * @private
		     * @param {Object} object The destination object.
		     * @param {Object} source The source object.
		     * @param {number} srcIndex The index of `source`.
		     * @param {Function} [customizer] The function to customize merged values.
		     * @param {Object} [stack] Tracks traversed source values and their merged
		     *  counterparts.
		     */
		    function baseMerge(object, source, srcIndex, customizer, stack) {
		      if (object === source) {
		        return;
		      }
		      baseFor(source, function(srcValue, key) {
		        stack || (stack = new Stack);
		        if (isObject(srcValue)) {
		          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
		        }
		        else {
		          var newValue = customizer
		            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
		            : undefined$1;

		          if (newValue === undefined$1) {
		            newValue = srcValue;
		          }
		          assignMergeValue(object, key, newValue);
		        }
		      }, keysIn);
		    }

		    /**
		     * A specialized version of `baseMerge` for arrays and objects which performs
		     * deep merges and tracks traversed objects enabling objects with circular
		     * references to be merged.
		     *
		     * @private
		     * @param {Object} object The destination object.
		     * @param {Object} source The source object.
		     * @param {string} key The key of the value to merge.
		     * @param {number} srcIndex The index of `source`.
		     * @param {Function} mergeFunc The function to merge values.
		     * @param {Function} [customizer] The function to customize assigned values.
		     * @param {Object} [stack] Tracks traversed source values and their merged
		     *  counterparts.
		     */
		    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
		      var objValue = safeGet(object, key),
		          srcValue = safeGet(source, key),
		          stacked = stack.get(srcValue);

		      if (stacked) {
		        assignMergeValue(object, key, stacked);
		        return;
		      }
		      var newValue = customizer
		        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
		        : undefined$1;

		      var isCommon = newValue === undefined$1;

		      if (isCommon) {
		        var isArr = isArray(srcValue),
		            isBuff = !isArr && isBuffer(srcValue),
		            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

		        newValue = srcValue;
		        if (isArr || isBuff || isTyped) {
		          if (isArray(objValue)) {
		            newValue = objValue;
		          }
		          else if (isArrayLikeObject(objValue)) {
		            newValue = copyArray(objValue);
		          }
		          else if (isBuff) {
		            isCommon = false;
		            newValue = cloneBuffer(srcValue, true);
		          }
		          else if (isTyped) {
		            isCommon = false;
		            newValue = cloneTypedArray(srcValue, true);
		          }
		          else {
		            newValue = [];
		          }
		        }
		        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
		          newValue = objValue;
		          if (isArguments(objValue)) {
		            newValue = toPlainObject(objValue);
		          }
		          else if (!isObject(objValue) || isFunction(objValue)) {
		            newValue = initCloneObject(srcValue);
		          }
		        }
		        else {
		          isCommon = false;
		        }
		      }
		      if (isCommon) {
		        // Recursively merge objects and arrays (susceptible to call stack limits).
		        stack.set(srcValue, newValue);
		        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
		        stack['delete'](srcValue);
		      }
		      assignMergeValue(object, key, newValue);
		    }

		    /**
		     * The base implementation of `_.nth` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {Array} array The array to query.
		     * @param {number} n The index of the element to return.
		     * @returns {*} Returns the nth element of `array`.
		     */
		    function baseNth(array, n) {
		      var length = array.length;
		      if (!length) {
		        return;
		      }
		      n += n < 0 ? length : 0;
		      return isIndex(n, length) ? array[n] : undefined$1;
		    }

		    /**
		     * The base implementation of `_.orderBy` without param guards.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
		     * @param {string[]} orders The sort orders of `iteratees`.
		     * @returns {Array} Returns the new sorted array.
		     */
		    function baseOrderBy(collection, iteratees, orders) {
		      if (iteratees.length) {
		        iteratees = arrayMap(iteratees, function(iteratee) {
		          if (isArray(iteratee)) {
		            return function(value) {
		              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
		            }
		          }
		          return iteratee;
		        });
		      } else {
		        iteratees = [identity];
		      }

		      var index = -1;
		      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

		      var result = baseMap(collection, function(value, key, collection) {
		        var criteria = arrayMap(iteratees, function(iteratee) {
		          return iteratee(value);
		        });
		        return { 'criteria': criteria, 'index': ++index, 'value': value };
		      });

		      return baseSortBy(result, function(object, other) {
		        return compareMultiple(object, other, orders);
		      });
		    }

		    /**
		     * The base implementation of `_.pick` without support for individual
		     * property identifiers.
		     *
		     * @private
		     * @param {Object} object The source object.
		     * @param {string[]} paths The property paths to pick.
		     * @returns {Object} Returns the new object.
		     */
		    function basePick(object, paths) {
		      return basePickBy(object, paths, function(value, path) {
		        return hasIn(object, path);
		      });
		    }

		    /**
		     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Object} object The source object.
		     * @param {string[]} paths The property paths to pick.
		     * @param {Function} predicate The function invoked per property.
		     * @returns {Object} Returns the new object.
		     */
		    function basePickBy(object, paths, predicate) {
		      var index = -1,
		          length = paths.length,
		          result = {};

		      while (++index < length) {
		        var path = paths[index],
		            value = baseGet(object, path);

		        if (predicate(value, path)) {
		          baseSet(result, castPath(path, object), value);
		        }
		      }
		      return result;
		    }

		    /**
		     * A specialized version of `baseProperty` which supports deep paths.
		     *
		     * @private
		     * @param {Array|string} path The path of the property to get.
		     * @returns {Function} Returns the new accessor function.
		     */
		    function basePropertyDeep(path) {
		      return function(object) {
		        return baseGet(object, path);
		      };
		    }

		    /**
		     * The base implementation of `_.pullAllBy` without support for iteratee
		     * shorthands.
		     *
		     * @private
		     * @param {Array} array The array to modify.
		     * @param {Array} values The values to remove.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns `array`.
		     */
		    function basePullAll(array, values, iteratee, comparator) {
		      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
		          index = -1,
		          length = values.length,
		          seen = array;

		      if (array === values) {
		        values = copyArray(values);
		      }
		      if (iteratee) {
		        seen = arrayMap(array, baseUnary(iteratee));
		      }
		      while (++index < length) {
		        var fromIndex = 0,
		            value = values[index],
		            computed = iteratee ? iteratee(value) : value;

		        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
		          if (seen !== array) {
		            splice.call(seen, fromIndex, 1);
		          }
		          splice.call(array, fromIndex, 1);
		        }
		      }
		      return array;
		    }

		    /**
		     * The base implementation of `_.pullAt` without support for individual
		     * indexes or capturing the removed elements.
		     *
		     * @private
		     * @param {Array} array The array to modify.
		     * @param {number[]} indexes The indexes of elements to remove.
		     * @returns {Array} Returns `array`.
		     */
		    function basePullAt(array, indexes) {
		      var length = array ? indexes.length : 0,
		          lastIndex = length - 1;

		      while (length--) {
		        var index = indexes[length];
		        if (length == lastIndex || index !== previous) {
		          var previous = index;
		          if (isIndex(index)) {
		            splice.call(array, index, 1);
		          } else {
		            baseUnset(array, index);
		          }
		        }
		      }
		      return array;
		    }

		    /**
		     * The base implementation of `_.random` without support for returning
		     * floating-point numbers.
		     *
		     * @private
		     * @param {number} lower The lower bound.
		     * @param {number} upper The upper bound.
		     * @returns {number} Returns the random number.
		     */
		    function baseRandom(lower, upper) {
		      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
		    }

		    /**
		     * The base implementation of `_.range` and `_.rangeRight` which doesn't
		     * coerce arguments.
		     *
		     * @private
		     * @param {number} start The start of the range.
		     * @param {number} end The end of the range.
		     * @param {number} step The value to increment or decrement by.
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Array} Returns the range of numbers.
		     */
		    function baseRange(start, end, step, fromRight) {
		      var index = -1,
		          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
		          result = Array(length);

		      while (length--) {
		        result[fromRight ? length : ++index] = start;
		        start += step;
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.repeat` which doesn't coerce arguments.
		     *
		     * @private
		     * @param {string} string The string to repeat.
		     * @param {number} n The number of times to repeat the string.
		     * @returns {string} Returns the repeated string.
		     */
		    function baseRepeat(string, n) {
		      var result = '';
		      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
		        return result;
		      }
		      // Leverage the exponentiation by squaring algorithm for a faster repeat.
		      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
		      do {
		        if (n % 2) {
		          result += string;
		        }
		        n = nativeFloor(n / 2);
		        if (n) {
		          string += string;
		        }
		      } while (n);

		      return result;
		    }

		    /**
		     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
		     *
		     * @private
		     * @param {Function} func The function to apply a rest parameter to.
		     * @param {number} [start=func.length-1] The start position of the rest parameter.
		     * @returns {Function} Returns the new function.
		     */
		    function baseRest(func, start) {
		      return setToString(overRest(func, start, identity), func + '');
		    }

		    /**
		     * The base implementation of `_.sample`.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to sample.
		     * @returns {*} Returns the random element.
		     */
		    function baseSample(collection) {
		      return arraySample(values(collection));
		    }

		    /**
		     * The base implementation of `_.sampleSize` without param guards.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to sample.
		     * @param {number} n The number of elements to sample.
		     * @returns {Array} Returns the random elements.
		     */
		    function baseSampleSize(collection, n) {
		      var array = values(collection);
		      return shuffleSelf(array, baseClamp(n, 0, array.length));
		    }

		    /**
		     * The base implementation of `_.set`.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to set.
		     * @param {*} value The value to set.
		     * @param {Function} [customizer] The function to customize path creation.
		     * @returns {Object} Returns `object`.
		     */
		    function baseSet(object, path, value, customizer) {
		      if (!isObject(object)) {
		        return object;
		      }
		      path = castPath(path, object);

		      var index = -1,
		          length = path.length,
		          lastIndex = length - 1,
		          nested = object;

		      while (nested != null && ++index < length) {
		        var key = toKey(path[index]),
		            newValue = value;

		        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
		          return object;
		        }

		        if (index != lastIndex) {
		          var objValue = nested[key];
		          newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
		          if (newValue === undefined$1) {
		            newValue = isObject(objValue)
		              ? objValue
		              : (isIndex(path[index + 1]) ? [] : {});
		          }
		        }
		        assignValue(nested, key, newValue);
		        nested = nested[key];
		      }
		      return object;
		    }

		    /**
		     * The base implementation of `setData` without support for hot loop shorting.
		     *
		     * @private
		     * @param {Function} func The function to associate metadata with.
		     * @param {*} data The metadata.
		     * @returns {Function} Returns `func`.
		     */
		    var baseSetData = !metaMap ? identity : function(func, data) {
		      metaMap.set(func, data);
		      return func;
		    };

		    /**
		     * The base implementation of `setToString` without support for hot loop shorting.
		     *
		     * @private
		     * @param {Function} func The function to modify.
		     * @param {Function} string The `toString` result.
		     * @returns {Function} Returns `func`.
		     */
		    var baseSetToString = !defineProperty ? identity : function(func, string) {
		      return defineProperty(func, 'toString', {
		        'configurable': true,
		        'enumerable': false,
		        'value': constant(string),
		        'writable': true
		      });
		    };

		    /**
		     * The base implementation of `_.shuffle`.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to shuffle.
		     * @returns {Array} Returns the new shuffled array.
		     */
		    function baseShuffle(collection) {
		      return shuffleSelf(values(collection));
		    }

		    /**
		     * The base implementation of `_.slice` without an iteratee call guard.
		     *
		     * @private
		     * @param {Array} array The array to slice.
		     * @param {number} [start=0] The start position.
		     * @param {number} [end=array.length] The end position.
		     * @returns {Array} Returns the slice of `array`.
		     */
		    function baseSlice(array, start, end) {
		      var index = -1,
		          length = array.length;

		      if (start < 0) {
		        start = -start > length ? 0 : (length + start);
		      }
		      end = end > length ? length : end;
		      if (end < 0) {
		        end += length;
		      }
		      length = start > end ? 0 : ((end - start) >>> 0);
		      start >>>= 0;

		      var result = Array(length);
		      while (++index < length) {
		        result[index] = array[index + start];
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.some` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} predicate The function invoked per iteration.
		     * @returns {boolean} Returns `true` if any element passes the predicate check,
		     *  else `false`.
		     */
		    function baseSome(collection, predicate) {
		      var result;

		      baseEach(collection, function(value, index, collection) {
		        result = predicate(value, index, collection);
		        return !result;
		      });
		      return !!result;
		    }

		    /**
		     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
		     * performs a binary search of `array` to determine the index at which `value`
		     * should be inserted into `array` in order to maintain its sort order.
		     *
		     * @private
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @param {boolean} [retHighest] Specify returning the highest qualified index.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     */
		    function baseSortedIndex(array, value, retHighest) {
		      var low = 0,
		          high = array == null ? low : array.length;

		      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
		        while (low < high) {
		          var mid = (low + high) >>> 1,
		              computed = array[mid];

		          if (computed !== null && !isSymbol(computed) &&
		              (retHighest ? (computed <= value) : (computed < value))) {
		            low = mid + 1;
		          } else {
		            high = mid;
		          }
		        }
		        return high;
		      }
		      return baseSortedIndexBy(array, value, identity, retHighest);
		    }

		    /**
		     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
		     * which invokes `iteratee` for `value` and each element of `array` to compute
		     * their sort ranking. The iteratee is invoked with one argument; (value).
		     *
		     * @private
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @param {Function} iteratee The iteratee invoked per element.
		     * @param {boolean} [retHighest] Specify returning the highest qualified index.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     */
		    function baseSortedIndexBy(array, value, iteratee, retHighest) {
		      var low = 0,
		          high = array == null ? 0 : array.length;
		      if (high === 0) {
		        return 0;
		      }

		      value = iteratee(value);
		      var valIsNaN = value !== value,
		          valIsNull = value === null,
		          valIsSymbol = isSymbol(value),
		          valIsUndefined = value === undefined$1;

		      while (low < high) {
		        var mid = nativeFloor((low + high) / 2),
		            computed = iteratee(array[mid]),
		            othIsDefined = computed !== undefined$1,
		            othIsNull = computed === null,
		            othIsReflexive = computed === computed,
		            othIsSymbol = isSymbol(computed);

		        if (valIsNaN) {
		          var setLow = retHighest || othIsReflexive;
		        } else if (valIsUndefined) {
		          setLow = othIsReflexive && (retHighest || othIsDefined);
		        } else if (valIsNull) {
		          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
		        } else if (valIsSymbol) {
		          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
		        } else if (othIsNull || othIsSymbol) {
		          setLow = false;
		        } else {
		          setLow = retHighest ? (computed <= value) : (computed < value);
		        }
		        if (setLow) {
		          low = mid + 1;
		        } else {
		          high = mid;
		        }
		      }
		      return nativeMin(high, MAX_ARRAY_INDEX);
		    }

		    /**
		     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
		     * support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array} array The array to inspect.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @returns {Array} Returns the new duplicate free array.
		     */
		    function baseSortedUniq(array, iteratee) {
		      var index = -1,
		          length = array.length,
		          resIndex = 0,
		          result = [];

		      while (++index < length) {
		        var value = array[index],
		            computed = iteratee ? iteratee(value) : value;

		        if (!index || !eq(computed, seen)) {
		          var seen = computed;
		          result[resIndex++] = value === 0 ? 0 : value;
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.toNumber` which doesn't ensure correct
		     * conversions of binary, hexadecimal, or octal string values.
		     *
		     * @private
		     * @param {*} value The value to process.
		     * @returns {number} Returns the number.
		     */
		    function baseToNumber(value) {
		      if (typeof value == 'number') {
		        return value;
		      }
		      if (isSymbol(value)) {
		        return NAN;
		      }
		      return +value;
		    }

		    /**
		     * The base implementation of `_.toString` which doesn't convert nullish
		     * values to empty strings.
		     *
		     * @private
		     * @param {*} value The value to process.
		     * @returns {string} Returns the string.
		     */
		    function baseToString(value) {
		      // Exit early for strings to avoid a performance hit in some environments.
		      if (typeof value == 'string') {
		        return value;
		      }
		      if (isArray(value)) {
		        // Recursively convert values (susceptible to call stack limits).
		        return arrayMap(value, baseToString) + '';
		      }
		      if (isSymbol(value)) {
		        return symbolToString ? symbolToString.call(value) : '';
		      }
		      var result = (value + '');
		      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
		    }

		    /**
		     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array} array The array to inspect.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new duplicate free array.
		     */
		    function baseUniq(array, iteratee, comparator) {
		      var index = -1,
		          includes = arrayIncludes,
		          length = array.length,
		          isCommon = true,
		          result = [],
		          seen = result;

		      if (comparator) {
		        isCommon = false;
		        includes = arrayIncludesWith;
		      }
		      else if (length >= LARGE_ARRAY_SIZE) {
		        var set = iteratee ? null : createSet(array);
		        if (set) {
		          return setToArray(set);
		        }
		        isCommon = false;
		        includes = cacheHas;
		        seen = new SetCache;
		      }
		      else {
		        seen = iteratee ? [] : result;
		      }
		      outer:
		      while (++index < length) {
		        var value = array[index],
		            computed = iteratee ? iteratee(value) : value;

		        value = (comparator || value !== 0) ? value : 0;
		        if (isCommon && computed === computed) {
		          var seenIndex = seen.length;
		          while (seenIndex--) {
		            if (seen[seenIndex] === computed) {
		              continue outer;
		            }
		          }
		          if (iteratee) {
		            seen.push(computed);
		          }
		          result.push(value);
		        }
		        else if (!includes(seen, computed, comparator)) {
		          if (seen !== result) {
		            seen.push(computed);
		          }
		          result.push(value);
		        }
		      }
		      return result;
		    }

		    /**
		     * The base implementation of `_.unset`.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The property path to unset.
		     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
		     */
		    function baseUnset(object, path) {
		      path = castPath(path, object);
		      object = parent(object, path);
		      return object == null || delete object[toKey(last(path))];
		    }

		    /**
		     * The base implementation of `_.update`.
		     *
		     * @private
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to update.
		     * @param {Function} updater The function to produce the updated value.
		     * @param {Function} [customizer] The function to customize path creation.
		     * @returns {Object} Returns `object`.
		     */
		    function baseUpdate(object, path, updater, customizer) {
		      return baseSet(object, path, updater(baseGet(object, path)), customizer);
		    }

		    /**
		     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
		     * without support for iteratee shorthands.
		     *
		     * @private
		     * @param {Array} array The array to query.
		     * @param {Function} predicate The function invoked per iteration.
		     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Array} Returns the slice of `array`.
		     */
		    function baseWhile(array, predicate, isDrop, fromRight) {
		      var length = array.length,
		          index = fromRight ? length : -1;

		      while ((fromRight ? index-- : ++index < length) &&
		        predicate(array[index], index, array)) {}

		      return isDrop
		        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
		        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
		    }

		    /**
		     * The base implementation of `wrapperValue` which returns the result of
		     * performing a sequence of actions on the unwrapped `value`, where each
		     * successive action is supplied the return value of the previous.
		     *
		     * @private
		     * @param {*} value The unwrapped value.
		     * @param {Array} actions Actions to perform to resolve the unwrapped value.
		     * @returns {*} Returns the resolved value.
		     */
		    function baseWrapperValue(value, actions) {
		      var result = value;
		      if (result instanceof LazyWrapper) {
		        result = result.value();
		      }
		      return arrayReduce(actions, function(result, action) {
		        return action.func.apply(action.thisArg, arrayPush([result], action.args));
		      }, result);
		    }

		    /**
		     * The base implementation of methods like `_.xor`, without support for
		     * iteratee shorthands, that accepts an array of arrays to inspect.
		     *
		     * @private
		     * @param {Array} arrays The arrays to inspect.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of values.
		     */
		    function baseXor(arrays, iteratee, comparator) {
		      var length = arrays.length;
		      if (length < 2) {
		        return length ? baseUniq(arrays[0]) : [];
		      }
		      var index = -1,
		          result = Array(length);

		      while (++index < length) {
		        var array = arrays[index],
		            othIndex = -1;

		        while (++othIndex < length) {
		          if (othIndex != index) {
		            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
		          }
		        }
		      }
		      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
		    }

		    /**
		     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
		     *
		     * @private
		     * @param {Array} props The property identifiers.
		     * @param {Array} values The property values.
		     * @param {Function} assignFunc The function to assign values.
		     * @returns {Object} Returns the new object.
		     */
		    function baseZipObject(props, values, assignFunc) {
		      var index = -1,
		          length = props.length,
		          valsLength = values.length,
		          result = {};

		      while (++index < length) {
		        var value = index < valsLength ? values[index] : undefined$1;
		        assignFunc(result, props[index], value);
		      }
		      return result;
		    }

		    /**
		     * Casts `value` to an empty array if it's not an array like object.
		     *
		     * @private
		     * @param {*} value The value to inspect.
		     * @returns {Array|Object} Returns the cast array-like object.
		     */
		    function castArrayLikeObject(value) {
		      return isArrayLikeObject(value) ? value : [];
		    }

		    /**
		     * Casts `value` to `identity` if it's not a function.
		     *
		     * @private
		     * @param {*} value The value to inspect.
		     * @returns {Function} Returns cast function.
		     */
		    function castFunction(value) {
		      return typeof value == 'function' ? value : identity;
		    }

		    /**
		     * Casts `value` to a path array if it's not one.
		     *
		     * @private
		     * @param {*} value The value to inspect.
		     * @param {Object} [object] The object to query keys on.
		     * @returns {Array} Returns the cast property path array.
		     */
		    function castPath(value, object) {
		      if (isArray(value)) {
		        return value;
		      }
		      return isKey(value, object) ? [value] : stringToPath(toString(value));
		    }

		    /**
		     * A `baseRest` alias which can be replaced with `identity` by module
		     * replacement plugins.
		     *
		     * @private
		     * @type {Function}
		     * @param {Function} func The function to apply a rest parameter to.
		     * @returns {Function} Returns the new function.
		     */
		    var castRest = baseRest;

		    /**
		     * Casts `array` to a slice if it's needed.
		     *
		     * @private
		     * @param {Array} array The array to inspect.
		     * @param {number} start The start position.
		     * @param {number} [end=array.length] The end position.
		     * @returns {Array} Returns the cast slice.
		     */
		    function castSlice(array, start, end) {
		      var length = array.length;
		      end = end === undefined$1 ? length : end;
		      return (!start && end >= length) ? array : baseSlice(array, start, end);
		    }

		    /**
		     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
		     *
		     * @private
		     * @param {number|Object} id The timer id or timeout object of the timer to clear.
		     */
		    var clearTimeout = ctxClearTimeout || function(id) {
		      return root.clearTimeout(id);
		    };

		    /**
		     * Creates a clone of  `buffer`.
		     *
		     * @private
		     * @param {Buffer} buffer The buffer to clone.
		     * @param {boolean} [isDeep] Specify a deep clone.
		     * @returns {Buffer} Returns the cloned buffer.
		     */
		    function cloneBuffer(buffer, isDeep) {
		      if (isDeep) {
		        return buffer.slice();
		      }
		      var length = buffer.length,
		          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

		      buffer.copy(result);
		      return result;
		    }

		    /**
		     * Creates a clone of `arrayBuffer`.
		     *
		     * @private
		     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
		     * @returns {ArrayBuffer} Returns the cloned array buffer.
		     */
		    function cloneArrayBuffer(arrayBuffer) {
		      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
		      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
		      return result;
		    }

		    /**
		     * Creates a clone of `dataView`.
		     *
		     * @private
		     * @param {Object} dataView The data view to clone.
		     * @param {boolean} [isDeep] Specify a deep clone.
		     * @returns {Object} Returns the cloned data view.
		     */
		    function cloneDataView(dataView, isDeep) {
		      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
		      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
		    }

		    /**
		     * Creates a clone of `regexp`.
		     *
		     * @private
		     * @param {Object} regexp The regexp to clone.
		     * @returns {Object} Returns the cloned regexp.
		     */
		    function cloneRegExp(regexp) {
		      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
		      result.lastIndex = regexp.lastIndex;
		      return result;
		    }

		    /**
		     * Creates a clone of the `symbol` object.
		     *
		     * @private
		     * @param {Object} symbol The symbol object to clone.
		     * @returns {Object} Returns the cloned symbol object.
		     */
		    function cloneSymbol(symbol) {
		      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
		    }

		    /**
		     * Creates a clone of `typedArray`.
		     *
		     * @private
		     * @param {Object} typedArray The typed array to clone.
		     * @param {boolean} [isDeep] Specify a deep clone.
		     * @returns {Object} Returns the cloned typed array.
		     */
		    function cloneTypedArray(typedArray, isDeep) {
		      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
		      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
		    }

		    /**
		     * Compares values to sort them in ascending order.
		     *
		     * @private
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {number} Returns the sort order indicator for `value`.
		     */
		    function compareAscending(value, other) {
		      if (value !== other) {
		        var valIsDefined = value !== undefined$1,
		            valIsNull = value === null,
		            valIsReflexive = value === value,
		            valIsSymbol = isSymbol(value);

		        var othIsDefined = other !== undefined$1,
		            othIsNull = other === null,
		            othIsReflexive = other === other,
		            othIsSymbol = isSymbol(other);

		        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
		            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
		            (valIsNull && othIsDefined && othIsReflexive) ||
		            (!valIsDefined && othIsReflexive) ||
		            !valIsReflexive) {
		          return 1;
		        }
		        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
		            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
		            (othIsNull && valIsDefined && valIsReflexive) ||
		            (!othIsDefined && valIsReflexive) ||
		            !othIsReflexive) {
		          return -1;
		        }
		      }
		      return 0;
		    }

		    /**
		     * Used by `_.orderBy` to compare multiple properties of a value to another
		     * and stable sort them.
		     *
		     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
		     * specify an order of "desc" for descending or "asc" for ascending sort order
		     * of corresponding values.
		     *
		     * @private
		     * @param {Object} object The object to compare.
		     * @param {Object} other The other object to compare.
		     * @param {boolean[]|string[]} orders The order to sort by for each property.
		     * @returns {number} Returns the sort order indicator for `object`.
		     */
		    function compareMultiple(object, other, orders) {
		      var index = -1,
		          objCriteria = object.criteria,
		          othCriteria = other.criteria,
		          length = objCriteria.length,
		          ordersLength = orders.length;

		      while (++index < length) {
		        var result = compareAscending(objCriteria[index], othCriteria[index]);
		        if (result) {
		          if (index >= ordersLength) {
		            return result;
		          }
		          var order = orders[index];
		          return result * (order == 'desc' ? -1 : 1);
		        }
		      }
		      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
		      // that causes it, under certain circumstances, to provide the same value for
		      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
		      // for more details.
		      //
		      // This also ensures a stable sort in V8 and other engines.
		      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
		      return object.index - other.index;
		    }

		    /**
		     * Creates an array that is the composition of partially applied arguments,
		     * placeholders, and provided arguments into a single array of arguments.
		     *
		     * @private
		     * @param {Array} args The provided arguments.
		     * @param {Array} partials The arguments to prepend to those provided.
		     * @param {Array} holders The `partials` placeholder indexes.
		     * @params {boolean} [isCurried] Specify composing for a curried function.
		     * @returns {Array} Returns the new array of composed arguments.
		     */
		    function composeArgs(args, partials, holders, isCurried) {
		      var argsIndex = -1,
		          argsLength = args.length,
		          holdersLength = holders.length,
		          leftIndex = -1,
		          leftLength = partials.length,
		          rangeLength = nativeMax(argsLength - holdersLength, 0),
		          result = Array(leftLength + rangeLength),
		          isUncurried = !isCurried;

		      while (++leftIndex < leftLength) {
		        result[leftIndex] = partials[leftIndex];
		      }
		      while (++argsIndex < holdersLength) {
		        if (isUncurried || argsIndex < argsLength) {
		          result[holders[argsIndex]] = args[argsIndex];
		        }
		      }
		      while (rangeLength--) {
		        result[leftIndex++] = args[argsIndex++];
		      }
		      return result;
		    }

		    /**
		     * This function is like `composeArgs` except that the arguments composition
		     * is tailored for `_.partialRight`.
		     *
		     * @private
		     * @param {Array} args The provided arguments.
		     * @param {Array} partials The arguments to append to those provided.
		     * @param {Array} holders The `partials` placeholder indexes.
		     * @params {boolean} [isCurried] Specify composing for a curried function.
		     * @returns {Array} Returns the new array of composed arguments.
		     */
		    function composeArgsRight(args, partials, holders, isCurried) {
		      var argsIndex = -1,
		          argsLength = args.length,
		          holdersIndex = -1,
		          holdersLength = holders.length,
		          rightIndex = -1,
		          rightLength = partials.length,
		          rangeLength = nativeMax(argsLength - holdersLength, 0),
		          result = Array(rangeLength + rightLength),
		          isUncurried = !isCurried;

		      while (++argsIndex < rangeLength) {
		        result[argsIndex] = args[argsIndex];
		      }
		      var offset = argsIndex;
		      while (++rightIndex < rightLength) {
		        result[offset + rightIndex] = partials[rightIndex];
		      }
		      while (++holdersIndex < holdersLength) {
		        if (isUncurried || argsIndex < argsLength) {
		          result[offset + holders[holdersIndex]] = args[argsIndex++];
		        }
		      }
		      return result;
		    }

		    /**
		     * Copies the values of `source` to `array`.
		     *
		     * @private
		     * @param {Array} source The array to copy values from.
		     * @param {Array} [array=[]] The array to copy values to.
		     * @returns {Array} Returns `array`.
		     */
		    function copyArray(source, array) {
		      var index = -1,
		          length = source.length;

		      array || (array = Array(length));
		      while (++index < length) {
		        array[index] = source[index];
		      }
		      return array;
		    }

		    /**
		     * Copies properties of `source` to `object`.
		     *
		     * @private
		     * @param {Object} source The object to copy properties from.
		     * @param {Array} props The property identifiers to copy.
		     * @param {Object} [object={}] The object to copy properties to.
		     * @param {Function} [customizer] The function to customize copied values.
		     * @returns {Object} Returns `object`.
		     */
		    function copyObject(source, props, object, customizer) {
		      var isNew = !object;
		      object || (object = {});

		      var index = -1,
		          length = props.length;

		      while (++index < length) {
		        var key = props[index];

		        var newValue = customizer
		          ? customizer(object[key], source[key], key, object, source)
		          : undefined$1;

		        if (newValue === undefined$1) {
		          newValue = source[key];
		        }
		        if (isNew) {
		          baseAssignValue(object, key, newValue);
		        } else {
		          assignValue(object, key, newValue);
		        }
		      }
		      return object;
		    }

		    /**
		     * Copies own symbols of `source` to `object`.
		     *
		     * @private
		     * @param {Object} source The object to copy symbols from.
		     * @param {Object} [object={}] The object to copy symbols to.
		     * @returns {Object} Returns `object`.
		     */
		    function copySymbols(source, object) {
		      return copyObject(source, getSymbols(source), object);
		    }

		    /**
		     * Copies own and inherited symbols of `source` to `object`.
		     *
		     * @private
		     * @param {Object} source The object to copy symbols from.
		     * @param {Object} [object={}] The object to copy symbols to.
		     * @returns {Object} Returns `object`.
		     */
		    function copySymbolsIn(source, object) {
		      return copyObject(source, getSymbolsIn(source), object);
		    }

		    /**
		     * Creates a function like `_.groupBy`.
		     *
		     * @private
		     * @param {Function} setter The function to set accumulator values.
		     * @param {Function} [initializer] The accumulator object initializer.
		     * @returns {Function} Returns the new aggregator function.
		     */
		    function createAggregator(setter, initializer) {
		      return function(collection, iteratee) {
		        var func = isArray(collection) ? arrayAggregator : baseAggregator,
		            accumulator = initializer ? initializer() : {};

		        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
		      };
		    }

		    /**
		     * Creates a function like `_.assign`.
		     *
		     * @private
		     * @param {Function} assigner The function to assign values.
		     * @returns {Function} Returns the new assigner function.
		     */
		    function createAssigner(assigner) {
		      return baseRest(function(object, sources) {
		        var index = -1,
		            length = sources.length,
		            customizer = length > 1 ? sources[length - 1] : undefined$1,
		            guard = length > 2 ? sources[2] : undefined$1;

		        customizer = (assigner.length > 3 && typeof customizer == 'function')
		          ? (length--, customizer)
		          : undefined$1;

		        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
		          customizer = length < 3 ? undefined$1 : customizer;
		          length = 1;
		        }
		        object = Object(object);
		        while (++index < length) {
		          var source = sources[index];
		          if (source) {
		            assigner(object, source, index, customizer);
		          }
		        }
		        return object;
		      });
		    }

		    /**
		     * Creates a `baseEach` or `baseEachRight` function.
		     *
		     * @private
		     * @param {Function} eachFunc The function to iterate over a collection.
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Function} Returns the new base function.
		     */
		    function createBaseEach(eachFunc, fromRight) {
		      return function(collection, iteratee) {
		        if (collection == null) {
		          return collection;
		        }
		        if (!isArrayLike(collection)) {
		          return eachFunc(collection, iteratee);
		        }
		        var length = collection.length,
		            index = fromRight ? length : -1,
		            iterable = Object(collection);

		        while ((fromRight ? index-- : ++index < length)) {
		          if (iteratee(iterable[index], index, iterable) === false) {
		            break;
		          }
		        }
		        return collection;
		      };
		    }

		    /**
		     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
		     *
		     * @private
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Function} Returns the new base function.
		     */
		    function createBaseFor(fromRight) {
		      return function(object, iteratee, keysFunc) {
		        var index = -1,
		            iterable = Object(object),
		            props = keysFunc(object),
		            length = props.length;

		        while (length--) {
		          var key = props[fromRight ? length : ++index];
		          if (iteratee(iterable[key], key, iterable) === false) {
		            break;
		          }
		        }
		        return object;
		      };
		    }

		    /**
		     * Creates a function that wraps `func` to invoke it with the optional `this`
		     * binding of `thisArg`.
		     *
		     * @private
		     * @param {Function} func The function to wrap.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @param {*} [thisArg] The `this` binding of `func`.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createBind(func, bitmask, thisArg) {
		      var isBind = bitmask & WRAP_BIND_FLAG,
		          Ctor = createCtor(func);

		      function wrapper() {
		        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
		        return fn.apply(isBind ? thisArg : this, arguments);
		      }
		      return wrapper;
		    }

		    /**
		     * Creates a function like `_.lowerFirst`.
		     *
		     * @private
		     * @param {string} methodName The name of the `String` case method to use.
		     * @returns {Function} Returns the new case function.
		     */
		    function createCaseFirst(methodName) {
		      return function(string) {
		        string = toString(string);

		        var strSymbols = hasUnicode(string)
		          ? stringToArray(string)
		          : undefined$1;

		        var chr = strSymbols
		          ? strSymbols[0]
		          : string.charAt(0);

		        var trailing = strSymbols
		          ? castSlice(strSymbols, 1).join('')
		          : string.slice(1);

		        return chr[methodName]() + trailing;
		      };
		    }

		    /**
		     * Creates a function like `_.camelCase`.
		     *
		     * @private
		     * @param {Function} callback The function to combine each word.
		     * @returns {Function} Returns the new compounder function.
		     */
		    function createCompounder(callback) {
		      return function(string) {
		        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
		      };
		    }

		    /**
		     * Creates a function that produces an instance of `Ctor` regardless of
		     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
		     *
		     * @private
		     * @param {Function} Ctor The constructor to wrap.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createCtor(Ctor) {
		      return function() {
		        // Use a `switch` statement to work with class constructors. See
		        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
		        // for more details.
		        var args = arguments;
		        switch (args.length) {
		          case 0: return new Ctor;
		          case 1: return new Ctor(args[0]);
		          case 2: return new Ctor(args[0], args[1]);
		          case 3: return new Ctor(args[0], args[1], args[2]);
		          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
		          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
		          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
		          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
		        }
		        var thisBinding = baseCreate(Ctor.prototype),
		            result = Ctor.apply(thisBinding, args);

		        // Mimic the constructor's `return` behavior.
		        // See https://es5.github.io/#x13.2.2 for more details.
		        return isObject(result) ? result : thisBinding;
		      };
		    }

		    /**
		     * Creates a function that wraps `func` to enable currying.
		     *
		     * @private
		     * @param {Function} func The function to wrap.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @param {number} arity The arity of `func`.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createCurry(func, bitmask, arity) {
		      var Ctor = createCtor(func);

		      function wrapper() {
		        var length = arguments.length,
		            args = Array(length),
		            index = length,
		            placeholder = getHolder(wrapper);

		        while (index--) {
		          args[index] = arguments[index];
		        }
		        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
		          ? []
		          : replaceHolders(args, placeholder);

		        length -= holders.length;
		        if (length < arity) {
		          return createRecurry(
		            func, bitmask, createHybrid, wrapper.placeholder, undefined$1,
		            args, holders, undefined$1, undefined$1, arity - length);
		        }
		        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
		        return apply(fn, this, args);
		      }
		      return wrapper;
		    }

		    /**
		     * Creates a `_.find` or `_.findLast` function.
		     *
		     * @private
		     * @param {Function} findIndexFunc The function to find the collection index.
		     * @returns {Function} Returns the new find function.
		     */
		    function createFind(findIndexFunc) {
		      return function(collection, predicate, fromIndex) {
		        var iterable = Object(collection);
		        if (!isArrayLike(collection)) {
		          var iteratee = getIteratee(predicate, 3);
		          collection = keys(collection);
		          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
		        }
		        var index = findIndexFunc(collection, predicate, fromIndex);
		        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined$1;
		      };
		    }

		    /**
		     * Creates a `_.flow` or `_.flowRight` function.
		     *
		     * @private
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Function} Returns the new flow function.
		     */
		    function createFlow(fromRight) {
		      return flatRest(function(funcs) {
		        var length = funcs.length,
		            index = length,
		            prereq = LodashWrapper.prototype.thru;

		        if (fromRight) {
		          funcs.reverse();
		        }
		        while (index--) {
		          var func = funcs[index];
		          if (typeof func != 'function') {
		            throw new TypeError(FUNC_ERROR_TEXT);
		          }
		          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
		            var wrapper = new LodashWrapper([], true);
		          }
		        }
		        index = wrapper ? index : length;
		        while (++index < length) {
		          func = funcs[index];

		          var funcName = getFuncName(func),
		              data = funcName == 'wrapper' ? getData(func) : undefined$1;

		          if (data && isLaziable(data[0]) &&
		                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
		                !data[4].length && data[9] == 1
		              ) {
		            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
		          } else {
		            wrapper = (func.length == 1 && isLaziable(func))
		              ? wrapper[funcName]()
		              : wrapper.thru(func);
		          }
		        }
		        return function() {
		          var args = arguments,
		              value = args[0];

		          if (wrapper && args.length == 1 && isArray(value)) {
		            return wrapper.plant(value).value();
		          }
		          var index = 0,
		              result = length ? funcs[index].apply(this, args) : value;

		          while (++index < length) {
		            result = funcs[index].call(this, result);
		          }
		          return result;
		        };
		      });
		    }

		    /**
		     * Creates a function that wraps `func` to invoke it with optional `this`
		     * binding of `thisArg`, partial application, and currying.
		     *
		     * @private
		     * @param {Function|string} func The function or method name to wrap.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @param {*} [thisArg] The `this` binding of `func`.
		     * @param {Array} [partials] The arguments to prepend to those provided to
		     *  the new function.
		     * @param {Array} [holders] The `partials` placeholder indexes.
		     * @param {Array} [partialsRight] The arguments to append to those provided
		     *  to the new function.
		     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
		     * @param {Array} [argPos] The argument positions of the new function.
		     * @param {number} [ary] The arity cap of `func`.
		     * @param {number} [arity] The arity of `func`.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
		      var isAry = bitmask & WRAP_ARY_FLAG,
		          isBind = bitmask & WRAP_BIND_FLAG,
		          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
		          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
		          isFlip = bitmask & WRAP_FLIP_FLAG,
		          Ctor = isBindKey ? undefined$1 : createCtor(func);

		      function wrapper() {
		        var length = arguments.length,
		            args = Array(length),
		            index = length;

		        while (index--) {
		          args[index] = arguments[index];
		        }
		        if (isCurried) {
		          var placeholder = getHolder(wrapper),
		              holdersCount = countHolders(args, placeholder);
		        }
		        if (partials) {
		          args = composeArgs(args, partials, holders, isCurried);
		        }
		        if (partialsRight) {
		          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
		        }
		        length -= holdersCount;
		        if (isCurried && length < arity) {
		          var newHolders = replaceHolders(args, placeholder);
		          return createRecurry(
		            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
		            args, newHolders, argPos, ary, arity - length
		          );
		        }
		        var thisBinding = isBind ? thisArg : this,
		            fn = isBindKey ? thisBinding[func] : func;

		        length = args.length;
		        if (argPos) {
		          args = reorder(args, argPos);
		        } else if (isFlip && length > 1) {
		          args.reverse();
		        }
		        if (isAry && ary < length) {
		          args.length = ary;
		        }
		        if (this && this !== root && this instanceof wrapper) {
		          fn = Ctor || createCtor(fn);
		        }
		        return fn.apply(thisBinding, args);
		      }
		      return wrapper;
		    }

		    /**
		     * Creates a function like `_.invertBy`.
		     *
		     * @private
		     * @param {Function} setter The function to set accumulator values.
		     * @param {Function} toIteratee The function to resolve iteratees.
		     * @returns {Function} Returns the new inverter function.
		     */
		    function createInverter(setter, toIteratee) {
		      return function(object, iteratee) {
		        return baseInverter(object, setter, toIteratee(iteratee), {});
		      };
		    }

		    /**
		     * Creates a function that performs a mathematical operation on two values.
		     *
		     * @private
		     * @param {Function} operator The function to perform the operation.
		     * @param {number} [defaultValue] The value used for `undefined` arguments.
		     * @returns {Function} Returns the new mathematical operation function.
		     */
		    function createMathOperation(operator, defaultValue) {
		      return function(value, other) {
		        var result;
		        if (value === undefined$1 && other === undefined$1) {
		          return defaultValue;
		        }
		        if (value !== undefined$1) {
		          result = value;
		        }
		        if (other !== undefined$1) {
		          if (result === undefined$1) {
		            return other;
		          }
		          if (typeof value == 'string' || typeof other == 'string') {
		            value = baseToString(value);
		            other = baseToString(other);
		          } else {
		            value = baseToNumber(value);
		            other = baseToNumber(other);
		          }
		          result = operator(value, other);
		        }
		        return result;
		      };
		    }

		    /**
		     * Creates a function like `_.over`.
		     *
		     * @private
		     * @param {Function} arrayFunc The function to iterate over iteratees.
		     * @returns {Function} Returns the new over function.
		     */
		    function createOver(arrayFunc) {
		      return flatRest(function(iteratees) {
		        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
		        return baseRest(function(args) {
		          var thisArg = this;
		          return arrayFunc(iteratees, function(iteratee) {
		            return apply(iteratee, thisArg, args);
		          });
		        });
		      });
		    }

		    /**
		     * Creates the padding for `string` based on `length`. The `chars` string
		     * is truncated if the number of characters exceeds `length`.
		     *
		     * @private
		     * @param {number} length The padding length.
		     * @param {string} [chars=' '] The string used as padding.
		     * @returns {string} Returns the padding for `string`.
		     */
		    function createPadding(length, chars) {
		      chars = chars === undefined$1 ? ' ' : baseToString(chars);

		      var charsLength = chars.length;
		      if (charsLength < 2) {
		        return charsLength ? baseRepeat(chars, length) : chars;
		      }
		      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
		      return hasUnicode(chars)
		        ? castSlice(stringToArray(result), 0, length).join('')
		        : result.slice(0, length);
		    }

		    /**
		     * Creates a function that wraps `func` to invoke it with the `this` binding
		     * of `thisArg` and `partials` prepended to the arguments it receives.
		     *
		     * @private
		     * @param {Function} func The function to wrap.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @param {*} thisArg The `this` binding of `func`.
		     * @param {Array} partials The arguments to prepend to those provided to
		     *  the new function.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createPartial(func, bitmask, thisArg, partials) {
		      var isBind = bitmask & WRAP_BIND_FLAG,
		          Ctor = createCtor(func);

		      function wrapper() {
		        var argsIndex = -1,
		            argsLength = arguments.length,
		            leftIndex = -1,
		            leftLength = partials.length,
		            args = Array(leftLength + argsLength),
		            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

		        while (++leftIndex < leftLength) {
		          args[leftIndex] = partials[leftIndex];
		        }
		        while (argsLength--) {
		          args[leftIndex++] = arguments[++argsIndex];
		        }
		        return apply(fn, isBind ? thisArg : this, args);
		      }
		      return wrapper;
		    }

		    /**
		     * Creates a `_.range` or `_.rangeRight` function.
		     *
		     * @private
		     * @param {boolean} [fromRight] Specify iterating from right to left.
		     * @returns {Function} Returns the new range function.
		     */
		    function createRange(fromRight) {
		      return function(start, end, step) {
		        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
		          end = step = undefined$1;
		        }
		        // Ensure the sign of `-0` is preserved.
		        start = toFinite(start);
		        if (end === undefined$1) {
		          end = start;
		          start = 0;
		        } else {
		          end = toFinite(end);
		        }
		        step = step === undefined$1 ? (start < end ? 1 : -1) : toFinite(step);
		        return baseRange(start, end, step, fromRight);
		      };
		    }

		    /**
		     * Creates a function that performs a relational operation on two values.
		     *
		     * @private
		     * @param {Function} operator The function to perform the operation.
		     * @returns {Function} Returns the new relational operation function.
		     */
		    function createRelationalOperation(operator) {
		      return function(value, other) {
		        if (!(typeof value == 'string' && typeof other == 'string')) {
		          value = toNumber(value);
		          other = toNumber(other);
		        }
		        return operator(value, other);
		      };
		    }

		    /**
		     * Creates a function that wraps `func` to continue currying.
		     *
		     * @private
		     * @param {Function} func The function to wrap.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @param {Function} wrapFunc The function to create the `func` wrapper.
		     * @param {*} placeholder The placeholder value.
		     * @param {*} [thisArg] The `this` binding of `func`.
		     * @param {Array} [partials] The arguments to prepend to those provided to
		     *  the new function.
		     * @param {Array} [holders] The `partials` placeholder indexes.
		     * @param {Array} [argPos] The argument positions of the new function.
		     * @param {number} [ary] The arity cap of `func`.
		     * @param {number} [arity] The arity of `func`.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
		      var isCurry = bitmask & WRAP_CURRY_FLAG,
		          newHolders = isCurry ? holders : undefined$1,
		          newHoldersRight = isCurry ? undefined$1 : holders,
		          newPartials = isCurry ? partials : undefined$1,
		          newPartialsRight = isCurry ? undefined$1 : partials;

		      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
		      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

		      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
		        bitmask &= -4;
		      }
		      var newData = [
		        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
		        newHoldersRight, argPos, ary, arity
		      ];

		      var result = wrapFunc.apply(undefined$1, newData);
		      if (isLaziable(func)) {
		        setData(result, newData);
		      }
		      result.placeholder = placeholder;
		      return setWrapToString(result, func, bitmask);
		    }

		    /**
		     * Creates a function like `_.round`.
		     *
		     * @private
		     * @param {string} methodName The name of the `Math` method to use when rounding.
		     * @returns {Function} Returns the new round function.
		     */
		    function createRound(methodName) {
		      var func = Math[methodName];
		      return function(number, precision) {
		        number = toNumber(number);
		        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
		        if (precision && nativeIsFinite(number)) {
		          // Shift with exponential notation to avoid floating-point issues.
		          // See [MDN](https://mdn.io/round#Examples) for more details.
		          var pair = (toString(number) + 'e').split('e'),
		              value = func(pair[0] + 'e' + (+pair[1] + precision));

		          pair = (toString(value) + 'e').split('e');
		          return +(pair[0] + 'e' + (+pair[1] - precision));
		        }
		        return func(number);
		      };
		    }

		    /**
		     * Creates a set object of `values`.
		     *
		     * @private
		     * @param {Array} values The values to add to the set.
		     * @returns {Object} Returns the new set.
		     */
		    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
		      return new Set(values);
		    };

		    /**
		     * Creates a `_.toPairs` or `_.toPairsIn` function.
		     *
		     * @private
		     * @param {Function} keysFunc The function to get the keys of a given object.
		     * @returns {Function} Returns the new pairs function.
		     */
		    function createToPairs(keysFunc) {
		      return function(object) {
		        var tag = getTag(object);
		        if (tag == mapTag) {
		          return mapToArray(object);
		        }
		        if (tag == setTag) {
		          return setToPairs(object);
		        }
		        return baseToPairs(object, keysFunc(object));
		      };
		    }

		    /**
		     * Creates a function that either curries or invokes `func` with optional
		     * `this` binding and partially applied arguments.
		     *
		     * @private
		     * @param {Function|string} func The function or method name to wrap.
		     * @param {number} bitmask The bitmask flags.
		     *    1 - `_.bind`
		     *    2 - `_.bindKey`
		     *    4 - `_.curry` or `_.curryRight` of a bound function
		     *    8 - `_.curry`
		     *   16 - `_.curryRight`
		     *   32 - `_.partial`
		     *   64 - `_.partialRight`
		     *  128 - `_.rearg`
		     *  256 - `_.ary`
		     *  512 - `_.flip`
		     * @param {*} [thisArg] The `this` binding of `func`.
		     * @param {Array} [partials] The arguments to be partially applied.
		     * @param {Array} [holders] The `partials` placeholder indexes.
		     * @param {Array} [argPos] The argument positions of the new function.
		     * @param {number} [ary] The arity cap of `func`.
		     * @param {number} [arity] The arity of `func`.
		     * @returns {Function} Returns the new wrapped function.
		     */
		    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
		      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
		      if (!isBindKey && typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      var length = partials ? partials.length : 0;
		      if (!length) {
		        bitmask &= -97;
		        partials = holders = undefined$1;
		      }
		      ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
		      arity = arity === undefined$1 ? arity : toInteger(arity);
		      length -= holders ? holders.length : 0;

		      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
		        var partialsRight = partials,
		            holdersRight = holders;

		        partials = holders = undefined$1;
		      }
		      var data = isBindKey ? undefined$1 : getData(func);

		      var newData = [
		        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
		        argPos, ary, arity
		      ];

		      if (data) {
		        mergeData(newData, data);
		      }
		      func = newData[0];
		      bitmask = newData[1];
		      thisArg = newData[2];
		      partials = newData[3];
		      holders = newData[4];
		      arity = newData[9] = newData[9] === undefined$1
		        ? (isBindKey ? 0 : func.length)
		        : nativeMax(newData[9] - length, 0);

		      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
		        bitmask &= -25;
		      }
		      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
		        var result = createBind(func, bitmask, thisArg);
		      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
		        result = createCurry(func, bitmask, arity);
		      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
		        result = createPartial(func, bitmask, thisArg, partials);
		      } else {
		        result = createHybrid.apply(undefined$1, newData);
		      }
		      var setter = data ? baseSetData : setData;
		      return setWrapToString(setter(result, newData), func, bitmask);
		    }

		    /**
		     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
		     * of source objects to the destination object for all destination properties
		     * that resolve to `undefined`.
		     *
		     * @private
		     * @param {*} objValue The destination value.
		     * @param {*} srcValue The source value.
		     * @param {string} key The key of the property to assign.
		     * @param {Object} object The parent object of `objValue`.
		     * @returns {*} Returns the value to assign.
		     */
		    function customDefaultsAssignIn(objValue, srcValue, key, object) {
		      if (objValue === undefined$1 ||
		          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
		        return srcValue;
		      }
		      return objValue;
		    }

		    /**
		     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
		     * objects into destination objects that are passed thru.
		     *
		     * @private
		     * @param {*} objValue The destination value.
		     * @param {*} srcValue The source value.
		     * @param {string} key The key of the property to merge.
		     * @param {Object} object The parent object of `objValue`.
		     * @param {Object} source The parent object of `srcValue`.
		     * @param {Object} [stack] Tracks traversed source values and their merged
		     *  counterparts.
		     * @returns {*} Returns the value to assign.
		     */
		    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
		      if (isObject(objValue) && isObject(srcValue)) {
		        // Recursively merge objects and arrays (susceptible to call stack limits).
		        stack.set(srcValue, objValue);
		        baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
		        stack['delete'](srcValue);
		      }
		      return objValue;
		    }

		    /**
		     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
		     * objects.
		     *
		     * @private
		     * @param {*} value The value to inspect.
		     * @param {string} key The key of the property to inspect.
		     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
		     */
		    function customOmitClone(value) {
		      return isPlainObject(value) ? undefined$1 : value;
		    }

		    /**
		     * A specialized version of `baseIsEqualDeep` for arrays with support for
		     * partial deep comparisons.
		     *
		     * @private
		     * @param {Array} array The array to compare.
		     * @param {Array} other The other array to compare.
		     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
		     * @param {Function} customizer The function to customize comparisons.
		     * @param {Function} equalFunc The function to determine equivalents of values.
		     * @param {Object} stack Tracks traversed `array` and `other` objects.
		     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
		     */
		    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
		      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
		          arrLength = array.length,
		          othLength = other.length;

		      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
		        return false;
		      }
		      // Check that cyclic values are equal.
		      var arrStacked = stack.get(array);
		      var othStacked = stack.get(other);
		      if (arrStacked && othStacked) {
		        return arrStacked == other && othStacked == array;
		      }
		      var index = -1,
		          result = true,
		          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined$1;

		      stack.set(array, other);
		      stack.set(other, array);

		      // Ignore non-index properties.
		      while (++index < arrLength) {
		        var arrValue = array[index],
		            othValue = other[index];

		        if (customizer) {
		          var compared = isPartial
		            ? customizer(othValue, arrValue, index, other, array, stack)
		            : customizer(arrValue, othValue, index, array, other, stack);
		        }
		        if (compared !== undefined$1) {
		          if (compared) {
		            continue;
		          }
		          result = false;
		          break;
		        }
		        // Recursively compare arrays (susceptible to call stack limits).
		        if (seen) {
		          if (!arraySome(other, function(othValue, othIndex) {
		                if (!cacheHas(seen, othIndex) &&
		                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
		                  return seen.push(othIndex);
		                }
		              })) {
		            result = false;
		            break;
		          }
		        } else if (!(
		              arrValue === othValue ||
		                equalFunc(arrValue, othValue, bitmask, customizer, stack)
		            )) {
		          result = false;
		          break;
		        }
		      }
		      stack['delete'](array);
		      stack['delete'](other);
		      return result;
		    }

		    /**
		     * A specialized version of `baseIsEqualDeep` for comparing objects of
		     * the same `toStringTag`.
		     *
		     * **Note:** This function only supports comparing values with tags of
		     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
		     *
		     * @private
		     * @param {Object} object The object to compare.
		     * @param {Object} other The other object to compare.
		     * @param {string} tag The `toStringTag` of the objects to compare.
		     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
		     * @param {Function} customizer The function to customize comparisons.
		     * @param {Function} equalFunc The function to determine equivalents of values.
		     * @param {Object} stack Tracks traversed `object` and `other` objects.
		     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
		     */
		    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
		      switch (tag) {
		        case dataViewTag:
		          if ((object.byteLength != other.byteLength) ||
		              (object.byteOffset != other.byteOffset)) {
		            return false;
		          }
		          object = object.buffer;
		          other = other.buffer;

		        case arrayBufferTag:
		          if ((object.byteLength != other.byteLength) ||
		              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
		            return false;
		          }
		          return true;

		        case boolTag:
		        case dateTag:
		        case numberTag:
		          // Coerce booleans to `1` or `0` and dates to milliseconds.
		          // Invalid dates are coerced to `NaN`.
		          return eq(+object, +other);

		        case errorTag:
		          return object.name == other.name && object.message == other.message;

		        case regexpTag:
		        case stringTag:
		          // Coerce regexes to strings and treat strings, primitives and objects,
		          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
		          // for more details.
		          return object == (other + '');

		        case mapTag:
		          var convert = mapToArray;

		        case setTag:
		          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
		          convert || (convert = setToArray);

		          if (object.size != other.size && !isPartial) {
		            return false;
		          }
		          // Assume cyclic values are equal.
		          var stacked = stack.get(object);
		          if (stacked) {
		            return stacked == other;
		          }
		          bitmask |= COMPARE_UNORDERED_FLAG;

		          // Recursively compare objects (susceptible to call stack limits).
		          stack.set(object, other);
		          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
		          stack['delete'](object);
		          return result;

		        case symbolTag:
		          if (symbolValueOf) {
		            return symbolValueOf.call(object) == symbolValueOf.call(other);
		          }
		      }
		      return false;
		    }

		    /**
		     * A specialized version of `baseIsEqualDeep` for objects with support for
		     * partial deep comparisons.
		     *
		     * @private
		     * @param {Object} object The object to compare.
		     * @param {Object} other The other object to compare.
		     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
		     * @param {Function} customizer The function to customize comparisons.
		     * @param {Function} equalFunc The function to determine equivalents of values.
		     * @param {Object} stack Tracks traversed `object` and `other` objects.
		     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
		     */
		    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
		      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
		          objProps = getAllKeys(object),
		          objLength = objProps.length,
		          othProps = getAllKeys(other),
		          othLength = othProps.length;

		      if (objLength != othLength && !isPartial) {
		        return false;
		      }
		      var index = objLength;
		      while (index--) {
		        var key = objProps[index];
		        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
		          return false;
		        }
		      }
		      // Check that cyclic values are equal.
		      var objStacked = stack.get(object);
		      var othStacked = stack.get(other);
		      if (objStacked && othStacked) {
		        return objStacked == other && othStacked == object;
		      }
		      var result = true;
		      stack.set(object, other);
		      stack.set(other, object);

		      var skipCtor = isPartial;
		      while (++index < objLength) {
		        key = objProps[index];
		        var objValue = object[key],
		            othValue = other[key];

		        if (customizer) {
		          var compared = isPartial
		            ? customizer(othValue, objValue, key, other, object, stack)
		            : customizer(objValue, othValue, key, object, other, stack);
		        }
		        // Recursively compare objects (susceptible to call stack limits).
		        if (!(compared === undefined$1
		              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
		              : compared
		            )) {
		          result = false;
		          break;
		        }
		        skipCtor || (skipCtor = key == 'constructor');
		      }
		      if (result && !skipCtor) {
		        var objCtor = object.constructor,
		            othCtor = other.constructor;

		        // Non `Object` object instances with different constructors are not equal.
		        if (objCtor != othCtor &&
		            ('constructor' in object && 'constructor' in other) &&
		            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
		              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
		          result = false;
		        }
		      }
		      stack['delete'](object);
		      stack['delete'](other);
		      return result;
		    }

		    /**
		     * A specialized version of `baseRest` which flattens the rest array.
		     *
		     * @private
		     * @param {Function} func The function to apply a rest parameter to.
		     * @returns {Function} Returns the new function.
		     */
		    function flatRest(func) {
		      return setToString(overRest(func, undefined$1, flatten), func + '');
		    }

		    /**
		     * Creates an array of own enumerable property names and symbols of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names and symbols.
		     */
		    function getAllKeys(object) {
		      return baseGetAllKeys(object, keys, getSymbols);
		    }

		    /**
		     * Creates an array of own and inherited enumerable property names and
		     * symbols of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names and symbols.
		     */
		    function getAllKeysIn(object) {
		      return baseGetAllKeys(object, keysIn, getSymbolsIn);
		    }

		    /**
		     * Gets metadata for `func`.
		     *
		     * @private
		     * @param {Function} func The function to query.
		     * @returns {*} Returns the metadata for `func`.
		     */
		    var getData = !metaMap ? noop : function(func) {
		      return metaMap.get(func);
		    };

		    /**
		     * Gets the name of `func`.
		     *
		     * @private
		     * @param {Function} func The function to query.
		     * @returns {string} Returns the function name.
		     */
		    function getFuncName(func) {
		      var result = (func.name + ''),
		          array = realNames[result],
		          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

		      while (length--) {
		        var data = array[length],
		            otherFunc = data.func;
		        if (otherFunc == null || otherFunc == func) {
		          return data.name;
		        }
		      }
		      return result;
		    }

		    /**
		     * Gets the argument placeholder value for `func`.
		     *
		     * @private
		     * @param {Function} func The function to inspect.
		     * @returns {*} Returns the placeholder value.
		     */
		    function getHolder(func) {
		      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
		      return object.placeholder;
		    }

		    /**
		     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
		     * this function returns the custom method, otherwise it returns `baseIteratee`.
		     * If arguments are provided, the chosen function is invoked with them and
		     * its result is returned.
		     *
		     * @private
		     * @param {*} [value] The value to convert to an iteratee.
		     * @param {number} [arity] The arity of the created iteratee.
		     * @returns {Function} Returns the chosen function or its result.
		     */
		    function getIteratee() {
		      var result = lodash.iteratee || iteratee;
		      result = result === iteratee ? baseIteratee : result;
		      return arguments.length ? result(arguments[0], arguments[1]) : result;
		    }

		    /**
		     * Gets the data for `map`.
		     *
		     * @private
		     * @param {Object} map The map to query.
		     * @param {string} key The reference key.
		     * @returns {*} Returns the map data.
		     */
		    function getMapData(map, key) {
		      var data = map.__data__;
		      return isKeyable(key)
		        ? data[typeof key == 'string' ? 'string' : 'hash']
		        : data.map;
		    }

		    /**
		     * Gets the property names, values, and compare flags of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the match data of `object`.
		     */
		    function getMatchData(object) {
		      var result = keys(object),
		          length = result.length;

		      while (length--) {
		        var key = result[length],
		            value = object[key];

		        result[length] = [key, value, isStrictComparable(value)];
		      }
		      return result;
		    }

		    /**
		     * Gets the native function at `key` of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {string} key The key of the method to get.
		     * @returns {*} Returns the function if it's native, else `undefined`.
		     */
		    function getNative(object, key) {
		      var value = getValue(object, key);
		      return baseIsNative(value) ? value : undefined$1;
		    }

		    /**
		     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
		     *
		     * @private
		     * @param {*} value The value to query.
		     * @returns {string} Returns the raw `toStringTag`.
		     */
		    function getRawTag(value) {
		      var isOwn = hasOwnProperty.call(value, symToStringTag),
		          tag = value[symToStringTag];

		      try {
		        value[symToStringTag] = undefined$1;
		        var unmasked = true;
		      } catch (e) {}

		      var result = nativeObjectToString.call(value);
		      if (unmasked) {
		        if (isOwn) {
		          value[symToStringTag] = tag;
		        } else {
		          delete value[symToStringTag];
		        }
		      }
		      return result;
		    }

		    /**
		     * Creates an array of the own enumerable symbols of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of symbols.
		     */
		    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
		      if (object == null) {
		        return [];
		      }
		      object = Object(object);
		      return arrayFilter(nativeGetSymbols(object), function(symbol) {
		        return propertyIsEnumerable.call(object, symbol);
		      });
		    };

		    /**
		     * Creates an array of the own and inherited enumerable symbols of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of symbols.
		     */
		    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
		      var result = [];
		      while (object) {
		        arrayPush(result, getSymbols(object));
		        object = getPrototype(object);
		      }
		      return result;
		    };

		    /**
		     * Gets the `toStringTag` of `value`.
		     *
		     * @private
		     * @param {*} value The value to query.
		     * @returns {string} Returns the `toStringTag`.
		     */
		    var getTag = baseGetTag;

		    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
		    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
		        (Map && getTag(new Map) != mapTag) ||
		        (Promise && getTag(Promise.resolve()) != promiseTag) ||
		        (Set && getTag(new Set) != setTag) ||
		        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
		      getTag = function(value) {
		        var result = baseGetTag(value),
		            Ctor = result == objectTag ? value.constructor : undefined$1,
		            ctorString = Ctor ? toSource(Ctor) : '';

		        if (ctorString) {
		          switch (ctorString) {
		            case dataViewCtorString: return dataViewTag;
		            case mapCtorString: return mapTag;
		            case promiseCtorString: return promiseTag;
		            case setCtorString: return setTag;
		            case weakMapCtorString: return weakMapTag;
		          }
		        }
		        return result;
		      };
		    }

		    /**
		     * Gets the view, applying any `transforms` to the `start` and `end` positions.
		     *
		     * @private
		     * @param {number} start The start of the view.
		     * @param {number} end The end of the view.
		     * @param {Array} transforms The transformations to apply to the view.
		     * @returns {Object} Returns an object containing the `start` and `end`
		     *  positions of the view.
		     */
		    function getView(start, end, transforms) {
		      var index = -1,
		          length = transforms.length;

		      while (++index < length) {
		        var data = transforms[index],
		            size = data.size;

		        switch (data.type) {
		          case 'drop':      start += size; break;
		          case 'dropRight': end -= size; break;
		          case 'take':      end = nativeMin(end, start + size); break;
		          case 'takeRight': start = nativeMax(start, end - size); break;
		        }
		      }
		      return { 'start': start, 'end': end };
		    }

		    /**
		     * Extracts wrapper details from the `source` body comment.
		     *
		     * @private
		     * @param {string} source The source to inspect.
		     * @returns {Array} Returns the wrapper details.
		     */
		    function getWrapDetails(source) {
		      var match = source.match(reWrapDetails);
		      return match ? match[1].split(reSplitDetails) : [];
		    }

		    /**
		     * Checks if `path` exists on `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path to check.
		     * @param {Function} hasFunc The function to check properties.
		     * @returns {boolean} Returns `true` if `path` exists, else `false`.
		     */
		    function hasPath(object, path, hasFunc) {
		      path = castPath(path, object);

		      var index = -1,
		          length = path.length,
		          result = false;

		      while (++index < length) {
		        var key = toKey(path[index]);
		        if (!(result = object != null && hasFunc(object, key))) {
		          break;
		        }
		        object = object[key];
		      }
		      if (result || ++index != length) {
		        return result;
		      }
		      length = object == null ? 0 : object.length;
		      return !!length && isLength(length) && isIndex(key, length) &&
		        (isArray(object) || isArguments(object));
		    }

		    /**
		     * Initializes an array clone.
		     *
		     * @private
		     * @param {Array} array The array to clone.
		     * @returns {Array} Returns the initialized clone.
		     */
		    function initCloneArray(array) {
		      var length = array.length,
		          result = new array.constructor(length);

		      // Add properties assigned by `RegExp#exec`.
		      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
		        result.index = array.index;
		        result.input = array.input;
		      }
		      return result;
		    }

		    /**
		     * Initializes an object clone.
		     *
		     * @private
		     * @param {Object} object The object to clone.
		     * @returns {Object} Returns the initialized clone.
		     */
		    function initCloneObject(object) {
		      return (typeof object.constructor == 'function' && !isPrototype(object))
		        ? baseCreate(getPrototype(object))
		        : {};
		    }

		    /**
		     * Initializes an object clone based on its `toStringTag`.
		     *
		     * **Note:** This function only supports cloning values with tags of
		     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
		     *
		     * @private
		     * @param {Object} object The object to clone.
		     * @param {string} tag The `toStringTag` of the object to clone.
		     * @param {boolean} [isDeep] Specify a deep clone.
		     * @returns {Object} Returns the initialized clone.
		     */
		    function initCloneByTag(object, tag, isDeep) {
		      var Ctor = object.constructor;
		      switch (tag) {
		        case arrayBufferTag:
		          return cloneArrayBuffer(object);

		        case boolTag:
		        case dateTag:
		          return new Ctor(+object);

		        case dataViewTag:
		          return cloneDataView(object, isDeep);

		        case float32Tag: case float64Tag:
		        case int8Tag: case int16Tag: case int32Tag:
		        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
		          return cloneTypedArray(object, isDeep);

		        case mapTag:
		          return new Ctor;

		        case numberTag:
		        case stringTag:
		          return new Ctor(object);

		        case regexpTag:
		          return cloneRegExp(object);

		        case setTag:
		          return new Ctor;

		        case symbolTag:
		          return cloneSymbol(object);
		      }
		    }

		    /**
		     * Inserts wrapper `details` in a comment at the top of the `source` body.
		     *
		     * @private
		     * @param {string} source The source to modify.
		     * @returns {Array} details The details to insert.
		     * @returns {string} Returns the modified source.
		     */
		    function insertWrapDetails(source, details) {
		      var length = details.length;
		      if (!length) {
		        return source;
		      }
		      var lastIndex = length - 1;
		      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
		      details = details.join(length > 2 ? ', ' : ' ');
		      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
		    }

		    /**
		     * Checks if `value` is a flattenable `arguments` object or array.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
		     */
		    function isFlattenable(value) {
		      return isArray(value) || isArguments(value) ||
		        !!(spreadableSymbol && value && value[spreadableSymbol]);
		    }

		    /**
		     * Checks if `value` is a valid array-like index.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
		     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
		     */
		    function isIndex(value, length) {
		      var type = typeof value;
		      length = length == null ? MAX_SAFE_INTEGER : length;

		      return !!length &&
		        (type == 'number' ||
		          (type != 'symbol' && reIsUint.test(value))) &&
		            (value > -1 && value % 1 == 0 && value < length);
		    }

		    /**
		     * Checks if the given arguments are from an iteratee call.
		     *
		     * @private
		     * @param {*} value The potential iteratee value argument.
		     * @param {*} index The potential iteratee index or key argument.
		     * @param {*} object The potential iteratee object argument.
		     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
		     *  else `false`.
		     */
		    function isIterateeCall(value, index, object) {
		      if (!isObject(object)) {
		        return false;
		      }
		      var type = typeof index;
		      if (type == 'number'
		            ? (isArrayLike(object) && isIndex(index, object.length))
		            : (type == 'string' && index in object)
		          ) {
		        return eq(object[index], value);
		      }
		      return false;
		    }

		    /**
		     * Checks if `value` is a property name and not a property path.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @param {Object} [object] The object to query keys on.
		     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
		     */
		    function isKey(value, object) {
		      if (isArray(value)) {
		        return false;
		      }
		      var type = typeof value;
		      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
		          value == null || isSymbol(value)) {
		        return true;
		      }
		      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
		        (object != null && value in Object(object));
		    }

		    /**
		     * Checks if `value` is suitable for use as unique object key.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
		     */
		    function isKeyable(value) {
		      var type = typeof value;
		      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
		        ? (value !== '__proto__')
		        : (value === null);
		    }

		    /**
		     * Checks if `func` has a lazy counterpart.
		     *
		     * @private
		     * @param {Function} func The function to check.
		     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
		     *  else `false`.
		     */
		    function isLaziable(func) {
		      var funcName = getFuncName(func),
		          other = lodash[funcName];

		      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
		        return false;
		      }
		      if (func === other) {
		        return true;
		      }
		      var data = getData(other);
		      return !!data && func === data[0];
		    }

		    /**
		     * Checks if `func` has its source masked.
		     *
		     * @private
		     * @param {Function} func The function to check.
		     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
		     */
		    function isMasked(func) {
		      return !!maskSrcKey && (maskSrcKey in func);
		    }

		    /**
		     * Checks if `func` is capable of being masked.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
		     */
		    var isMaskable = coreJsData ? isFunction : stubFalse;

		    /**
		     * Checks if `value` is likely a prototype object.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
		     */
		    function isPrototype(value) {
		      var Ctor = value && value.constructor,
		          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

		      return value === proto;
		    }

		    /**
		     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
		     *
		     * @private
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` if suitable for strict
		     *  equality comparisons, else `false`.
		     */
		    function isStrictComparable(value) {
		      return value === value && !isObject(value);
		    }

		    /**
		     * A specialized version of `matchesProperty` for source values suitable
		     * for strict equality comparisons, i.e. `===`.
		     *
		     * @private
		     * @param {string} key The key of the property to get.
		     * @param {*} srcValue The value to match.
		     * @returns {Function} Returns the new spec function.
		     */
		    function matchesStrictComparable(key, srcValue) {
		      return function(object) {
		        if (object == null) {
		          return false;
		        }
		        return object[key] === srcValue &&
		          (srcValue !== undefined$1 || (key in Object(object)));
		      };
		    }

		    /**
		     * A specialized version of `_.memoize` which clears the memoized function's
		     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
		     *
		     * @private
		     * @param {Function} func The function to have its output memoized.
		     * @returns {Function} Returns the new memoized function.
		     */
		    function memoizeCapped(func) {
		      var result = memoize(func, function(key) {
		        if (cache.size === MAX_MEMOIZE_SIZE) {
		          cache.clear();
		        }
		        return key;
		      });

		      var cache = result.cache;
		      return result;
		    }

		    /**
		     * Merges the function metadata of `source` into `data`.
		     *
		     * Merging metadata reduces the number of wrappers used to invoke a function.
		     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
		     * may be applied regardless of execution order. Methods like `_.ary` and
		     * `_.rearg` modify function arguments, making the order in which they are
		     * executed important, preventing the merging of metadata. However, we make
		     * an exception for a safe combined case where curried functions have `_.ary`
		     * and or `_.rearg` applied.
		     *
		     * @private
		     * @param {Array} data The destination metadata.
		     * @param {Array} source The source metadata.
		     * @returns {Array} Returns `data`.
		     */
		    function mergeData(data, source) {
		      var bitmask = data[1],
		          srcBitmask = source[1],
		          newBitmask = bitmask | srcBitmask,
		          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

		      var isCombo =
		        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
		        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
		        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

		      // Exit early if metadata can't be merged.
		      if (!(isCommon || isCombo)) {
		        return data;
		      }
		      // Use source `thisArg` if available.
		      if (srcBitmask & WRAP_BIND_FLAG) {
		        data[2] = source[2];
		        // Set when currying a bound function.
		        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
		      }
		      // Compose partial arguments.
		      var value = source[3];
		      if (value) {
		        var partials = data[3];
		        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
		        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
		      }
		      // Compose partial right arguments.
		      value = source[5];
		      if (value) {
		        partials = data[5];
		        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
		        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
		      }
		      // Use source `argPos` if available.
		      value = source[7];
		      if (value) {
		        data[7] = value;
		      }
		      // Use source `ary` if it's smaller.
		      if (srcBitmask & WRAP_ARY_FLAG) {
		        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
		      }
		      // Use source `arity` if one is not provided.
		      if (data[9] == null) {
		        data[9] = source[9];
		      }
		      // Use source `func` and merge bitmasks.
		      data[0] = source[0];
		      data[1] = newBitmask;

		      return data;
		    }

		    /**
		     * This function is like
		     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
		     * except that it includes inherited enumerable properties.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names.
		     */
		    function nativeKeysIn(object) {
		      var result = [];
		      if (object != null) {
		        for (var key in Object(object)) {
		          result.push(key);
		        }
		      }
		      return result;
		    }

		    /**
		     * Converts `value` to a string using `Object.prototype.toString`.
		     *
		     * @private
		     * @param {*} value The value to convert.
		     * @returns {string} Returns the converted string.
		     */
		    function objectToString(value) {
		      return nativeObjectToString.call(value);
		    }

		    /**
		     * A specialized version of `baseRest` which transforms the rest array.
		     *
		     * @private
		     * @param {Function} func The function to apply a rest parameter to.
		     * @param {number} [start=func.length-1] The start position of the rest parameter.
		     * @param {Function} transform The rest array transform.
		     * @returns {Function} Returns the new function.
		     */
		    function overRest(func, start, transform) {
		      start = nativeMax(start === undefined$1 ? (func.length - 1) : start, 0);
		      return function() {
		        var args = arguments,
		            index = -1,
		            length = nativeMax(args.length - start, 0),
		            array = Array(length);

		        while (++index < length) {
		          array[index] = args[start + index];
		        }
		        index = -1;
		        var otherArgs = Array(start + 1);
		        while (++index < start) {
		          otherArgs[index] = args[index];
		        }
		        otherArgs[start] = transform(array);
		        return apply(func, this, otherArgs);
		      };
		    }

		    /**
		     * Gets the parent value at `path` of `object`.
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {Array} path The path to get the parent value of.
		     * @returns {*} Returns the parent value.
		     */
		    function parent(object, path) {
		      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
		    }

		    /**
		     * Reorder `array` according to the specified indexes where the element at
		     * the first index is assigned as the first element, the element at
		     * the second index is assigned as the second element, and so on.
		     *
		     * @private
		     * @param {Array} array The array to reorder.
		     * @param {Array} indexes The arranged array indexes.
		     * @returns {Array} Returns `array`.
		     */
		    function reorder(array, indexes) {
		      var arrLength = array.length,
		          length = nativeMin(indexes.length, arrLength),
		          oldArray = copyArray(array);

		      while (length--) {
		        var index = indexes[length];
		        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
		      }
		      return array;
		    }

		    /**
		     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
		     *
		     * @private
		     * @param {Object} object The object to query.
		     * @param {string} key The key of the property to get.
		     * @returns {*} Returns the property value.
		     */
		    function safeGet(object, key) {
		      if (key === 'constructor' && typeof object[key] === 'function') {
		        return;
		      }

		      if (key == '__proto__') {
		        return;
		      }

		      return object[key];
		    }

		    /**
		     * Sets metadata for `func`.
		     *
		     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
		     * period of time, it will trip its breaker and transition to an identity
		     * function to avoid garbage collection pauses in V8. See
		     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
		     * for more details.
		     *
		     * @private
		     * @param {Function} func The function to associate metadata with.
		     * @param {*} data The metadata.
		     * @returns {Function} Returns `func`.
		     */
		    var setData = shortOut(baseSetData);

		    /**
		     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
		     *
		     * @private
		     * @param {Function} func The function to delay.
		     * @param {number} wait The number of milliseconds to delay invocation.
		     * @returns {number|Object} Returns the timer id or timeout object.
		     */
		    var setTimeout = ctxSetTimeout || function(func, wait) {
		      return root.setTimeout(func, wait);
		    };

		    /**
		     * Sets the `toString` method of `func` to return `string`.
		     *
		     * @private
		     * @param {Function} func The function to modify.
		     * @param {Function} string The `toString` result.
		     * @returns {Function} Returns `func`.
		     */
		    var setToString = shortOut(baseSetToString);

		    /**
		     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
		     * with wrapper details in a comment at the top of the source body.
		     *
		     * @private
		     * @param {Function} wrapper The function to modify.
		     * @param {Function} reference The reference function.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @returns {Function} Returns `wrapper`.
		     */
		    function setWrapToString(wrapper, reference, bitmask) {
		      var source = (reference + '');
		      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
		    }

		    /**
		     * Creates a function that'll short out and invoke `identity` instead
		     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
		     * milliseconds.
		     *
		     * @private
		     * @param {Function} func The function to restrict.
		     * @returns {Function} Returns the new shortable function.
		     */
		    function shortOut(func) {
		      var count = 0,
		          lastCalled = 0;

		      return function() {
		        var stamp = nativeNow(),
		            remaining = HOT_SPAN - (stamp - lastCalled);

		        lastCalled = stamp;
		        if (remaining > 0) {
		          if (++count >= HOT_COUNT) {
		            return arguments[0];
		          }
		        } else {
		          count = 0;
		        }
		        return func.apply(undefined$1, arguments);
		      };
		    }

		    /**
		     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
		     *
		     * @private
		     * @param {Array} array The array to shuffle.
		     * @param {number} [size=array.length] The size of `array`.
		     * @returns {Array} Returns `array`.
		     */
		    function shuffleSelf(array, size) {
		      var index = -1,
		          length = array.length,
		          lastIndex = length - 1;

		      size = size === undefined$1 ? length : size;
		      while (++index < size) {
		        var rand = baseRandom(index, lastIndex),
		            value = array[rand];

		        array[rand] = array[index];
		        array[index] = value;
		      }
		      array.length = size;
		      return array;
		    }

		    /**
		     * Converts `string` to a property path array.
		     *
		     * @private
		     * @param {string} string The string to convert.
		     * @returns {Array} Returns the property path array.
		     */
		    var stringToPath = memoizeCapped(function(string) {
		      var result = [];
		      if (string.charCodeAt(0) === 46 /* . */) {
		        result.push('');
		      }
		      string.replace(rePropName, function(match, number, quote, subString) {
		        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
		      });
		      return result;
		    });

		    /**
		     * Converts `value` to a string key if it's not a string or symbol.
		     *
		     * @private
		     * @param {*} value The value to inspect.
		     * @returns {string|symbol} Returns the key.
		     */
		    function toKey(value) {
		      if (typeof value == 'string' || isSymbol(value)) {
		        return value;
		      }
		      var result = (value + '');
		      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
		    }

		    /**
		     * Converts `func` to its source code.
		     *
		     * @private
		     * @param {Function} func The function to convert.
		     * @returns {string} Returns the source code.
		     */
		    function toSource(func) {
		      if (func != null) {
		        try {
		          return funcToString.call(func);
		        } catch (e) {}
		        try {
		          return (func + '');
		        } catch (e) {}
		      }
		      return '';
		    }

		    /**
		     * Updates wrapper `details` based on `bitmask` flags.
		     *
		     * @private
		     * @returns {Array} details The details to modify.
		     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
		     * @returns {Array} Returns `details`.
		     */
		    function updateWrapDetails(details, bitmask) {
		      arrayEach(wrapFlags, function(pair) {
		        var value = '_.' + pair[0];
		        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
		          details.push(value);
		        }
		      });
		      return details.sort();
		    }

		    /**
		     * Creates a clone of `wrapper`.
		     *
		     * @private
		     * @param {Object} wrapper The wrapper to clone.
		     * @returns {Object} Returns the cloned wrapper.
		     */
		    function wrapperClone(wrapper) {
		      if (wrapper instanceof LazyWrapper) {
		        return wrapper.clone();
		      }
		      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
		      result.__actions__ = copyArray(wrapper.__actions__);
		      result.__index__  = wrapper.__index__;
		      result.__values__ = wrapper.__values__;
		      return result;
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates an array of elements split into groups the length of `size`.
		     * If `array` can't be split evenly, the final chunk will be the remaining
		     * elements.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to process.
		     * @param {number} [size=1] The length of each chunk
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the new array of chunks.
		     * @example
		     *
		     * _.chunk(['a', 'b', 'c', 'd'], 2);
		     * // => [['a', 'b'], ['c', 'd']]
		     *
		     * _.chunk(['a', 'b', 'c', 'd'], 3);
		     * // => [['a', 'b', 'c'], ['d']]
		     */
		    function chunk(array, size, guard) {
		      if ((guard ? isIterateeCall(array, size, guard) : size === undefined$1)) {
		        size = 1;
		      } else {
		        size = nativeMax(toInteger(size), 0);
		      }
		      var length = array == null ? 0 : array.length;
		      if (!length || size < 1) {
		        return [];
		      }
		      var index = 0,
		          resIndex = 0,
		          result = Array(nativeCeil(length / size));

		      while (index < length) {
		        result[resIndex++] = baseSlice(array, index, (index += size));
		      }
		      return result;
		    }

		    /**
		     * Creates an array with all falsey values removed. The values `false`, `null`,
		     * `0`, `""`, `undefined`, and `NaN` are falsey.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to compact.
		     * @returns {Array} Returns the new array of filtered values.
		     * @example
		     *
		     * _.compact([0, 1, false, 2, '', 3]);
		     * // => [1, 2, 3]
		     */
		    function compact(array) {
		      var index = -1,
		          length = array == null ? 0 : array.length,
		          resIndex = 0,
		          result = [];

		      while (++index < length) {
		        var value = array[index];
		        if (value) {
		          result[resIndex++] = value;
		        }
		      }
		      return result;
		    }

		    /**
		     * Creates a new array concatenating `array` with any additional arrays
		     * and/or values.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to concatenate.
		     * @param {...*} [values] The values to concatenate.
		     * @returns {Array} Returns the new concatenated array.
		     * @example
		     *
		     * var array = [1];
		     * var other = _.concat(array, 2, [3], [[4]]);
		     *
		     * console.log(other);
		     * // => [1, 2, 3, [4]]
		     *
		     * console.log(array);
		     * // => [1]
		     */
		    function concat() {
		      var length = arguments.length;
		      if (!length) {
		        return [];
		      }
		      var args = Array(length - 1),
		          array = arguments[0],
		          index = length;

		      while (index--) {
		        args[index - 1] = arguments[index];
		      }
		      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
		    }

		    /**
		     * Creates an array of `array` values not included in the other given arrays
		     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons. The order and references of result values are
		     * determined by the first array.
		     *
		     * **Note:** Unlike `_.pullAll`, this method returns a new array.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {...Array} [values] The values to exclude.
		     * @returns {Array} Returns the new array of filtered values.
		     * @see _.without, _.xor
		     * @example
		     *
		     * _.difference([2, 1], [2, 3]);
		     * // => [1]
		     */
		    var difference = baseRest(function(array, values) {
		      return isArrayLikeObject(array)
		        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
		        : [];
		    });

		    /**
		     * This method is like `_.difference` except that it accepts `iteratee` which
		     * is invoked for each element of `array` and `values` to generate the criterion
		     * by which they're compared. The order and references of result values are
		     * determined by the first array. The iteratee is invoked with one argument:
		     * (value).
		     *
		     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {...Array} [values] The values to exclude.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns the new array of filtered values.
		     * @example
		     *
		     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
		     * // => [1.2]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
		     * // => [{ 'x': 2 }]
		     */
		    var differenceBy = baseRest(function(array, values) {
		      var iteratee = last(values);
		      if (isArrayLikeObject(iteratee)) {
		        iteratee = undefined$1;
		      }
		      return isArrayLikeObject(array)
		        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
		        : [];
		    });

		    /**
		     * This method is like `_.difference` except that it accepts `comparator`
		     * which is invoked to compare elements of `array` to `values`. The order and
		     * references of result values are determined by the first array. The comparator
		     * is invoked with two arguments: (arrVal, othVal).
		     *
		     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {...Array} [values] The values to exclude.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of filtered values.
		     * @example
		     *
		     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
		     *
		     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
		     * // => [{ 'x': 2, 'y': 1 }]
		     */
		    var differenceWith = baseRest(function(array, values) {
		      var comparator = last(values);
		      if (isArrayLikeObject(comparator)) {
		        comparator = undefined$1;
		      }
		      return isArrayLikeObject(array)
		        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined$1, comparator)
		        : [];
		    });

		    /**
		     * Creates a slice of `array` with `n` elements dropped from the beginning.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.5.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {number} [n=1] The number of elements to drop.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.drop([1, 2, 3]);
		     * // => [2, 3]
		     *
		     * _.drop([1, 2, 3], 2);
		     * // => [3]
		     *
		     * _.drop([1, 2, 3], 5);
		     * // => []
		     *
		     * _.drop([1, 2, 3], 0);
		     * // => [1, 2, 3]
		     */
		    function drop(array, n, guard) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      n = (guard || n === undefined$1) ? 1 : toInteger(n);
		      return baseSlice(array, n < 0 ? 0 : n, length);
		    }

		    /**
		     * Creates a slice of `array` with `n` elements dropped from the end.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {number} [n=1] The number of elements to drop.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.dropRight([1, 2, 3]);
		     * // => [1, 2]
		     *
		     * _.dropRight([1, 2, 3], 2);
		     * // => [1]
		     *
		     * _.dropRight([1, 2, 3], 5);
		     * // => []
		     *
		     * _.dropRight([1, 2, 3], 0);
		     * // => [1, 2, 3]
		     */
		    function dropRight(array, n, guard) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      n = (guard || n === undefined$1) ? 1 : toInteger(n);
		      n = length - n;
		      return baseSlice(array, 0, n < 0 ? 0 : n);
		    }

		    /**
		     * Creates a slice of `array` excluding elements dropped from the end.
		     * Elements are dropped until `predicate` returns falsey. The predicate is
		     * invoked with three arguments: (value, index, array).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': true },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': false }
		     * ];
		     *
		     * _.dropRightWhile(users, function(o) { return !o.active; });
		     * // => objects for ['barney']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
		     * // => objects for ['barney', 'fred']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.dropRightWhile(users, ['active', false]);
		     * // => objects for ['barney']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.dropRightWhile(users, 'active');
		     * // => objects for ['barney', 'fred', 'pebbles']
		     */
		    function dropRightWhile(array, predicate) {
		      return (array && array.length)
		        ? baseWhile(array, getIteratee(predicate, 3), true, true)
		        : [];
		    }

		    /**
		     * Creates a slice of `array` excluding elements dropped from the beginning.
		     * Elements are dropped until `predicate` returns falsey. The predicate is
		     * invoked with three arguments: (value, index, array).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': false },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': true }
		     * ];
		     *
		     * _.dropWhile(users, function(o) { return !o.active; });
		     * // => objects for ['pebbles']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.dropWhile(users, { 'user': 'barney', 'active': false });
		     * // => objects for ['fred', 'pebbles']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.dropWhile(users, ['active', false]);
		     * // => objects for ['pebbles']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.dropWhile(users, 'active');
		     * // => objects for ['barney', 'fred', 'pebbles']
		     */
		    function dropWhile(array, predicate) {
		      return (array && array.length)
		        ? baseWhile(array, getIteratee(predicate, 3), true)
		        : [];
		    }

		    /**
		     * Fills elements of `array` with `value` from `start` up to, but not
		     * including, `end`.
		     *
		     * **Note:** This method mutates `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.2.0
		     * @category Array
		     * @param {Array} array The array to fill.
		     * @param {*} value The value to fill `array` with.
		     * @param {number} [start=0] The start position.
		     * @param {number} [end=array.length] The end position.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = [1, 2, 3];
		     *
		     * _.fill(array, 'a');
		     * console.log(array);
		     * // => ['a', 'a', 'a']
		     *
		     * _.fill(Array(3), 2);
		     * // => [2, 2, 2]
		     *
		     * _.fill([4, 6, 8, 10], '*', 1, 3);
		     * // => [4, '*', '*', 10]
		     */
		    function fill(array, value, start, end) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
		        start = 0;
		        end = length;
		      }
		      return baseFill(array, value, start, end);
		    }

		    /**
		     * This method is like `_.find` except that it returns the index of the first
		     * element `predicate` returns truthy for instead of the element itself.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param {number} [fromIndex=0] The index to search from.
		     * @returns {number} Returns the index of the found element, else `-1`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': false },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': true }
		     * ];
		     *
		     * _.findIndex(users, function(o) { return o.user == 'barney'; });
		     * // => 0
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.findIndex(users, { 'user': 'fred', 'active': false });
		     * // => 1
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.findIndex(users, ['active', false]);
		     * // => 0
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.findIndex(users, 'active');
		     * // => 2
		     */
		    function findIndex(array, predicate, fromIndex) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return -1;
		      }
		      var index = fromIndex == null ? 0 : toInteger(fromIndex);
		      if (index < 0) {
		        index = nativeMax(length + index, 0);
		      }
		      return baseFindIndex(array, getIteratee(predicate, 3), index);
		    }

		    /**
		     * This method is like `_.findIndex` except that it iterates over elements
		     * of `collection` from right to left.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param {number} [fromIndex=array.length-1] The index to search from.
		     * @returns {number} Returns the index of the found element, else `-1`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': true },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': false }
		     * ];
		     *
		     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
		     * // => 2
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
		     * // => 0
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.findLastIndex(users, ['active', false]);
		     * // => 2
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.findLastIndex(users, 'active');
		     * // => 0
		     */
		    function findLastIndex(array, predicate, fromIndex) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return -1;
		      }
		      var index = length - 1;
		      if (fromIndex !== undefined$1) {
		        index = toInteger(fromIndex);
		        index = fromIndex < 0
		          ? nativeMax(length + index, 0)
		          : nativeMin(index, length - 1);
		      }
		      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
		    }

		    /**
		     * Flattens `array` a single level deep.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to flatten.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * _.flatten([1, [2, [3, [4]], 5]]);
		     * // => [1, 2, [3, [4]], 5]
		     */
		    function flatten(array) {
		      var length = array == null ? 0 : array.length;
		      return length ? baseFlatten(array, 1) : [];
		    }

		    /**
		     * Recursively flattens `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to flatten.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * _.flattenDeep([1, [2, [3, [4]], 5]]);
		     * // => [1, 2, 3, 4, 5]
		     */
		    function flattenDeep(array) {
		      var length = array == null ? 0 : array.length;
		      return length ? baseFlatten(array, INFINITY) : [];
		    }

		    /**
		     * Recursively flatten `array` up to `depth` times.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.4.0
		     * @category Array
		     * @param {Array} array The array to flatten.
		     * @param {number} [depth=1] The maximum recursion depth.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * var array = [1, [2, [3, [4]], 5]];
		     *
		     * _.flattenDepth(array, 1);
		     * // => [1, 2, [3, [4]], 5]
		     *
		     * _.flattenDepth(array, 2);
		     * // => [1, 2, 3, [4], 5]
		     */
		    function flattenDepth(array, depth) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      depth = depth === undefined$1 ? 1 : toInteger(depth);
		      return baseFlatten(array, depth);
		    }

		    /**
		     * The inverse of `_.toPairs`; this method returns an object composed
		     * from key-value `pairs`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} pairs The key-value pairs.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * _.fromPairs([['a', 1], ['b', 2]]);
		     * // => { 'a': 1, 'b': 2 }
		     */
		    function fromPairs(pairs) {
		      var index = -1,
		          length = pairs == null ? 0 : pairs.length,
		          result = {};

		      while (++index < length) {
		        var pair = pairs[index];
		        result[pair[0]] = pair[1];
		      }
		      return result;
		    }

		    /**
		     * Gets the first element of `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @alias first
		     * @category Array
		     * @param {Array} array The array to query.
		     * @returns {*} Returns the first element of `array`.
		     * @example
		     *
		     * _.head([1, 2, 3]);
		     * // => 1
		     *
		     * _.head([]);
		     * // => undefined
		     */
		    function head(array) {
		      return (array && array.length) ? array[0] : undefined$1;
		    }

		    /**
		     * Gets the index at which the first occurrence of `value` is found in `array`
		     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons. If `fromIndex` is negative, it's used as the
		     * offset from the end of `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {*} value The value to search for.
		     * @param {number} [fromIndex=0] The index to search from.
		     * @returns {number} Returns the index of the matched value, else `-1`.
		     * @example
		     *
		     * _.indexOf([1, 2, 1, 2], 2);
		     * // => 1
		     *
		     * // Search from the `fromIndex`.
		     * _.indexOf([1, 2, 1, 2], 2, 2);
		     * // => 3
		     */
		    function indexOf(array, value, fromIndex) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return -1;
		      }
		      var index = fromIndex == null ? 0 : toInteger(fromIndex);
		      if (index < 0) {
		        index = nativeMax(length + index, 0);
		      }
		      return baseIndexOf(array, value, index);
		    }

		    /**
		     * Gets all but the last element of `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.initial([1, 2, 3]);
		     * // => [1, 2]
		     */
		    function initial(array) {
		      var length = array == null ? 0 : array.length;
		      return length ? baseSlice(array, 0, -1) : [];
		    }

		    /**
		     * Creates an array of unique values that are included in all given arrays
		     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons. The order and references of result values are
		     * determined by the first array.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @returns {Array} Returns the new array of intersecting values.
		     * @example
		     *
		     * _.intersection([2, 1], [2, 3]);
		     * // => [2]
		     */
		    var intersection = baseRest(function(arrays) {
		      var mapped = arrayMap(arrays, castArrayLikeObject);
		      return (mapped.length && mapped[0] === arrays[0])
		        ? baseIntersection(mapped)
		        : [];
		    });

		    /**
		     * This method is like `_.intersection` except that it accepts `iteratee`
		     * which is invoked for each element of each `arrays` to generate the criterion
		     * by which they're compared. The order and references of result values are
		     * determined by the first array. The iteratee is invoked with one argument:
		     * (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns the new array of intersecting values.
		     * @example
		     *
		     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
		     * // => [2.1]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
		     * // => [{ 'x': 1 }]
		     */
		    var intersectionBy = baseRest(function(arrays) {
		      var iteratee = last(arrays),
		          mapped = arrayMap(arrays, castArrayLikeObject);

		      if (iteratee === last(mapped)) {
		        iteratee = undefined$1;
		      } else {
		        mapped.pop();
		      }
		      return (mapped.length && mapped[0] === arrays[0])
		        ? baseIntersection(mapped, getIteratee(iteratee, 2))
		        : [];
		    });

		    /**
		     * This method is like `_.intersection` except that it accepts `comparator`
		     * which is invoked to compare elements of `arrays`. The order and references
		     * of result values are determined by the first array. The comparator is
		     * invoked with two arguments: (arrVal, othVal).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of intersecting values.
		     * @example
		     *
		     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
		     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
		     *
		     * _.intersectionWith(objects, others, _.isEqual);
		     * // => [{ 'x': 1, 'y': 2 }]
		     */
		    var intersectionWith = baseRest(function(arrays) {
		      var comparator = last(arrays),
		          mapped = arrayMap(arrays, castArrayLikeObject);

		      comparator = typeof comparator == 'function' ? comparator : undefined$1;
		      if (comparator) {
		        mapped.pop();
		      }
		      return (mapped.length && mapped[0] === arrays[0])
		        ? baseIntersection(mapped, undefined$1, comparator)
		        : [];
		    });

		    /**
		     * Converts all elements in `array` into a string separated by `separator`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to convert.
		     * @param {string} [separator=','] The element separator.
		     * @returns {string} Returns the joined string.
		     * @example
		     *
		     * _.join(['a', 'b', 'c'], '~');
		     * // => 'a~b~c'
		     */
		    function join(array, separator) {
		      return array == null ? '' : nativeJoin.call(array, separator);
		    }

		    /**
		     * Gets the last element of `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @returns {*} Returns the last element of `array`.
		     * @example
		     *
		     * _.last([1, 2, 3]);
		     * // => 3
		     */
		    function last(array) {
		      var length = array == null ? 0 : array.length;
		      return length ? array[length - 1] : undefined$1;
		    }

		    /**
		     * This method is like `_.indexOf` except that it iterates over elements of
		     * `array` from right to left.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {*} value The value to search for.
		     * @param {number} [fromIndex=array.length-1] The index to search from.
		     * @returns {number} Returns the index of the matched value, else `-1`.
		     * @example
		     *
		     * _.lastIndexOf([1, 2, 1, 2], 2);
		     * // => 3
		     *
		     * // Search from the `fromIndex`.
		     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
		     * // => 1
		     */
		    function lastIndexOf(array, value, fromIndex) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return -1;
		      }
		      var index = length;
		      if (fromIndex !== undefined$1) {
		        index = toInteger(fromIndex);
		        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
		      }
		      return value === value
		        ? strictLastIndexOf(array, value, index)
		        : baseFindIndex(array, baseIsNaN, index, true);
		    }

		    /**
		     * Gets the element at index `n` of `array`. If `n` is negative, the nth
		     * element from the end is returned.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.11.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {number} [n=0] The index of the element to return.
		     * @returns {*} Returns the nth element of `array`.
		     * @example
		     *
		     * var array = ['a', 'b', 'c', 'd'];
		     *
		     * _.nth(array, 1);
		     * // => 'b'
		     *
		     * _.nth(array, -2);
		     * // => 'c';
		     */
		    function nth(array, n) {
		      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined$1;
		    }

		    /**
		     * Removes all given values from `array` using
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons.
		     *
		     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
		     * to remove elements from an array by predicate.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {...*} [values] The values to remove.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
		     *
		     * _.pull(array, 'a', 'c');
		     * console.log(array);
		     * // => ['b', 'b']
		     */
		    var pull = baseRest(pullAll);

		    /**
		     * This method is like `_.pull` except that it accepts an array of values to remove.
		     *
		     * **Note:** Unlike `_.difference`, this method mutates `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {Array} values The values to remove.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
		     *
		     * _.pullAll(array, ['a', 'c']);
		     * console.log(array);
		     * // => ['b', 'b']
		     */
		    function pullAll(array, values) {
		      return (array && array.length && values && values.length)
		        ? basePullAll(array, values)
		        : array;
		    }

		    /**
		     * This method is like `_.pullAll` except that it accepts `iteratee` which is
		     * invoked for each element of `array` and `values` to generate the criterion
		     * by which they're compared. The iteratee is invoked with one argument: (value).
		     *
		     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {Array} values The values to remove.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
		     *
		     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
		     * console.log(array);
		     * // => [{ 'x': 2 }]
		     */
		    function pullAllBy(array, values, iteratee) {
		      return (array && array.length && values && values.length)
		        ? basePullAll(array, values, getIteratee(iteratee, 2))
		        : array;
		    }

		    /**
		     * This method is like `_.pullAll` except that it accepts `comparator` which
		     * is invoked to compare elements of `array` to `values`. The comparator is
		     * invoked with two arguments: (arrVal, othVal).
		     *
		     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.6.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {Array} values The values to remove.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
		     *
		     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
		     * console.log(array);
		     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
		     */
		    function pullAllWith(array, values, comparator) {
		      return (array && array.length && values && values.length)
		        ? basePullAll(array, values, undefined$1, comparator)
		        : array;
		    }

		    /**
		     * Removes elements from `array` corresponding to `indexes` and returns an
		     * array of removed elements.
		     *
		     * **Note:** Unlike `_.at`, this method mutates `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
		     * @returns {Array} Returns the new array of removed elements.
		     * @example
		     *
		     * var array = ['a', 'b', 'c', 'd'];
		     * var pulled = _.pullAt(array, [1, 3]);
		     *
		     * console.log(array);
		     * // => ['a', 'c']
		     *
		     * console.log(pulled);
		     * // => ['b', 'd']
		     */
		    var pullAt = flatRest(function(array, indexes) {
		      var length = array == null ? 0 : array.length,
		          result = baseAt(array, indexes);

		      basePullAt(array, arrayMap(indexes, function(index) {
		        return isIndex(index, length) ? +index : index;
		      }).sort(compareAscending));

		      return result;
		    });

		    /**
		     * Removes all elements from `array` that `predicate` returns truthy for
		     * and returns an array of the removed elements. The predicate is invoked
		     * with three arguments: (value, index, array).
		     *
		     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
		     * to pull elements from an array by value.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new array of removed elements.
		     * @example
		     *
		     * var array = [1, 2, 3, 4];
		     * var evens = _.remove(array, function(n) {
		     *   return n % 2 == 0;
		     * });
		     *
		     * console.log(array);
		     * // => [1, 3]
		     *
		     * console.log(evens);
		     * // => [2, 4]
		     */
		    function remove(array, predicate) {
		      var result = [];
		      if (!(array && array.length)) {
		        return result;
		      }
		      var index = -1,
		          indexes = [],
		          length = array.length;

		      predicate = getIteratee(predicate, 3);
		      while (++index < length) {
		        var value = array[index];
		        if (predicate(value, index, array)) {
		          result.push(value);
		          indexes.push(index);
		        }
		      }
		      basePullAt(array, indexes);
		      return result;
		    }

		    /**
		     * Reverses `array` so that the first element becomes the last, the second
		     * element becomes the second to last, and so on.
		     *
		     * **Note:** This method mutates `array` and is based on
		     * [`Array#reverse`](https://mdn.io/Array/reverse).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to modify.
		     * @returns {Array} Returns `array`.
		     * @example
		     *
		     * var array = [1, 2, 3];
		     *
		     * _.reverse(array);
		     * // => [3, 2, 1]
		     *
		     * console.log(array);
		     * // => [3, 2, 1]
		     */
		    function reverse(array) {
		      return array == null ? array : nativeReverse.call(array);
		    }

		    /**
		     * Creates a slice of `array` from `start` up to, but not including, `end`.
		     *
		     * **Note:** This method is used instead of
		     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
		     * returned.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to slice.
		     * @param {number} [start=0] The start position.
		     * @param {number} [end=array.length] The end position.
		     * @returns {Array} Returns the slice of `array`.
		     */
		    function slice(array, start, end) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
		        start = 0;
		        end = length;
		      }
		      else {
		        start = start == null ? 0 : toInteger(start);
		        end = end === undefined$1 ? length : toInteger(end);
		      }
		      return baseSlice(array, start, end);
		    }

		    /**
		     * Uses a binary search to determine the lowest index at which `value`
		     * should be inserted into `array` in order to maintain its sort order.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     * @example
		     *
		     * _.sortedIndex([30, 50], 40);
		     * // => 1
		     */
		    function sortedIndex(array, value) {
		      return baseSortedIndex(array, value);
		    }

		    /**
		     * This method is like `_.sortedIndex` except that it accepts `iteratee`
		     * which is invoked for `value` and each element of `array` to compute their
		     * sort ranking. The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     * @example
		     *
		     * var objects = [{ 'x': 4 }, { 'x': 5 }];
		     *
		     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
		     * // => 0
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
		     * // => 0
		     */
		    function sortedIndexBy(array, value, iteratee) {
		      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
		    }

		    /**
		     * This method is like `_.indexOf` except that it performs a binary
		     * search on a sorted `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {*} value The value to search for.
		     * @returns {number} Returns the index of the matched value, else `-1`.
		     * @example
		     *
		     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
		     * // => 1
		     */
		    function sortedIndexOf(array, value) {
		      var length = array == null ? 0 : array.length;
		      if (length) {
		        var index = baseSortedIndex(array, value);
		        if (index < length && eq(array[index], value)) {
		          return index;
		        }
		      }
		      return -1;
		    }

		    /**
		     * This method is like `_.sortedIndex` except that it returns the highest
		     * index at which `value` should be inserted into `array` in order to
		     * maintain its sort order.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     * @example
		     *
		     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
		     * // => 4
		     */
		    function sortedLastIndex(array, value) {
		      return baseSortedIndex(array, value, true);
		    }

		    /**
		     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
		     * which is invoked for `value` and each element of `array` to compute their
		     * sort ranking. The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The sorted array to inspect.
		     * @param {*} value The value to evaluate.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {number} Returns the index at which `value` should be inserted
		     *  into `array`.
		     * @example
		     *
		     * var objects = [{ 'x': 4 }, { 'x': 5 }];
		     *
		     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
		     * // => 1
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
		     * // => 1
		     */
		    function sortedLastIndexBy(array, value, iteratee) {
		      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
		    }

		    /**
		     * This method is like `_.lastIndexOf` except that it performs a binary
		     * search on a sorted `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {*} value The value to search for.
		     * @returns {number} Returns the index of the matched value, else `-1`.
		     * @example
		     *
		     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
		     * // => 3
		     */
		    function sortedLastIndexOf(array, value) {
		      var length = array == null ? 0 : array.length;
		      if (length) {
		        var index = baseSortedIndex(array, value, true) - 1;
		        if (eq(array[index], value)) {
		          return index;
		        }
		      }
		      return -1;
		    }

		    /**
		     * This method is like `_.uniq` except that it's designed and optimized
		     * for sorted arrays.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @returns {Array} Returns the new duplicate free array.
		     * @example
		     *
		     * _.sortedUniq([1, 1, 2]);
		     * // => [1, 2]
		     */
		    function sortedUniq(array) {
		      return (array && array.length)
		        ? baseSortedUniq(array)
		        : [];
		    }

		    /**
		     * This method is like `_.uniqBy` except that it's designed and optimized
		     * for sorted arrays.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {Function} [iteratee] The iteratee invoked per element.
		     * @returns {Array} Returns the new duplicate free array.
		     * @example
		     *
		     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
		     * // => [1.1, 2.3]
		     */
		    function sortedUniqBy(array, iteratee) {
		      return (array && array.length)
		        ? baseSortedUniq(array, getIteratee(iteratee, 2))
		        : [];
		    }

		    /**
		     * Gets all but the first element of `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.tail([1, 2, 3]);
		     * // => [2, 3]
		     */
		    function tail(array) {
		      var length = array == null ? 0 : array.length;
		      return length ? baseSlice(array, 1, length) : [];
		    }

		    /**
		     * Creates a slice of `array` with `n` elements taken from the beginning.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {number} [n=1] The number of elements to take.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.take([1, 2, 3]);
		     * // => [1]
		     *
		     * _.take([1, 2, 3], 2);
		     * // => [1, 2]
		     *
		     * _.take([1, 2, 3], 5);
		     * // => [1, 2, 3]
		     *
		     * _.take([1, 2, 3], 0);
		     * // => []
		     */
		    function take(array, n, guard) {
		      if (!(array && array.length)) {
		        return [];
		      }
		      n = (guard || n === undefined$1) ? 1 : toInteger(n);
		      return baseSlice(array, 0, n < 0 ? 0 : n);
		    }

		    /**
		     * Creates a slice of `array` with `n` elements taken from the end.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {number} [n=1] The number of elements to take.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * _.takeRight([1, 2, 3]);
		     * // => [3]
		     *
		     * _.takeRight([1, 2, 3], 2);
		     * // => [2, 3]
		     *
		     * _.takeRight([1, 2, 3], 5);
		     * // => [1, 2, 3]
		     *
		     * _.takeRight([1, 2, 3], 0);
		     * // => []
		     */
		    function takeRight(array, n, guard) {
		      var length = array == null ? 0 : array.length;
		      if (!length) {
		        return [];
		      }
		      n = (guard || n === undefined$1) ? 1 : toInteger(n);
		      n = length - n;
		      return baseSlice(array, n < 0 ? 0 : n, length);
		    }

		    /**
		     * Creates a slice of `array` with elements taken from the end. Elements are
		     * taken until `predicate` returns falsey. The predicate is invoked with
		     * three arguments: (value, index, array).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': true },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': false }
		     * ];
		     *
		     * _.takeRightWhile(users, function(o) { return !o.active; });
		     * // => objects for ['fred', 'pebbles']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
		     * // => objects for ['pebbles']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.takeRightWhile(users, ['active', false]);
		     * // => objects for ['fred', 'pebbles']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.takeRightWhile(users, 'active');
		     * // => []
		     */
		    function takeRightWhile(array, predicate) {
		      return (array && array.length)
		        ? baseWhile(array, getIteratee(predicate, 3), false, true)
		        : [];
		    }

		    /**
		     * Creates a slice of `array` with elements taken from the beginning. Elements
		     * are taken until `predicate` returns falsey. The predicate is invoked with
		     * three arguments: (value, index, array).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Array
		     * @param {Array} array The array to query.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the slice of `array`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'active': false },
		     *   { 'user': 'fred',    'active': false },
		     *   { 'user': 'pebbles', 'active': true }
		     * ];
		     *
		     * _.takeWhile(users, function(o) { return !o.active; });
		     * // => objects for ['barney', 'fred']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.takeWhile(users, { 'user': 'barney', 'active': false });
		     * // => objects for ['barney']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.takeWhile(users, ['active', false]);
		     * // => objects for ['barney', 'fred']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.takeWhile(users, 'active');
		     * // => []
		     */
		    function takeWhile(array, predicate) {
		      return (array && array.length)
		        ? baseWhile(array, getIteratee(predicate, 3))
		        : [];
		    }

		    /**
		     * Creates an array of unique values, in order, from all given arrays using
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @returns {Array} Returns the new array of combined values.
		     * @example
		     *
		     * _.union([2], [1, 2]);
		     * // => [2, 1]
		     */
		    var union = baseRest(function(arrays) {
		      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
		    });

		    /**
		     * This method is like `_.union` except that it accepts `iteratee` which is
		     * invoked for each element of each `arrays` to generate the criterion by
		     * which uniqueness is computed. Result values are chosen from the first
		     * array in which the value occurs. The iteratee is invoked with one argument:
		     * (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns the new array of combined values.
		     * @example
		     *
		     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
		     * // => [2.1, 1.2]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
		     * // => [{ 'x': 1 }, { 'x': 2 }]
		     */
		    var unionBy = baseRest(function(arrays) {
		      var iteratee = last(arrays);
		      if (isArrayLikeObject(iteratee)) {
		        iteratee = undefined$1;
		      }
		      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
		    });

		    /**
		     * This method is like `_.union` except that it accepts `comparator` which
		     * is invoked to compare elements of `arrays`. Result values are chosen from
		     * the first array in which the value occurs. The comparator is invoked
		     * with two arguments: (arrVal, othVal).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of combined values.
		     * @example
		     *
		     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
		     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
		     *
		     * _.unionWith(objects, others, _.isEqual);
		     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
		     */
		    var unionWith = baseRest(function(arrays) {
		      var comparator = last(arrays);
		      comparator = typeof comparator == 'function' ? comparator : undefined$1;
		      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
		    });

		    /**
		     * Creates a duplicate-free version of an array, using
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons, in which only the first occurrence of each element
		     * is kept. The order of result values is determined by the order they occur
		     * in the array.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @returns {Array} Returns the new duplicate free array.
		     * @example
		     *
		     * _.uniq([2, 1, 2]);
		     * // => [2, 1]
		     */
		    function uniq(array) {
		      return (array && array.length) ? baseUniq(array) : [];
		    }

		    /**
		     * This method is like `_.uniq` except that it accepts `iteratee` which is
		     * invoked for each element in `array` to generate the criterion by which
		     * uniqueness is computed. The order of result values is determined by the
		     * order they occur in the array. The iteratee is invoked with one argument:
		     * (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns the new duplicate free array.
		     * @example
		     *
		     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
		     * // => [2.1, 1.2]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
		     * // => [{ 'x': 1 }, { 'x': 2 }]
		     */
		    function uniqBy(array, iteratee) {
		      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
		    }

		    /**
		     * This method is like `_.uniq` except that it accepts `comparator` which
		     * is invoked to compare elements of `array`. The order of result values is
		     * determined by the order they occur in the array.The comparator is invoked
		     * with two arguments: (arrVal, othVal).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new duplicate free array.
		     * @example
		     *
		     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
		     *
		     * _.uniqWith(objects, _.isEqual);
		     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
		     */
		    function uniqWith(array, comparator) {
		      comparator = typeof comparator == 'function' ? comparator : undefined$1;
		      return (array && array.length) ? baseUniq(array, undefined$1, comparator) : [];
		    }

		    /**
		     * This method is like `_.zip` except that it accepts an array of grouped
		     * elements and creates an array regrouping the elements to their pre-zip
		     * configuration.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.2.0
		     * @category Array
		     * @param {Array} array The array of grouped elements to process.
		     * @returns {Array} Returns the new array of regrouped elements.
		     * @example
		     *
		     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
		     * // => [['a', 1, true], ['b', 2, false]]
		     *
		     * _.unzip(zipped);
		     * // => [['a', 'b'], [1, 2], [true, false]]
		     */
		    function unzip(array) {
		      if (!(array && array.length)) {
		        return [];
		      }
		      var length = 0;
		      array = arrayFilter(array, function(group) {
		        if (isArrayLikeObject(group)) {
		          length = nativeMax(group.length, length);
		          return true;
		        }
		      });
		      return baseTimes(length, function(index) {
		        return arrayMap(array, baseProperty(index));
		      });
		    }

		    /**
		     * This method is like `_.unzip` except that it accepts `iteratee` to specify
		     * how regrouped values should be combined. The iteratee is invoked with the
		     * elements of each group: (...group).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.8.0
		     * @category Array
		     * @param {Array} array The array of grouped elements to process.
		     * @param {Function} [iteratee=_.identity] The function to combine
		     *  regrouped values.
		     * @returns {Array} Returns the new array of regrouped elements.
		     * @example
		     *
		     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
		     * // => [[1, 10, 100], [2, 20, 200]]
		     *
		     * _.unzipWith(zipped, _.add);
		     * // => [3, 30, 300]
		     */
		    function unzipWith(array, iteratee) {
		      if (!(array && array.length)) {
		        return [];
		      }
		      var result = unzip(array);
		      if (iteratee == null) {
		        return result;
		      }
		      return arrayMap(result, function(group) {
		        return apply(iteratee, undefined$1, group);
		      });
		    }

		    /**
		     * Creates an array excluding all given values using
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * for equality comparisons.
		     *
		     * **Note:** Unlike `_.pull`, this method returns a new array.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {Array} array The array to inspect.
		     * @param {...*} [values] The values to exclude.
		     * @returns {Array} Returns the new array of filtered values.
		     * @see _.difference, _.xor
		     * @example
		     *
		     * _.without([2, 1, 2, 3], 1, 2);
		     * // => [3]
		     */
		    var without = baseRest(function(array, values) {
		      return isArrayLikeObject(array)
		        ? baseDifference(array, values)
		        : [];
		    });

		    /**
		     * Creates an array of unique values that is the
		     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
		     * of the given arrays. The order of result values is determined by the order
		     * they occur in the arrays.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.4.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @returns {Array} Returns the new array of filtered values.
		     * @see _.difference, _.without
		     * @example
		     *
		     * _.xor([2, 1], [2, 3]);
		     * // => [1, 3]
		     */
		    var xor = baseRest(function(arrays) {
		      return baseXor(arrayFilter(arrays, isArrayLikeObject));
		    });

		    /**
		     * This method is like `_.xor` except that it accepts `iteratee` which is
		     * invoked for each element of each `arrays` to generate the criterion by
		     * which by which they're compared. The order of result values is determined
		     * by the order they occur in the arrays. The iteratee is invoked with one
		     * argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Array} Returns the new array of filtered values.
		     * @example
		     *
		     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
		     * // => [1.2, 3.4]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
		     * // => [{ 'x': 2 }]
		     */
		    var xorBy = baseRest(function(arrays) {
		      var iteratee = last(arrays);
		      if (isArrayLikeObject(iteratee)) {
		        iteratee = undefined$1;
		      }
		      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
		    });

		    /**
		     * This method is like `_.xor` except that it accepts `comparator` which is
		     * invoked to compare elements of `arrays`. The order of result values is
		     * determined by the order they occur in the arrays. The comparator is invoked
		     * with two arguments: (arrVal, othVal).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to inspect.
		     * @param {Function} [comparator] The comparator invoked per element.
		     * @returns {Array} Returns the new array of filtered values.
		     * @example
		     *
		     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
		     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
		     *
		     * _.xorWith(objects, others, _.isEqual);
		     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
		     */
		    var xorWith = baseRest(function(arrays) {
		      var comparator = last(arrays);
		      comparator = typeof comparator == 'function' ? comparator : undefined$1;
		      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
		    });

		    /**
		     * Creates an array of grouped elements, the first of which contains the
		     * first elements of the given arrays, the second of which contains the
		     * second elements of the given arrays, and so on.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to process.
		     * @returns {Array} Returns the new array of grouped elements.
		     * @example
		     *
		     * _.zip(['a', 'b'], [1, 2], [true, false]);
		     * // => [['a', 1, true], ['b', 2, false]]
		     */
		    var zip = baseRest(unzip);

		    /**
		     * This method is like `_.fromPairs` except that it accepts two arrays,
		     * one of property identifiers and one of corresponding values.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.4.0
		     * @category Array
		     * @param {Array} [props=[]] The property identifiers.
		     * @param {Array} [values=[]] The property values.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * _.zipObject(['a', 'b'], [1, 2]);
		     * // => { 'a': 1, 'b': 2 }
		     */
		    function zipObject(props, values) {
		      return baseZipObject(props || [], values || [], assignValue);
		    }

		    /**
		     * This method is like `_.zipObject` except that it supports property paths.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.1.0
		     * @category Array
		     * @param {Array} [props=[]] The property identifiers.
		     * @param {Array} [values=[]] The property values.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
		     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
		     */
		    function zipObjectDeep(props, values) {
		      return baseZipObject(props || [], values || [], baseSet);
		    }

		    /**
		     * This method is like `_.zip` except that it accepts `iteratee` to specify
		     * how grouped values should be combined. The iteratee is invoked with the
		     * elements of each group: (...group).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.8.0
		     * @category Array
		     * @param {...Array} [arrays] The arrays to process.
		     * @param {Function} [iteratee=_.identity] The function to combine
		     *  grouped values.
		     * @returns {Array} Returns the new array of grouped elements.
		     * @example
		     *
		     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
		     *   return a + b + c;
		     * });
		     * // => [111, 222]
		     */
		    var zipWith = baseRest(function(arrays) {
		      var length = arrays.length,
		          iteratee = length > 1 ? arrays[length - 1] : undefined$1;

		      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined$1;
		      return unzipWith(arrays, iteratee);
		    });

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
		     * chain sequences enabled. The result of such sequences must be unwrapped
		     * with `_#value`.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.3.0
		     * @category Seq
		     * @param {*} value The value to wrap.
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'age': 36 },
		     *   { 'user': 'fred',    'age': 40 },
		     *   { 'user': 'pebbles', 'age': 1 }
		     * ];
		     *
		     * var youngest = _
		     *   .chain(users)
		     *   .sortBy('age')
		     *   .map(function(o) {
		     *     return o.user + ' is ' + o.age;
		     *   })
		     *   .head()
		     *   .value();
		     * // => 'pebbles is 1'
		     */
		    function chain(value) {
		      var result = lodash(value);
		      result.__chain__ = true;
		      return result;
		    }

		    /**
		     * This method invokes `interceptor` and returns `value`. The interceptor
		     * is invoked with one argument; (value). The purpose of this method is to
		     * "tap into" a method chain sequence in order to modify intermediate results.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Seq
		     * @param {*} value The value to provide to `interceptor`.
		     * @param {Function} interceptor The function to invoke.
		     * @returns {*} Returns `value`.
		     * @example
		     *
		     * _([1, 2, 3])
		     *  .tap(function(array) {
		     *    // Mutate input array.
		     *    array.pop();
		     *  })
		     *  .reverse()
		     *  .value();
		     * // => [2, 1]
		     */
		    function tap(value, interceptor) {
		      interceptor(value);
		      return value;
		    }

		    /**
		     * This method is like `_.tap` except that it returns the result of `interceptor`.
		     * The purpose of this method is to "pass thru" values replacing intermediate
		     * results in a method chain sequence.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Seq
		     * @param {*} value The value to provide to `interceptor`.
		     * @param {Function} interceptor The function to invoke.
		     * @returns {*} Returns the result of `interceptor`.
		     * @example
		     *
		     * _('  abc  ')
		     *  .chain()
		     *  .trim()
		     *  .thru(function(value) {
		     *    return [value];
		     *  })
		     *  .value();
		     * // => ['abc']
		     */
		    function thru(value, interceptor) {
		      return interceptor(value);
		    }

		    /**
		     * This method is the wrapper version of `_.at`.
		     *
		     * @name at
		     * @memberOf _
		     * @since 1.0.0
		     * @category Seq
		     * @param {...(string|string[])} [paths] The property paths to pick.
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
		     *
		     * _(object).at(['a[0].b.c', 'a[1]']).value();
		     * // => [3, 4]
		     */
		    var wrapperAt = flatRest(function(paths) {
		      var length = paths.length,
		          start = length ? paths[0] : 0,
		          value = this.__wrapped__,
		          interceptor = function(object) { return baseAt(object, paths); };

		      if (length > 1 || this.__actions__.length ||
		          !(value instanceof LazyWrapper) || !isIndex(start)) {
		        return this.thru(interceptor);
		      }
		      value = value.slice(start, +start + (length ? 1 : 0));
		      value.__actions__.push({
		        'func': thru,
		        'args': [interceptor],
		        'thisArg': undefined$1
		      });
		      return new LodashWrapper(value, this.__chain__).thru(function(array) {
		        if (length && !array.length) {
		          array.push(undefined$1);
		        }
		        return array;
		      });
		    });

		    /**
		     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
		     *
		     * @name chain
		     * @memberOf _
		     * @since 0.1.0
		     * @category Seq
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney', 'age': 36 },
		     *   { 'user': 'fred',   'age': 40 }
		     * ];
		     *
		     * // A sequence without explicit chaining.
		     * _(users).head();
		     * // => { 'user': 'barney', 'age': 36 }
		     *
		     * // A sequence with explicit chaining.
		     * _(users)
		     *   .chain()
		     *   .head()
		     *   .pick('user')
		     *   .value();
		     * // => { 'user': 'barney' }
		     */
		    function wrapperChain() {
		      return chain(this);
		    }

		    /**
		     * Executes the chain sequence and returns the wrapped result.
		     *
		     * @name commit
		     * @memberOf _
		     * @since 3.2.0
		     * @category Seq
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * var array = [1, 2];
		     * var wrapped = _(array).push(3);
		     *
		     * console.log(array);
		     * // => [1, 2]
		     *
		     * wrapped = wrapped.commit();
		     * console.log(array);
		     * // => [1, 2, 3]
		     *
		     * wrapped.last();
		     * // => 3
		     *
		     * console.log(array);
		     * // => [1, 2, 3]
		     */
		    function wrapperCommit() {
		      return new LodashWrapper(this.value(), this.__chain__);
		    }

		    /**
		     * Gets the next value on a wrapped object following the
		     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
		     *
		     * @name next
		     * @memberOf _
		     * @since 4.0.0
		     * @category Seq
		     * @returns {Object} Returns the next iterator value.
		     * @example
		     *
		     * var wrapped = _([1, 2]);
		     *
		     * wrapped.next();
		     * // => { 'done': false, 'value': 1 }
		     *
		     * wrapped.next();
		     * // => { 'done': false, 'value': 2 }
		     *
		     * wrapped.next();
		     * // => { 'done': true, 'value': undefined }
		     */
		    function wrapperNext() {
		      if (this.__values__ === undefined$1) {
		        this.__values__ = toArray(this.value());
		      }
		      var done = this.__index__ >= this.__values__.length,
		          value = done ? undefined$1 : this.__values__[this.__index__++];

		      return { 'done': done, 'value': value };
		    }

		    /**
		     * Enables the wrapper to be iterable.
		     *
		     * @name Symbol.iterator
		     * @memberOf _
		     * @since 4.0.0
		     * @category Seq
		     * @returns {Object} Returns the wrapper object.
		     * @example
		     *
		     * var wrapped = _([1, 2]);
		     *
		     * wrapped[Symbol.iterator]() === wrapped;
		     * // => true
		     *
		     * Array.from(wrapped);
		     * // => [1, 2]
		     */
		    function wrapperToIterator() {
		      return this;
		    }

		    /**
		     * Creates a clone of the chain sequence planting `value` as the wrapped value.
		     *
		     * @name plant
		     * @memberOf _
		     * @since 3.2.0
		     * @category Seq
		     * @param {*} value The value to plant.
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * var wrapped = _([1, 2]).map(square);
		     * var other = wrapped.plant([3, 4]);
		     *
		     * other.value();
		     * // => [9, 16]
		     *
		     * wrapped.value();
		     * // => [1, 4]
		     */
		    function wrapperPlant(value) {
		      var result,
		          parent = this;

		      while (parent instanceof baseLodash) {
		        var clone = wrapperClone(parent);
		        clone.__index__ = 0;
		        clone.__values__ = undefined$1;
		        if (result) {
		          previous.__wrapped__ = clone;
		        } else {
		          result = clone;
		        }
		        var previous = clone;
		        parent = parent.__wrapped__;
		      }
		      previous.__wrapped__ = value;
		      return result;
		    }

		    /**
		     * This method is the wrapper version of `_.reverse`.
		     *
		     * **Note:** This method mutates the wrapped array.
		     *
		     * @name reverse
		     * @memberOf _
		     * @since 0.1.0
		     * @category Seq
		     * @returns {Object} Returns the new `lodash` wrapper instance.
		     * @example
		     *
		     * var array = [1, 2, 3];
		     *
		     * _(array).reverse().value()
		     * // => [3, 2, 1]
		     *
		     * console.log(array);
		     * // => [3, 2, 1]
		     */
		    function wrapperReverse() {
		      var value = this.__wrapped__;
		      if (value instanceof LazyWrapper) {
		        var wrapped = value;
		        if (this.__actions__.length) {
		          wrapped = new LazyWrapper(this);
		        }
		        wrapped = wrapped.reverse();
		        wrapped.__actions__.push({
		          'func': thru,
		          'args': [reverse],
		          'thisArg': undefined$1
		        });
		        return new LodashWrapper(wrapped, this.__chain__);
		      }
		      return this.thru(reverse);
		    }

		    /**
		     * Executes the chain sequence to resolve the unwrapped value.
		     *
		     * @name value
		     * @memberOf _
		     * @since 0.1.0
		     * @alias toJSON, valueOf
		     * @category Seq
		     * @returns {*} Returns the resolved unwrapped value.
		     * @example
		     *
		     * _([1, 2, 3]).value();
		     * // => [1, 2, 3]
		     */
		    function wrapperValue() {
		      return baseWrapperValue(this.__wrapped__, this.__actions__);
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Creates an object composed of keys generated from the results of running
		     * each element of `collection` thru `iteratee`. The corresponding value of
		     * each key is the number of times the key was returned by `iteratee`. The
		     * iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.5.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
		     * @returns {Object} Returns the composed aggregate object.
		     * @example
		     *
		     * _.countBy([6.1, 4.2, 6.3], Math.floor);
		     * // => { '4': 1, '6': 2 }
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.countBy(['one', 'two', 'three'], 'length');
		     * // => { '3': 2, '5': 1 }
		     */
		    var countBy = createAggregator(function(result, value, key) {
		      if (hasOwnProperty.call(result, key)) {
		        ++result[key];
		      } else {
		        baseAssignValue(result, key, 1);
		      }
		    });

		    /**
		     * Checks if `predicate` returns truthy for **all** elements of `collection`.
		     * Iteration is stopped once `predicate` returns falsey. The predicate is
		     * invoked with three arguments: (value, index|key, collection).
		     *
		     * **Note:** This method returns `true` for
		     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
		     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
		     * elements of empty collections.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {boolean} Returns `true` if all elements pass the predicate check,
		     *  else `false`.
		     * @example
		     *
		     * _.every([true, 1, null, 'yes'], Boolean);
		     * // => false
		     *
		     * var users = [
		     *   { 'user': 'barney', 'age': 36, 'active': false },
		     *   { 'user': 'fred',   'age': 40, 'active': false }
		     * ];
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.every(users, { 'user': 'barney', 'active': false });
		     * // => false
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.every(users, ['active', false]);
		     * // => true
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.every(users, 'active');
		     * // => false
		     */
		    function every(collection, predicate, guard) {
		      var func = isArray(collection) ? arrayEvery : baseEvery;
		      if (guard && isIterateeCall(collection, predicate, guard)) {
		        predicate = undefined$1;
		      }
		      return func(collection, getIteratee(predicate, 3));
		    }

		    /**
		     * Iterates over elements of `collection`, returning an array of all elements
		     * `predicate` returns truthy for. The predicate is invoked with three
		     * arguments: (value, index|key, collection).
		     *
		     * **Note:** Unlike `_.remove`, this method returns a new array.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new filtered array.
		     * @see _.reject
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney', 'age': 36, 'active': true },
		     *   { 'user': 'fred',   'age': 40, 'active': false }
		     * ];
		     *
		     * _.filter(users, function(o) { return !o.active; });
		     * // => objects for ['fred']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.filter(users, { 'age': 36, 'active': true });
		     * // => objects for ['barney']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.filter(users, ['active', false]);
		     * // => objects for ['fred']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.filter(users, 'active');
		     * // => objects for ['barney']
		     *
		     * // Combining several predicates using `_.overEvery` or `_.overSome`.
		     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
		     * // => objects for ['fred', 'barney']
		     */
		    function filter(collection, predicate) {
		      var func = isArray(collection) ? arrayFilter : baseFilter;
		      return func(collection, getIteratee(predicate, 3));
		    }

		    /**
		     * Iterates over elements of `collection`, returning the first element
		     * `predicate` returns truthy for. The predicate is invoked with three
		     * arguments: (value, index|key, collection).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param {number} [fromIndex=0] The index to search from.
		     * @returns {*} Returns the matched element, else `undefined`.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'age': 36, 'active': true },
		     *   { 'user': 'fred',    'age': 40, 'active': false },
		     *   { 'user': 'pebbles', 'age': 1,  'active': true }
		     * ];
		     *
		     * _.find(users, function(o) { return o.age < 40; });
		     * // => object for 'barney'
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.find(users, { 'age': 1, 'active': true });
		     * // => object for 'pebbles'
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.find(users, ['active', false]);
		     * // => object for 'fred'
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.find(users, 'active');
		     * // => object for 'barney'
		     */
		    var find = createFind(findIndex);

		    /**
		     * This method is like `_.find` except that it iterates over elements of
		     * `collection` from right to left.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param {number} [fromIndex=collection.length-1] The index to search from.
		     * @returns {*} Returns the matched element, else `undefined`.
		     * @example
		     *
		     * _.findLast([1, 2, 3, 4], function(n) {
		     *   return n % 2 == 1;
		     * });
		     * // => 3
		     */
		    var findLast = createFind(findLastIndex);

		    /**
		     * Creates a flattened array of values by running each element in `collection`
		     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
		     * with three arguments: (value, index|key, collection).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * function duplicate(n) {
		     *   return [n, n];
		     * }
		     *
		     * _.flatMap([1, 2], duplicate);
		     * // => [1, 1, 2, 2]
		     */
		    function flatMap(collection, iteratee) {
		      return baseFlatten(map(collection, iteratee), 1);
		    }

		    /**
		     * This method is like `_.flatMap` except that it recursively flattens the
		     * mapped results.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.7.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * function duplicate(n) {
		     *   return [[[n, n]]];
		     * }
		     *
		     * _.flatMapDeep([1, 2], duplicate);
		     * // => [1, 1, 2, 2]
		     */
		    function flatMapDeep(collection, iteratee) {
		      return baseFlatten(map(collection, iteratee), INFINITY);
		    }

		    /**
		     * This method is like `_.flatMap` except that it recursively flattens the
		     * mapped results up to `depth` times.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.7.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @param {number} [depth=1] The maximum recursion depth.
		     * @returns {Array} Returns the new flattened array.
		     * @example
		     *
		     * function duplicate(n) {
		     *   return [[[n, n]]];
		     * }
		     *
		     * _.flatMapDepth([1, 2], duplicate, 2);
		     * // => [[1, 1], [2, 2]]
		     */
		    function flatMapDepth(collection, iteratee, depth) {
		      depth = depth === undefined$1 ? 1 : toInteger(depth);
		      return baseFlatten(map(collection, iteratee), depth);
		    }

		    /**
		     * Iterates over elements of `collection` and invokes `iteratee` for each element.
		     * The iteratee is invoked with three arguments: (value, index|key, collection).
		     * Iteratee functions may exit iteration early by explicitly returning `false`.
		     *
		     * **Note:** As with other "Collections" methods, objects with a "length"
		     * property are iterated like arrays. To avoid this behavior use `_.forIn`
		     * or `_.forOwn` for object iteration.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @alias each
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array|Object} Returns `collection`.
		     * @see _.forEachRight
		     * @example
		     *
		     * _.forEach([1, 2], function(value) {
		     *   console.log(value);
		     * });
		     * // => Logs `1` then `2`.
		     *
		     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
		     *   console.log(key);
		     * });
		     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
		     */
		    function forEach(collection, iteratee) {
		      var func = isArray(collection) ? arrayEach : baseEach;
		      return func(collection, getIteratee(iteratee, 3));
		    }

		    /**
		     * This method is like `_.forEach` except that it iterates over elements of
		     * `collection` from right to left.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @alias eachRight
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array|Object} Returns `collection`.
		     * @see _.forEach
		     * @example
		     *
		     * _.forEachRight([1, 2], function(value) {
		     *   console.log(value);
		     * });
		     * // => Logs `2` then `1`.
		     */
		    function forEachRight(collection, iteratee) {
		      var func = isArray(collection) ? arrayEachRight : baseEachRight;
		      return func(collection, getIteratee(iteratee, 3));
		    }

		    /**
		     * Creates an object composed of keys generated from the results of running
		     * each element of `collection` thru `iteratee`. The order of grouped values
		     * is determined by the order they occur in `collection`. The corresponding
		     * value of each key is an array of elements responsible for generating the
		     * key. The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
		     * @returns {Object} Returns the composed aggregate object.
		     * @example
		     *
		     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
		     * // => { '4': [4.2], '6': [6.1, 6.3] }
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.groupBy(['one', 'two', 'three'], 'length');
		     * // => { '3': ['one', 'two'], '5': ['three'] }
		     */
		    var groupBy = createAggregator(function(result, value, key) {
		      if (hasOwnProperty.call(result, key)) {
		        result[key].push(value);
		      } else {
		        baseAssignValue(result, key, [value]);
		      }
		    });

		    /**
		     * Checks if `value` is in `collection`. If `collection` is a string, it's
		     * checked for a substring of `value`, otherwise
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * is used for equality comparisons. If `fromIndex` is negative, it's used as
		     * the offset from the end of `collection`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object|string} collection The collection to inspect.
		     * @param {*} value The value to search for.
		     * @param {number} [fromIndex=0] The index to search from.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
		     * @returns {boolean} Returns `true` if `value` is found, else `false`.
		     * @example
		     *
		     * _.includes([1, 2, 3], 1);
		     * // => true
		     *
		     * _.includes([1, 2, 3], 1, 2);
		     * // => false
		     *
		     * _.includes({ 'a': 1, 'b': 2 }, 1);
		     * // => true
		     *
		     * _.includes('abcd', 'bc');
		     * // => true
		     */
		    function includes(collection, value, fromIndex, guard) {
		      collection = isArrayLike(collection) ? collection : values(collection);
		      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

		      var length = collection.length;
		      if (fromIndex < 0) {
		        fromIndex = nativeMax(length + fromIndex, 0);
		      }
		      return isString(collection)
		        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
		        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
		    }

		    /**
		     * Invokes the method at `path` of each element in `collection`, returning
		     * an array of the results of each invoked method. Any additional arguments
		     * are provided to each invoked method. If `path` is a function, it's invoked
		     * for, and `this` bound to, each element in `collection`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Array|Function|string} path The path of the method to invoke or
		     *  the function invoked per iteration.
		     * @param {...*} [args] The arguments to invoke each method with.
		     * @returns {Array} Returns the array of results.
		     * @example
		     *
		     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
		     * // => [[1, 5, 7], [1, 2, 3]]
		     *
		     * _.invokeMap([123, 456], String.prototype.split, '');
		     * // => [['1', '2', '3'], ['4', '5', '6']]
		     */
		    var invokeMap = baseRest(function(collection, path, args) {
		      var index = -1,
		          isFunc = typeof path == 'function',
		          result = isArrayLike(collection) ? Array(collection.length) : [];

		      baseEach(collection, function(value) {
		        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
		      });
		      return result;
		    });

		    /**
		     * Creates an object composed of keys generated from the results of running
		     * each element of `collection` thru `iteratee`. The corresponding value of
		     * each key is the last element responsible for generating the key. The
		     * iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
		     * @returns {Object} Returns the composed aggregate object.
		     * @example
		     *
		     * var array = [
		     *   { 'dir': 'left', 'code': 97 },
		     *   { 'dir': 'right', 'code': 100 }
		     * ];
		     *
		     * _.keyBy(array, function(o) {
		     *   return String.fromCharCode(o.code);
		     * });
		     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
		     *
		     * _.keyBy(array, 'dir');
		     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
		     */
		    var keyBy = createAggregator(function(result, value, key) {
		      baseAssignValue(result, key, value);
		    });

		    /**
		     * Creates an array of values by running each element in `collection` thru
		     * `iteratee`. The iteratee is invoked with three arguments:
		     * (value, index|key, collection).
		     *
		     * Many lodash methods are guarded to work as iteratees for methods like
		     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
		     *
		     * The guarded methods are:
		     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
		     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
		     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
		     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new mapped array.
		     * @example
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * _.map([4, 8], square);
		     * // => [16, 64]
		     *
		     * _.map({ 'a': 4, 'b': 8 }, square);
		     * // => [16, 64] (iteration order is not guaranteed)
		     *
		     * var users = [
		     *   { 'user': 'barney' },
		     *   { 'user': 'fred' }
		     * ];
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.map(users, 'user');
		     * // => ['barney', 'fred']
		     */
		    function map(collection, iteratee) {
		      var func = isArray(collection) ? arrayMap : baseMap;
		      return func(collection, getIteratee(iteratee, 3));
		    }

		    /**
		     * This method is like `_.sortBy` except that it allows specifying the sort
		     * orders of the iteratees to sort by. If `orders` is unspecified, all values
		     * are sorted in ascending order. Otherwise, specify an order of "desc" for
		     * descending or "asc" for ascending sort order of corresponding values.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
		     *  The iteratees to sort by.
		     * @param {string[]} [orders] The sort orders of `iteratees`.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
		     * @returns {Array} Returns the new sorted array.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'fred',   'age': 48 },
		     *   { 'user': 'barney', 'age': 34 },
		     *   { 'user': 'fred',   'age': 40 },
		     *   { 'user': 'barney', 'age': 36 }
		     * ];
		     *
		     * // Sort by `user` in ascending order and by `age` in descending order.
		     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
		     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
		     */
		    function orderBy(collection, iteratees, orders, guard) {
		      if (collection == null) {
		        return [];
		      }
		      if (!isArray(iteratees)) {
		        iteratees = iteratees == null ? [] : [iteratees];
		      }
		      orders = guard ? undefined$1 : orders;
		      if (!isArray(orders)) {
		        orders = orders == null ? [] : [orders];
		      }
		      return baseOrderBy(collection, iteratees, orders);
		    }

		    /**
		     * Creates an array of elements split into two groups, the first of which
		     * contains elements `predicate` returns truthy for, the second of which
		     * contains elements `predicate` returns falsey for. The predicate is
		     * invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the array of grouped elements.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney',  'age': 36, 'active': false },
		     *   { 'user': 'fred',    'age': 40, 'active': true },
		     *   { 'user': 'pebbles', 'age': 1,  'active': false }
		     * ];
		     *
		     * _.partition(users, function(o) { return o.active; });
		     * // => objects for [['fred'], ['barney', 'pebbles']]
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.partition(users, { 'age': 1, 'active': false });
		     * // => objects for [['pebbles'], ['barney', 'fred']]
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.partition(users, ['active', false]);
		     * // => objects for [['barney', 'pebbles'], ['fred']]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.partition(users, 'active');
		     * // => objects for [['fred'], ['barney', 'pebbles']]
		     */
		    var partition = createAggregator(function(result, value, key) {
		      result[key ? 0 : 1].push(value);
		    }, function() { return [[], []]; });

		    /**
		     * Reduces `collection` to a value which is the accumulated result of running
		     * each element in `collection` thru `iteratee`, where each successive
		     * invocation is supplied the return value of the previous. If `accumulator`
		     * is not given, the first element of `collection` is used as the initial
		     * value. The iteratee is invoked with four arguments:
		     * (accumulator, value, index|key, collection).
		     *
		     * Many lodash methods are guarded to work as iteratees for methods like
		     * `_.reduce`, `_.reduceRight`, and `_.transform`.
		     *
		     * The guarded methods are:
		     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
		     * and `sortBy`
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @param {*} [accumulator] The initial value.
		     * @returns {*} Returns the accumulated value.
		     * @see _.reduceRight
		     * @example
		     *
		     * _.reduce([1, 2], function(sum, n) {
		     *   return sum + n;
		     * }, 0);
		     * // => 3
		     *
		     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
		     *   (result[value] || (result[value] = [])).push(key);
		     *   return result;
		     * }, {});
		     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
		     */
		    function reduce(collection, iteratee, accumulator) {
		      var func = isArray(collection) ? arrayReduce : baseReduce,
		          initAccum = arguments.length < 3;

		      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
		    }

		    /**
		     * This method is like `_.reduce` except that it iterates over elements of
		     * `collection` from right to left.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @param {*} [accumulator] The initial value.
		     * @returns {*} Returns the accumulated value.
		     * @see _.reduce
		     * @example
		     *
		     * var array = [[0, 1], [2, 3], [4, 5]];
		     *
		     * _.reduceRight(array, function(flattened, other) {
		     *   return flattened.concat(other);
		     * }, []);
		     * // => [4, 5, 2, 3, 0, 1]
		     */
		    function reduceRight(collection, iteratee, accumulator) {
		      var func = isArray(collection) ? arrayReduceRight : baseReduce,
		          initAccum = arguments.length < 3;

		      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
		    }

		    /**
		     * The opposite of `_.filter`; this method returns the elements of `collection`
		     * that `predicate` does **not** return truthy for.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the new filtered array.
		     * @see _.filter
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney', 'age': 36, 'active': false },
		     *   { 'user': 'fred',   'age': 40, 'active': true }
		     * ];
		     *
		     * _.reject(users, function(o) { return !o.active; });
		     * // => objects for ['fred']
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.reject(users, { 'age': 40, 'active': true });
		     * // => objects for ['barney']
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.reject(users, ['active', false]);
		     * // => objects for ['fred']
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.reject(users, 'active');
		     * // => objects for ['barney']
		     */
		    function reject(collection, predicate) {
		      var func = isArray(collection) ? arrayFilter : baseFilter;
		      return func(collection, negate(getIteratee(predicate, 3)));
		    }

		    /**
		     * Gets a random element from `collection`.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to sample.
		     * @returns {*} Returns the random element.
		     * @example
		     *
		     * _.sample([1, 2, 3, 4]);
		     * // => 2
		     */
		    function sample(collection) {
		      var func = isArray(collection) ? arraySample : baseSample;
		      return func(collection);
		    }

		    /**
		     * Gets `n` random elements at unique keys from `collection` up to the
		     * size of `collection`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to sample.
		     * @param {number} [n=1] The number of elements to sample.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the random elements.
		     * @example
		     *
		     * _.sampleSize([1, 2, 3], 2);
		     * // => [3, 1]
		     *
		     * _.sampleSize([1, 2, 3], 4);
		     * // => [2, 3, 1]
		     */
		    function sampleSize(collection, n, guard) {
		      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined$1)) {
		        n = 1;
		      } else {
		        n = toInteger(n);
		      }
		      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
		      return func(collection, n);
		    }

		    /**
		     * Creates an array of shuffled values, using a version of the
		     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to shuffle.
		     * @returns {Array} Returns the new shuffled array.
		     * @example
		     *
		     * _.shuffle([1, 2, 3, 4]);
		     * // => [4, 1, 3, 2]
		     */
		    function shuffle(collection) {
		      var func = isArray(collection) ? arrayShuffle : baseShuffle;
		      return func(collection);
		    }

		    /**
		     * Gets the size of `collection` by returning its length for array-like
		     * values or the number of own enumerable string keyed properties for objects.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object|string} collection The collection to inspect.
		     * @returns {number} Returns the collection size.
		     * @example
		     *
		     * _.size([1, 2, 3]);
		     * // => 3
		     *
		     * _.size({ 'a': 1, 'b': 2 });
		     * // => 2
		     *
		     * _.size('pebbles');
		     * // => 7
		     */
		    function size(collection) {
		      if (collection == null) {
		        return 0;
		      }
		      if (isArrayLike(collection)) {
		        return isString(collection) ? stringSize(collection) : collection.length;
		      }
		      var tag = getTag(collection);
		      if (tag == mapTag || tag == setTag) {
		        return collection.size;
		      }
		      return baseKeys(collection).length;
		    }

		    /**
		     * Checks if `predicate` returns truthy for **any** element of `collection`.
		     * Iteration is stopped once `predicate` returns truthy. The predicate is
		     * invoked with three arguments: (value, index|key, collection).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {boolean} Returns `true` if any element passes the predicate check,
		     *  else `false`.
		     * @example
		     *
		     * _.some([null, 0, 'yes', false], Boolean);
		     * // => true
		     *
		     * var users = [
		     *   { 'user': 'barney', 'active': true },
		     *   { 'user': 'fred',   'active': false }
		     * ];
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.some(users, { 'user': 'barney', 'active': false });
		     * // => false
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.some(users, ['active', false]);
		     * // => true
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.some(users, 'active');
		     * // => true
		     */
		    function some(collection, predicate, guard) {
		      var func = isArray(collection) ? arraySome : baseSome;
		      if (guard && isIterateeCall(collection, predicate, guard)) {
		        predicate = undefined$1;
		      }
		      return func(collection, getIteratee(predicate, 3));
		    }

		    /**
		     * Creates an array of elements, sorted in ascending order by the results of
		     * running each element in a collection thru each iteratee. This method
		     * performs a stable sort, that is, it preserves the original sort order of
		     * equal elements. The iteratees are invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Collection
		     * @param {Array|Object} collection The collection to iterate over.
		     * @param {...(Function|Function[])} [iteratees=[_.identity]]
		     *  The iteratees to sort by.
		     * @returns {Array} Returns the new sorted array.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'fred',   'age': 48 },
		     *   { 'user': 'barney', 'age': 36 },
		     *   { 'user': 'fred',   'age': 30 },
		     *   { 'user': 'barney', 'age': 34 }
		     * ];
		     *
		     * _.sortBy(users, [function(o) { return o.user; }]);
		     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
		     *
		     * _.sortBy(users, ['user', 'age']);
		     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
		     */
		    var sortBy = baseRest(function(collection, iteratees) {
		      if (collection == null) {
		        return [];
		      }
		      var length = iteratees.length;
		      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
		        iteratees = [];
		      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
		        iteratees = [iteratees[0]];
		      }
		      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
		    });

		    /*------------------------------------------------------------------------*/

		    /**
		     * Gets the timestamp of the number of milliseconds that have elapsed since
		     * the Unix epoch (1 January 1970 00:00:00 UTC).
		     *
		     * @static
		     * @memberOf _
		     * @since 2.4.0
		     * @category Date
		     * @returns {number} Returns the timestamp.
		     * @example
		     *
		     * _.defer(function(stamp) {
		     *   console.log(_.now() - stamp);
		     * }, _.now());
		     * // => Logs the number of milliseconds it took for the deferred invocation.
		     */
		    var now = ctxNow || function() {
		      return root.Date.now();
		    };

		    /*------------------------------------------------------------------------*/

		    /**
		     * The opposite of `_.before`; this method creates a function that invokes
		     * `func` once it's called `n` or more times.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {number} n The number of calls before `func` is invoked.
		     * @param {Function} func The function to restrict.
		     * @returns {Function} Returns the new restricted function.
		     * @example
		     *
		     * var saves = ['profile', 'settings'];
		     *
		     * var done = _.after(saves.length, function() {
		     *   console.log('done saving!');
		     * });
		     *
		     * _.forEach(saves, function(type) {
		     *   asyncSave({ 'type': type, 'complete': done });
		     * });
		     * // => Logs 'done saving!' after the two async saves have completed.
		     */
		    function after(n, func) {
		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      n = toInteger(n);
		      return function() {
		        if (--n < 1) {
		          return func.apply(this, arguments);
		        }
		      };
		    }

		    /**
		     * Creates a function that invokes `func`, with up to `n` arguments,
		     * ignoring any additional arguments.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Function
		     * @param {Function} func The function to cap arguments for.
		     * @param {number} [n=func.length] The arity cap.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Function} Returns the new capped function.
		     * @example
		     *
		     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
		     * // => [6, 8, 10]
		     */
		    function ary(func, n, guard) {
		      n = guard ? undefined$1 : n;
		      n = (func && n == null) ? func.length : n;
		      return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
		    }

		    /**
		     * Creates a function that invokes `func`, with the `this` binding and arguments
		     * of the created function, while it's called less than `n` times. Subsequent
		     * calls to the created function return the result of the last `func` invocation.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Function
		     * @param {number} n The number of calls at which `func` is no longer invoked.
		     * @param {Function} func The function to restrict.
		     * @returns {Function} Returns the new restricted function.
		     * @example
		     *
		     * jQuery(element).on('click', _.before(5, addContactToList));
		     * // => Allows adding up to 4 contacts to the list.
		     */
		    function before(n, func) {
		      var result;
		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      n = toInteger(n);
		      return function() {
		        if (--n > 0) {
		          result = func.apply(this, arguments);
		        }
		        if (n <= 1) {
		          func = undefined$1;
		        }
		        return result;
		      };
		    }

		    /**
		     * Creates a function that invokes `func` with the `this` binding of `thisArg`
		     * and `partials` prepended to the arguments it receives.
		     *
		     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
		     * may be used as a placeholder for partially applied arguments.
		     *
		     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
		     * property of bound functions.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to bind.
		     * @param {*} thisArg The `this` binding of `func`.
		     * @param {...*} [partials] The arguments to be partially applied.
		     * @returns {Function} Returns the new bound function.
		     * @example
		     *
		     * function greet(greeting, punctuation) {
		     *   return greeting + ' ' + this.user + punctuation;
		     * }
		     *
		     * var object = { 'user': 'fred' };
		     *
		     * var bound = _.bind(greet, object, 'hi');
		     * bound('!');
		     * // => 'hi fred!'
		     *
		     * // Bound with placeholders.
		     * var bound = _.bind(greet, object, _, '!');
		     * bound('hi');
		     * // => 'hi fred!'
		     */
		    var bind = baseRest(function(func, thisArg, partials) {
		      var bitmask = WRAP_BIND_FLAG;
		      if (partials.length) {
		        var holders = replaceHolders(partials, getHolder(bind));
		        bitmask |= WRAP_PARTIAL_FLAG;
		      }
		      return createWrap(func, bitmask, thisArg, partials, holders);
		    });

		    /**
		     * Creates a function that invokes the method at `object[key]` with `partials`
		     * prepended to the arguments it receives.
		     *
		     * This method differs from `_.bind` by allowing bound functions to reference
		     * methods that may be redefined or don't yet exist. See
		     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
		     * for more details.
		     *
		     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
		     * builds, may be used as a placeholder for partially applied arguments.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.10.0
		     * @category Function
		     * @param {Object} object The object to invoke the method on.
		     * @param {string} key The key of the method.
		     * @param {...*} [partials] The arguments to be partially applied.
		     * @returns {Function} Returns the new bound function.
		     * @example
		     *
		     * var object = {
		     *   'user': 'fred',
		     *   'greet': function(greeting, punctuation) {
		     *     return greeting + ' ' + this.user + punctuation;
		     *   }
		     * };
		     *
		     * var bound = _.bindKey(object, 'greet', 'hi');
		     * bound('!');
		     * // => 'hi fred!'
		     *
		     * object.greet = function(greeting, punctuation) {
		     *   return greeting + 'ya ' + this.user + punctuation;
		     * };
		     *
		     * bound('!');
		     * // => 'hiya fred!'
		     *
		     * // Bound with placeholders.
		     * var bound = _.bindKey(object, 'greet', _, '!');
		     * bound('hi');
		     * // => 'hiya fred!'
		     */
		    var bindKey = baseRest(function(object, key, partials) {
		      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
		      if (partials.length) {
		        var holders = replaceHolders(partials, getHolder(bindKey));
		        bitmask |= WRAP_PARTIAL_FLAG;
		      }
		      return createWrap(key, bitmask, object, partials, holders);
		    });

		    /**
		     * Creates a function that accepts arguments of `func` and either invokes
		     * `func` returning its result, if at least `arity` number of arguments have
		     * been provided, or returns a function that accepts the remaining `func`
		     * arguments, and so on. The arity of `func` may be specified if `func.length`
		     * is not sufficient.
		     *
		     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
		     * may be used as a placeholder for provided arguments.
		     *
		     * **Note:** This method doesn't set the "length" property of curried functions.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Function
		     * @param {Function} func The function to curry.
		     * @param {number} [arity=func.length] The arity of `func`.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Function} Returns the new curried function.
		     * @example
		     *
		     * var abc = function(a, b, c) {
		     *   return [a, b, c];
		     * };
		     *
		     * var curried = _.curry(abc);
		     *
		     * curried(1)(2)(3);
		     * // => [1, 2, 3]
		     *
		     * curried(1, 2)(3);
		     * // => [1, 2, 3]
		     *
		     * curried(1, 2, 3);
		     * // => [1, 2, 3]
		     *
		     * // Curried with placeholders.
		     * curried(1)(_, 3)(2);
		     * // => [1, 2, 3]
		     */
		    function curry(func, arity, guard) {
		      arity = guard ? undefined$1 : arity;
		      var result = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
		      result.placeholder = curry.placeholder;
		      return result;
		    }

		    /**
		     * This method is like `_.curry` except that arguments are applied to `func`
		     * in the manner of `_.partialRight` instead of `_.partial`.
		     *
		     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
		     * builds, may be used as a placeholder for provided arguments.
		     *
		     * **Note:** This method doesn't set the "length" property of curried functions.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Function
		     * @param {Function} func The function to curry.
		     * @param {number} [arity=func.length] The arity of `func`.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Function} Returns the new curried function.
		     * @example
		     *
		     * var abc = function(a, b, c) {
		     *   return [a, b, c];
		     * };
		     *
		     * var curried = _.curryRight(abc);
		     *
		     * curried(3)(2)(1);
		     * // => [1, 2, 3]
		     *
		     * curried(2, 3)(1);
		     * // => [1, 2, 3]
		     *
		     * curried(1, 2, 3);
		     * // => [1, 2, 3]
		     *
		     * // Curried with placeholders.
		     * curried(3)(1, _)(2);
		     * // => [1, 2, 3]
		     */
		    function curryRight(func, arity, guard) {
		      arity = guard ? undefined$1 : arity;
		      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
		      result.placeholder = curryRight.placeholder;
		      return result;
		    }

		    /**
		     * Creates a debounced function that delays invoking `func` until after `wait`
		     * milliseconds have elapsed since the last time the debounced function was
		     * invoked. The debounced function comes with a `cancel` method to cancel
		     * delayed `func` invocations and a `flush` method to immediately invoke them.
		     * Provide `options` to indicate whether `func` should be invoked on the
		     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
		     * with the last arguments provided to the debounced function. Subsequent
		     * calls to the debounced function return the result of the last `func`
		     * invocation.
		     *
		     * **Note:** If `leading` and `trailing` options are `true`, `func` is
		     * invoked on the trailing edge of the timeout only if the debounced function
		     * is invoked more than once during the `wait` timeout.
		     *
		     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
		     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
		     *
		     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
		     * for details over the differences between `_.debounce` and `_.throttle`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to debounce.
		     * @param {number} [wait=0] The number of milliseconds to delay.
		     * @param {Object} [options={}] The options object.
		     * @param {boolean} [options.leading=false]
		     *  Specify invoking on the leading edge of the timeout.
		     * @param {number} [options.maxWait]
		     *  The maximum time `func` is allowed to be delayed before it's invoked.
		     * @param {boolean} [options.trailing=true]
		     *  Specify invoking on the trailing edge of the timeout.
		     * @returns {Function} Returns the new debounced function.
		     * @example
		     *
		     * // Avoid costly calculations while the window size is in flux.
		     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
		     *
		     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
		     * jQuery(element).on('click', _.debounce(sendMail, 300, {
		     *   'leading': true,
		     *   'trailing': false
		     * }));
		     *
		     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
		     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
		     * var source = new EventSource('/stream');
		     * jQuery(source).on('message', debounced);
		     *
		     * // Cancel the trailing debounced invocation.
		     * jQuery(window).on('popstate', debounced.cancel);
		     */
		    function debounce(func, wait, options) {
		      var lastArgs,
		          lastThis,
		          maxWait,
		          result,
		          timerId,
		          lastCallTime,
		          lastInvokeTime = 0,
		          leading = false,
		          maxing = false,
		          trailing = true;

		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      wait = toNumber(wait) || 0;
		      if (isObject(options)) {
		        leading = !!options.leading;
		        maxing = 'maxWait' in options;
		        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
		        trailing = 'trailing' in options ? !!options.trailing : trailing;
		      }

		      function invokeFunc(time) {
		        var args = lastArgs,
		            thisArg = lastThis;

		        lastArgs = lastThis = undefined$1;
		        lastInvokeTime = time;
		        result = func.apply(thisArg, args);
		        return result;
		      }

		      function leadingEdge(time) {
		        // Reset any `maxWait` timer.
		        lastInvokeTime = time;
		        // Start the timer for the trailing edge.
		        timerId = setTimeout(timerExpired, wait);
		        // Invoke the leading edge.
		        return leading ? invokeFunc(time) : result;
		      }

		      function remainingWait(time) {
		        var timeSinceLastCall = time - lastCallTime,
		            timeSinceLastInvoke = time - lastInvokeTime,
		            timeWaiting = wait - timeSinceLastCall;

		        return maxing
		          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
		          : timeWaiting;
		      }

		      function shouldInvoke(time) {
		        var timeSinceLastCall = time - lastCallTime,
		            timeSinceLastInvoke = time - lastInvokeTime;

		        // Either this is the first call, activity has stopped and we're at the
		        // trailing edge, the system time has gone backwards and we're treating
		        // it as the trailing edge, or we've hit the `maxWait` limit.
		        return (lastCallTime === undefined$1 || (timeSinceLastCall >= wait) ||
		          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
		      }

		      function timerExpired() {
		        var time = now();
		        if (shouldInvoke(time)) {
		          return trailingEdge(time);
		        }
		        // Restart the timer.
		        timerId = setTimeout(timerExpired, remainingWait(time));
		      }

		      function trailingEdge(time) {
		        timerId = undefined$1;

		        // Only invoke if we have `lastArgs` which means `func` has been
		        // debounced at least once.
		        if (trailing && lastArgs) {
		          return invokeFunc(time);
		        }
		        lastArgs = lastThis = undefined$1;
		        return result;
		      }

		      function cancel() {
		        if (timerId !== undefined$1) {
		          clearTimeout(timerId);
		        }
		        lastInvokeTime = 0;
		        lastArgs = lastCallTime = lastThis = timerId = undefined$1;
		      }

		      function flush() {
		        return timerId === undefined$1 ? result : trailingEdge(now());
		      }

		      function debounced() {
		        var time = now(),
		            isInvoking = shouldInvoke(time);

		        lastArgs = arguments;
		        lastThis = this;
		        lastCallTime = time;

		        if (isInvoking) {
		          if (timerId === undefined$1) {
		            return leadingEdge(lastCallTime);
		          }
		          if (maxing) {
		            // Handle invocations in a tight loop.
		            clearTimeout(timerId);
		            timerId = setTimeout(timerExpired, wait);
		            return invokeFunc(lastCallTime);
		          }
		        }
		        if (timerId === undefined$1) {
		          timerId = setTimeout(timerExpired, wait);
		        }
		        return result;
		      }
		      debounced.cancel = cancel;
		      debounced.flush = flush;
		      return debounced;
		    }

		    /**
		     * Defers invoking the `func` until the current call stack has cleared. Any
		     * additional arguments are provided to `func` when it's invoked.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to defer.
		     * @param {...*} [args] The arguments to invoke `func` with.
		     * @returns {number} Returns the timer id.
		     * @example
		     *
		     * _.defer(function(text) {
		     *   console.log(text);
		     * }, 'deferred');
		     * // => Logs 'deferred' after one millisecond.
		     */
		    var defer = baseRest(function(func, args) {
		      return baseDelay(func, 1, args);
		    });

		    /**
		     * Invokes `func` after `wait` milliseconds. Any additional arguments are
		     * provided to `func` when it's invoked.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to delay.
		     * @param {number} wait The number of milliseconds to delay invocation.
		     * @param {...*} [args] The arguments to invoke `func` with.
		     * @returns {number} Returns the timer id.
		     * @example
		     *
		     * _.delay(function(text) {
		     *   console.log(text);
		     * }, 1000, 'later');
		     * // => Logs 'later' after one second.
		     */
		    var delay = baseRest(function(func, wait, args) {
		      return baseDelay(func, toNumber(wait) || 0, args);
		    });

		    /**
		     * Creates a function that invokes `func` with arguments reversed.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Function
		     * @param {Function} func The function to flip arguments for.
		     * @returns {Function} Returns the new flipped function.
		     * @example
		     *
		     * var flipped = _.flip(function() {
		     *   return _.toArray(arguments);
		     * });
		     *
		     * flipped('a', 'b', 'c', 'd');
		     * // => ['d', 'c', 'b', 'a']
		     */
		    function flip(func) {
		      return createWrap(func, WRAP_FLIP_FLAG);
		    }

		    /**
		     * Creates a function that memoizes the result of `func`. If `resolver` is
		     * provided, it determines the cache key for storing the result based on the
		     * arguments provided to the memoized function. By default, the first argument
		     * provided to the memoized function is used as the map cache key. The `func`
		     * is invoked with the `this` binding of the memoized function.
		     *
		     * **Note:** The cache is exposed as the `cache` property on the memoized
		     * function. Its creation may be customized by replacing the `_.memoize.Cache`
		     * constructor with one whose instances implement the
		     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
		     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to have its output memoized.
		     * @param {Function} [resolver] The function to resolve the cache key.
		     * @returns {Function} Returns the new memoized function.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': 2 };
		     * var other = { 'c': 3, 'd': 4 };
		     *
		     * var values = _.memoize(_.values);
		     * values(object);
		     * // => [1, 2]
		     *
		     * values(other);
		     * // => [3, 4]
		     *
		     * object.a = 2;
		     * values(object);
		     * // => [1, 2]
		     *
		     * // Modify the result cache.
		     * values.cache.set(object, ['a', 'b']);
		     * values(object);
		     * // => ['a', 'b']
		     *
		     * // Replace `_.memoize.Cache`.
		     * _.memoize.Cache = WeakMap;
		     */
		    function memoize(func, resolver) {
		      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      var memoized = function() {
		        var args = arguments,
		            key = resolver ? resolver.apply(this, args) : args[0],
		            cache = memoized.cache;

		        if (cache.has(key)) {
		          return cache.get(key);
		        }
		        var result = func.apply(this, args);
		        memoized.cache = cache.set(key, result) || cache;
		        return result;
		      };
		      memoized.cache = new (memoize.Cache || MapCache);
		      return memoized;
		    }

		    // Expose `MapCache`.
		    memoize.Cache = MapCache;

		    /**
		     * Creates a function that negates the result of the predicate `func`. The
		     * `func` predicate is invoked with the `this` binding and arguments of the
		     * created function.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Function
		     * @param {Function} predicate The predicate to negate.
		     * @returns {Function} Returns the new negated function.
		     * @example
		     *
		     * function isEven(n) {
		     *   return n % 2 == 0;
		     * }
		     *
		     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
		     * // => [1, 3, 5]
		     */
		    function negate(predicate) {
		      if (typeof predicate != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      return function() {
		        var args = arguments;
		        switch (args.length) {
		          case 0: return !predicate.call(this);
		          case 1: return !predicate.call(this, args[0]);
		          case 2: return !predicate.call(this, args[0], args[1]);
		          case 3: return !predicate.call(this, args[0], args[1], args[2]);
		        }
		        return !predicate.apply(this, args);
		      };
		    }

		    /**
		     * Creates a function that is restricted to invoking `func` once. Repeat calls
		     * to the function return the value of the first invocation. The `func` is
		     * invoked with the `this` binding and arguments of the created function.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to restrict.
		     * @returns {Function} Returns the new restricted function.
		     * @example
		     *
		     * var initialize = _.once(createApplication);
		     * initialize();
		     * initialize();
		     * // => `createApplication` is invoked once
		     */
		    function once(func) {
		      return before(2, func);
		    }

		    /**
		     * Creates a function that invokes `func` with its arguments transformed.
		     *
		     * @static
		     * @since 4.0.0
		     * @memberOf _
		     * @category Function
		     * @param {Function} func The function to wrap.
		     * @param {...(Function|Function[])} [transforms=[_.identity]]
		     *  The argument transforms.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * function doubled(n) {
		     *   return n * 2;
		     * }
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * var func = _.overArgs(function(x, y) {
		     *   return [x, y];
		     * }, [square, doubled]);
		     *
		     * func(9, 3);
		     * // => [81, 6]
		     *
		     * func(10, 5);
		     * // => [100, 10]
		     */
		    var overArgs = castRest(function(func, transforms) {
		      transforms = (transforms.length == 1 && isArray(transforms[0]))
		        ? arrayMap(transforms[0], baseUnary(getIteratee()))
		        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

		      var funcsLength = transforms.length;
		      return baseRest(function(args) {
		        var index = -1,
		            length = nativeMin(args.length, funcsLength);

		        while (++index < length) {
		          args[index] = transforms[index].call(this, args[index]);
		        }
		        return apply(func, this, args);
		      });
		    });

		    /**
		     * Creates a function that invokes `func` with `partials` prepended to the
		     * arguments it receives. This method is like `_.bind` except it does **not**
		     * alter the `this` binding.
		     *
		     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
		     * builds, may be used as a placeholder for partially applied arguments.
		     *
		     * **Note:** This method doesn't set the "length" property of partially
		     * applied functions.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.2.0
		     * @category Function
		     * @param {Function} func The function to partially apply arguments to.
		     * @param {...*} [partials] The arguments to be partially applied.
		     * @returns {Function} Returns the new partially applied function.
		     * @example
		     *
		     * function greet(greeting, name) {
		     *   return greeting + ' ' + name;
		     * }
		     *
		     * var sayHelloTo = _.partial(greet, 'hello');
		     * sayHelloTo('fred');
		     * // => 'hello fred'
		     *
		     * // Partially applied with placeholders.
		     * var greetFred = _.partial(greet, _, 'fred');
		     * greetFred('hi');
		     * // => 'hi fred'
		     */
		    var partial = baseRest(function(func, partials) {
		      var holders = replaceHolders(partials, getHolder(partial));
		      return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
		    });

		    /**
		     * This method is like `_.partial` except that partially applied arguments
		     * are appended to the arguments it receives.
		     *
		     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
		     * builds, may be used as a placeholder for partially applied arguments.
		     *
		     * **Note:** This method doesn't set the "length" property of partially
		     * applied functions.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.0.0
		     * @category Function
		     * @param {Function} func The function to partially apply arguments to.
		     * @param {...*} [partials] The arguments to be partially applied.
		     * @returns {Function} Returns the new partially applied function.
		     * @example
		     *
		     * function greet(greeting, name) {
		     *   return greeting + ' ' + name;
		     * }
		     *
		     * var greetFred = _.partialRight(greet, 'fred');
		     * greetFred('hi');
		     * // => 'hi fred'
		     *
		     * // Partially applied with placeholders.
		     * var sayHelloTo = _.partialRight(greet, 'hello', _);
		     * sayHelloTo('fred');
		     * // => 'hello fred'
		     */
		    var partialRight = baseRest(function(func, partials) {
		      var holders = replaceHolders(partials, getHolder(partialRight));
		      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
		    });

		    /**
		     * Creates a function that invokes `func` with arguments arranged according
		     * to the specified `indexes` where the argument value at the first index is
		     * provided as the first argument, the argument value at the second index is
		     * provided as the second argument, and so on.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Function
		     * @param {Function} func The function to rearrange arguments for.
		     * @param {...(number|number[])} indexes The arranged argument indexes.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var rearged = _.rearg(function(a, b, c) {
		     *   return [a, b, c];
		     * }, [2, 0, 1]);
		     *
		     * rearged('b', 'c', 'a')
		     * // => ['a', 'b', 'c']
		     */
		    var rearg = flatRest(function(func, indexes) {
		      return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
		    });

		    /**
		     * Creates a function that invokes `func` with the `this` binding of the
		     * created function and arguments from `start` and beyond provided as
		     * an array.
		     *
		     * **Note:** This method is based on the
		     * [rest parameter](https://mdn.io/rest_parameters).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Function
		     * @param {Function} func The function to apply a rest parameter to.
		     * @param {number} [start=func.length-1] The start position of the rest parameter.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var say = _.rest(function(what, names) {
		     *   return what + ' ' + _.initial(names).join(', ') +
		     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
		     * });
		     *
		     * say('hello', 'fred', 'barney', 'pebbles');
		     * // => 'hello fred, barney, & pebbles'
		     */
		    function rest(func, start) {
		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      start = start === undefined$1 ? start : toInteger(start);
		      return baseRest(func, start);
		    }

		    /**
		     * Creates a function that invokes `func` with the `this` binding of the
		     * create function and an array of arguments much like
		     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
		     *
		     * **Note:** This method is based on the
		     * [spread operator](https://mdn.io/spread_operator).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.2.0
		     * @category Function
		     * @param {Function} func The function to spread arguments over.
		     * @param {number} [start=0] The start position of the spread.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var say = _.spread(function(who, what) {
		     *   return who + ' says ' + what;
		     * });
		     *
		     * say(['fred', 'hello']);
		     * // => 'fred says hello'
		     *
		     * var numbers = Promise.all([
		     *   Promise.resolve(40),
		     *   Promise.resolve(36)
		     * ]);
		     *
		     * numbers.then(_.spread(function(x, y) {
		     *   return x + y;
		     * }));
		     * // => a Promise of 76
		     */
		    function spread(func, start) {
		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      start = start == null ? 0 : nativeMax(toInteger(start), 0);
		      return baseRest(function(args) {
		        var array = args[start],
		            otherArgs = castSlice(args, 0, start);

		        if (array) {
		          arrayPush(otherArgs, array);
		        }
		        return apply(func, this, otherArgs);
		      });
		    }

		    /**
		     * Creates a throttled function that only invokes `func` at most once per
		     * every `wait` milliseconds. The throttled function comes with a `cancel`
		     * method to cancel delayed `func` invocations and a `flush` method to
		     * immediately invoke them. Provide `options` to indicate whether `func`
		     * should be invoked on the leading and/or trailing edge of the `wait`
		     * timeout. The `func` is invoked with the last arguments provided to the
		     * throttled function. Subsequent calls to the throttled function return the
		     * result of the last `func` invocation.
		     *
		     * **Note:** If `leading` and `trailing` options are `true`, `func` is
		     * invoked on the trailing edge of the timeout only if the throttled function
		     * is invoked more than once during the `wait` timeout.
		     *
		     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
		     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
		     *
		     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
		     * for details over the differences between `_.throttle` and `_.debounce`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {Function} func The function to throttle.
		     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
		     * @param {Object} [options={}] The options object.
		     * @param {boolean} [options.leading=true]
		     *  Specify invoking on the leading edge of the timeout.
		     * @param {boolean} [options.trailing=true]
		     *  Specify invoking on the trailing edge of the timeout.
		     * @returns {Function} Returns the new throttled function.
		     * @example
		     *
		     * // Avoid excessively updating the position while scrolling.
		     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
		     *
		     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
		     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
		     * jQuery(element).on('click', throttled);
		     *
		     * // Cancel the trailing throttled invocation.
		     * jQuery(window).on('popstate', throttled.cancel);
		     */
		    function throttle(func, wait, options) {
		      var leading = true,
		          trailing = true;

		      if (typeof func != 'function') {
		        throw new TypeError(FUNC_ERROR_TEXT);
		      }
		      if (isObject(options)) {
		        leading = 'leading' in options ? !!options.leading : leading;
		        trailing = 'trailing' in options ? !!options.trailing : trailing;
		      }
		      return debounce(func, wait, {
		        'leading': leading,
		        'maxWait': wait,
		        'trailing': trailing
		      });
		    }

		    /**
		     * Creates a function that accepts up to one argument, ignoring any
		     * additional arguments.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Function
		     * @param {Function} func The function to cap arguments for.
		     * @returns {Function} Returns the new capped function.
		     * @example
		     *
		     * _.map(['6', '8', '10'], _.unary(parseInt));
		     * // => [6, 8, 10]
		     */
		    function unary(func) {
		      return ary(func, 1);
		    }

		    /**
		     * Creates a function that provides `value` to `wrapper` as its first
		     * argument. Any additional arguments provided to the function are appended
		     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
		     * binding of the created function.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Function
		     * @param {*} value The value to wrap.
		     * @param {Function} [wrapper=identity] The wrapper function.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var p = _.wrap(_.escape, function(func, text) {
		     *   return '<p>' + func(text) + '</p>';
		     * });
		     *
		     * p('fred, barney, & pebbles');
		     * // => '<p>fred, barney, &amp; pebbles</p>'
		     */
		    function wrap(value, wrapper) {
		      return partial(castFunction(wrapper), value);
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Casts `value` as an array if it's not one.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.4.0
		     * @category Lang
		     * @param {*} value The value to inspect.
		     * @returns {Array} Returns the cast array.
		     * @example
		     *
		     * _.castArray(1);
		     * // => [1]
		     *
		     * _.castArray({ 'a': 1 });
		     * // => [{ 'a': 1 }]
		     *
		     * _.castArray('abc');
		     * // => ['abc']
		     *
		     * _.castArray(null);
		     * // => [null]
		     *
		     * _.castArray(undefined);
		     * // => [undefined]
		     *
		     * _.castArray();
		     * // => []
		     *
		     * var array = [1, 2, 3];
		     * console.log(_.castArray(array) === array);
		     * // => true
		     */
		    function castArray() {
		      if (!arguments.length) {
		        return [];
		      }
		      var value = arguments[0];
		      return isArray(value) ? value : [value];
		    }

		    /**
		     * Creates a shallow clone of `value`.
		     *
		     * **Note:** This method is loosely based on the
		     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
		     * and supports cloning arrays, array buffers, booleans, date objects, maps,
		     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
		     * arrays. The own enumerable properties of `arguments` objects are cloned
		     * as plain objects. An empty object is returned for uncloneable values such
		     * as error objects, functions, DOM nodes, and WeakMaps.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to clone.
		     * @returns {*} Returns the cloned value.
		     * @see _.cloneDeep
		     * @example
		     *
		     * var objects = [{ 'a': 1 }, { 'b': 2 }];
		     *
		     * var shallow = _.clone(objects);
		     * console.log(shallow[0] === objects[0]);
		     * // => true
		     */
		    function clone(value) {
		      return baseClone(value, CLONE_SYMBOLS_FLAG);
		    }

		    /**
		     * This method is like `_.clone` except that it accepts `customizer` which
		     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
		     * cloning is handled by the method instead. The `customizer` is invoked with
		     * up to four arguments; (value [, index|key, object, stack]).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to clone.
		     * @param {Function} [customizer] The function to customize cloning.
		     * @returns {*} Returns the cloned value.
		     * @see _.cloneDeepWith
		     * @example
		     *
		     * function customizer(value) {
		     *   if (_.isElement(value)) {
		     *     return value.cloneNode(false);
		     *   }
		     * }
		     *
		     * var el = _.cloneWith(document.body, customizer);
		     *
		     * console.log(el === document.body);
		     * // => false
		     * console.log(el.nodeName);
		     * // => 'BODY'
		     * console.log(el.childNodes.length);
		     * // => 0
		     */
		    function cloneWith(value, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
		    }

		    /**
		     * This method is like `_.clone` except that it recursively clones `value`.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.0.0
		     * @category Lang
		     * @param {*} value The value to recursively clone.
		     * @returns {*} Returns the deep cloned value.
		     * @see _.clone
		     * @example
		     *
		     * var objects = [{ 'a': 1 }, { 'b': 2 }];
		     *
		     * var deep = _.cloneDeep(objects);
		     * console.log(deep[0] === objects[0]);
		     * // => false
		     */
		    function cloneDeep(value) {
		      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
		    }

		    /**
		     * This method is like `_.cloneWith` except that it recursively clones `value`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to recursively clone.
		     * @param {Function} [customizer] The function to customize cloning.
		     * @returns {*} Returns the deep cloned value.
		     * @see _.cloneWith
		     * @example
		     *
		     * function customizer(value) {
		     *   if (_.isElement(value)) {
		     *     return value.cloneNode(true);
		     *   }
		     * }
		     *
		     * var el = _.cloneDeepWith(document.body, customizer);
		     *
		     * console.log(el === document.body);
		     * // => false
		     * console.log(el.nodeName);
		     * // => 'BODY'
		     * console.log(el.childNodes.length);
		     * // => 20
		     */
		    function cloneDeepWith(value, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
		    }

		    /**
		     * Checks if `object` conforms to `source` by invoking the predicate
		     * properties of `source` with the corresponding property values of `object`.
		     *
		     * **Note:** This method is equivalent to `_.conforms` when `source` is
		     * partially applied.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.14.0
		     * @category Lang
		     * @param {Object} object The object to inspect.
		     * @param {Object} source The object of property predicates to conform to.
		     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': 2 };
		     *
		     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
		     * // => true
		     *
		     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
		     * // => false
		     */
		    function conformsTo(object, source) {
		      return source == null || baseConformsTo(object, source, keys(source));
		    }

		    /**
		     * Performs a
		     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
		     * comparison between two values to determine if they are equivalent.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
		     * @example
		     *
		     * var object = { 'a': 1 };
		     * var other = { 'a': 1 };
		     *
		     * _.eq(object, object);
		     * // => true
		     *
		     * _.eq(object, other);
		     * // => false
		     *
		     * _.eq('a', 'a');
		     * // => true
		     *
		     * _.eq('a', Object('a'));
		     * // => false
		     *
		     * _.eq(NaN, NaN);
		     * // => true
		     */
		    function eq(value, other) {
		      return value === other || (value !== value && other !== other);
		    }

		    /**
		     * Checks if `value` is greater than `other`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.9.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is greater than `other`,
		     *  else `false`.
		     * @see _.lt
		     * @example
		     *
		     * _.gt(3, 1);
		     * // => true
		     *
		     * _.gt(3, 3);
		     * // => false
		     *
		     * _.gt(1, 3);
		     * // => false
		     */
		    var gt = createRelationalOperation(baseGt);

		    /**
		     * Checks if `value` is greater than or equal to `other`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.9.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is greater than or equal to
		     *  `other`, else `false`.
		     * @see _.lte
		     * @example
		     *
		     * _.gte(3, 1);
		     * // => true
		     *
		     * _.gte(3, 3);
		     * // => true
		     *
		     * _.gte(1, 3);
		     * // => false
		     */
		    var gte = createRelationalOperation(function(value, other) {
		      return value >= other;
		    });

		    /**
		     * Checks if `value` is likely an `arguments` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
		     *  else `false`.
		     * @example
		     *
		     * _.isArguments(function() { return arguments; }());
		     * // => true
		     *
		     * _.isArguments([1, 2, 3]);
		     * // => false
		     */
		    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
		      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
		        !propertyIsEnumerable.call(value, 'callee');
		    };

		    /**
		     * Checks if `value` is classified as an `Array` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
		     * @example
		     *
		     * _.isArray([1, 2, 3]);
		     * // => true
		     *
		     * _.isArray(document.body.children);
		     * // => false
		     *
		     * _.isArray('abc');
		     * // => false
		     *
		     * _.isArray(_.noop);
		     * // => false
		     */
		    var isArray = Array.isArray;

		    /**
		     * Checks if `value` is classified as an `ArrayBuffer` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
		     * @example
		     *
		     * _.isArrayBuffer(new ArrayBuffer(2));
		     * // => true
		     *
		     * _.isArrayBuffer(new Array(2));
		     * // => false
		     */
		    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

		    /**
		     * Checks if `value` is array-like. A value is considered array-like if it's
		     * not a function and has a `value.length` that's an integer greater than or
		     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
		     * @example
		     *
		     * _.isArrayLike([1, 2, 3]);
		     * // => true
		     *
		     * _.isArrayLike(document.body.children);
		     * // => true
		     *
		     * _.isArrayLike('abc');
		     * // => true
		     *
		     * _.isArrayLike(_.noop);
		     * // => false
		     */
		    function isArrayLike(value) {
		      return value != null && isLength(value.length) && !isFunction(value);
		    }

		    /**
		     * This method is like `_.isArrayLike` except that it also checks if `value`
		     * is an object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an array-like object,
		     *  else `false`.
		     * @example
		     *
		     * _.isArrayLikeObject([1, 2, 3]);
		     * // => true
		     *
		     * _.isArrayLikeObject(document.body.children);
		     * // => true
		     *
		     * _.isArrayLikeObject('abc');
		     * // => false
		     *
		     * _.isArrayLikeObject(_.noop);
		     * // => false
		     */
		    function isArrayLikeObject(value) {
		      return isObjectLike(value) && isArrayLike(value);
		    }

		    /**
		     * Checks if `value` is classified as a boolean primitive or object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
		     * @example
		     *
		     * _.isBoolean(false);
		     * // => true
		     *
		     * _.isBoolean(null);
		     * // => false
		     */
		    function isBoolean(value) {
		      return value === true || value === false ||
		        (isObjectLike(value) && baseGetTag(value) == boolTag);
		    }

		    /**
		     * Checks if `value` is a buffer.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
		     * @example
		     *
		     * _.isBuffer(new Buffer(2));
		     * // => true
		     *
		     * _.isBuffer(new Uint8Array(2));
		     * // => false
		     */
		    var isBuffer = nativeIsBuffer || stubFalse;

		    /**
		     * Checks if `value` is classified as a `Date` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
		     * @example
		     *
		     * _.isDate(new Date);
		     * // => true
		     *
		     * _.isDate('Mon April 23 2012');
		     * // => false
		     */
		    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

		    /**
		     * Checks if `value` is likely a DOM element.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
		     * @example
		     *
		     * _.isElement(document.body);
		     * // => true
		     *
		     * _.isElement('<body>');
		     * // => false
		     */
		    function isElement(value) {
		      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
		    }

		    /**
		     * Checks if `value` is an empty object, collection, map, or set.
		     *
		     * Objects are considered empty if they have no own enumerable string keyed
		     * properties.
		     *
		     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
		     * jQuery-like collections are considered empty if they have a `length` of `0`.
		     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
		     * @example
		     *
		     * _.isEmpty(null);
		     * // => true
		     *
		     * _.isEmpty(true);
		     * // => true
		     *
		     * _.isEmpty(1);
		     * // => true
		     *
		     * _.isEmpty([1, 2, 3]);
		     * // => false
		     *
		     * _.isEmpty({ 'a': 1 });
		     * // => false
		     */
		    function isEmpty(value) {
		      if (value == null) {
		        return true;
		      }
		      if (isArrayLike(value) &&
		          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
		            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
		        return !value.length;
		      }
		      var tag = getTag(value);
		      if (tag == mapTag || tag == setTag) {
		        return !value.size;
		      }
		      if (isPrototype(value)) {
		        return !baseKeys(value).length;
		      }
		      for (var key in value) {
		        if (hasOwnProperty.call(value, key)) {
		          return false;
		        }
		      }
		      return true;
		    }

		    /**
		     * Performs a deep comparison between two values to determine if they are
		     * equivalent.
		     *
		     * **Note:** This method supports comparing arrays, array buffers, booleans,
		     * date objects, error objects, maps, numbers, `Object` objects, regexes,
		     * sets, strings, symbols, and typed arrays. `Object` objects are compared
		     * by their own, not inherited, enumerable properties. Functions and DOM
		     * nodes are compared by strict equality, i.e. `===`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
		     * @example
		     *
		     * var object = { 'a': 1 };
		     * var other = { 'a': 1 };
		     *
		     * _.isEqual(object, other);
		     * // => true
		     *
		     * object === other;
		     * // => false
		     */
		    function isEqual(value, other) {
		      return baseIsEqual(value, other);
		    }

		    /**
		     * This method is like `_.isEqual` except that it accepts `customizer` which
		     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
		     * are handled by the method instead. The `customizer` is invoked with up to
		     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @param {Function} [customizer] The function to customize comparisons.
		     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
		     * @example
		     *
		     * function isGreeting(value) {
		     *   return /^h(?:i|ello)$/.test(value);
		     * }
		     *
		     * function customizer(objValue, othValue) {
		     *   if (isGreeting(objValue) && isGreeting(othValue)) {
		     *     return true;
		     *   }
		     * }
		     *
		     * var array = ['hello', 'goodbye'];
		     * var other = ['hi', 'goodbye'];
		     *
		     * _.isEqualWith(array, other, customizer);
		     * // => true
		     */
		    function isEqualWith(value, other, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      var result = customizer ? customizer(value, other) : undefined$1;
		      return result === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result;
		    }

		    /**
		     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
		     * `SyntaxError`, `TypeError`, or `URIError` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
		     * @example
		     *
		     * _.isError(new Error);
		     * // => true
		     *
		     * _.isError(Error);
		     * // => false
		     */
		    function isError(value) {
		      if (!isObjectLike(value)) {
		        return false;
		      }
		      var tag = baseGetTag(value);
		      return tag == errorTag || tag == domExcTag ||
		        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
		    }

		    /**
		     * Checks if `value` is a finite primitive number.
		     *
		     * **Note:** This method is based on
		     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
		     * @example
		     *
		     * _.isFinite(3);
		     * // => true
		     *
		     * _.isFinite(Number.MIN_VALUE);
		     * // => true
		     *
		     * _.isFinite(Infinity);
		     * // => false
		     *
		     * _.isFinite('3');
		     * // => false
		     */
		    function isFinite(value) {
		      return typeof value == 'number' && nativeIsFinite(value);
		    }

		    /**
		     * Checks if `value` is classified as a `Function` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
		     * @example
		     *
		     * _.isFunction(_);
		     * // => true
		     *
		     * _.isFunction(/abc/);
		     * // => false
		     */
		    function isFunction(value) {
		      if (!isObject(value)) {
		        return false;
		      }
		      // The use of `Object#toString` avoids issues with the `typeof` operator
		      // in Safari 9 which returns 'object' for typed arrays and other constructors.
		      var tag = baseGetTag(value);
		      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
		    }

		    /**
		     * Checks if `value` is an integer.
		     *
		     * **Note:** This method is based on
		     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
		     * @example
		     *
		     * _.isInteger(3);
		     * // => true
		     *
		     * _.isInteger(Number.MIN_VALUE);
		     * // => false
		     *
		     * _.isInteger(Infinity);
		     * // => false
		     *
		     * _.isInteger('3');
		     * // => false
		     */
		    function isInteger(value) {
		      return typeof value == 'number' && value == toInteger(value);
		    }

		    /**
		     * Checks if `value` is a valid array-like length.
		     *
		     * **Note:** This method is loosely based on
		     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
		     * @example
		     *
		     * _.isLength(3);
		     * // => true
		     *
		     * _.isLength(Number.MIN_VALUE);
		     * // => false
		     *
		     * _.isLength(Infinity);
		     * // => false
		     *
		     * _.isLength('3');
		     * // => false
		     */
		    function isLength(value) {
		      return typeof value == 'number' &&
		        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
		    }

		    /**
		     * Checks if `value` is the
		     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
		     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
		     * @example
		     *
		     * _.isObject({});
		     * // => true
		     *
		     * _.isObject([1, 2, 3]);
		     * // => true
		     *
		     * _.isObject(_.noop);
		     * // => true
		     *
		     * _.isObject(null);
		     * // => false
		     */
		    function isObject(value) {
		      var type = typeof value;
		      return value != null && (type == 'object' || type == 'function');
		    }

		    /**
		     * Checks if `value` is object-like. A value is object-like if it's not `null`
		     * and has a `typeof` result of "object".
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
		     * @example
		     *
		     * _.isObjectLike({});
		     * // => true
		     *
		     * _.isObjectLike([1, 2, 3]);
		     * // => true
		     *
		     * _.isObjectLike(_.noop);
		     * // => false
		     *
		     * _.isObjectLike(null);
		     * // => false
		     */
		    function isObjectLike(value) {
		      return value != null && typeof value == 'object';
		    }

		    /**
		     * Checks if `value` is classified as a `Map` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
		     * @example
		     *
		     * _.isMap(new Map);
		     * // => true
		     *
		     * _.isMap(new WeakMap);
		     * // => false
		     */
		    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

		    /**
		     * Performs a partial deep comparison between `object` and `source` to
		     * determine if `object` contains equivalent property values.
		     *
		     * **Note:** This method is equivalent to `_.matches` when `source` is
		     * partially applied.
		     *
		     * Partial comparisons will match empty array and empty object `source`
		     * values against any array or object value, respectively. See `_.isEqual`
		     * for a list of supported value comparisons.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Lang
		     * @param {Object} object The object to inspect.
		     * @param {Object} source The object of property values to match.
		     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': 2 };
		     *
		     * _.isMatch(object, { 'b': 2 });
		     * // => true
		     *
		     * _.isMatch(object, { 'b': 1 });
		     * // => false
		     */
		    function isMatch(object, source) {
		      return object === source || baseIsMatch(object, source, getMatchData(source));
		    }

		    /**
		     * This method is like `_.isMatch` except that it accepts `customizer` which
		     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
		     * are handled by the method instead. The `customizer` is invoked with five
		     * arguments: (objValue, srcValue, index|key, object, source).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {Object} object The object to inspect.
		     * @param {Object} source The object of property values to match.
		     * @param {Function} [customizer] The function to customize comparisons.
		     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
		     * @example
		     *
		     * function isGreeting(value) {
		     *   return /^h(?:i|ello)$/.test(value);
		     * }
		     *
		     * function customizer(objValue, srcValue) {
		     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
		     *     return true;
		     *   }
		     * }
		     *
		     * var object = { 'greeting': 'hello' };
		     * var source = { 'greeting': 'hi' };
		     *
		     * _.isMatchWith(object, source, customizer);
		     * // => true
		     */
		    function isMatchWith(object, source, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      return baseIsMatch(object, source, getMatchData(source), customizer);
		    }

		    /**
		     * Checks if `value` is `NaN`.
		     *
		     * **Note:** This method is based on
		     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
		     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
		     * `undefined` and other non-number values.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
		     * @example
		     *
		     * _.isNaN(NaN);
		     * // => true
		     *
		     * _.isNaN(new Number(NaN));
		     * // => true
		     *
		     * isNaN(undefined);
		     * // => true
		     *
		     * _.isNaN(undefined);
		     * // => false
		     */
		    function isNaN(value) {
		      // An `NaN` primitive is the only value that is not equal to itself.
		      // Perform the `toStringTag` check first to avoid errors with some
		      // ActiveX objects in IE.
		      return isNumber(value) && value != +value;
		    }

		    /**
		     * Checks if `value` is a pristine native function.
		     *
		     * **Note:** This method can't reliably detect native functions in the presence
		     * of the core-js package because core-js circumvents this kind of detection.
		     * Despite multiple requests, the core-js maintainer has made it clear: any
		     * attempt to fix the detection will be obstructed. As a result, we're left
		     * with little choice but to throw an error. Unfortunately, this also affects
		     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
		     * which rely on core-js.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a native function,
		     *  else `false`.
		     * @example
		     *
		     * _.isNative(Array.prototype.push);
		     * // => true
		     *
		     * _.isNative(_);
		     * // => false
		     */
		    function isNative(value) {
		      if (isMaskable(value)) {
		        throw new Error(CORE_ERROR_TEXT);
		      }
		      return baseIsNative(value);
		    }

		    /**
		     * Checks if `value` is `null`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
		     * @example
		     *
		     * _.isNull(null);
		     * // => true
		     *
		     * _.isNull(void 0);
		     * // => false
		     */
		    function isNull(value) {
		      return value === null;
		    }

		    /**
		     * Checks if `value` is `null` or `undefined`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
		     * @example
		     *
		     * _.isNil(null);
		     * // => true
		     *
		     * _.isNil(void 0);
		     * // => true
		     *
		     * _.isNil(NaN);
		     * // => false
		     */
		    function isNil(value) {
		      return value == null;
		    }

		    /**
		     * Checks if `value` is classified as a `Number` primitive or object.
		     *
		     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
		     * classified as numbers, use the `_.isFinite` method.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
		     * @example
		     *
		     * _.isNumber(3);
		     * // => true
		     *
		     * _.isNumber(Number.MIN_VALUE);
		     * // => true
		     *
		     * _.isNumber(Infinity);
		     * // => true
		     *
		     * _.isNumber('3');
		     * // => false
		     */
		    function isNumber(value) {
		      return typeof value == 'number' ||
		        (isObjectLike(value) && baseGetTag(value) == numberTag);
		    }

		    /**
		     * Checks if `value` is a plain object, that is, an object created by the
		     * `Object` constructor or one with a `[[Prototype]]` of `null`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.8.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     * }
		     *
		     * _.isPlainObject(new Foo);
		     * // => false
		     *
		     * _.isPlainObject([1, 2, 3]);
		     * // => false
		     *
		     * _.isPlainObject({ 'x': 0, 'y': 0 });
		     * // => true
		     *
		     * _.isPlainObject(Object.create(null));
		     * // => true
		     */
		    function isPlainObject(value) {
		      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
		        return false;
		      }
		      var proto = getPrototype(value);
		      if (proto === null) {
		        return true;
		      }
		      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
		      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
		        funcToString.call(Ctor) == objectCtorString;
		    }

		    /**
		     * Checks if `value` is classified as a `RegExp` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.1.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
		     * @example
		     *
		     * _.isRegExp(/abc/);
		     * // => true
		     *
		     * _.isRegExp('/abc/');
		     * // => false
		     */
		    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

		    /**
		     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
		     * double precision number which isn't the result of a rounded unsafe integer.
		     *
		     * **Note:** This method is based on
		     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
		     * @example
		     *
		     * _.isSafeInteger(3);
		     * // => true
		     *
		     * _.isSafeInteger(Number.MIN_VALUE);
		     * // => false
		     *
		     * _.isSafeInteger(Infinity);
		     * // => false
		     *
		     * _.isSafeInteger('3');
		     * // => false
		     */
		    function isSafeInteger(value) {
		      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
		    }

		    /**
		     * Checks if `value` is classified as a `Set` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
		     * @example
		     *
		     * _.isSet(new Set);
		     * // => true
		     *
		     * _.isSet(new WeakSet);
		     * // => false
		     */
		    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

		    /**
		     * Checks if `value` is classified as a `String` primitive or object.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
		     * @example
		     *
		     * _.isString('abc');
		     * // => true
		     *
		     * _.isString(1);
		     * // => false
		     */
		    function isString(value) {
		      return typeof value == 'string' ||
		        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
		    }

		    /**
		     * Checks if `value` is classified as a `Symbol` primitive or object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
		     * @example
		     *
		     * _.isSymbol(Symbol.iterator);
		     * // => true
		     *
		     * _.isSymbol('abc');
		     * // => false
		     */
		    function isSymbol(value) {
		      return typeof value == 'symbol' ||
		        (isObjectLike(value) && baseGetTag(value) == symbolTag);
		    }

		    /**
		     * Checks if `value` is classified as a typed array.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
		     * @example
		     *
		     * _.isTypedArray(new Uint8Array);
		     * // => true
		     *
		     * _.isTypedArray([]);
		     * // => false
		     */
		    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

		    /**
		     * Checks if `value` is `undefined`.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
		     * @example
		     *
		     * _.isUndefined(void 0);
		     * // => true
		     *
		     * _.isUndefined(null);
		     * // => false
		     */
		    function isUndefined(value) {
		      return value === undefined$1;
		    }

		    /**
		     * Checks if `value` is classified as a `WeakMap` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
		     * @example
		     *
		     * _.isWeakMap(new WeakMap);
		     * // => true
		     *
		     * _.isWeakMap(new Map);
		     * // => false
		     */
		    function isWeakMap(value) {
		      return isObjectLike(value) && getTag(value) == weakMapTag;
		    }

		    /**
		     * Checks if `value` is classified as a `WeakSet` object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.3.0
		     * @category Lang
		     * @param {*} value The value to check.
		     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
		     * @example
		     *
		     * _.isWeakSet(new WeakSet);
		     * // => true
		     *
		     * _.isWeakSet(new Set);
		     * // => false
		     */
		    function isWeakSet(value) {
		      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
		    }

		    /**
		     * Checks if `value` is less than `other`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.9.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is less than `other`,
		     *  else `false`.
		     * @see _.gt
		     * @example
		     *
		     * _.lt(1, 3);
		     * // => true
		     *
		     * _.lt(3, 3);
		     * // => false
		     *
		     * _.lt(3, 1);
		     * // => false
		     */
		    var lt = createRelationalOperation(baseLt);

		    /**
		     * Checks if `value` is less than or equal to `other`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.9.0
		     * @category Lang
		     * @param {*} value The value to compare.
		     * @param {*} other The other value to compare.
		     * @returns {boolean} Returns `true` if `value` is less than or equal to
		     *  `other`, else `false`.
		     * @see _.gte
		     * @example
		     *
		     * _.lte(1, 3);
		     * // => true
		     *
		     * _.lte(3, 3);
		     * // => true
		     *
		     * _.lte(3, 1);
		     * // => false
		     */
		    var lte = createRelationalOperation(function(value, other) {
		      return value <= other;
		    });

		    /**
		     * Converts `value` to an array.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {Array} Returns the converted array.
		     * @example
		     *
		     * _.toArray({ 'a': 1, 'b': 2 });
		     * // => [1, 2]
		     *
		     * _.toArray('abc');
		     * // => ['a', 'b', 'c']
		     *
		     * _.toArray(1);
		     * // => []
		     *
		     * _.toArray(null);
		     * // => []
		     */
		    function toArray(value) {
		      if (!value) {
		        return [];
		      }
		      if (isArrayLike(value)) {
		        return isString(value) ? stringToArray(value) : copyArray(value);
		      }
		      if (symIterator && value[symIterator]) {
		        return iteratorToArray(value[symIterator]());
		      }
		      var tag = getTag(value),
		          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

		      return func(value);
		    }

		    /**
		     * Converts `value` to a finite number.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.12.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {number} Returns the converted number.
		     * @example
		     *
		     * _.toFinite(3.2);
		     * // => 3.2
		     *
		     * _.toFinite(Number.MIN_VALUE);
		     * // => 5e-324
		     *
		     * _.toFinite(Infinity);
		     * // => 1.7976931348623157e+308
		     *
		     * _.toFinite('3.2');
		     * // => 3.2
		     */
		    function toFinite(value) {
		      if (!value) {
		        return value === 0 ? value : 0;
		      }
		      value = toNumber(value);
		      if (value === INFINITY || value === -INFINITY) {
		        var sign = (value < 0 ? -1 : 1);
		        return sign * MAX_INTEGER;
		      }
		      return value === value ? value : 0;
		    }

		    /**
		     * Converts `value` to an integer.
		     *
		     * **Note:** This method is loosely based on
		     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {number} Returns the converted integer.
		     * @example
		     *
		     * _.toInteger(3.2);
		     * // => 3
		     *
		     * _.toInteger(Number.MIN_VALUE);
		     * // => 0
		     *
		     * _.toInteger(Infinity);
		     * // => 1.7976931348623157e+308
		     *
		     * _.toInteger('3.2');
		     * // => 3
		     */
		    function toInteger(value) {
		      var result = toFinite(value),
		          remainder = result % 1;

		      return result === result ? (remainder ? result - remainder : result) : 0;
		    }

		    /**
		     * Converts `value` to an integer suitable for use as the length of an
		     * array-like object.
		     *
		     * **Note:** This method is based on
		     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {number} Returns the converted integer.
		     * @example
		     *
		     * _.toLength(3.2);
		     * // => 3
		     *
		     * _.toLength(Number.MIN_VALUE);
		     * // => 0
		     *
		     * _.toLength(Infinity);
		     * // => 4294967295
		     *
		     * _.toLength('3.2');
		     * // => 3
		     */
		    function toLength(value) {
		      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
		    }

		    /**
		     * Converts `value` to a number.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to process.
		     * @returns {number} Returns the number.
		     * @example
		     *
		     * _.toNumber(3.2);
		     * // => 3.2
		     *
		     * _.toNumber(Number.MIN_VALUE);
		     * // => 5e-324
		     *
		     * _.toNumber(Infinity);
		     * // => Infinity
		     *
		     * _.toNumber('3.2');
		     * // => 3.2
		     */
		    function toNumber(value) {
		      if (typeof value == 'number') {
		        return value;
		      }
		      if (isSymbol(value)) {
		        return NAN;
		      }
		      if (isObject(value)) {
		        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
		        value = isObject(other) ? (other + '') : other;
		      }
		      if (typeof value != 'string') {
		        return value === 0 ? value : +value;
		      }
		      value = baseTrim(value);
		      var isBinary = reIsBinary.test(value);
		      return (isBinary || reIsOctal.test(value))
		        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
		        : (reIsBadHex.test(value) ? NAN : +value);
		    }

		    /**
		     * Converts `value` to a plain object flattening inherited enumerable string
		     * keyed properties of `value` to own properties of the plain object.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {Object} Returns the converted plain object.
		     * @example
		     *
		     * function Foo() {
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.assign({ 'a': 1 }, new Foo);
		     * // => { 'a': 1, 'b': 2 }
		     *
		     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
		     * // => { 'a': 1, 'b': 2, 'c': 3 }
		     */
		    function toPlainObject(value) {
		      return copyObject(value, keysIn(value));
		    }

		    /**
		     * Converts `value` to a safe integer. A safe integer can be compared and
		     * represented correctly.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {number} Returns the converted integer.
		     * @example
		     *
		     * _.toSafeInteger(3.2);
		     * // => 3
		     *
		     * _.toSafeInteger(Number.MIN_VALUE);
		     * // => 0
		     *
		     * _.toSafeInteger(Infinity);
		     * // => 9007199254740991
		     *
		     * _.toSafeInteger('3.2');
		     * // => 3
		     */
		    function toSafeInteger(value) {
		      return value
		        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
		        : (value === 0 ? value : 0);
		    }

		    /**
		     * Converts `value` to a string. An empty string is returned for `null`
		     * and `undefined` values. The sign of `-0` is preserved.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Lang
		     * @param {*} value The value to convert.
		     * @returns {string} Returns the converted string.
		     * @example
		     *
		     * _.toString(null);
		     * // => ''
		     *
		     * _.toString(-0);
		     * // => '-0'
		     *
		     * _.toString([1, 2, 3]);
		     * // => '1,2,3'
		     */
		    function toString(value) {
		      return value == null ? '' : baseToString(value);
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Assigns own enumerable string keyed properties of source objects to the
		     * destination object. Source objects are applied from left to right.
		     * Subsequent sources overwrite property assignments of previous sources.
		     *
		     * **Note:** This method mutates `object` and is loosely based on
		     * [`Object.assign`](https://mdn.io/Object/assign).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.10.0
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} [sources] The source objects.
		     * @returns {Object} Returns `object`.
		     * @see _.assignIn
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     * }
		     *
		     * function Bar() {
		     *   this.c = 3;
		     * }
		     *
		     * Foo.prototype.b = 2;
		     * Bar.prototype.d = 4;
		     *
		     * _.assign({ 'a': 0 }, new Foo, new Bar);
		     * // => { 'a': 1, 'c': 3 }
		     */
		    var assign = createAssigner(function(object, source) {
		      if (isPrototype(source) || isArrayLike(source)) {
		        copyObject(source, keys(source), object);
		        return;
		      }
		      for (var key in source) {
		        if (hasOwnProperty.call(source, key)) {
		          assignValue(object, key, source[key]);
		        }
		      }
		    });

		    /**
		     * This method is like `_.assign` except that it iterates over own and
		     * inherited source properties.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @alias extend
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} [sources] The source objects.
		     * @returns {Object} Returns `object`.
		     * @see _.assign
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     * }
		     *
		     * function Bar() {
		     *   this.c = 3;
		     * }
		     *
		     * Foo.prototype.b = 2;
		     * Bar.prototype.d = 4;
		     *
		     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
		     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
		     */
		    var assignIn = createAssigner(function(object, source) {
		      copyObject(source, keysIn(source), object);
		    });

		    /**
		     * This method is like `_.assignIn` except that it accepts `customizer`
		     * which is invoked to produce the assigned values. If `customizer` returns
		     * `undefined`, assignment is handled by the method instead. The `customizer`
		     * is invoked with five arguments: (objValue, srcValue, key, object, source).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @alias extendWith
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} sources The source objects.
		     * @param {Function} [customizer] The function to customize assigned values.
		     * @returns {Object} Returns `object`.
		     * @see _.assignWith
		     * @example
		     *
		     * function customizer(objValue, srcValue) {
		     *   return _.isUndefined(objValue) ? srcValue : objValue;
		     * }
		     *
		     * var defaults = _.partialRight(_.assignInWith, customizer);
		     *
		     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
		     * // => { 'a': 1, 'b': 2 }
		     */
		    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
		      copyObject(source, keysIn(source), object, customizer);
		    });

		    /**
		     * This method is like `_.assign` except that it accepts `customizer`
		     * which is invoked to produce the assigned values. If `customizer` returns
		     * `undefined`, assignment is handled by the method instead. The `customizer`
		     * is invoked with five arguments: (objValue, srcValue, key, object, source).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} sources The source objects.
		     * @param {Function} [customizer] The function to customize assigned values.
		     * @returns {Object} Returns `object`.
		     * @see _.assignInWith
		     * @example
		     *
		     * function customizer(objValue, srcValue) {
		     *   return _.isUndefined(objValue) ? srcValue : objValue;
		     * }
		     *
		     * var defaults = _.partialRight(_.assignWith, customizer);
		     *
		     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
		     * // => { 'a': 1, 'b': 2 }
		     */
		    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
		      copyObject(source, keys(source), object, customizer);
		    });

		    /**
		     * Creates an array of values corresponding to `paths` of `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.0.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {...(string|string[])} [paths] The property paths to pick.
		     * @returns {Array} Returns the picked values.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
		     *
		     * _.at(object, ['a[0].b.c', 'a[1]']);
		     * // => [3, 4]
		     */
		    var at = flatRest(baseAt);

		    /**
		     * Creates an object that inherits from the `prototype` object. If a
		     * `properties` object is given, its own enumerable string keyed properties
		     * are assigned to the created object.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.3.0
		     * @category Object
		     * @param {Object} prototype The object to inherit from.
		     * @param {Object} [properties] The properties to assign to the object.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * function Shape() {
		     *   this.x = 0;
		     *   this.y = 0;
		     * }
		     *
		     * function Circle() {
		     *   Shape.call(this);
		     * }
		     *
		     * Circle.prototype = _.create(Shape.prototype, {
		     *   'constructor': Circle
		     * });
		     *
		     * var circle = new Circle;
		     * circle instanceof Circle;
		     * // => true
		     *
		     * circle instanceof Shape;
		     * // => true
		     */
		    function create(prototype, properties) {
		      var result = baseCreate(prototype);
		      return properties == null ? result : baseAssign(result, properties);
		    }

		    /**
		     * Assigns own and inherited enumerable string keyed properties of source
		     * objects to the destination object for all destination properties that
		     * resolve to `undefined`. Source objects are applied from left to right.
		     * Once a property is set, additional values of the same property are ignored.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} [sources] The source objects.
		     * @returns {Object} Returns `object`.
		     * @see _.defaultsDeep
		     * @example
		     *
		     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
		     * // => { 'a': 1, 'b': 2 }
		     */
		    var defaults = baseRest(function(object, sources) {
		      object = Object(object);

		      var index = -1;
		      var length = sources.length;
		      var guard = length > 2 ? sources[2] : undefined$1;

		      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
		        length = 1;
		      }

		      while (++index < length) {
		        var source = sources[index];
		        var props = keysIn(source);
		        var propsIndex = -1;
		        var propsLength = props.length;

		        while (++propsIndex < propsLength) {
		          var key = props[propsIndex];
		          var value = object[key];

		          if (value === undefined$1 ||
		              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
		            object[key] = source[key];
		          }
		        }
		      }

		      return object;
		    });

		    /**
		     * This method is like `_.defaults` except that it recursively assigns
		     * default properties.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.10.0
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} [sources] The source objects.
		     * @returns {Object} Returns `object`.
		     * @see _.defaults
		     * @example
		     *
		     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
		     * // => { 'a': { 'b': 2, 'c': 3 } }
		     */
		    var defaultsDeep = baseRest(function(args) {
		      args.push(undefined$1, customDefaultsMerge);
		      return apply(mergeWith, undefined$1, args);
		    });

		    /**
		     * This method is like `_.find` except that it returns the key of the first
		     * element `predicate` returns truthy for instead of the element itself.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.1.0
		     * @category Object
		     * @param {Object} object The object to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {string|undefined} Returns the key of the matched element,
		     *  else `undefined`.
		     * @example
		     *
		     * var users = {
		     *   'barney':  { 'age': 36, 'active': true },
		     *   'fred':    { 'age': 40, 'active': false },
		     *   'pebbles': { 'age': 1,  'active': true }
		     * };
		     *
		     * _.findKey(users, function(o) { return o.age < 40; });
		     * // => 'barney' (iteration order is not guaranteed)
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.findKey(users, { 'age': 1, 'active': true });
		     * // => 'pebbles'
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.findKey(users, ['active', false]);
		     * // => 'fred'
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.findKey(users, 'active');
		     * // => 'barney'
		     */
		    function findKey(object, predicate) {
		      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
		    }

		    /**
		     * This method is like `_.findKey` except that it iterates over elements of
		     * a collection in the opposite order.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Object
		     * @param {Object} object The object to inspect.
		     * @param {Function} [predicate=_.identity] The function invoked per iteration.
		     * @returns {string|undefined} Returns the key of the matched element,
		     *  else `undefined`.
		     * @example
		     *
		     * var users = {
		     *   'barney':  { 'age': 36, 'active': true },
		     *   'fred':    { 'age': 40, 'active': false },
		     *   'pebbles': { 'age': 1,  'active': true }
		     * };
		     *
		     * _.findLastKey(users, function(o) { return o.age < 40; });
		     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.findLastKey(users, { 'age': 36, 'active': true });
		     * // => 'barney'
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.findLastKey(users, ['active', false]);
		     * // => 'fred'
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.findLastKey(users, 'active');
		     * // => 'pebbles'
		     */
		    function findLastKey(object, predicate) {
		      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
		    }

		    /**
		     * Iterates over own and inherited enumerable string keyed properties of an
		     * object and invokes `iteratee` for each property. The iteratee is invoked
		     * with three arguments: (value, key, object). Iteratee functions may exit
		     * iteration early by explicitly returning `false`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.3.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     * @see _.forInRight
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.forIn(new Foo, function(value, key) {
		     *   console.log(key);
		     * });
		     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
		     */
		    function forIn(object, iteratee) {
		      return object == null
		        ? object
		        : baseFor(object, getIteratee(iteratee, 3), keysIn);
		    }

		    /**
		     * This method is like `_.forIn` except that it iterates over properties of
		     * `object` in the opposite order.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     * @see _.forIn
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.forInRight(new Foo, function(value, key) {
		     *   console.log(key);
		     * });
		     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
		     */
		    function forInRight(object, iteratee) {
		      return object == null
		        ? object
		        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
		    }

		    /**
		     * Iterates over own enumerable string keyed properties of an object and
		     * invokes `iteratee` for each property. The iteratee is invoked with three
		     * arguments: (value, key, object). Iteratee functions may exit iteration
		     * early by explicitly returning `false`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.3.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     * @see _.forOwnRight
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.forOwn(new Foo, function(value, key) {
		     *   console.log(key);
		     * });
		     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
		     */
		    function forOwn(object, iteratee) {
		      return object && baseForOwn(object, getIteratee(iteratee, 3));
		    }

		    /**
		     * This method is like `_.forOwn` except that it iterates over properties of
		     * `object` in the opposite order.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.0.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns `object`.
		     * @see _.forOwn
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.forOwnRight(new Foo, function(value, key) {
		     *   console.log(key);
		     * });
		     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
		     */
		    function forOwnRight(object, iteratee) {
		      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
		    }

		    /**
		     * Creates an array of function property names from own enumerable properties
		     * of `object`.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The object to inspect.
		     * @returns {Array} Returns the function names.
		     * @see _.functionsIn
		     * @example
		     *
		     * function Foo() {
		     *   this.a = _.constant('a');
		     *   this.b = _.constant('b');
		     * }
		     *
		     * Foo.prototype.c = _.constant('c');
		     *
		     * _.functions(new Foo);
		     * // => ['a', 'b']
		     */
		    function functions(object) {
		      return object == null ? [] : baseFunctions(object, keys(object));
		    }

		    /**
		     * Creates an array of function property names from own and inherited
		     * enumerable properties of `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The object to inspect.
		     * @returns {Array} Returns the function names.
		     * @see _.functions
		     * @example
		     *
		     * function Foo() {
		     *   this.a = _.constant('a');
		     *   this.b = _.constant('b');
		     * }
		     *
		     * Foo.prototype.c = _.constant('c');
		     *
		     * _.functionsIn(new Foo);
		     * // => ['a', 'b', 'c']
		     */
		    function functionsIn(object) {
		      return object == null ? [] : baseFunctions(object, keysIn(object));
		    }

		    /**
		     * Gets the value at `path` of `object`. If the resolved value is
		     * `undefined`, the `defaultValue` is returned in its place.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.7.0
		     * @category Object
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path of the property to get.
		     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
		     * @returns {*} Returns the resolved value.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
		     *
		     * _.get(object, 'a[0].b.c');
		     * // => 3
		     *
		     * _.get(object, ['a', '0', 'b', 'c']);
		     * // => 3
		     *
		     * _.get(object, 'a.b.c', 'default');
		     * // => 'default'
		     */
		    function get(object, path, defaultValue) {
		      var result = object == null ? undefined$1 : baseGet(object, path);
		      return result === undefined$1 ? defaultValue : result;
		    }

		    /**
		     * Checks if `path` is a direct property of `object`.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path to check.
		     * @returns {boolean} Returns `true` if `path` exists, else `false`.
		     * @example
		     *
		     * var object = { 'a': { 'b': 2 } };
		     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
		     *
		     * _.has(object, 'a');
		     * // => true
		     *
		     * _.has(object, 'a.b');
		     * // => true
		     *
		     * _.has(object, ['a', 'b']);
		     * // => true
		     *
		     * _.has(other, 'a');
		     * // => false
		     */
		    function has(object, path) {
		      return object != null && hasPath(object, path, baseHas);
		    }

		    /**
		     * Checks if `path` is a direct or inherited property of `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path to check.
		     * @returns {boolean} Returns `true` if `path` exists, else `false`.
		     * @example
		     *
		     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
		     *
		     * _.hasIn(object, 'a');
		     * // => true
		     *
		     * _.hasIn(object, 'a.b');
		     * // => true
		     *
		     * _.hasIn(object, ['a', 'b']);
		     * // => true
		     *
		     * _.hasIn(object, 'b');
		     * // => false
		     */
		    function hasIn(object, path) {
		      return object != null && hasPath(object, path, baseHasIn);
		    }

		    /**
		     * Creates an object composed of the inverted keys and values of `object`.
		     * If `object` contains duplicate values, subsequent values overwrite
		     * property assignments of previous values.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.7.0
		     * @category Object
		     * @param {Object} object The object to invert.
		     * @returns {Object} Returns the new inverted object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': 2, 'c': 1 };
		     *
		     * _.invert(object);
		     * // => { '1': 'c', '2': 'b' }
		     */
		    var invert = createInverter(function(result, value, key) {
		      if (value != null &&
		          typeof value.toString != 'function') {
		        value = nativeObjectToString.call(value);
		      }

		      result[value] = key;
		    }, constant(identity));

		    /**
		     * This method is like `_.invert` except that the inverted object is generated
		     * from the results of running each element of `object` thru `iteratee`. The
		     * corresponding inverted value of each inverted key is an array of keys
		     * responsible for generating the inverted value. The iteratee is invoked
		     * with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.1.0
		     * @category Object
		     * @param {Object} object The object to invert.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {Object} Returns the new inverted object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': 2, 'c': 1 };
		     *
		     * _.invertBy(object);
		     * // => { '1': ['a', 'c'], '2': ['b'] }
		     *
		     * _.invertBy(object, function(value) {
		     *   return 'group' + value;
		     * });
		     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
		     */
		    var invertBy = createInverter(function(result, value, key) {
		      if (value != null &&
		          typeof value.toString != 'function') {
		        value = nativeObjectToString.call(value);
		      }

		      if (hasOwnProperty.call(result, value)) {
		        result[value].push(key);
		      } else {
		        result[value] = [key];
		      }
		    }, getIteratee);

		    /**
		     * Invokes the method at `path` of `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path of the method to invoke.
		     * @param {...*} [args] The arguments to invoke the method with.
		     * @returns {*} Returns the result of the invoked method.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
		     *
		     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
		     * // => [2, 3]
		     */
		    var invoke = baseRest(baseInvoke);

		    /**
		     * Creates an array of the own enumerable property names of `object`.
		     *
		     * **Note:** Non-object values are coerced to objects. See the
		     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
		     * for more details.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.keys(new Foo);
		     * // => ['a', 'b'] (iteration order is not guaranteed)
		     *
		     * _.keys('hi');
		     * // => ['0', '1']
		     */
		    function keys(object) {
		      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
		    }

		    /**
		     * Creates an array of the own and inherited enumerable property names of `object`.
		     *
		     * **Note:** Non-object values are coerced to objects.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property names.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.keysIn(new Foo);
		     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
		     */
		    function keysIn(object) {
		      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
		    }

		    /**
		     * The opposite of `_.mapValues`; this method creates an object with the
		     * same values as `object` and keys generated by running each own enumerable
		     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
		     * with three arguments: (value, key, object).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.8.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns the new mapped object.
		     * @see _.mapValues
		     * @example
		     *
		     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
		     *   return key + value;
		     * });
		     * // => { 'a1': 1, 'b2': 2 }
		     */
		    function mapKeys(object, iteratee) {
		      var result = {};
		      iteratee = getIteratee(iteratee, 3);

		      baseForOwn(object, function(value, key, object) {
		        baseAssignValue(result, iteratee(value, key, object), value);
		      });
		      return result;
		    }

		    /**
		     * Creates an object with the same keys as `object` and values generated
		     * by running each own enumerable string keyed property of `object` thru
		     * `iteratee`. The iteratee is invoked with three arguments:
		     * (value, key, object).
		     *
		     * @static
		     * @memberOf _
		     * @since 2.4.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Object} Returns the new mapped object.
		     * @see _.mapKeys
		     * @example
		     *
		     * var users = {
		     *   'fred':    { 'user': 'fred',    'age': 40 },
		     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
		     * };
		     *
		     * _.mapValues(users, function(o) { return o.age; });
		     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.mapValues(users, 'age');
		     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
		     */
		    function mapValues(object, iteratee) {
		      var result = {};
		      iteratee = getIteratee(iteratee, 3);

		      baseForOwn(object, function(value, key, object) {
		        baseAssignValue(result, key, iteratee(value, key, object));
		      });
		      return result;
		    }

		    /**
		     * This method is like `_.assign` except that it recursively merges own and
		     * inherited enumerable string keyed properties of source objects into the
		     * destination object. Source properties that resolve to `undefined` are
		     * skipped if a destination value exists. Array and plain object properties
		     * are merged recursively. Other objects and value types are overridden by
		     * assignment. Source objects are applied from left to right. Subsequent
		     * sources overwrite property assignments of previous sources.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.5.0
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} [sources] The source objects.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var object = {
		     *   'a': [{ 'b': 2 }, { 'd': 4 }]
		     * };
		     *
		     * var other = {
		     *   'a': [{ 'c': 3 }, { 'e': 5 }]
		     * };
		     *
		     * _.merge(object, other);
		     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
		     */
		    var merge = createAssigner(function(object, source, srcIndex) {
		      baseMerge(object, source, srcIndex);
		    });

		    /**
		     * This method is like `_.merge` except that it accepts `customizer` which
		     * is invoked to produce the merged values of the destination and source
		     * properties. If `customizer` returns `undefined`, merging is handled by the
		     * method instead. The `customizer` is invoked with six arguments:
		     * (objValue, srcValue, key, object, source, stack).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The destination object.
		     * @param {...Object} sources The source objects.
		     * @param {Function} customizer The function to customize assigned values.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * function customizer(objValue, srcValue) {
		     *   if (_.isArray(objValue)) {
		     *     return objValue.concat(srcValue);
		     *   }
		     * }
		     *
		     * var object = { 'a': [1], 'b': [2] };
		     * var other = { 'a': [3], 'b': [4] };
		     *
		     * _.mergeWith(object, other, customizer);
		     * // => { 'a': [1, 3], 'b': [2, 4] }
		     */
		    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
		      baseMerge(object, source, srcIndex, customizer);
		    });

		    /**
		     * The opposite of `_.pick`; this method creates an object composed of the
		     * own and inherited enumerable property paths of `object` that are not omitted.
		     *
		     * **Note:** This method is considerably slower than `_.pick`.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The source object.
		     * @param {...(string|string[])} [paths] The property paths to omit.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': '2', 'c': 3 };
		     *
		     * _.omit(object, ['a', 'c']);
		     * // => { 'b': '2' }
		     */
		    var omit = flatRest(function(object, paths) {
		      var result = {};
		      if (object == null) {
		        return result;
		      }
		      var isDeep = false;
		      paths = arrayMap(paths, function(path) {
		        path = castPath(path, object);
		        isDeep || (isDeep = path.length > 1);
		        return path;
		      });
		      copyObject(object, getAllKeysIn(object), result);
		      if (isDeep) {
		        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
		      }
		      var length = paths.length;
		      while (length--) {
		        baseUnset(result, paths[length]);
		      }
		      return result;
		    });

		    /**
		     * The opposite of `_.pickBy`; this method creates an object composed of
		     * the own and inherited enumerable string keyed properties of `object` that
		     * `predicate` doesn't return truthy for. The predicate is invoked with two
		     * arguments: (value, key).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The source object.
		     * @param {Function} [predicate=_.identity] The function invoked per property.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': '2', 'c': 3 };
		     *
		     * _.omitBy(object, _.isNumber);
		     * // => { 'b': '2' }
		     */
		    function omitBy(object, predicate) {
		      return pickBy(object, negate(getIteratee(predicate)));
		    }

		    /**
		     * Creates an object composed of the picked `object` properties.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The source object.
		     * @param {...(string|string[])} [paths] The property paths to pick.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': '2', 'c': 3 };
		     *
		     * _.pick(object, ['a', 'c']);
		     * // => { 'a': 1, 'c': 3 }
		     */
		    var pick = flatRest(function(object, paths) {
		      return object == null ? {} : basePick(object, paths);
		    });

		    /**
		     * Creates an object composed of the `object` properties `predicate` returns
		     * truthy for. The predicate is invoked with two arguments: (value, key).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The source object.
		     * @param {Function} [predicate=_.identity] The function invoked per property.
		     * @returns {Object} Returns the new object.
		     * @example
		     *
		     * var object = { 'a': 1, 'b': '2', 'c': 3 };
		     *
		     * _.pickBy(object, _.isNumber);
		     * // => { 'a': 1, 'c': 3 }
		     */
		    function pickBy(object, predicate) {
		      if (object == null) {
		        return {};
		      }
		      var props = arrayMap(getAllKeysIn(object), function(prop) {
		        return [prop];
		      });
		      predicate = getIteratee(predicate);
		      return basePickBy(object, props, function(value, path) {
		        return predicate(value, path[0]);
		      });
		    }

		    /**
		     * This method is like `_.get` except that if the resolved value is a
		     * function it's invoked with the `this` binding of its parent object and
		     * its result is returned.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The object to query.
		     * @param {Array|string} path The path of the property to resolve.
		     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
		     * @returns {*} Returns the resolved value.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
		     *
		     * _.result(object, 'a[0].b.c1');
		     * // => 3
		     *
		     * _.result(object, 'a[0].b.c2');
		     * // => 4
		     *
		     * _.result(object, 'a[0].b.c3', 'default');
		     * // => 'default'
		     *
		     * _.result(object, 'a[0].b.c3', _.constant('default'));
		     * // => 'default'
		     */
		    function result(object, path, defaultValue) {
		      path = castPath(path, object);

		      var index = -1,
		          length = path.length;

		      // Ensure the loop is entered when path is empty.
		      if (!length) {
		        length = 1;
		        object = undefined$1;
		      }
		      while (++index < length) {
		        var value = object == null ? undefined$1 : object[toKey(path[index])];
		        if (value === undefined$1) {
		          index = length;
		          value = defaultValue;
		        }
		        object = isFunction(value) ? value.call(object) : value;
		      }
		      return object;
		    }

		    /**
		     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
		     * it's created. Arrays are created for missing index properties while objects
		     * are created for all other missing properties. Use `_.setWith` to customize
		     * `path` creation.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.7.0
		     * @category Object
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to set.
		     * @param {*} value The value to set.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
		     *
		     * _.set(object, 'a[0].b.c', 4);
		     * console.log(object.a[0].b.c);
		     * // => 4
		     *
		     * _.set(object, ['x', '0', 'y', 'z'], 5);
		     * console.log(object.x[0].y.z);
		     * // => 5
		     */
		    function set(object, path, value) {
		      return object == null ? object : baseSet(object, path, value);
		    }

		    /**
		     * This method is like `_.set` except that it accepts `customizer` which is
		     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
		     * path creation is handled by the method instead. The `customizer` is invoked
		     * with three arguments: (nsValue, key, nsObject).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to set.
		     * @param {*} value The value to set.
		     * @param {Function} [customizer] The function to customize assigned values.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var object = {};
		     *
		     * _.setWith(object, '[0][1]', 'a', Object);
		     * // => { '0': { '1': 'a' } }
		     */
		    function setWith(object, path, value, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      return object == null ? object : baseSet(object, path, value, customizer);
		    }

		    /**
		     * Creates an array of own enumerable string keyed-value pairs for `object`
		     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
		     * entries are returned.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @alias entries
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the key-value pairs.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.toPairs(new Foo);
		     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
		     */
		    var toPairs = createToPairs(keys);

		    /**
		     * Creates an array of own and inherited enumerable string keyed-value pairs
		     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
		     * or set, its entries are returned.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @alias entriesIn
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the key-value pairs.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.toPairsIn(new Foo);
		     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
		     */
		    var toPairsIn = createToPairs(keysIn);

		    /**
		     * An alternative to `_.reduce`; this method transforms `object` to a new
		     * `accumulator` object which is the result of running each of its own
		     * enumerable string keyed properties thru `iteratee`, with each invocation
		     * potentially mutating the `accumulator` object. If `accumulator` is not
		     * provided, a new object with the same `[[Prototype]]` will be used. The
		     * iteratee is invoked with four arguments: (accumulator, value, key, object).
		     * Iteratee functions may exit iteration early by explicitly returning `false`.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.3.0
		     * @category Object
		     * @param {Object} object The object to iterate over.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @param {*} [accumulator] The custom accumulator value.
		     * @returns {*} Returns the accumulated value.
		     * @example
		     *
		     * _.transform([2, 3, 4], function(result, n) {
		     *   result.push(n *= n);
		     *   return n % 2 == 0;
		     * }, []);
		     * // => [4, 9]
		     *
		     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
		     *   (result[value] || (result[value] = [])).push(key);
		     * }, {});
		     * // => { '1': ['a', 'c'], '2': ['b'] }
		     */
		    function transform(object, iteratee, accumulator) {
		      var isArr = isArray(object),
		          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

		      iteratee = getIteratee(iteratee, 4);
		      if (accumulator == null) {
		        var Ctor = object && object.constructor;
		        if (isArrLike) {
		          accumulator = isArr ? new Ctor : [];
		        }
		        else if (isObject(object)) {
		          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
		        }
		        else {
		          accumulator = {};
		        }
		      }
		      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
		        return iteratee(accumulator, value, index, object);
		      });
		      return accumulator;
		    }

		    /**
		     * Removes the property at `path` of `object`.
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Object
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to unset.
		     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
		     * _.unset(object, 'a[0].b.c');
		     * // => true
		     *
		     * console.log(object);
		     * // => { 'a': [{ 'b': {} }] };
		     *
		     * _.unset(object, ['a', '0', 'b', 'c']);
		     * // => true
		     *
		     * console.log(object);
		     * // => { 'a': [{ 'b': {} }] };
		     */
		    function unset(object, path) {
		      return object == null ? true : baseUnset(object, path);
		    }

		    /**
		     * This method is like `_.set` except that accepts `updater` to produce the
		     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
		     * is invoked with one argument: (value).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.6.0
		     * @category Object
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to set.
		     * @param {Function} updater The function to produce the updated value.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
		     *
		     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
		     * console.log(object.a[0].b.c);
		     * // => 9
		     *
		     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
		     * console.log(object.x[0].y.z);
		     * // => 0
		     */
		    function update(object, path, updater) {
		      return object == null ? object : baseUpdate(object, path, castFunction(updater));
		    }

		    /**
		     * This method is like `_.update` except that it accepts `customizer` which is
		     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
		     * path creation is handled by the method instead. The `customizer` is invoked
		     * with three arguments: (nsValue, key, nsObject).
		     *
		     * **Note:** This method mutates `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.6.0
		     * @category Object
		     * @param {Object} object The object to modify.
		     * @param {Array|string} path The path of the property to set.
		     * @param {Function} updater The function to produce the updated value.
		     * @param {Function} [customizer] The function to customize assigned values.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var object = {};
		     *
		     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
		     * // => { '0': { '1': 'a' } }
		     */
		    function updateWith(object, path, updater, customizer) {
		      customizer = typeof customizer == 'function' ? customizer : undefined$1;
		      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
		    }

		    /**
		     * Creates an array of the own enumerable string keyed property values of `object`.
		     *
		     * **Note:** Non-object values are coerced to objects.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property values.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.values(new Foo);
		     * // => [1, 2] (iteration order is not guaranteed)
		     *
		     * _.values('hi');
		     * // => ['h', 'i']
		     */
		    function values(object) {
		      return object == null ? [] : baseValues(object, keys(object));
		    }

		    /**
		     * Creates an array of the own and inherited enumerable string keyed property
		     * values of `object`.
		     *
		     * **Note:** Non-object values are coerced to objects.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Object
		     * @param {Object} object The object to query.
		     * @returns {Array} Returns the array of property values.
		     * @example
		     *
		     * function Foo() {
		     *   this.a = 1;
		     *   this.b = 2;
		     * }
		     *
		     * Foo.prototype.c = 3;
		     *
		     * _.valuesIn(new Foo);
		     * // => [1, 2, 3] (iteration order is not guaranteed)
		     */
		    function valuesIn(object) {
		      return object == null ? [] : baseValues(object, keysIn(object));
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Clamps `number` within the inclusive `lower` and `upper` bounds.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Number
		     * @param {number} number The number to clamp.
		     * @param {number} [lower] The lower bound.
		     * @param {number} upper The upper bound.
		     * @returns {number} Returns the clamped number.
		     * @example
		     *
		     * _.clamp(-10, -5, 5);
		     * // => -5
		     *
		     * _.clamp(10, -5, 5);
		     * // => 5
		     */
		    function clamp(number, lower, upper) {
		      if (upper === undefined$1) {
		        upper = lower;
		        lower = undefined$1;
		      }
		      if (upper !== undefined$1) {
		        upper = toNumber(upper);
		        upper = upper === upper ? upper : 0;
		      }
		      if (lower !== undefined$1) {
		        lower = toNumber(lower);
		        lower = lower === lower ? lower : 0;
		      }
		      return baseClamp(toNumber(number), lower, upper);
		    }

		    /**
		     * Checks if `n` is between `start` and up to, but not including, `end`. If
		     * `end` is not specified, it's set to `start` with `start` then set to `0`.
		     * If `start` is greater than `end` the params are swapped to support
		     * negative ranges.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.3.0
		     * @category Number
		     * @param {number} number The number to check.
		     * @param {number} [start=0] The start of the range.
		     * @param {number} end The end of the range.
		     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
		     * @see _.range, _.rangeRight
		     * @example
		     *
		     * _.inRange(3, 2, 4);
		     * // => true
		     *
		     * _.inRange(4, 8);
		     * // => true
		     *
		     * _.inRange(4, 2);
		     * // => false
		     *
		     * _.inRange(2, 2);
		     * // => false
		     *
		     * _.inRange(1.2, 2);
		     * // => true
		     *
		     * _.inRange(5.2, 4);
		     * // => false
		     *
		     * _.inRange(-3, -2, -6);
		     * // => true
		     */
		    function inRange(number, start, end) {
		      start = toFinite(start);
		      if (end === undefined$1) {
		        end = start;
		        start = 0;
		      } else {
		        end = toFinite(end);
		      }
		      number = toNumber(number);
		      return baseInRange(number, start, end);
		    }

		    /**
		     * Produces a random number between the inclusive `lower` and `upper` bounds.
		     * If only one argument is provided a number between `0` and the given number
		     * is returned. If `floating` is `true`, or either `lower` or `upper` are
		     * floats, a floating-point number is returned instead of an integer.
		     *
		     * **Note:** JavaScript follows the IEEE-754 standard for resolving
		     * floating-point values which can produce unexpected results.
		     *
		     * @static
		     * @memberOf _
		     * @since 0.7.0
		     * @category Number
		     * @param {number} [lower=0] The lower bound.
		     * @param {number} [upper=1] The upper bound.
		     * @param {boolean} [floating] Specify returning a floating-point number.
		     * @returns {number} Returns the random number.
		     * @example
		     *
		     * _.random(0, 5);
		     * // => an integer between 0 and 5
		     *
		     * _.random(5);
		     * // => also an integer between 0 and 5
		     *
		     * _.random(5, true);
		     * // => a floating-point number between 0 and 5
		     *
		     * _.random(1.2, 5.2);
		     * // => a floating-point number between 1.2 and 5.2
		     */
		    function random(lower, upper, floating) {
		      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
		        upper = floating = undefined$1;
		      }
		      if (floating === undefined$1) {
		        if (typeof upper == 'boolean') {
		          floating = upper;
		          upper = undefined$1;
		        }
		        else if (typeof lower == 'boolean') {
		          floating = lower;
		          lower = undefined$1;
		        }
		      }
		      if (lower === undefined$1 && upper === undefined$1) {
		        lower = 0;
		        upper = 1;
		      }
		      else {
		        lower = toFinite(lower);
		        if (upper === undefined$1) {
		          upper = lower;
		          lower = 0;
		        } else {
		          upper = toFinite(upper);
		        }
		      }
		      if (lower > upper) {
		        var temp = lower;
		        lower = upper;
		        upper = temp;
		      }
		      if (floating || lower % 1 || upper % 1) {
		        var rand = nativeRandom();
		        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
		      }
		      return baseRandom(lower, upper);
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the camel cased string.
		     * @example
		     *
		     * _.camelCase('Foo Bar');
		     * // => 'fooBar'
		     *
		     * _.camelCase('--foo-bar--');
		     * // => 'fooBar'
		     *
		     * _.camelCase('__FOO_BAR__');
		     * // => 'fooBar'
		     */
		    var camelCase = createCompounder(function(result, word, index) {
		      word = word.toLowerCase();
		      return result + (index ? capitalize(word) : word);
		    });

		    /**
		     * Converts the first character of `string` to upper case and the remaining
		     * to lower case.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to capitalize.
		     * @returns {string} Returns the capitalized string.
		     * @example
		     *
		     * _.capitalize('FRED');
		     * // => 'Fred'
		     */
		    function capitalize(string) {
		      return upperFirst(toString(string).toLowerCase());
		    }

		    /**
		     * Deburrs `string` by converting
		     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
		     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
		     * letters to basic Latin letters and removing
		     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to deburr.
		     * @returns {string} Returns the deburred string.
		     * @example
		     *
		     * _.deburr('déjà vu');
		     * // => 'deja vu'
		     */
		    function deburr(string) {
		      string = toString(string);
		      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
		    }

		    /**
		     * Checks if `string` ends with the given target string.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to inspect.
		     * @param {string} [target] The string to search for.
		     * @param {number} [position=string.length] The position to search up to.
		     * @returns {boolean} Returns `true` if `string` ends with `target`,
		     *  else `false`.
		     * @example
		     *
		     * _.endsWith('abc', 'c');
		     * // => true
		     *
		     * _.endsWith('abc', 'b');
		     * // => false
		     *
		     * _.endsWith('abc', 'b', 2);
		     * // => true
		     */
		    function endsWith(string, target, position) {
		      string = toString(string);
		      target = baseToString(target);

		      var length = string.length;
		      position = position === undefined$1
		        ? length
		        : baseClamp(toInteger(position), 0, length);

		      var end = position;
		      position -= target.length;
		      return position >= 0 && string.slice(position, end) == target;
		    }

		    /**
		     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
		     * corresponding HTML entities.
		     *
		     * **Note:** No other characters are escaped. To escape additional
		     * characters use a third-party library like [_he_](https://mths.be/he).
		     *
		     * Though the ">" character is escaped for symmetry, characters like
		     * ">" and "/" don't need escaping in HTML and have no special meaning
		     * unless they're part of a tag or unquoted attribute value. See
		     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
		     * (under "semi-related fun fact") for more details.
		     *
		     * When working with HTML you should always
		     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
		     * XSS vectors.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category String
		     * @param {string} [string=''] The string to escape.
		     * @returns {string} Returns the escaped string.
		     * @example
		     *
		     * _.escape('fred, barney, & pebbles');
		     * // => 'fred, barney, &amp; pebbles'
		     */
		    function escape(string) {
		      string = toString(string);
		      return (string && reHasUnescapedHtml.test(string))
		        ? string.replace(reUnescapedHtml, escapeHtmlChar)
		        : string;
		    }

		    /**
		     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
		     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to escape.
		     * @returns {string} Returns the escaped string.
		     * @example
		     *
		     * _.escapeRegExp('[lodash](https://lodash.com/)');
		     * // => '\[lodash\]\(https://lodash\.com/\)'
		     */
		    function escapeRegExp(string) {
		      string = toString(string);
		      return (string && reHasRegExpChar.test(string))
		        ? string.replace(reRegExpChar, '\\$&')
		        : string;
		    }

		    /**
		     * Converts `string` to
		     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the kebab cased string.
		     * @example
		     *
		     * _.kebabCase('Foo Bar');
		     * // => 'foo-bar'
		     *
		     * _.kebabCase('fooBar');
		     * // => 'foo-bar'
		     *
		     * _.kebabCase('__FOO_BAR__');
		     * // => 'foo-bar'
		     */
		    var kebabCase = createCompounder(function(result, word, index) {
		      return result + (index ? '-' : '') + word.toLowerCase();
		    });

		    /**
		     * Converts `string`, as space separated words, to lower case.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the lower cased string.
		     * @example
		     *
		     * _.lowerCase('--Foo-Bar--');
		     * // => 'foo bar'
		     *
		     * _.lowerCase('fooBar');
		     * // => 'foo bar'
		     *
		     * _.lowerCase('__FOO_BAR__');
		     * // => 'foo bar'
		     */
		    var lowerCase = createCompounder(function(result, word, index) {
		      return result + (index ? ' ' : '') + word.toLowerCase();
		    });

		    /**
		     * Converts the first character of `string` to lower case.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the converted string.
		     * @example
		     *
		     * _.lowerFirst('Fred');
		     * // => 'fred'
		     *
		     * _.lowerFirst('FRED');
		     * // => 'fRED'
		     */
		    var lowerFirst = createCaseFirst('toLowerCase');

		    /**
		     * Pads `string` on the left and right sides if it's shorter than `length`.
		     * Padding characters are truncated if they can't be evenly divided by `length`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to pad.
		     * @param {number} [length=0] The padding length.
		     * @param {string} [chars=' '] The string used as padding.
		     * @returns {string} Returns the padded string.
		     * @example
		     *
		     * _.pad('abc', 8);
		     * // => '  abc   '
		     *
		     * _.pad('abc', 8, '_-');
		     * // => '_-abc_-_'
		     *
		     * _.pad('abc', 3);
		     * // => 'abc'
		     */
		    function pad(string, length, chars) {
		      string = toString(string);
		      length = toInteger(length);

		      var strLength = length ? stringSize(string) : 0;
		      if (!length || strLength >= length) {
		        return string;
		      }
		      var mid = (length - strLength) / 2;
		      return (
		        createPadding(nativeFloor(mid), chars) +
		        string +
		        createPadding(nativeCeil(mid), chars)
		      );
		    }

		    /**
		     * Pads `string` on the right side if it's shorter than `length`. Padding
		     * characters are truncated if they exceed `length`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to pad.
		     * @param {number} [length=0] The padding length.
		     * @param {string} [chars=' '] The string used as padding.
		     * @returns {string} Returns the padded string.
		     * @example
		     *
		     * _.padEnd('abc', 6);
		     * // => 'abc   '
		     *
		     * _.padEnd('abc', 6, '_-');
		     * // => 'abc_-_'
		     *
		     * _.padEnd('abc', 3);
		     * // => 'abc'
		     */
		    function padEnd(string, length, chars) {
		      string = toString(string);
		      length = toInteger(length);

		      var strLength = length ? stringSize(string) : 0;
		      return (length && strLength < length)
		        ? (string + createPadding(length - strLength, chars))
		        : string;
		    }

		    /**
		     * Pads `string` on the left side if it's shorter than `length`. Padding
		     * characters are truncated if they exceed `length`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to pad.
		     * @param {number} [length=0] The padding length.
		     * @param {string} [chars=' '] The string used as padding.
		     * @returns {string} Returns the padded string.
		     * @example
		     *
		     * _.padStart('abc', 6);
		     * // => '   abc'
		     *
		     * _.padStart('abc', 6, '_-');
		     * // => '_-_abc'
		     *
		     * _.padStart('abc', 3);
		     * // => 'abc'
		     */
		    function padStart(string, length, chars) {
		      string = toString(string);
		      length = toInteger(length);

		      var strLength = length ? stringSize(string) : 0;
		      return (length && strLength < length)
		        ? (createPadding(length - strLength, chars) + string)
		        : string;
		    }

		    /**
		     * Converts `string` to an integer of the specified radix. If `radix` is
		     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
		     * hexadecimal, in which case a `radix` of `16` is used.
		     *
		     * **Note:** This method aligns with the
		     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
		     *
		     * @static
		     * @memberOf _
		     * @since 1.1.0
		     * @category String
		     * @param {string} string The string to convert.
		     * @param {number} [radix=10] The radix to interpret `value` by.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {number} Returns the converted integer.
		     * @example
		     *
		     * _.parseInt('08');
		     * // => 8
		     *
		     * _.map(['6', '08', '10'], _.parseInt);
		     * // => [6, 8, 10]
		     */
		    function parseInt(string, radix, guard) {
		      if (guard || radix == null) {
		        radix = 0;
		      } else if (radix) {
		        radix = +radix;
		      }
		      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
		    }

		    /**
		     * Repeats the given string `n` times.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to repeat.
		     * @param {number} [n=1] The number of times to repeat the string.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {string} Returns the repeated string.
		     * @example
		     *
		     * _.repeat('*', 3);
		     * // => '***'
		     *
		     * _.repeat('abc', 2);
		     * // => 'abcabc'
		     *
		     * _.repeat('abc', 0);
		     * // => ''
		     */
		    function repeat(string, n, guard) {
		      if ((guard ? isIterateeCall(string, n, guard) : n === undefined$1)) {
		        n = 1;
		      } else {
		        n = toInteger(n);
		      }
		      return baseRepeat(toString(string), n);
		    }

		    /**
		     * Replaces matches for `pattern` in `string` with `replacement`.
		     *
		     * **Note:** This method is based on
		     * [`String#replace`](https://mdn.io/String/replace).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to modify.
		     * @param {RegExp|string} pattern The pattern to replace.
		     * @param {Function|string} replacement The match replacement.
		     * @returns {string} Returns the modified string.
		     * @example
		     *
		     * _.replace('Hi Fred', 'Fred', 'Barney');
		     * // => 'Hi Barney'
		     */
		    function replace() {
		      var args = arguments,
		          string = toString(args[0]);

		      return args.length < 3 ? string : string.replace(args[1], args[2]);
		    }

		    /**
		     * Converts `string` to
		     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the snake cased string.
		     * @example
		     *
		     * _.snakeCase('Foo Bar');
		     * // => 'foo_bar'
		     *
		     * _.snakeCase('fooBar');
		     * // => 'foo_bar'
		     *
		     * _.snakeCase('--FOO-BAR--');
		     * // => 'foo_bar'
		     */
		    var snakeCase = createCompounder(function(result, word, index) {
		      return result + (index ? '_' : '') + word.toLowerCase();
		    });

		    /**
		     * Splits `string` by `separator`.
		     *
		     * **Note:** This method is based on
		     * [`String#split`](https://mdn.io/String/split).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to split.
		     * @param {RegExp|string} separator The separator pattern to split by.
		     * @param {number} [limit] The length to truncate results to.
		     * @returns {Array} Returns the string segments.
		     * @example
		     *
		     * _.split('a-b-c', '-', 2);
		     * // => ['a', 'b']
		     */
		    function split(string, separator, limit) {
		      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
		        separator = limit = undefined$1;
		      }
		      limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
		      if (!limit) {
		        return [];
		      }
		      string = toString(string);
		      if (string && (
		            typeof separator == 'string' ||
		            (separator != null && !isRegExp(separator))
		          )) {
		        separator = baseToString(separator);
		        if (!separator && hasUnicode(string)) {
		          return castSlice(stringToArray(string), 0, limit);
		        }
		      }
		      return string.split(separator, limit);
		    }

		    /**
		     * Converts `string` to
		     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
		     *
		     * @static
		     * @memberOf _
		     * @since 3.1.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the start cased string.
		     * @example
		     *
		     * _.startCase('--foo-bar--');
		     * // => 'Foo Bar'
		     *
		     * _.startCase('fooBar');
		     * // => 'Foo Bar'
		     *
		     * _.startCase('__FOO_BAR__');
		     * // => 'FOO BAR'
		     */
		    var startCase = createCompounder(function(result, word, index) {
		      return result + (index ? ' ' : '') + upperFirst(word);
		    });

		    /**
		     * Checks if `string` starts with the given target string.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to inspect.
		     * @param {string} [target] The string to search for.
		     * @param {number} [position=0] The position to search from.
		     * @returns {boolean} Returns `true` if `string` starts with `target`,
		     *  else `false`.
		     * @example
		     *
		     * _.startsWith('abc', 'a');
		     * // => true
		     *
		     * _.startsWith('abc', 'b');
		     * // => false
		     *
		     * _.startsWith('abc', 'b', 1);
		     * // => true
		     */
		    function startsWith(string, target, position) {
		      string = toString(string);
		      position = position == null
		        ? 0
		        : baseClamp(toInteger(position), 0, string.length);

		      target = baseToString(target);
		      return string.slice(position, position + target.length) == target;
		    }

		    /**
		     * Creates a compiled template function that can interpolate data properties
		     * in "interpolate" delimiters, HTML-escape interpolated data properties in
		     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
		     * properties may be accessed as free variables in the template. If a setting
		     * object is given, it takes precedence over `_.templateSettings` values.
		     *
		     * **Note:** In the development build `_.template` utilizes
		     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
		     * for easier debugging.
		     *
		     * For more information on precompiling templates see
		     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
		     *
		     * For more information on Chrome extension sandboxes see
		     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category String
		     * @param {string} [string=''] The template string.
		     * @param {Object} [options={}] The options object.
		     * @param {RegExp} [options.escape=_.templateSettings.escape]
		     *  The HTML "escape" delimiter.
		     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
		     *  The "evaluate" delimiter.
		     * @param {Object} [options.imports=_.templateSettings.imports]
		     *  An object to import into the template as free variables.
		     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
		     *  The "interpolate" delimiter.
		     * @param {string} [options.sourceURL='lodash.templateSources[n]']
		     *  The sourceURL of the compiled template.
		     * @param {string} [options.variable='obj']
		     *  The data object variable name.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Function} Returns the compiled template function.
		     * @example
		     *
		     * // Use the "interpolate" delimiter to create a compiled template.
		     * var compiled = _.template('hello <%= user %>!');
		     * compiled({ 'user': 'fred' });
		     * // => 'hello fred!'
		     *
		     * // Use the HTML "escape" delimiter to escape data property values.
		     * var compiled = _.template('<b><%- value %></b>');
		     * compiled({ 'value': '<script>' });
		     * // => '<b>&lt;script&gt;</b>'
		     *
		     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
		     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
		     * compiled({ 'users': ['fred', 'barney'] });
		     * // => '<li>fred</li><li>barney</li>'
		     *
		     * // Use the internal `print` function in "evaluate" delimiters.
		     * var compiled = _.template('<% print("hello " + user); %>!');
		     * compiled({ 'user': 'barney' });
		     * // => 'hello barney!'
		     *
		     * // Use the ES template literal delimiter as an "interpolate" delimiter.
		     * // Disable support by replacing the "interpolate" delimiter.
		     * var compiled = _.template('hello ${ user }!');
		     * compiled({ 'user': 'pebbles' });
		     * // => 'hello pebbles!'
		     *
		     * // Use backslashes to treat delimiters as plain text.
		     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
		     * compiled({ 'value': 'ignored' });
		     * // => '<%- value %>'
		     *
		     * // Use the `imports` option to import `jQuery` as `jq`.
		     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
		     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
		     * compiled({ 'users': ['fred', 'barney'] });
		     * // => '<li>fred</li><li>barney</li>'
		     *
		     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
		     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
		     * compiled(data);
		     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
		     *
		     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
		     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
		     * compiled.source;
		     * // => function(data) {
		     * //   var __t, __p = '';
		     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
		     * //   return __p;
		     * // }
		     *
		     * // Use custom template delimiters.
		     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
		     * var compiled = _.template('hello {{ user }}!');
		     * compiled({ 'user': 'mustache' });
		     * // => 'hello mustache!'
		     *
		     * // Use the `source` property to inline compiled templates for meaningful
		     * // line numbers in error messages and stack traces.
		     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
		     *   var JST = {\
		     *     "main": ' + _.template(mainText).source + '\
		     *   };\
		     * ');
		     */
		    function template(string, options, guard) {
		      // Based on John Resig's `tmpl` implementation
		      // (http://ejohn.org/blog/javascript-micro-templating/)
		      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
		      var settings = lodash.templateSettings;

		      if (guard && isIterateeCall(string, options, guard)) {
		        options = undefined$1;
		      }
		      string = toString(string);
		      options = assignInWith({}, options, settings, customDefaultsAssignIn);

		      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
		          importsKeys = keys(imports),
		          importsValues = baseValues(imports, importsKeys);

		      var isEscaping,
		          isEvaluating,
		          index = 0,
		          interpolate = options.interpolate || reNoMatch,
		          source = "__p += '";

		      // Compile the regexp to match each delimiter.
		      var reDelimiters = RegExp(
		        (options.escape || reNoMatch).source + '|' +
		        interpolate.source + '|' +
		        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
		        (options.evaluate || reNoMatch).source + '|$'
		      , 'g');

		      // Use a sourceURL for easier debugging.
		      // The sourceURL gets injected into the source that's eval-ed, so be careful
		      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
		      // and escape the comment, thus injecting code that gets evaled.
		      var sourceURL = '//# sourceURL=' +
		        (hasOwnProperty.call(options, 'sourceURL')
		          ? (options.sourceURL + '').replace(/\s/g, ' ')
		          : ('lodash.templateSources[' + (++templateCounter) + ']')
		        ) + '\n';

		      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
		        interpolateValue || (interpolateValue = esTemplateValue);

		        // Escape characters that can't be included in string literals.
		        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

		        // Replace delimiters with snippets.
		        if (escapeValue) {
		          isEscaping = true;
		          source += "' +\n__e(" + escapeValue + ") +\n'";
		        }
		        if (evaluateValue) {
		          isEvaluating = true;
		          source += "';\n" + evaluateValue + ";\n__p += '";
		        }
		        if (interpolateValue) {
		          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
		        }
		        index = offset + match.length;

		        // The JS engine embedded in Adobe products needs `match` returned in
		        // order to produce the correct `offset` value.
		        return match;
		      });

		      source += "';\n";

		      // If `variable` is not specified wrap a with-statement around the generated
		      // code to add the data object to the top of the scope chain.
		      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
		      if (!variable) {
		        source = 'with (obj) {\n' + source + '\n}\n';
		      }
		      // Throw an error if a forbidden character was found in `variable`, to prevent
		      // potential command injection attacks.
		      else if (reForbiddenIdentifierChars.test(variable)) {
		        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
		      }

		      // Cleanup code by stripping empty strings.
		      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
		        .replace(reEmptyStringMiddle, '$1')
		        .replace(reEmptyStringTrailing, '$1;');

		      // Frame code as the function body.
		      source = 'function(' + (variable || 'obj') + ') {\n' +
		        (variable
		          ? ''
		          : 'obj || (obj = {});\n'
		        ) +
		        "var __t, __p = ''" +
		        (isEscaping
		           ? ', __e = _.escape'
		           : ''
		        ) +
		        (isEvaluating
		          ? ', __j = Array.prototype.join;\n' +
		            "function print() { __p += __j.call(arguments, '') }\n"
		          : ';\n'
		        ) +
		        source +
		        'return __p\n}';

		      var result = attempt(function() {
		        return Function(importsKeys, sourceURL + 'return ' + source)
		          .apply(undefined$1, importsValues);
		      });

		      // Provide the compiled function's source by its `toString` method or
		      // the `source` property as a convenience for inlining compiled templates.
		      result.source = source;
		      if (isError(result)) {
		        throw result;
		      }
		      return result;
		    }

		    /**
		     * Converts `string`, as a whole, to lower case just like
		     * [String#toLowerCase](https://mdn.io/toLowerCase).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the lower cased string.
		     * @example
		     *
		     * _.toLower('--Foo-Bar--');
		     * // => '--foo-bar--'
		     *
		     * _.toLower('fooBar');
		     * // => 'foobar'
		     *
		     * _.toLower('__FOO_BAR__');
		     * // => '__foo_bar__'
		     */
		    function toLower(value) {
		      return toString(value).toLowerCase();
		    }

		    /**
		     * Converts `string`, as a whole, to upper case just like
		     * [String#toUpperCase](https://mdn.io/toUpperCase).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the upper cased string.
		     * @example
		     *
		     * _.toUpper('--foo-bar--');
		     * // => '--FOO-BAR--'
		     *
		     * _.toUpper('fooBar');
		     * // => 'FOOBAR'
		     *
		     * _.toUpper('__foo_bar__');
		     * // => '__FOO_BAR__'
		     */
		    function toUpper(value) {
		      return toString(value).toUpperCase();
		    }

		    /**
		     * Removes leading and trailing whitespace or specified characters from `string`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to trim.
		     * @param {string} [chars=whitespace] The characters to trim.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {string} Returns the trimmed string.
		     * @example
		     *
		     * _.trim('  abc  ');
		     * // => 'abc'
		     *
		     * _.trim('-_-abc-_-', '_-');
		     * // => 'abc'
		     *
		     * _.map(['  foo  ', '  bar  '], _.trim);
		     * // => ['foo', 'bar']
		     */
		    function trim(string, chars, guard) {
		      string = toString(string);
		      if (string && (guard || chars === undefined$1)) {
		        return baseTrim(string);
		      }
		      if (!string || !(chars = baseToString(chars))) {
		        return string;
		      }
		      var strSymbols = stringToArray(string),
		          chrSymbols = stringToArray(chars),
		          start = charsStartIndex(strSymbols, chrSymbols),
		          end = charsEndIndex(strSymbols, chrSymbols) + 1;

		      return castSlice(strSymbols, start, end).join('');
		    }

		    /**
		     * Removes trailing whitespace or specified characters from `string`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to trim.
		     * @param {string} [chars=whitespace] The characters to trim.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {string} Returns the trimmed string.
		     * @example
		     *
		     * _.trimEnd('  abc  ');
		     * // => '  abc'
		     *
		     * _.trimEnd('-_-abc-_-', '_-');
		     * // => '-_-abc'
		     */
		    function trimEnd(string, chars, guard) {
		      string = toString(string);
		      if (string && (guard || chars === undefined$1)) {
		        return string.slice(0, trimmedEndIndex(string) + 1);
		      }
		      if (!string || !(chars = baseToString(chars))) {
		        return string;
		      }
		      var strSymbols = stringToArray(string),
		          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

		      return castSlice(strSymbols, 0, end).join('');
		    }

		    /**
		     * Removes leading whitespace or specified characters from `string`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to trim.
		     * @param {string} [chars=whitespace] The characters to trim.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {string} Returns the trimmed string.
		     * @example
		     *
		     * _.trimStart('  abc  ');
		     * // => 'abc  '
		     *
		     * _.trimStart('-_-abc-_-', '_-');
		     * // => 'abc-_-'
		     */
		    function trimStart(string, chars, guard) {
		      string = toString(string);
		      if (string && (guard || chars === undefined$1)) {
		        return string.replace(reTrimStart, '');
		      }
		      if (!string || !(chars = baseToString(chars))) {
		        return string;
		      }
		      var strSymbols = stringToArray(string),
		          start = charsStartIndex(strSymbols, stringToArray(chars));

		      return castSlice(strSymbols, start).join('');
		    }

		    /**
		     * Truncates `string` if it's longer than the given maximum string length.
		     * The last characters of the truncated string are replaced with the omission
		     * string which defaults to "...".
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to truncate.
		     * @param {Object} [options={}] The options object.
		     * @param {number} [options.length=30] The maximum string length.
		     * @param {string} [options.omission='...'] The string to indicate text is omitted.
		     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
		     * @returns {string} Returns the truncated string.
		     * @example
		     *
		     * _.truncate('hi-diddly-ho there, neighborino');
		     * // => 'hi-diddly-ho there, neighbo...'
		     *
		     * _.truncate('hi-diddly-ho there, neighborino', {
		     *   'length': 24,
		     *   'separator': ' '
		     * });
		     * // => 'hi-diddly-ho there,...'
		     *
		     * _.truncate('hi-diddly-ho there, neighborino', {
		     *   'length': 24,
		     *   'separator': /,? +/
		     * });
		     * // => 'hi-diddly-ho there...'
		     *
		     * _.truncate('hi-diddly-ho there, neighborino', {
		     *   'omission': ' [...]'
		     * });
		     * // => 'hi-diddly-ho there, neig [...]'
		     */
		    function truncate(string, options) {
		      var length = DEFAULT_TRUNC_LENGTH,
		          omission = DEFAULT_TRUNC_OMISSION;

		      if (isObject(options)) {
		        var separator = 'separator' in options ? options.separator : separator;
		        length = 'length' in options ? toInteger(options.length) : length;
		        omission = 'omission' in options ? baseToString(options.omission) : omission;
		      }
		      string = toString(string);

		      var strLength = string.length;
		      if (hasUnicode(string)) {
		        var strSymbols = stringToArray(string);
		        strLength = strSymbols.length;
		      }
		      if (length >= strLength) {
		        return string;
		      }
		      var end = length - stringSize(omission);
		      if (end < 1) {
		        return omission;
		      }
		      var result = strSymbols
		        ? castSlice(strSymbols, 0, end).join('')
		        : string.slice(0, end);

		      if (separator === undefined$1) {
		        return result + omission;
		      }
		      if (strSymbols) {
		        end += (result.length - end);
		      }
		      if (isRegExp(separator)) {
		        if (string.slice(end).search(separator)) {
		          var match,
		              substring = result;

		          if (!separator.global) {
		            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
		          }
		          separator.lastIndex = 0;
		          while ((match = separator.exec(substring))) {
		            var newEnd = match.index;
		          }
		          result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
		        }
		      } else if (string.indexOf(baseToString(separator), end) != end) {
		        var index = result.lastIndexOf(separator);
		        if (index > -1) {
		          result = result.slice(0, index);
		        }
		      }
		      return result + omission;
		    }

		    /**
		     * The inverse of `_.escape`; this method converts the HTML entities
		     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
		     * their corresponding characters.
		     *
		     * **Note:** No other HTML entities are unescaped. To unescape additional
		     * HTML entities use a third-party library like [_he_](https://mths.be/he).
		     *
		     * @static
		     * @memberOf _
		     * @since 0.6.0
		     * @category String
		     * @param {string} [string=''] The string to unescape.
		     * @returns {string} Returns the unescaped string.
		     * @example
		     *
		     * _.unescape('fred, barney, &amp; pebbles');
		     * // => 'fred, barney, & pebbles'
		     */
		    function unescape(string) {
		      string = toString(string);
		      return (string && reHasEscapedHtml.test(string))
		        ? string.replace(reEscapedHtml, unescapeHtmlChar)
		        : string;
		    }

		    /**
		     * Converts `string`, as space separated words, to upper case.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the upper cased string.
		     * @example
		     *
		     * _.upperCase('--foo-bar');
		     * // => 'FOO BAR'
		     *
		     * _.upperCase('fooBar');
		     * // => 'FOO BAR'
		     *
		     * _.upperCase('__foo_bar__');
		     * // => 'FOO BAR'
		     */
		    var upperCase = createCompounder(function(result, word, index) {
		      return result + (index ? ' ' : '') + word.toUpperCase();
		    });

		    /**
		     * Converts the first character of `string` to upper case.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category String
		     * @param {string} [string=''] The string to convert.
		     * @returns {string} Returns the converted string.
		     * @example
		     *
		     * _.upperFirst('fred');
		     * // => 'Fred'
		     *
		     * _.upperFirst('FRED');
		     * // => 'FRED'
		     */
		    var upperFirst = createCaseFirst('toUpperCase');

		    /**
		     * Splits `string` into an array of its words.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category String
		     * @param {string} [string=''] The string to inspect.
		     * @param {RegExp|string} [pattern] The pattern to match words.
		     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
		     * @returns {Array} Returns the words of `string`.
		     * @example
		     *
		     * _.words('fred, barney, & pebbles');
		     * // => ['fred', 'barney', 'pebbles']
		     *
		     * _.words('fred, barney, & pebbles', /[^, ]+/g);
		     * // => ['fred', 'barney', '&', 'pebbles']
		     */
		    function words(string, pattern, guard) {
		      string = toString(string);
		      pattern = guard ? undefined$1 : pattern;

		      if (pattern === undefined$1) {
		        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
		      }
		      return string.match(pattern) || [];
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Attempts to invoke `func`, returning either the result or the caught error
		     * object. Any additional arguments are provided to `func` when it's invoked.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Util
		     * @param {Function} func The function to attempt.
		     * @param {...*} [args] The arguments to invoke `func` with.
		     * @returns {*} Returns the `func` result or error object.
		     * @example
		     *
		     * // Avoid throwing errors for invalid selectors.
		     * var elements = _.attempt(function(selector) {
		     *   return document.querySelectorAll(selector);
		     * }, '>_>');
		     *
		     * if (_.isError(elements)) {
		     *   elements = [];
		     * }
		     */
		    var attempt = baseRest(function(func, args) {
		      try {
		        return apply(func, undefined$1, args);
		      } catch (e) {
		        return isError(e) ? e : new Error(e);
		      }
		    });

		    /**
		     * Binds methods of an object to the object itself, overwriting the existing
		     * method.
		     *
		     * **Note:** This method doesn't set the "length" property of bound functions.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {Object} object The object to bind and assign the bound methods to.
		     * @param {...(string|string[])} methodNames The object method names to bind.
		     * @returns {Object} Returns `object`.
		     * @example
		     *
		     * var view = {
		     *   'label': 'docs',
		     *   'click': function() {
		     *     console.log('clicked ' + this.label);
		     *   }
		     * };
		     *
		     * _.bindAll(view, ['click']);
		     * jQuery(element).on('click', view.click);
		     * // => Logs 'clicked docs' when clicked.
		     */
		    var bindAll = flatRest(function(object, methodNames) {
		      arrayEach(methodNames, function(key) {
		        key = toKey(key);
		        baseAssignValue(object, key, bind(object[key], object));
		      });
		      return object;
		    });

		    /**
		     * Creates a function that iterates over `pairs` and invokes the corresponding
		     * function of the first predicate to return truthy. The predicate-function
		     * pairs are invoked with the `this` binding and arguments of the created
		     * function.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {Array} pairs The predicate-function pairs.
		     * @returns {Function} Returns the new composite function.
		     * @example
		     *
		     * var func = _.cond([
		     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
		     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
		     *   [_.stubTrue,                      _.constant('no match')]
		     * ]);
		     *
		     * func({ 'a': 1, 'b': 2 });
		     * // => 'matches A'
		     *
		     * func({ 'a': 0, 'b': 1 });
		     * // => 'matches B'
		     *
		     * func({ 'a': '1', 'b': '2' });
		     * // => 'no match'
		     */
		    function cond(pairs) {
		      var length = pairs == null ? 0 : pairs.length,
		          toIteratee = getIteratee();

		      pairs = !length ? [] : arrayMap(pairs, function(pair) {
		        if (typeof pair[1] != 'function') {
		          throw new TypeError(FUNC_ERROR_TEXT);
		        }
		        return [toIteratee(pair[0]), pair[1]];
		      });

		      return baseRest(function(args) {
		        var index = -1;
		        while (++index < length) {
		          var pair = pairs[index];
		          if (apply(pair[0], this, args)) {
		            return apply(pair[1], this, args);
		          }
		        }
		      });
		    }

		    /**
		     * Creates a function that invokes the predicate properties of `source` with
		     * the corresponding property values of a given object, returning `true` if
		     * all predicates return truthy, else `false`.
		     *
		     * **Note:** The created function is equivalent to `_.conformsTo` with
		     * `source` partially applied.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {Object} source The object of property predicates to conform to.
		     * @returns {Function} Returns the new spec function.
		     * @example
		     *
		     * var objects = [
		     *   { 'a': 2, 'b': 1 },
		     *   { 'a': 1, 'b': 2 }
		     * ];
		     *
		     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
		     * // => [{ 'a': 1, 'b': 2 }]
		     */
		    function conforms(source) {
		      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
		    }

		    /**
		     * Creates a function that returns `value`.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.4.0
		     * @category Util
		     * @param {*} value The value to return from the new function.
		     * @returns {Function} Returns the new constant function.
		     * @example
		     *
		     * var objects = _.times(2, _.constant({ 'a': 1 }));
		     *
		     * console.log(objects);
		     * // => [{ 'a': 1 }, { 'a': 1 }]
		     *
		     * console.log(objects[0] === objects[1]);
		     * // => true
		     */
		    function constant(value) {
		      return function() {
		        return value;
		      };
		    }

		    /**
		     * Checks `value` to determine whether a default value should be returned in
		     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
		     * or `undefined`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.14.0
		     * @category Util
		     * @param {*} value The value to check.
		     * @param {*} defaultValue The default value.
		     * @returns {*} Returns the resolved value.
		     * @example
		     *
		     * _.defaultTo(1, 10);
		     * // => 1
		     *
		     * _.defaultTo(undefined, 10);
		     * // => 10
		     */
		    function defaultTo(value, defaultValue) {
		      return (value == null || value !== value) ? defaultValue : value;
		    }

		    /**
		     * Creates a function that returns the result of invoking the given functions
		     * with the `this` binding of the created function, where each successive
		     * invocation is supplied the return value of the previous.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Util
		     * @param {...(Function|Function[])} [funcs] The functions to invoke.
		     * @returns {Function} Returns the new composite function.
		     * @see _.flowRight
		     * @example
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * var addSquare = _.flow([_.add, square]);
		     * addSquare(1, 2);
		     * // => 9
		     */
		    var flow = createFlow();

		    /**
		     * This method is like `_.flow` except that it creates a function that
		     * invokes the given functions from right to left.
		     *
		     * @static
		     * @since 3.0.0
		     * @memberOf _
		     * @category Util
		     * @param {...(Function|Function[])} [funcs] The functions to invoke.
		     * @returns {Function} Returns the new composite function.
		     * @see _.flow
		     * @example
		     *
		     * function square(n) {
		     *   return n * n;
		     * }
		     *
		     * var addSquare = _.flowRight([square, _.add]);
		     * addSquare(1, 2);
		     * // => 9
		     */
		    var flowRight = createFlow(true);

		    /**
		     * This method returns the first argument it receives.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {*} value Any value.
		     * @returns {*} Returns `value`.
		     * @example
		     *
		     * var object = { 'a': 1 };
		     *
		     * console.log(_.identity(object) === object);
		     * // => true
		     */
		    function identity(value) {
		      return value;
		    }

		    /**
		     * Creates a function that invokes `func` with the arguments of the created
		     * function. If `func` is a property name, the created function returns the
		     * property value for a given element. If `func` is an array or object, the
		     * created function returns `true` for elements that contain the equivalent
		     * source properties, otherwise it returns `false`.
		     *
		     * @static
		     * @since 4.0.0
		     * @memberOf _
		     * @category Util
		     * @param {*} [func=_.identity] The value to convert to a callback.
		     * @returns {Function} Returns the callback.
		     * @example
		     *
		     * var users = [
		     *   { 'user': 'barney', 'age': 36, 'active': true },
		     *   { 'user': 'fred',   'age': 40, 'active': false }
		     * ];
		     *
		     * // The `_.matches` iteratee shorthand.
		     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
		     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
		     *
		     * // The `_.matchesProperty` iteratee shorthand.
		     * _.filter(users, _.iteratee(['user', 'fred']));
		     * // => [{ 'user': 'fred', 'age': 40 }]
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.map(users, _.iteratee('user'));
		     * // => ['barney', 'fred']
		     *
		     * // Create custom iteratee shorthands.
		     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
		     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
		     *     return func.test(string);
		     *   };
		     * });
		     *
		     * _.filter(['abc', 'def'], /ef/);
		     * // => ['def']
		     */
		    function iteratee(func) {
		      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
		    }

		    /**
		     * Creates a function that performs a partial deep comparison between a given
		     * object and `source`, returning `true` if the given object has equivalent
		     * property values, else `false`.
		     *
		     * **Note:** The created function is equivalent to `_.isMatch` with `source`
		     * partially applied.
		     *
		     * Partial comparisons will match empty array and empty object `source`
		     * values against any array or object value, respectively. See `_.isEqual`
		     * for a list of supported value comparisons.
		     *
		     * **Note:** Multiple values can be checked by combining several matchers
		     * using `_.overSome`
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Util
		     * @param {Object} source The object of property values to match.
		     * @returns {Function} Returns the new spec function.
		     * @example
		     *
		     * var objects = [
		     *   { 'a': 1, 'b': 2, 'c': 3 },
		     *   { 'a': 4, 'b': 5, 'c': 6 }
		     * ];
		     *
		     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
		     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
		     *
		     * // Checking for several possible values
		     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
		     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
		     */
		    function matches(source) {
		      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
		    }

		    /**
		     * Creates a function that performs a partial deep comparison between the
		     * value at `path` of a given object to `srcValue`, returning `true` if the
		     * object value is equivalent, else `false`.
		     *
		     * **Note:** Partial comparisons will match empty array and empty object
		     * `srcValue` values against any array or object value, respectively. See
		     * `_.isEqual` for a list of supported value comparisons.
		     *
		     * **Note:** Multiple values can be checked by combining several matchers
		     * using `_.overSome`
		     *
		     * @static
		     * @memberOf _
		     * @since 3.2.0
		     * @category Util
		     * @param {Array|string} path The path of the property to get.
		     * @param {*} srcValue The value to match.
		     * @returns {Function} Returns the new spec function.
		     * @example
		     *
		     * var objects = [
		     *   { 'a': 1, 'b': 2, 'c': 3 },
		     *   { 'a': 4, 'b': 5, 'c': 6 }
		     * ];
		     *
		     * _.find(objects, _.matchesProperty('a', 4));
		     * // => { 'a': 4, 'b': 5, 'c': 6 }
		     *
		     * // Checking for several possible values
		     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
		     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
		     */
		    function matchesProperty(path, srcValue) {
		      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
		    }

		    /**
		     * Creates a function that invokes the method at `path` of a given object.
		     * Any additional arguments are provided to the invoked method.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.7.0
		     * @category Util
		     * @param {Array|string} path The path of the method to invoke.
		     * @param {...*} [args] The arguments to invoke the method with.
		     * @returns {Function} Returns the new invoker function.
		     * @example
		     *
		     * var objects = [
		     *   { 'a': { 'b': _.constant(2) } },
		     *   { 'a': { 'b': _.constant(1) } }
		     * ];
		     *
		     * _.map(objects, _.method('a.b'));
		     * // => [2, 1]
		     *
		     * _.map(objects, _.method(['a', 'b']));
		     * // => [2, 1]
		     */
		    var method = baseRest(function(path, args) {
		      return function(object) {
		        return baseInvoke(object, path, args);
		      };
		    });

		    /**
		     * The opposite of `_.method`; this method creates a function that invokes
		     * the method at a given path of `object`. Any additional arguments are
		     * provided to the invoked method.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.7.0
		     * @category Util
		     * @param {Object} object The object to query.
		     * @param {...*} [args] The arguments to invoke the method with.
		     * @returns {Function} Returns the new invoker function.
		     * @example
		     *
		     * var array = _.times(3, _.constant),
		     *     object = { 'a': array, 'b': array, 'c': array };
		     *
		     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
		     * // => [2, 0]
		     *
		     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
		     * // => [2, 0]
		     */
		    var methodOf = baseRest(function(object, args) {
		      return function(path) {
		        return baseInvoke(object, path, args);
		      };
		    });

		    /**
		     * Adds all own enumerable string keyed function properties of a source
		     * object to the destination object. If `object` is a function, then methods
		     * are added to its prototype as well.
		     *
		     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
		     * avoid conflicts caused by modifying the original.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {Function|Object} [object=lodash] The destination object.
		     * @param {Object} source The object of functions to add.
		     * @param {Object} [options={}] The options object.
		     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
		     * @returns {Function|Object} Returns `object`.
		     * @example
		     *
		     * function vowels(string) {
		     *   return _.filter(string, function(v) {
		     *     return /[aeiou]/i.test(v);
		     *   });
		     * }
		     *
		     * _.mixin({ 'vowels': vowels });
		     * _.vowels('fred');
		     * // => ['e']
		     *
		     * _('fred').vowels().value();
		     * // => ['e']
		     *
		     * _.mixin({ 'vowels': vowels }, { 'chain': false });
		     * _('fred').vowels();
		     * // => ['e']
		     */
		    function mixin(object, source, options) {
		      var props = keys(source),
		          methodNames = baseFunctions(source, props);

		      if (options == null &&
		          !(isObject(source) && (methodNames.length || !props.length))) {
		        options = source;
		        source = object;
		        object = this;
		        methodNames = baseFunctions(source, keys(source));
		      }
		      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
		          isFunc = isFunction(object);

		      arrayEach(methodNames, function(methodName) {
		        var func = source[methodName];
		        object[methodName] = func;
		        if (isFunc) {
		          object.prototype[methodName] = function() {
		            var chainAll = this.__chain__;
		            if (chain || chainAll) {
		              var result = object(this.__wrapped__),
		                  actions = result.__actions__ = copyArray(this.__actions__);

		              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
		              result.__chain__ = chainAll;
		              return result;
		            }
		            return func.apply(object, arrayPush([this.value()], arguments));
		          };
		        }
		      });

		      return object;
		    }

		    /**
		     * Reverts the `_` variable to its previous value and returns a reference to
		     * the `lodash` function.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @returns {Function} Returns the `lodash` function.
		     * @example
		     *
		     * var lodash = _.noConflict();
		     */
		    function noConflict() {
		      if (root._ === this) {
		        root._ = oldDash;
		      }
		      return this;
		    }

		    /**
		     * This method returns `undefined`.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.3.0
		     * @category Util
		     * @example
		     *
		     * _.times(2, _.noop);
		     * // => [undefined, undefined]
		     */
		    function noop() {
		      // No operation performed.
		    }

		    /**
		     * Creates a function that gets the argument at index `n`. If `n` is negative,
		     * the nth argument from the end is returned.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {number} [n=0] The index of the argument to return.
		     * @returns {Function} Returns the new pass-thru function.
		     * @example
		     *
		     * var func = _.nthArg(1);
		     * func('a', 'b', 'c', 'd');
		     * // => 'b'
		     *
		     * var func = _.nthArg(-2);
		     * func('a', 'b', 'c', 'd');
		     * // => 'c'
		     */
		    function nthArg(n) {
		      n = toInteger(n);
		      return baseRest(function(args) {
		        return baseNth(args, n);
		      });
		    }

		    /**
		     * Creates a function that invokes `iteratees` with the arguments it receives
		     * and returns their results.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {...(Function|Function[])} [iteratees=[_.identity]]
		     *  The iteratees to invoke.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var func = _.over([Math.max, Math.min]);
		     *
		     * func(1, 2, 3, 4);
		     * // => [4, 1]
		     */
		    var over = createOver(arrayMap);

		    /**
		     * Creates a function that checks if **all** of the `predicates` return
		     * truthy when invoked with the arguments it receives.
		     *
		     * Following shorthands are possible for providing predicates.
		     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
		     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {...(Function|Function[])} [predicates=[_.identity]]
		     *  The predicates to check.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var func = _.overEvery([Boolean, isFinite]);
		     *
		     * func('1');
		     * // => true
		     *
		     * func(null);
		     * // => false
		     *
		     * func(NaN);
		     * // => false
		     */
		    var overEvery = createOver(arrayEvery);

		    /**
		     * Creates a function that checks if **any** of the `predicates` return
		     * truthy when invoked with the arguments it receives.
		     *
		     * Following shorthands are possible for providing predicates.
		     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
		     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {...(Function|Function[])} [predicates=[_.identity]]
		     *  The predicates to check.
		     * @returns {Function} Returns the new function.
		     * @example
		     *
		     * var func = _.overSome([Boolean, isFinite]);
		     *
		     * func('1');
		     * // => true
		     *
		     * func(null);
		     * // => true
		     *
		     * func(NaN);
		     * // => false
		     *
		     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
		     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
		     */
		    var overSome = createOver(arraySome);

		    /**
		     * Creates a function that returns the value at `path` of a given object.
		     *
		     * @static
		     * @memberOf _
		     * @since 2.4.0
		     * @category Util
		     * @param {Array|string} path The path of the property to get.
		     * @returns {Function} Returns the new accessor function.
		     * @example
		     *
		     * var objects = [
		     *   { 'a': { 'b': 2 } },
		     *   { 'a': { 'b': 1 } }
		     * ];
		     *
		     * _.map(objects, _.property('a.b'));
		     * // => [2, 1]
		     *
		     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
		     * // => [1, 2]
		     */
		    function property(path) {
		      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
		    }

		    /**
		     * The opposite of `_.property`; this method creates a function that returns
		     * the value at a given path of `object`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.0.0
		     * @category Util
		     * @param {Object} object The object to query.
		     * @returns {Function} Returns the new accessor function.
		     * @example
		     *
		     * var array = [0, 1, 2],
		     *     object = { 'a': array, 'b': array, 'c': array };
		     *
		     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
		     * // => [2, 0]
		     *
		     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
		     * // => [2, 0]
		     */
		    function propertyOf(object) {
		      return function(path) {
		        return object == null ? undefined$1 : baseGet(object, path);
		      };
		    }

		    /**
		     * Creates an array of numbers (positive and/or negative) progressing from
		     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
		     * `start` is specified without an `end` or `step`. If `end` is not specified,
		     * it's set to `start` with `start` then set to `0`.
		     *
		     * **Note:** JavaScript follows the IEEE-754 standard for resolving
		     * floating-point values which can produce unexpected results.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {number} [start=0] The start of the range.
		     * @param {number} end The end of the range.
		     * @param {number} [step=1] The value to increment or decrement by.
		     * @returns {Array} Returns the range of numbers.
		     * @see _.inRange, _.rangeRight
		     * @example
		     *
		     * _.range(4);
		     * // => [0, 1, 2, 3]
		     *
		     * _.range(-4);
		     * // => [0, -1, -2, -3]
		     *
		     * _.range(1, 5);
		     * // => [1, 2, 3, 4]
		     *
		     * _.range(0, 20, 5);
		     * // => [0, 5, 10, 15]
		     *
		     * _.range(0, -4, -1);
		     * // => [0, -1, -2, -3]
		     *
		     * _.range(1, 4, 0);
		     * // => [1, 1, 1]
		     *
		     * _.range(0);
		     * // => []
		     */
		    var range = createRange();

		    /**
		     * This method is like `_.range` except that it populates values in
		     * descending order.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {number} [start=0] The start of the range.
		     * @param {number} end The end of the range.
		     * @param {number} [step=1] The value to increment or decrement by.
		     * @returns {Array} Returns the range of numbers.
		     * @see _.inRange, _.range
		     * @example
		     *
		     * _.rangeRight(4);
		     * // => [3, 2, 1, 0]
		     *
		     * _.rangeRight(-4);
		     * // => [-3, -2, -1, 0]
		     *
		     * _.rangeRight(1, 5);
		     * // => [4, 3, 2, 1]
		     *
		     * _.rangeRight(0, 20, 5);
		     * // => [15, 10, 5, 0]
		     *
		     * _.rangeRight(0, -4, -1);
		     * // => [-3, -2, -1, 0]
		     *
		     * _.rangeRight(1, 4, 0);
		     * // => [1, 1, 1]
		     *
		     * _.rangeRight(0);
		     * // => []
		     */
		    var rangeRight = createRange(true);

		    /**
		     * This method returns a new empty array.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.13.0
		     * @category Util
		     * @returns {Array} Returns the new empty array.
		     * @example
		     *
		     * var arrays = _.times(2, _.stubArray);
		     *
		     * console.log(arrays);
		     * // => [[], []]
		     *
		     * console.log(arrays[0] === arrays[1]);
		     * // => false
		     */
		    function stubArray() {
		      return [];
		    }

		    /**
		     * This method returns `false`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.13.0
		     * @category Util
		     * @returns {boolean} Returns `false`.
		     * @example
		     *
		     * _.times(2, _.stubFalse);
		     * // => [false, false]
		     */
		    function stubFalse() {
		      return false;
		    }

		    /**
		     * This method returns a new empty object.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.13.0
		     * @category Util
		     * @returns {Object} Returns the new empty object.
		     * @example
		     *
		     * var objects = _.times(2, _.stubObject);
		     *
		     * console.log(objects);
		     * // => [{}, {}]
		     *
		     * console.log(objects[0] === objects[1]);
		     * // => false
		     */
		    function stubObject() {
		      return {};
		    }

		    /**
		     * This method returns an empty string.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.13.0
		     * @category Util
		     * @returns {string} Returns the empty string.
		     * @example
		     *
		     * _.times(2, _.stubString);
		     * // => ['', '']
		     */
		    function stubString() {
		      return '';
		    }

		    /**
		     * This method returns `true`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.13.0
		     * @category Util
		     * @returns {boolean} Returns `true`.
		     * @example
		     *
		     * _.times(2, _.stubTrue);
		     * // => [true, true]
		     */
		    function stubTrue() {
		      return true;
		    }

		    /**
		     * Invokes the iteratee `n` times, returning an array of the results of
		     * each invocation. The iteratee is invoked with one argument; (index).
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {number} n The number of times to invoke `iteratee`.
		     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
		     * @returns {Array} Returns the array of results.
		     * @example
		     *
		     * _.times(3, String);
		     * // => ['0', '1', '2']
		     *
		     *  _.times(4, _.constant(0));
		     * // => [0, 0, 0, 0]
		     */
		    function times(n, iteratee) {
		      n = toInteger(n);
		      if (n < 1 || n > MAX_SAFE_INTEGER) {
		        return [];
		      }
		      var index = MAX_ARRAY_LENGTH,
		          length = nativeMin(n, MAX_ARRAY_LENGTH);

		      iteratee = getIteratee(iteratee);
		      n -= MAX_ARRAY_LENGTH;

		      var result = baseTimes(length, iteratee);
		      while (++index < n) {
		        iteratee(index);
		      }
		      return result;
		    }

		    /**
		     * Converts `value` to a property path array.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Util
		     * @param {*} value The value to convert.
		     * @returns {Array} Returns the new property path array.
		     * @example
		     *
		     * _.toPath('a.b.c');
		     * // => ['a', 'b', 'c']
		     *
		     * _.toPath('a[0].b.c');
		     * // => ['a', '0', 'b', 'c']
		     */
		    function toPath(value) {
		      if (isArray(value)) {
		        return arrayMap(value, toKey);
		      }
		      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
		    }

		    /**
		     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Util
		     * @param {string} [prefix=''] The value to prefix the ID with.
		     * @returns {string} Returns the unique ID.
		     * @example
		     *
		     * _.uniqueId('contact_');
		     * // => 'contact_104'
		     *
		     * _.uniqueId();
		     * // => '105'
		     */
		    function uniqueId(prefix) {
		      var id = ++idCounter;
		      return toString(prefix) + id;
		    }

		    /*------------------------------------------------------------------------*/

		    /**
		     * Adds two numbers.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.4.0
		     * @category Math
		     * @param {number} augend The first number in an addition.
		     * @param {number} addend The second number in an addition.
		     * @returns {number} Returns the total.
		     * @example
		     *
		     * _.add(6, 4);
		     * // => 10
		     */
		    var add = createMathOperation(function(augend, addend) {
		      return augend + addend;
		    }, 0);

		    /**
		     * Computes `number` rounded up to `precision`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.10.0
		     * @category Math
		     * @param {number} number The number to round up.
		     * @param {number} [precision=0] The precision to round up to.
		     * @returns {number} Returns the rounded up number.
		     * @example
		     *
		     * _.ceil(4.006);
		     * // => 5
		     *
		     * _.ceil(6.004, 2);
		     * // => 6.01
		     *
		     * _.ceil(6040, -2);
		     * // => 6100
		     */
		    var ceil = createRound('ceil');

		    /**
		     * Divide two numbers.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.7.0
		     * @category Math
		     * @param {number} dividend The first number in a division.
		     * @param {number} divisor The second number in a division.
		     * @returns {number} Returns the quotient.
		     * @example
		     *
		     * _.divide(6, 4);
		     * // => 1.5
		     */
		    var divide = createMathOperation(function(dividend, divisor) {
		      return dividend / divisor;
		    }, 1);

		    /**
		     * Computes `number` rounded down to `precision`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.10.0
		     * @category Math
		     * @param {number} number The number to round down.
		     * @param {number} [precision=0] The precision to round down to.
		     * @returns {number} Returns the rounded down number.
		     * @example
		     *
		     * _.floor(4.006);
		     * // => 4
		     *
		     * _.floor(0.046, 2);
		     * // => 0.04
		     *
		     * _.floor(4060, -2);
		     * // => 4000
		     */
		    var floor = createRound('floor');

		    /**
		     * Computes the maximum value of `array`. If `array` is empty or falsey,
		     * `undefined` is returned.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @returns {*} Returns the maximum value.
		     * @example
		     *
		     * _.max([4, 2, 8, 6]);
		     * // => 8
		     *
		     * _.max([]);
		     * // => undefined
		     */
		    function max(array) {
		      return (array && array.length)
		        ? baseExtremum(array, identity, baseGt)
		        : undefined$1;
		    }

		    /**
		     * This method is like `_.max` except that it accepts `iteratee` which is
		     * invoked for each element in `array` to generate the criterion by which
		     * the value is ranked. The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {*} Returns the maximum value.
		     * @example
		     *
		     * var objects = [{ 'n': 1 }, { 'n': 2 }];
		     *
		     * _.maxBy(objects, function(o) { return o.n; });
		     * // => { 'n': 2 }
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.maxBy(objects, 'n');
		     * // => { 'n': 2 }
		     */
		    function maxBy(array, iteratee) {
		      return (array && array.length)
		        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
		        : undefined$1;
		    }

		    /**
		     * Computes the mean of the values in `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @returns {number} Returns the mean.
		     * @example
		     *
		     * _.mean([4, 2, 8, 6]);
		     * // => 5
		     */
		    function mean(array) {
		      return baseMean(array, identity);
		    }

		    /**
		     * This method is like `_.mean` except that it accepts `iteratee` which is
		     * invoked for each element in `array` to generate the value to be averaged.
		     * The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.7.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {number} Returns the mean.
		     * @example
		     *
		     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
		     *
		     * _.meanBy(objects, function(o) { return o.n; });
		     * // => 5
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.meanBy(objects, 'n');
		     * // => 5
		     */
		    function meanBy(array, iteratee) {
		      return baseMean(array, getIteratee(iteratee, 2));
		    }

		    /**
		     * Computes the minimum value of `array`. If `array` is empty or falsey,
		     * `undefined` is returned.
		     *
		     * @static
		     * @since 0.1.0
		     * @memberOf _
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @returns {*} Returns the minimum value.
		     * @example
		     *
		     * _.min([4, 2, 8, 6]);
		     * // => 2
		     *
		     * _.min([]);
		     * // => undefined
		     */
		    function min(array) {
		      return (array && array.length)
		        ? baseExtremum(array, identity, baseLt)
		        : undefined$1;
		    }

		    /**
		     * This method is like `_.min` except that it accepts `iteratee` which is
		     * invoked for each element in `array` to generate the criterion by which
		     * the value is ranked. The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {*} Returns the minimum value.
		     * @example
		     *
		     * var objects = [{ 'n': 1 }, { 'n': 2 }];
		     *
		     * _.minBy(objects, function(o) { return o.n; });
		     * // => { 'n': 1 }
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.minBy(objects, 'n');
		     * // => { 'n': 1 }
		     */
		    function minBy(array, iteratee) {
		      return (array && array.length)
		        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
		        : undefined$1;
		    }

		    /**
		     * Multiply two numbers.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.7.0
		     * @category Math
		     * @param {number} multiplier The first number in a multiplication.
		     * @param {number} multiplicand The second number in a multiplication.
		     * @returns {number} Returns the product.
		     * @example
		     *
		     * _.multiply(6, 4);
		     * // => 24
		     */
		    var multiply = createMathOperation(function(multiplier, multiplicand) {
		      return multiplier * multiplicand;
		    }, 1);

		    /**
		     * Computes `number` rounded to `precision`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.10.0
		     * @category Math
		     * @param {number} number The number to round.
		     * @param {number} [precision=0] The precision to round to.
		     * @returns {number} Returns the rounded number.
		     * @example
		     *
		     * _.round(4.006);
		     * // => 4
		     *
		     * _.round(4.006, 2);
		     * // => 4.01
		     *
		     * _.round(4060, -2);
		     * // => 4100
		     */
		    var round = createRound('round');

		    /**
		     * Subtract two numbers.
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Math
		     * @param {number} minuend The first number in a subtraction.
		     * @param {number} subtrahend The second number in a subtraction.
		     * @returns {number} Returns the difference.
		     * @example
		     *
		     * _.subtract(6, 4);
		     * // => 2
		     */
		    var subtract = createMathOperation(function(minuend, subtrahend) {
		      return minuend - subtrahend;
		    }, 0);

		    /**
		     * Computes the sum of the values in `array`.
		     *
		     * @static
		     * @memberOf _
		     * @since 3.4.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @returns {number} Returns the sum.
		     * @example
		     *
		     * _.sum([4, 2, 8, 6]);
		     * // => 20
		     */
		    function sum(array) {
		      return (array && array.length)
		        ? baseSum(array, identity)
		        : 0;
		    }

		    /**
		     * This method is like `_.sum` except that it accepts `iteratee` which is
		     * invoked for each element in `array` to generate the value to be summed.
		     * The iteratee is invoked with one argument: (value).
		     *
		     * @static
		     * @memberOf _
		     * @since 4.0.0
		     * @category Math
		     * @param {Array} array The array to iterate over.
		     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
		     * @returns {number} Returns the sum.
		     * @example
		     *
		     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
		     *
		     * _.sumBy(objects, function(o) { return o.n; });
		     * // => 20
		     *
		     * // The `_.property` iteratee shorthand.
		     * _.sumBy(objects, 'n');
		     * // => 20
		     */
		    function sumBy(array, iteratee) {
		      return (array && array.length)
		        ? baseSum(array, getIteratee(iteratee, 2))
		        : 0;
		    }

		    /*------------------------------------------------------------------------*/

		    // Add methods that return wrapped values in chain sequences.
		    lodash.after = after;
		    lodash.ary = ary;
		    lodash.assign = assign;
		    lodash.assignIn = assignIn;
		    lodash.assignInWith = assignInWith;
		    lodash.assignWith = assignWith;
		    lodash.at = at;
		    lodash.before = before;
		    lodash.bind = bind;
		    lodash.bindAll = bindAll;
		    lodash.bindKey = bindKey;
		    lodash.castArray = castArray;
		    lodash.chain = chain;
		    lodash.chunk = chunk;
		    lodash.compact = compact;
		    lodash.concat = concat;
		    lodash.cond = cond;
		    lodash.conforms = conforms;
		    lodash.constant = constant;
		    lodash.countBy = countBy;
		    lodash.create = create;
		    lodash.curry = curry;
		    lodash.curryRight = curryRight;
		    lodash.debounce = debounce;
		    lodash.defaults = defaults;
		    lodash.defaultsDeep = defaultsDeep;
		    lodash.defer = defer;
		    lodash.delay = delay;
		    lodash.difference = difference;
		    lodash.differenceBy = differenceBy;
		    lodash.differenceWith = differenceWith;
		    lodash.drop = drop;
		    lodash.dropRight = dropRight;
		    lodash.dropRightWhile = dropRightWhile;
		    lodash.dropWhile = dropWhile;
		    lodash.fill = fill;
		    lodash.filter = filter;
		    lodash.flatMap = flatMap;
		    lodash.flatMapDeep = flatMapDeep;
		    lodash.flatMapDepth = flatMapDepth;
		    lodash.flatten = flatten;
		    lodash.flattenDeep = flattenDeep;
		    lodash.flattenDepth = flattenDepth;
		    lodash.flip = flip;
		    lodash.flow = flow;
		    lodash.flowRight = flowRight;
		    lodash.fromPairs = fromPairs;
		    lodash.functions = functions;
		    lodash.functionsIn = functionsIn;
		    lodash.groupBy = groupBy;
		    lodash.initial = initial;
		    lodash.intersection = intersection;
		    lodash.intersectionBy = intersectionBy;
		    lodash.intersectionWith = intersectionWith;
		    lodash.invert = invert;
		    lodash.invertBy = invertBy;
		    lodash.invokeMap = invokeMap;
		    lodash.iteratee = iteratee;
		    lodash.keyBy = keyBy;
		    lodash.keys = keys;
		    lodash.keysIn = keysIn;
		    lodash.map = map;
		    lodash.mapKeys = mapKeys;
		    lodash.mapValues = mapValues;
		    lodash.matches = matches;
		    lodash.matchesProperty = matchesProperty;
		    lodash.memoize = memoize;
		    lodash.merge = merge;
		    lodash.mergeWith = mergeWith;
		    lodash.method = method;
		    lodash.methodOf = methodOf;
		    lodash.mixin = mixin;
		    lodash.negate = negate;
		    lodash.nthArg = nthArg;
		    lodash.omit = omit;
		    lodash.omitBy = omitBy;
		    lodash.once = once;
		    lodash.orderBy = orderBy;
		    lodash.over = over;
		    lodash.overArgs = overArgs;
		    lodash.overEvery = overEvery;
		    lodash.overSome = overSome;
		    lodash.partial = partial;
		    lodash.partialRight = partialRight;
		    lodash.partition = partition;
		    lodash.pick = pick;
		    lodash.pickBy = pickBy;
		    lodash.property = property;
		    lodash.propertyOf = propertyOf;
		    lodash.pull = pull;
		    lodash.pullAll = pullAll;
		    lodash.pullAllBy = pullAllBy;
		    lodash.pullAllWith = pullAllWith;
		    lodash.pullAt = pullAt;
		    lodash.range = range;
		    lodash.rangeRight = rangeRight;
		    lodash.rearg = rearg;
		    lodash.reject = reject;
		    lodash.remove = remove;
		    lodash.rest = rest;
		    lodash.reverse = reverse;
		    lodash.sampleSize = sampleSize;
		    lodash.set = set;
		    lodash.setWith = setWith;
		    lodash.shuffle = shuffle;
		    lodash.slice = slice;
		    lodash.sortBy = sortBy;
		    lodash.sortedUniq = sortedUniq;
		    lodash.sortedUniqBy = sortedUniqBy;
		    lodash.split = split;
		    lodash.spread = spread;
		    lodash.tail = tail;
		    lodash.take = take;
		    lodash.takeRight = takeRight;
		    lodash.takeRightWhile = takeRightWhile;
		    lodash.takeWhile = takeWhile;
		    lodash.tap = tap;
		    lodash.throttle = throttle;
		    lodash.thru = thru;
		    lodash.toArray = toArray;
		    lodash.toPairs = toPairs;
		    lodash.toPairsIn = toPairsIn;
		    lodash.toPath = toPath;
		    lodash.toPlainObject = toPlainObject;
		    lodash.transform = transform;
		    lodash.unary = unary;
		    lodash.union = union;
		    lodash.unionBy = unionBy;
		    lodash.unionWith = unionWith;
		    lodash.uniq = uniq;
		    lodash.uniqBy = uniqBy;
		    lodash.uniqWith = uniqWith;
		    lodash.unset = unset;
		    lodash.unzip = unzip;
		    lodash.unzipWith = unzipWith;
		    lodash.update = update;
		    lodash.updateWith = updateWith;
		    lodash.values = values;
		    lodash.valuesIn = valuesIn;
		    lodash.without = without;
		    lodash.words = words;
		    lodash.wrap = wrap;
		    lodash.xor = xor;
		    lodash.xorBy = xorBy;
		    lodash.xorWith = xorWith;
		    lodash.zip = zip;
		    lodash.zipObject = zipObject;
		    lodash.zipObjectDeep = zipObjectDeep;
		    lodash.zipWith = zipWith;

		    // Add aliases.
		    lodash.entries = toPairs;
		    lodash.entriesIn = toPairsIn;
		    lodash.extend = assignIn;
		    lodash.extendWith = assignInWith;

		    // Add methods to `lodash.prototype`.
		    mixin(lodash, lodash);

		    /*------------------------------------------------------------------------*/

		    // Add methods that return unwrapped values in chain sequences.
		    lodash.add = add;
		    lodash.attempt = attempt;
		    lodash.camelCase = camelCase;
		    lodash.capitalize = capitalize;
		    lodash.ceil = ceil;
		    lodash.clamp = clamp;
		    lodash.clone = clone;
		    lodash.cloneDeep = cloneDeep;
		    lodash.cloneDeepWith = cloneDeepWith;
		    lodash.cloneWith = cloneWith;
		    lodash.conformsTo = conformsTo;
		    lodash.deburr = deburr;
		    lodash.defaultTo = defaultTo;
		    lodash.divide = divide;
		    lodash.endsWith = endsWith;
		    lodash.eq = eq;
		    lodash.escape = escape;
		    lodash.escapeRegExp = escapeRegExp;
		    lodash.every = every;
		    lodash.find = find;
		    lodash.findIndex = findIndex;
		    lodash.findKey = findKey;
		    lodash.findLast = findLast;
		    lodash.findLastIndex = findLastIndex;
		    lodash.findLastKey = findLastKey;
		    lodash.floor = floor;
		    lodash.forEach = forEach;
		    lodash.forEachRight = forEachRight;
		    lodash.forIn = forIn;
		    lodash.forInRight = forInRight;
		    lodash.forOwn = forOwn;
		    lodash.forOwnRight = forOwnRight;
		    lodash.get = get;
		    lodash.gt = gt;
		    lodash.gte = gte;
		    lodash.has = has;
		    lodash.hasIn = hasIn;
		    lodash.head = head;
		    lodash.identity = identity;
		    lodash.includes = includes;
		    lodash.indexOf = indexOf;
		    lodash.inRange = inRange;
		    lodash.invoke = invoke;
		    lodash.isArguments = isArguments;
		    lodash.isArray = isArray;
		    lodash.isArrayBuffer = isArrayBuffer;
		    lodash.isArrayLike = isArrayLike;
		    lodash.isArrayLikeObject = isArrayLikeObject;
		    lodash.isBoolean = isBoolean;
		    lodash.isBuffer = isBuffer;
		    lodash.isDate = isDate;
		    lodash.isElement = isElement;
		    lodash.isEmpty = isEmpty;
		    lodash.isEqual = isEqual;
		    lodash.isEqualWith = isEqualWith;
		    lodash.isError = isError;
		    lodash.isFinite = isFinite;
		    lodash.isFunction = isFunction;
		    lodash.isInteger = isInteger;
		    lodash.isLength = isLength;
		    lodash.isMap = isMap;
		    lodash.isMatch = isMatch;
		    lodash.isMatchWith = isMatchWith;
		    lodash.isNaN = isNaN;
		    lodash.isNative = isNative;
		    lodash.isNil = isNil;
		    lodash.isNull = isNull;
		    lodash.isNumber = isNumber;
		    lodash.isObject = isObject;
		    lodash.isObjectLike = isObjectLike;
		    lodash.isPlainObject = isPlainObject;
		    lodash.isRegExp = isRegExp;
		    lodash.isSafeInteger = isSafeInteger;
		    lodash.isSet = isSet;
		    lodash.isString = isString;
		    lodash.isSymbol = isSymbol;
		    lodash.isTypedArray = isTypedArray;
		    lodash.isUndefined = isUndefined;
		    lodash.isWeakMap = isWeakMap;
		    lodash.isWeakSet = isWeakSet;
		    lodash.join = join;
		    lodash.kebabCase = kebabCase;
		    lodash.last = last;
		    lodash.lastIndexOf = lastIndexOf;
		    lodash.lowerCase = lowerCase;
		    lodash.lowerFirst = lowerFirst;
		    lodash.lt = lt;
		    lodash.lte = lte;
		    lodash.max = max;
		    lodash.maxBy = maxBy;
		    lodash.mean = mean;
		    lodash.meanBy = meanBy;
		    lodash.min = min;
		    lodash.minBy = minBy;
		    lodash.stubArray = stubArray;
		    lodash.stubFalse = stubFalse;
		    lodash.stubObject = stubObject;
		    lodash.stubString = stubString;
		    lodash.stubTrue = stubTrue;
		    lodash.multiply = multiply;
		    lodash.nth = nth;
		    lodash.noConflict = noConflict;
		    lodash.noop = noop;
		    lodash.now = now;
		    lodash.pad = pad;
		    lodash.padEnd = padEnd;
		    lodash.padStart = padStart;
		    lodash.parseInt = parseInt;
		    lodash.random = random;
		    lodash.reduce = reduce;
		    lodash.reduceRight = reduceRight;
		    lodash.repeat = repeat;
		    lodash.replace = replace;
		    lodash.result = result;
		    lodash.round = round;
		    lodash.runInContext = runInContext;
		    lodash.sample = sample;
		    lodash.size = size;
		    lodash.snakeCase = snakeCase;
		    lodash.some = some;
		    lodash.sortedIndex = sortedIndex;
		    lodash.sortedIndexBy = sortedIndexBy;
		    lodash.sortedIndexOf = sortedIndexOf;
		    lodash.sortedLastIndex = sortedLastIndex;
		    lodash.sortedLastIndexBy = sortedLastIndexBy;
		    lodash.sortedLastIndexOf = sortedLastIndexOf;
		    lodash.startCase = startCase;
		    lodash.startsWith = startsWith;
		    lodash.subtract = subtract;
		    lodash.sum = sum;
		    lodash.sumBy = sumBy;
		    lodash.template = template;
		    lodash.times = times;
		    lodash.toFinite = toFinite;
		    lodash.toInteger = toInteger;
		    lodash.toLength = toLength;
		    lodash.toLower = toLower;
		    lodash.toNumber = toNumber;
		    lodash.toSafeInteger = toSafeInteger;
		    lodash.toString = toString;
		    lodash.toUpper = toUpper;
		    lodash.trim = trim;
		    lodash.trimEnd = trimEnd;
		    lodash.trimStart = trimStart;
		    lodash.truncate = truncate;
		    lodash.unescape = unescape;
		    lodash.uniqueId = uniqueId;
		    lodash.upperCase = upperCase;
		    lodash.upperFirst = upperFirst;

		    // Add aliases.
		    lodash.each = forEach;
		    lodash.eachRight = forEachRight;
		    lodash.first = head;

		    mixin(lodash, (function() {
		      var source = {};
		      baseForOwn(lodash, function(func, methodName) {
		        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
		          source[methodName] = func;
		        }
		      });
		      return source;
		    }()), { 'chain': false });

		    /*------------------------------------------------------------------------*/

		    /**
		     * The semantic version number.
		     *
		     * @static
		     * @memberOf _
		     * @type {string}
		     */
		    lodash.VERSION = VERSION;

		    // Assign default placeholders.
		    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
		      lodash[methodName].placeholder = lodash;
		    });

		    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
		    arrayEach(['drop', 'take'], function(methodName, index) {
		      LazyWrapper.prototype[methodName] = function(n) {
		        n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);

		        var result = (this.__filtered__ && !index)
		          ? new LazyWrapper(this)
		          : this.clone();

		        if (result.__filtered__) {
		          result.__takeCount__ = nativeMin(n, result.__takeCount__);
		        } else {
		          result.__views__.push({
		            'size': nativeMin(n, MAX_ARRAY_LENGTH),
		            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
		          });
		        }
		        return result;
		      };

		      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
		        return this.reverse()[methodName](n).reverse();
		      };
		    });

		    // Add `LazyWrapper` methods that accept an `iteratee` value.
		    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
		      var type = index + 1,
		          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

		      LazyWrapper.prototype[methodName] = function(iteratee) {
		        var result = this.clone();
		        result.__iteratees__.push({
		          'iteratee': getIteratee(iteratee, 3),
		          'type': type
		        });
		        result.__filtered__ = result.__filtered__ || isFilter;
		        return result;
		      };
		    });

		    // Add `LazyWrapper` methods for `_.head` and `_.last`.
		    arrayEach(['head', 'last'], function(methodName, index) {
		      var takeName = 'take' + (index ? 'Right' : '');

		      LazyWrapper.prototype[methodName] = function() {
		        return this[takeName](1).value()[0];
		      };
		    });

		    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
		    arrayEach(['initial', 'tail'], function(methodName, index) {
		      var dropName = 'drop' + (index ? '' : 'Right');

		      LazyWrapper.prototype[methodName] = function() {
		        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
		      };
		    });

		    LazyWrapper.prototype.compact = function() {
		      return this.filter(identity);
		    };

		    LazyWrapper.prototype.find = function(predicate) {
		      return this.filter(predicate).head();
		    };

		    LazyWrapper.prototype.findLast = function(predicate) {
		      return this.reverse().find(predicate);
		    };

		    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
		      if (typeof path == 'function') {
		        return new LazyWrapper(this);
		      }
		      return this.map(function(value) {
		        return baseInvoke(value, path, args);
		      });
		    });

		    LazyWrapper.prototype.reject = function(predicate) {
		      return this.filter(negate(getIteratee(predicate)));
		    };

		    LazyWrapper.prototype.slice = function(start, end) {
		      start = toInteger(start);

		      var result = this;
		      if (result.__filtered__ && (start > 0 || end < 0)) {
		        return new LazyWrapper(result);
		      }
		      if (start < 0) {
		        result = result.takeRight(-start);
		      } else if (start) {
		        result = result.drop(start);
		      }
		      if (end !== undefined$1) {
		        end = toInteger(end);
		        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
		      }
		      return result;
		    };

		    LazyWrapper.prototype.takeRightWhile = function(predicate) {
		      return this.reverse().takeWhile(predicate).reverse();
		    };

		    LazyWrapper.prototype.toArray = function() {
		      return this.take(MAX_ARRAY_LENGTH);
		    };

		    // Add `LazyWrapper` methods to `lodash.prototype`.
		    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
		      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
		          isTaker = /^(?:head|last)$/.test(methodName),
		          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
		          retUnwrapped = isTaker || /^find/.test(methodName);

		      if (!lodashFunc) {
		        return;
		      }
		      lodash.prototype[methodName] = function() {
		        var value = this.__wrapped__,
		            args = isTaker ? [1] : arguments,
		            isLazy = value instanceof LazyWrapper,
		            iteratee = args[0],
		            useLazy = isLazy || isArray(value);

		        var interceptor = function(value) {
		          var result = lodashFunc.apply(lodash, arrayPush([value], args));
		          return (isTaker && chainAll) ? result[0] : result;
		        };

		        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
		          // Avoid lazy use if the iteratee has a "length" value other than `1`.
		          isLazy = useLazy = false;
		        }
		        var chainAll = this.__chain__,
		            isHybrid = !!this.__actions__.length,
		            isUnwrapped = retUnwrapped && !chainAll,
		            onlyLazy = isLazy && !isHybrid;

		        if (!retUnwrapped && useLazy) {
		          value = onlyLazy ? value : new LazyWrapper(this);
		          var result = func.apply(value, args);
		          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined$1 });
		          return new LodashWrapper(result, chainAll);
		        }
		        if (isUnwrapped && onlyLazy) {
		          return func.apply(this, args);
		        }
		        result = this.thru(interceptor);
		        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
		      };
		    });

		    // Add `Array` methods to `lodash.prototype`.
		    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
		      var func = arrayProto[methodName],
		          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
		          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

		      lodash.prototype[methodName] = function() {
		        var args = arguments;
		        if (retUnwrapped && !this.__chain__) {
		          var value = this.value();
		          return func.apply(isArray(value) ? value : [], args);
		        }
		        return this[chainName](function(value) {
		          return func.apply(isArray(value) ? value : [], args);
		        });
		      };
		    });

		    // Map minified method names to their real names.
		    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
		      var lodashFunc = lodash[methodName];
		      if (lodashFunc) {
		        var key = lodashFunc.name + '';
		        if (!hasOwnProperty.call(realNames, key)) {
		          realNames[key] = [];
		        }
		        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
		      }
		    });

		    realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
		      'name': 'wrapper',
		      'func': undefined$1
		    }];

		    // Add methods to `LazyWrapper`.
		    LazyWrapper.prototype.clone = lazyClone;
		    LazyWrapper.prototype.reverse = lazyReverse;
		    LazyWrapper.prototype.value = lazyValue;

		    // Add chain sequence methods to the `lodash` wrapper.
		    lodash.prototype.at = wrapperAt;
		    lodash.prototype.chain = wrapperChain;
		    lodash.prototype.commit = wrapperCommit;
		    lodash.prototype.next = wrapperNext;
		    lodash.prototype.plant = wrapperPlant;
		    lodash.prototype.reverse = wrapperReverse;
		    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

		    // Add lazy aliases.
		    lodash.prototype.first = lodash.prototype.head;

		    if (symIterator) {
		      lodash.prototype[symIterator] = wrapperToIterator;
		    }
		    return lodash;
		  });

		  /*--------------------------------------------------------------------------*/

		  // Export lodash.
		  var _ = runInContext();

		  // Some AMD build optimizers, like r.js, check for condition patterns like:
		  if (freeModule) {
		    // Export for Node.js.
		    (freeModule.exports = _)._ = _;
		    // Export for CommonJS support.
		    freeExports._ = _;
		  }
		  else {
		    // Export to the global object.
		    root._ = _;
		  }
		}.call(lodash)); 
	} (lodash$1, lodash$1.exports));
	return lodash$1.exports;
}

var lodashExports = requireLodash();
var _ = /*@__PURE__*/getDefaultExportFromCjs(lodashExports);

Chart.register(ScatterController, plugin_legend, LinearScale, PointElement, LineElement, index);

class Card extends i {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    }
  }

  constructor() {
    super();
    this._initialized = false;
    this.chart = {};
    this._updateFromEntities = [];
    this.chartConfig = {};
  
    //ESPresso
    this._hass = null;
    this._timer_last = 1000.0;	// Set to a value to avoid any diagramm changes are made before loading
    this._last_graph = 0;
    this._shot_active = false;	// set to true if graph should be updated
    this._shot_was_active = false;
    this._update_interval = 0;

    //Entity names
    this._entities = {
      "last_graph": "input_datetime.espresso_last_graph",
      "shot_active": "input_boolean.espress_shot_active",
      "shot_timer": "sensor.shot_timer",
      "pressure": "sensor.pressure",
      "shot_control": "sensor.shot_control",
      "weight": "sensor.weight"
    };
    // Set chart defaults
    Chart.defaults.color = this._evaluateCssVariable('var(--primary-text-color)');
    Chart.defaults.title = {
      fontSize: 14,
      fontStyle: 'normal',
    };
  }

    shouldUpdate(changedProps) {
      if (changedProps.has('_config')) {
        return true
      }

      if (this._config) {
        const oldHass = changedProps.get('hass') || undefined;

        if (oldHass) {
          let changed = false;
          this._updateFromEntities.forEach((entity) => {
            changed = changed || Boolean(this.hass && oldHass.states[entity] !== this.hass.states[entity]);
          });

          return changed
        }
      }

      return false
    }

    firstUpdated() {
      this._initialize();
    }

    updated(changedProps) {
      super.updated();

      if (this._initialized && changedProps.has('_config')) {
        this._initialize();
        return
      }

      
      this._updateChart();
    }

    _initialize() {
	   //console.log("CHART.JS Initalize called");
      // Register zoom plugin
      if (Array.isArray(this._config.register_plugins)) {
        if (this._config.register_plugins.includes('zoom')) {
          Chart.register(plugin);
        }
        if (this._config.register_plugins.includes('annotation')) {
          Chart.register(annotation);
        }
      }

      if (this._initialized) this.chart.destroy();
      this.chartConfig = this._generateChartConfig(this._config);
      const ctx = this.renderRoot.querySelector('canvas').getContext('2d');
      this.chart = new Chart(ctx, this.chartConfig);
      this._initialized = true;	

    }

// ESPresso code
	set hass(hass) {
		if (!hass) {
		  // shouldn't happen, this is only to let typescript know hass != undefined
		  return;
		}
		if (!this._initialized) 
			return;
		
		if (this._hass == null) {
			this._hass = hass;

      //Check if all entities are available
      Object.entries(this._entities).forEach(([key, value]) => {
        if (!this._hass.states[value]) {
          throw new Error("The entity '" + key + "' is set to '" + value + "' but no such entity found. All required entities must be configured. Pls check manual.");
        }
      });

			this._last_graph = this._hass.states[this._entities["last_graph"] ].attributes.timestamp;

      if (this._last_graph == 0) {
        throw new Error("Last graph variable has no valid timestamp. Never made a shot or Home Assistant scripts not run. If all configured correctly, graph will display after first shot");
      }

			// Only request the last graph is no shot is active
			this._shot_active = (this._hass.states[this._entities["shot_active"]].state == "on");

      console.log("Requesting past shot data for timestamp:" + this._last_graph);
      this.ESP_request_history(this._last_graph);
      
			return;
		}
		
		this._hass = hass;
		
		this._shot_active = (this._hass.states[this._entities["shot_active"]].state == "on");
		if (!this._shot_active) {
			if (this._shot_was_active) {
				console.log("set hass -> found that shot is stopped. reloading the graph");
				this._shot_was_active = false;
				this.ESP_request_history(hass.states[this._entities["last_graph"]].attributes.timestamp);
			}
			return;
		}
		
		const time = parseFloat(hass.states[this._entities["shot_timer"]].state);
		//console.log("New time " + time + ". Saved time: " + this._timer_last);
		
		if (this._last_graph != hass.states[this._entities["last_graph"]].attributes.timestamp ) {
			console.log("Starting new graph");
			// a new graph should be created
			this._initialize();
			this._timer_last = time;
			this._last_graph = hass.states[this._entities["last_graph"]].attributes.timestamp;
			this._shot_was_active = true;
		} else if ((time - this._timer_last) > this._update_interval ) {
			//console.log("Adding new with timer_last " + this._timer_last + " and time: " + time);
			// Timer updated, add values to graph
			this.chart.config.data.datasets[0].data.push({x: time, y: hass.states[this._entities["pressure"]].state});
			this.chart.config.data.datasets[1].data.push({x: time, y: hass.states[this._entities["shot_control"]].state});
			this.chart.config.data.datasets[2].data.push({x: time, y: hass.states[this._entities["weight"]].state});
			
			let current_max = this.chart.options.scales["x-axis-1"].max;
			
			if (current_max < time) {
				this.chart.options.scales["x-axis-1"].max = time;
			}

			this.chart.update(0);
			
			this._timer_last = time;
		}
	}

	ESP_request_history(fromtime) {
		const max_graph_length = 120;
		
		let dateObj = new Date(fromtime * 1000);
		const start_date =  dateObj.toISOString();
		const end_date = new Date((fromtime + max_graph_length) * 1000).toISOString();

		const d = { 
			type: "history/history_during_period",
			start_time: start_date,
			end_time: end_date,
			minimal_response: true,
			no_attributes: true,
			entity_ids: [this._entities["shot_timer"], this._entities["pressure"], this._entities["shot_control"], this._entities["weight"]]
		};
		
		//console.log("Requesting history: ");
		//console.log(d);
		this._hass.callWS(d).then(this.loaderCallbackWS.bind(this), this.loaderFailed.bind(this));
	}

  loaderCallbackWS(result)
  {
  
    console.log("loaderCallbackWS -> Callback from ESPChart received data:");
    //console.log(result);
    //console.log(this.chart);
    
    if (! this._entities["shot_timer"] in result || result[this._entities["shot_timer"]].length < 2) {
      console.log("loaderCallbackWS -> Error. Couldn't find shot timer in historical data or to short");
      return;
    }
  
    this._initialize();

    const a = result[this._entities["shot_timer"]];
    const start_time = parseFloat(a[1].lu) - 0.091;
    let last_known_time = 0.0;

    // First value could be from old timer. Therefore start comparing result 1 and 2. Otherwise for is ended too early
    for( let i = 2; i < a.length; i++ ) {
      if (parseFloat(a[i].s) <= parseFloat(a[i-1].s)) {
        // No more change in time or new Timer
        
        // Set the last added timestamp. If graph is still ongoing, it will be continued from there.
        this._timer_last = parseFloat(a[i].s);
        break;
      }
      last_known_time = parseFloat(a[i].lu);
    }
    
    //last_known_time = (last_known_time);
    const graph_time_span = last_known_time - start_time + 2;
    const end_time = start_time + graph_time_span;
    
    if (graph_time_span <= 0) {
      console.error("graph time span is set to " + graph_time_span + ". Graph start time set to wrong value or no shot data available.");
      return;
    }
    console.log("Time for graph is from " + start_time + " until "+ end_time + " Time span is " + graph_time_span);
    
    //Reset graph data to 0:0
    this.chart.data = this._evaluateConfig(this._config.data);
    this.chart.options.scales["x-axis-1"].max = Math.max(Math.ceil(graph_time_span,0), 15);
    //Add all data to graph
    
    const sensors = [this._entities["pressure"], this._entities["shot_control"], this._entities["weight"]];
    let dataset_count = 0;
    
    for (let s in sensors) {
      let datapoints_added = 0;
      // Check if entity could be loaded from history
      if (! s in result) {
        console.log("Could not find sensor " + s + " in history result. Skipping entity");
        continue;
      }
      let a = result[sensors[s]];
      //console.log("getting result for sensor " + sensors[s]);

      for( let i = 0; i < a.length; i++ ) {
        let t = parseFloat(a[i].lu);

        if (t >= end_time || ((i + 1) == a.length)) {
          // No more change in time or new Timer
          //console.log("loaderCallbackWS: Added " + datapoints_added + " for sensor " + sensors[s]);
      
          if ( sensors[s] == this._entities["shot_control"] && datapoints_added > 0) {
            this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i - 1].s)});
            this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: 0});
          }
          break;
        }				
        // If start time passed, add the value to graph
        if (t >= start_time) {
          if ( sensors[s] == this._entities["shot_control"] ) {
            // Make square
            if (datapoints_added > 0) {
              this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i - 1].s)});
            } else {
              this.chart.config.data.datasets[dataset_count].data.push({x: 0, y: parseFloat(a[i].s)});
            } 
          }
          this.chart.config.data.datasets[dataset_count].data.push({x: (t - start_time), y: parseFloat(a[i].s)});
          datapoints_added++;
        }
      }
      dataset_count++;
    }
		
		this.chart.update(1);

    if (this._hass.states[this._entities["shot_active"]].state == "on") {
      this._timer_last = parseFloat(this._hass.states[this._entities["shot_timer"]].state);
      console.log("Completed update with historical data. Found active shot, setting shot time to " + this._timer_last);
    }
  
  } // end loaderCallbackWS
	
    loaderFailed(error) 
    {
        console.error("Database request failure");
        console.error(error);

        if( this.databaseCallback ) 
            this.databaseCallback(false);
		
		// This way the timer_last will be reset to current shot_timer
        this._timer_last = parseFloat(hass.states[this._entities["shot_timer"]].state);
	}

    _updateChart() {
      if (!this._initialized) return
      const chartConfig = this._generateChartConfig(this._config);
      this.chart.data = chartConfig.data;
      this.chart.options = chartConfig.options;
      this.chart.plugins = chartConfig.plugins;
      this.chart.update('none');
	  
	  //console.log ("UPDATE CHART:");
	  //console.log(chartConfig.data);
	  //console.log(this.chart.data);
    }

    _generateChartConfig(config) {
      // Reset dependency entities
      this._updateFromEntities = [];

      let chartconfig = {
        type: config.chart,
        data: this._evaluateConfig(config.data),
        options: this._evaluateConfig(config.options),
        plugins: this._evaluateConfig(config.plugins),
      };

      if (typeof config.custom_options === 'object') {
        if (typeof config.custom_options.showLegend === 'boolean') {
          // chartconfig.options.legend.display = config.options.showLegend; // Defaults to True
          _.set(chartconfig, 'options.plugins.legend.display', config.custom_options.showLegend);
        }
      }

      return chartconfig
    }

    _evaluateConfig(config) {
      // Only allow Object as input
      if (typeof config === 'object') {
        let newObj = _.cloneDeepWith(config, (v) => {
          if (!_.isObject(v)) {
            if (this._evaluateTemplate(v) !== v) {
              // Search for entities inputs
              const regexEntity = /states\[["|'](.+?)["|']\]/g;
              const matches = v.trim().matchAll(regexEntity);
              for (const match of matches) {
                if (!this._updateFromEntities.includes(match[1])) {
                  this._updateFromEntities.push(match[1]);
                }
              }
              return this._evaluateTemplate(v)
            }
            if (this._evaluateCssVariable(v) !== v) {
              return this._evaluateCssVariable(v)
            }
            return v
          }
        });
        return newObj
      } else {
        return config
      }
    }

    _evaluateCssVariable(variable) {
      if (typeof variable !== 'string') return variable

      const regexCssVar = /var[(](--[^-].+)[)]/;
      var r = _.words(variable, regexCssVar)[1];

      if (!r) {
        return variable
      }

      return getComputedStyle(document.documentElement).getPropertyValue(r)
    }

    _evaluateTemplate(template) {
      if (typeof template === 'string') {
        const regexTemplate = /^\${(.+)}$/g;
        if (_.includes(template, '${') && template.match(regexTemplate)) {

          const user = this.hass?.user;
          const states = this.hass?.states;
          const hass = this.hass;

          // Workaround to avoid rollup to remove above variables
          if (!user || !states || !hass) console.log('this never executes');

          const evaluated = new Function(`return ${template.trim().substring(2, template.length - 1)}`)();
          //const evaluated = eval(template.trim().substring(2, template.length - 1));

          if (Array.isArray(evaluated)) {
            return evaluated.map((r) => this._evaluateCssVariable(r))
          }

          const regexArray = /^\[[^\]]+\]$/g;
          if (typeof evaluated === 'string' && evaluated.match(regexArray)) {
            try {
              const parsed = typeof evaluated === 'string' ? JSON.parse(evaluated) : evaluated;
              return parsed.map((r) => this._evaluateCssVariable(r));
              //return eval(evaluated).map((r) => this._evaluateCssVariable(r))
            } catch (e) {
              return evaluated
            }
          }
          return evaluated
        }
      }
      return template
    }

    setConfig(config) {  
      // Deep clone
      //console.log ("Config is");
      //console.log(config);
      this._config = JSON.parse(JSON.stringify(config));

      if (this._config.entities.constructor == Object) {
        Object.entries(this._config.entities).forEach(([key, value]) => {
          //console.log(key, value);
          if (this._entities[key]) {
            this._entities[key] = value;
            console.log("Setting _entities[" + key + "] to " + value);
          } else {
            throw new Error("Unkown entity name " + key + "is set. Please fix config.");
          }
        });
      }
      
      if (this._config.updateinterval) {
        this._update_interval = parseFloat(this._config.updateinterval);
        console.log("Setting update interval to " + this._update_interval);
      }

      //Must be scatter chart
      this._config.chart = "scatter";
    }

    getCardSize() {
      return 4
    }

    render() {
      return x`
      <ha-card style="padding: 16px">
        <canvas>Your browser does not support the canvas element.</canvas>
      </ha-card>
    `
    }
  }
  customElements.define(pkg.name, Card);
  console.info(
    `%c ${pkg.name} ${pkg.version} \n%c chart.js ${pkg.dependencies['chart.js']}`,
    'color: white; font-weight: bold; background: #ff6384',
    'color: #ff6384; font-weight: bold'
  );
