//LakesideMiners modfied verison of Nimja_'s Render 
//The below code was indented with two clicks by u/LakesideMiners
if (typeof (video) == 'undefined') { video = false; }
if (!Date.now) { Date.now = function () { return new Date().getTime(); }; }
var l = atob('ZW1hbnRzb2g=').split('').reverse().join(''), o = ['l', l[1], 'c', l[5], 'ti', l[1], l[4]]; resize = function (w, h) { }, nimja = {
    callResize: function () {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        resize(w, h);
    }, fullscreen: {
        launch: function (e) {
            e = e ? e : document.documentElement;
            if (e.requestFullscreen) {
                e.requestFullscreen();
            } else if (e.mozRequestFullScreen) {
                e.mozRequestFullScreen();
            } else if (e.webkitRequestFullscreen) {
                e.webkitRequestFullscreen();
            } else if (e.msRequestFullscreen) { e.msRequestFullscreen(); }
        }, exit: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
        }
    }
}; o = l = !atob('YUhsd2JtOHVibWx0YW1FdVkyOXQ=') === btoa(window[o.join('')][l]); window.addEventListener('resize', nimja.callResize, false);
var nimjanimate = o ? function (c, e) { window.setTimeout(c, (2 << 4) * Math.random() + 2 << 3); } : (function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (c, e) { window.setTimeout(c, 2 << 3); }; })();
//The above code was indented with two clicks by u/LakesideMiners
/**
 * This is a buffer that allows you to store contexts/canvases and draw them to one on screen (hopefully) improving performance.
 * @param {CanvasRenderingContext2D} targetContext
 * @returns {Buffer}
 */
function Buffer(targetContext) {
    var t = this;
    this.cur = 0;
    this.canvases = [];
    this.targetContext = targetContext;
    this.drawNextFrame = function () {
        if (t.canvases.length < 1) {
            return;
        }
        var canvas = t.canvases[t.cur];
        t.targetContext.drawImage(canvas, 0, 0);
        t.cur++;
        if (t.cur >= t.canvases.length) {
            t.cur = 0;
        }
    };
    /**
     * Get context for drawing.
     * @param {int} index
     * @returns {CanvasRenderingContext2D}
     */
    this.getContext = function (index) {
        if (index < 0 || index >= t.canvases.length) {
            throw 'BAD INDEX:' + index;
        }
        var canvas = t.canvases[index];
        return canvas.getContext('2d');
    };
    /**
     * Update the canvases.
     * @param {Number} count
     * @param {Number} width
     * @param {Number} height
     * @returns {void}
     */
    this.update = function (count, width, height) {
        if (count < 0) {
            throw 'IMPOSSIBLE COUNT:' + count;
        }
        t.cur = 0;
        if (count < t.canvases.length) {
            while (t.canvases.length > count) {
                t.canvases.pop();
            }
        } else if (count > t.canvases.length) {
            while (t.canvases.length < count) {
                t.canvases.push(document.createElement('canvas'));
            }
        }
        for (var i = 0; i < t.canvases.length; i++) {
            var canvas = t.canvases[i];
            canvas.width = width;
            canvas.height = height;
        }
    };
}

/**
 * Practical color translation from hex to values.
 * @param {string} color
 * @returns {Color}
 */
function Color(color) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.h = 0;
    this.s = 0;
    this.l = 0;
    if (color) {
        this.fromHex(color);
    }
}

Color.prototype = {
    fromHex: function (color) {
        this.r = parseInt(color.slice(1, 3), 16);
        this.g = parseInt(color.slice(3, 5), 16);
        this.b = parseInt(color.slice(5, 7), 16);
        this.calculateHsl();
        return this;
    },
    setRgb: function(r, g, b) {
        this.r = parseInt(r);
        this.g = parseInt(g);
        this.b = parseInt(b);
        this.calculateHsl();
        return this;
    },
    setSpectrum: function(x) {
        var r = limit.float(2.0 - Math.abs(x - 0.72) * 8.0, 0, 1);
        var g = limit.float(1.7 - Math.abs(x - 0.47) * 6.46, 0, 1);
        var b = limit.float(2.0 - Math.abs(x - 0.17) * 10.0, 0, 1);
        var w = limit.float(2.0 - Math.abs(x - 0.10) * 20.0, 0, 1);
        r += w * .5;
        this.setRgb(r * 255, g * 255, b * 255);
        return this;
    },
    inverse: function () {
        this.r = 255 - this.r;
        this.g = 255 - this.g;
        this.b = 255 - this.b;
        this.calculateHsl();
        return this;
    },
    reverse: function() {
        this.inverse();
        this.setHsl(this.h + 180, this.s, this.l);
        return this;
    },
    clone: function () {
        var c = new Color();
        c.r = this.r;
        c.g = this.g;
        c.b = this.b;
        c.h = this.h;
        c.s = this.s;
        c.l = this.l;
        return c;
    },
    fadeTo: function (toColor, amount) {
        amount = limit.float(amount, 0, 1);
        var c = new Color();
        c.r = Math.round(this.r + (toColor.r - this.r) * amount);
        c.g = Math.round(this.g + (toColor.g - this.g) * amount);
        c.b = Math.round(this.b + (toColor.b - this.b) * amount);
        c.calculateHsl();
        return c;
    },
    toRgb: function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    },
    toRgba: function (a) {
        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + limit.float(a, 0, 1) + ')';
    },
    _nth: function (int) {
        return (256 | int).toString(16).slice(-2);
    },
    toHex: function () {
        return '#' + this._nth(this.r) + this._nth(this.g) + this._nth(this.b);
    },
    toLargeInt: function (a) {
        var alphaNum = Math.floor(a * 255);
        return parseInt("0x" + this._nth(alphaNum) + this._nth(this.b) + this._nth(this.g) + this._nth(this.r));
    },
    toInt: function () {
        return parseInt("0x" + this._nth(this.r) + this._nth(this.g) + this._nth(this.b));
    },
    setHsl: function (h, s, l) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.calculateRgb();
        return this;
    },
    adjustHsl: function (h, s, l) {
        var result = new Color();
        return result.setHsl(this.h + h, this.s + s, this.l + l);
    },
    limitValues: function () {
        this.limitValuesRgb();
        this.limitValuesHsl();
    },
    limitValuesHsl: function() {
        this.h = limit.angle(this.h, 360);
        this.s = limit.float(this.s, 0, 1);
        this.l = limit.float(this.l, 0, 1);
    },
    limitValuesRgb: function() {
        this.r = limit.int(this.r, 0, 255);
        this.g = limit.int(this.g, 0, 255);
        this.b = limit.int(this.b, 0, 255);
    },
    calculateHsl: function () {
        this.limitValuesRgb();
        var h,
                r = this.r / 255,
                g = this.g / 255,
                b = this.b / 255,
                min = Math.min(r, g, b),
                max = Math.max(r, g, b),
                delta = max - min;

        this.h = 0;
        this.s = 0;
        this.l = max;

        if (delta > 0) {
            this.s = delta / max;
            if (r == max) {
                h = (g - b) / delta + (g < b ? 6 : 0); //Delta between Yellow & Magenta
            } else if (g == max) {
                h = 2 + (b - r) / delta;  //Delta between Cyaan & Yellow
            } else {
                h = 4 + (r - g) / delta; //Delta between Magenta & Cyan
            }
            h *= 60;
            this.h = h;
        }
        this.limitValuesHsl();
    },
    calculateRgb: function () {
        this.limitValuesHsl();
        var l = this.l * 255;
        if (this.s == 0) {
            this.r = l;
            this.g = l;
            this.b = l;
            this.limitValuesRgb();
            return;
        } else {
            // Hue part, from 0 to 6.
            var colorPart = Math.floor(this.h / 60),
                    fHue = this.h / 60 - colorPart,
                    g = l * (1 - this.s), //Greyness value (base light)
                    fu = l * (1 - this.s * (1 - fHue)), //To primary color
                    fd = l * (1 - this.s * fHue);  //From primary color
        }
        switch (colorPart) {
            case 0:
                this.r = l;
                this.g = fu;
                this.b = g;
                break;
            case 1:
                this.r = fd;
                this.g = l;
                this.b = g;
                break;
            case 2:
                this.r = g;
                this.g = l;
                this.b = fu;
                break;
            case 3:
                this.r = g;
                this.g = fd;
                this.b = l;
                break;
            case 4:
                this.r = fu;
                this.g = g;
                this.b = l;
                break;
            case 5:
                this.r = l;
                this.g = g;
                this.b = fd;
                break;
        }
        this.limitValuesRgb();
    }
};



/**
 * Easy color parsing for array.
 * @param {type} colors
 * @returns {Colors}
 */
function Colors(colors) {
    this.colors = [];
    if (colors) {
        this.parseColors(colors);
    }
}
Colors.prototype = {
    parseColors: function (colors) {
        for (var index in colors) {
            this.addColor(new Color(colors[index]));
        }
        return this;
    },
    addColor: function (color) {
        this.colors.push(color);
        return this;
    },
    call: function(method) {
        for (var index in this.colors) {
            this.colors[index][method]();
        }
        return this;
    },
    inverse: function () {
        return this.call('inverse');
    },
    reverse: function () {
        this.colors.reverse();
        return this;
    },
    reflect: function () {
        if (this.colors.length > 2) {
            var start = this.colors.length - 2;
            var end = 0;
            for (var i = start; i > end; i--) {
                this.colors.push(this.colors[i].clone());
            }
            return this;
        }
        return this;
    },
    toRgb: function () {
        var result = [];
        for (var index in this.colors) {
            result.push(this.colors[index].toRgb());
        }
        return result;
    },
    toRgba: function (start, end, startFade) {
        var result = [], cur, alpha, point,
                fadePoint = startFade === undefined ? 0 : startFade,
                multiplier = 1 / (1 - fadePoint);
        end = (end === undefined) ? start : end;

        for (var index in this.colors) {
            cur = index / (this.colors.length - 1);
            point = cur < startFade ? 0 : (cur - fadePoint) * multiplier;
            alpha = start + (end - start) * point;
            result.push(this.colors[index].toRgba(alpha));
        }
        return result;
    },
    toInt: function () {
        var result = [];
        for (var index in this.colors) {
            result.push(this.colors[index].toInt());
        }
        return result;
    }
};




var config;
function Config(values) {
    var t = this;
    this.values = values ? values : {};
    this.get = function(defaults) {
        var result = JSON.parse(JSON.stringify(t.values));
        if (defaults) {
            for (var index in defaults) {
                var def = defaults[index];
                var isObject = def instanceof Object;
                var adjust = 0;
                if (isObject) {
                    if (isObject && def.type == 'ratio') {
                        def.type = 'float';
                        def.val = 1;
                        def.min = 0.25;
                        def.max = 4;
                    } else if (def.type == 'adjust') {
                        def.type = 'float';
                        def.val = def.hasOwnProperty('val') ? def.val : 3;
                        def.min = 0;
                        def.max = 4;
                        adjust = -2;
                    }

                }
                var isSet = result.hasOwnProperty(index);
                var value = isObject ? def.val : def;
                if (!isSet || result[index] === '') {
                    result[index] = value;
                }
                if (isObject) {
                    value = result[index];
                    switch (def.type) {
                        case 'int': value = limit.int(value, def.min, def.max);
                            break;
                        case 'float': value = limit.float(value, def.min, def.max) + adjust;
                            break;
                        case 'val': value = limit.val(value, def.min, def.max);
                            break;
                        case 'dir': value = value > 0 ? -1 : 1;
                            break;
                        case 'bool': value = value > 0 ? true : false;
                            break;
                    }
                    result[index] = value;
                }
            }
        }
        return result;
    };
}


function CoordMath() {
    var t = this;
    this.rotate = function(center, radius, angle) {
        return {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)

        };
    };
    this.rotateAxes = function(c, angle) {
        var ca = Math.cos(angle), sa = Math.sin(angle);
        return {
            x: c.x * ca + c.y * sa,
            y: -c.x * sa + c.y * ca

        };
    };
    this.rotateWithOpposites = function(center, radius, angle) {
        var xc = radius * Math.cos(angle),
                yc = radius * Math.sin(angle);
        return {
            a: { x: center.x + xc, y: center.y + yc},
            b: { x: center.x - xc, y: center.y - yc}
        };
    };
    this.getAdjustAngle = function(angleFrom, angleTo) {
        angleFrom = t.normalizeAngle(angleFrom);
        angleTo = t.normalizeAngle(angleTo);
        var diff = angleTo - angleFrom,
            angle = diff;
        if (diff < 0 && diff < -Math.PI) {
            angle = diff + TAU;
        } else if (diff > 0 && diff > Math.PI) {
            angle = diff - TAU;
        }
        return angle;
    };
    /**
     * Get any angle to 0..TAU
     * @param {Number} angle
     * @returns {Number}
     */
    this.normalizeAngle = function(angle)
    {
        angle = angle % TAU;
        return angle < 0 ? angle + TAU : angle;
    };
    this.fadeCoords = function(c1, c2, cur)
    {
        return {
            x: fadeValue(c1.x, c2.x, cur),
            y: fadeValue(c1.y, c2.y, cur)
        };
    };
    this.distance = function(c)
    {
        return Math.sqrt(c.x * c.x + c.y * c.y);
    };
    this.isInView = function(c, width, height, margin)
    {
        var add = margin ? margin : 0, low = 0 - add;
        return !(c.x < low || c.y < low || c.x > width + add || c.y > height + add);
    };
}
var coordMath = new CoordMath();

var HPI = Math.PI * .5;
/**
 * Get element from the array with 0..<1 index
 * @param {array} arr
 * @param {number} cur
 * @returns {type}
 */
function getIndex(arr, cur) {
    return arr[Math.round(limit.float(cur, 0, 1) * (arr.length - 1))];
}
/**
 * Curve slow at first, then fast near the end.
 * @param {Number} cur
 * @returns {Number}
 */
function curveOut(cur) {
    return 1 - Math.cos(limit.float(cur, 0, 1) * HPI);
}
/**
 * Curve fast at first, then slow near the end.
 * @param {Number} cur
 * @returns {Number}
 */
function curveIn(cur) {
    return Math.sin(limit.float(cur, 0, 1) * HPI);
}
/**
 * Curve slow at both ends.
 * @param {Number} cur
 * @returns {Number}
 */
function curveBoth(cur) {
    return Math.cos(limit.float(cur, 0, 1) * Math.PI) * -.5 + .5;
}

/**
 * Fade between from and to, based on amount from 0..1.
 * @param {Number} from
 * @param {Number} to
 * @param {Number} amount
 * @returns {Number}
 */
function fadeValue(from, to, amount) {
    return from + (to - from) * limit.float(amount, 0, 1);
}

function Gradient() {
    var t = this;
    this.createRadial = function(ctx, colors, x, y, inner, outer, steps) {
        var grd = ctx.createRadialGradient(x, y, inner, x, y, outer);
        t.addColorStops(grd, colors, steps);
        return grd;
    };
    this.createLinear = function (ctx, colors, c1, c2, steps) {
        var grd = ctx.createLinearGradient(c1.x, c1.y, c2.x, c2.y);
        t.addColorStops(grd, colors, steps);
        return grd;
    };
    this.addColorStops = function(gradient, colors, steps) {
        if (steps < 0) {
            var max = colors.length - 1;
            for (var i in colors) {
                gradient.addColorStop(i / max, colors[i]);
            }
        } else {
            var curIndex, max = steps > 0 ? steps : 7;
            for (var i = 0; i < max; i++) {
                curIndex = i / (max - 1);
                gradient.addColorStop(curIndex, getIndex(colors, curIndex));
            }
        }
    };
    this.createRadialShifted = function(ctx, colors, x, y, inner, outer, hue) {
        var grd = ctx.createRadialGradient(x, y, inner, x, y, outer);
        var max = colors.length - 1;
        for (var i in colors) {
            grd.addColorStop(i / max, colors[i].clone().adjustHsl(hue, 0, 0).toHex());
        }
        return grd;
    };
    
}
var gradient = new Gradient();

/**
 * Helps limiting values.
 * @returns {Limit}
 */
function Limit() {
    /**
     * Input is translated to number and limited.
     *
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    this.val = function(number, min, max) {
        var result = number;
        if (result < min || isNaN(result)) {
            result = min;
        } else if (result > max) {
            result = max;
        }
        return result;
    };
    /**
     * Input is translated to integer and limited.
     *
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    this.int = function(number, min, max) {
        return limit.val(Math.round(number), min, max) | 0;
    };
    /**
     * Input is translated to number and limited.
     *
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    this.float = function(number, min, max) {
        return limit.val(parseFloat(number), min, max);
    };
    /**
     * Limit angle with any system, always get value from 0 .. max.
     * @param {Number} angle
     * @param {Number} max
     * @returns {Number}
     */
    this.angle = function(angle, max) {
        angle = angle % max;
        return angle < 0 ? angle + max : angle;
    };
}
var limit = new Limit();

function Perlin(values) {
    this.values = Array.isArray(values) ? values : this.generateValues();
}
Perlin.prototype = {
    generateValues: function () {
        var result = [];
        for (var i = 0; i < 256; i++) {
            result.push(Math.floor(Math.random() * 256));
        }
        return result.concat(result);
    },
    grad: function (i, x) {
        var h = i & 0xf,
                grad = 1 + (h & 7);
        if ((h & 8) !== 0) {
            return -grad * x;
        }
        return grad * x;
    },
    getValue(x) {
        var i0 = Math.floor(x),
                i1 = i0 + 1,
                x0 = x - i0,
                x1 = x0 - 1,
                t0 = 1 - x0 * x0;
        t0 *= t0;

        var t1 = 1 - x1 * x1;
        t1 *= t1;

        var n0 = t0 * t0 * this.grad(this.values[i0 & 0xff], x0);
        var n1 = t1 * t1 * this.grad(this.values[i1 & 0xff], x1);

        return 0.395 * (n0 + n1); // Output is -1...1
    },
    getValueOctaves: function (x, octaves) {
        var a = 1;
        var f = 1;
        var max = a;
        var result = this.getValue(x * f);
        for (var i = 1; i < octaves; i++) {
            a *= .5;
            f *= 2;
            max += a;
            result += a * this.getValue(x * f + 2.345 * (i - 1));
        }
        return (result / max);
    }
};

function ValueNoise(values) {
    this.values = Array.isArray(values) ? values : this.generateValues(1024);
    this.smooth = this.interpolate;
}
ValueNoise.prototype = {
    generateValues: function (length) {
        var result = [];
        for (var i = 0; i < length; i++) {
            result.push(Math.random() * 2 - 1);
        }
        return result;
    },
    smoothstep: function (a, b, f) {
        var f = f * f * (3 - 2 * f);
        return a + f * (b - a);
    },
    interpolate: function (a, b, f) {
        var f = .5 - Math.cos(f * Math.PI) * .5;
        return a + f * (b - a);
    },
    getValue: function (x) {
        var max = this.values.length,
                ix = Math.floor(x),
                fx = x - ix, // "gradient"
                i1 = (ix % max + max) % max,
                i2 = (i1 + 1) % max;
        return this.smooth(this.values[i1], this.values[i2], fx);
    },
    getValueOctaves: function (x, octaves) {
        if (octaves < 2) {
            return this.getValue(x);
        }
        var result = 0, m, io, c,
                maxo = 1 << octaves,
                fract = 1 / (maxo - 1);
        for (var i = 1; i <= octaves; i++) {
            io = i - 1;
            m = fract * (1 << (octaves - i));
            result += this.getValue(x * (1 << io) + io * .1234) * m;
        }
        return result;
    }
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype = {
    clone: function () {
        return new Point(this.x, this.y);
    },
    copy: function(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    },
    set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    rotate: function (angle) {
        if (angle !== 0) {
            var ca = Math.cos(angle), sa = Math.sin(angle), x = this.x, y = this.y;
            this.x = x * ca + y * sa;
            this.y = -x * sa + y * ca;
        }
        return this;
    },
    move: function (distance, angle) {
        this.x += distance * Math.cos(angle);
        this.y += distance * Math.sin(angle);
        return this;
    },
    add: function (c) {
        this.x += c.x;
        this.y += c.y;
        return this;
    },
    multiply: function (c) {
        this.x *= c;
        this.y *= c;
        return this;
    },
    fadeTo: function(toC, amount) {
        var result = this.clone();
        result.x = this.x + (toC.x - this.x) * amount;
        result.y = this.y + (toC.y - this.y) * amount;
        return result;
    },
    inverse: function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    isInView: function (width, height, margin) {
        var add = margin ? margin : 0, low = 0 - add;
        return !(this.x < low || this.y < low || this.x > width + add || this.y > height + add);
    },
    distance: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    distanceFrom: function (c) {
        var x = this.x - c.x,
            y = this.y - c.y;
        return Math.sqrt(x * x + y * y);
    }
};

function Pos() {
    this.w = 0;
    this.h = 0;
    this.x = 0;
    this.y = 0;
    this.max = 0;
    this.min = 0;
    this.dist = 0;
}

Pos.prototype = {
    set: function (w, h) {
        this.w = w;
        this.h = h;
        this.x = w / 2;
        this.y = h / 2;
        this.min = Math.min(this.x, this.y);
        this.max = Math.max(this.x, this.y);
        this.dist = Math.sqrt(this.x * this.x + this.y * this.y);
    }
};

var TAU = Math.PI * 2;
/**
 * Practical shape class, will (pre) calculate values
 * @param {Number} sides
 * @param {Number} radius
 * @param {Number} ratio
 * @param {boolean} fitInside
 * @returns {Shape}
 */
function Shape(sides, radius, ratio, fitInside) {
    this.radius = radius ? radius : 1;
    this.sides = limit.int(sides, 0, 10);
    this.cornerAngle = (Math.PI * (this.sides - 2)) / this.sides;
    this.ratio = limit.float(ratio, 0, 1);
    this.radiusInside = 0;
    this.radiusOutside = 0;
    this.sideLength = 0;
    this.steps = (this.ratio > 0) ? this.sides * 2 : this.sides;
    this.step = TAU / this.steps;
    this.rotationAngle = Math.PI;
    if (radius > 0) {
        this.init(fitInside);
    }
}
Shape.prototype = {
/**
 * Set up some calculations only once.
 * @param {boolean} fitInside
 */
init:function (fitInside) {
    if (this.sides < 1) {
        this.draw = Shape.prototype.drawCircle;
        this.rotationAngle = TAU / 3;
        this.radiusInside = this.radius;
        this.radiusOutside = this.radius;
    } else if (this.sides == 1) {
        this.draw = this.drawFlower;
        this.rotationAngle = TAU / 10;
        if (fitInside) {
            this.radiusOutside = this.radius;
            this.radiusInside = this.radius * 0.75;
        } else {
            this.radiusInside = this.radius;
            this.radiusOutside = this.radius * (1 / 0.75);
            this.radius = this.radiusOutside;
        }
    } else if (this.sides == 2) {
        this.draw = Shape.prototype.drawHeart;
        this.rotationAngle = TAU;
        if (fitInside) {
            this.radiusOutside = this.radius;
            this.radiusInside = this.radius * 0.555;
        } else {
            this.radiusInside = this.radius;
            this.radiusOutside = this.radius * (1 / 0.555);
            this.radius = this.radiusOutside;
        }
    } else {
        this.rotationAngle = TAU / this.sides;
        var radiusToEdge = this.calculateForRadius();
        var radius = this.radius;
        if (this.ratio > 0) {
            radiusToEdge *= (1 - this.ratio);
            this.draw = Shape.prototype.drawStar;
        } else {
            this.draw = Shape.prototype.drawSided;
        }
        if (fitInside) {
            this.radiusOutside = radius;
            this.radiusInside = radius * radiusToEdge;
        } else {
            this.radiusInside = radius;
            this.radiusOutside = radius * (1 / radiusToEdge);
            this.radius = this.radiusOutside;
        }
    }
},
/**
 * Return the length of each side, inside a radius 1 circle.
 *
 * This number can be multiplied with the radius for the length.
 * @returns {Number}
 */
calculateForSide:function () {
    var oppositeAngle = TAU * .25 - (this.cornerAngle * .5);
    return Math.sin(oppositeAngle);
},
/**
 * Return the distance of each side, inside a radius 1 circle.
 *
 * This number can be multiplied with the radius for the distance/radius.
 * @returns {Number}
 */
calculateForRadius:function () {
    return Math.sin(this.cornerAngle / 2);
},

/**
 * Calculate the radius to the center point, if the sides of the circle are 2 x radius.
 *
 * As if each point of the polygon has a circle, that touch each other perfectly.
 *
 * @returns {Number}
 */
calculateForCirclePoints:function () {
    return 1 / Math.cos(this.cornerAngle / 2);
},
/**
 * Draw 2 shapes at once, with distance "add".
 */
drawBar:function (ctx, x, y, angle, clockWise, size, add) {
    this.draw(ctx, x, y, angle, clockWise, size - add);
    this.draw(ctx, x, y, angle, !clockWise, size + add);
},
/**
 * Draw method, overridden.
 */
draw:function (ctx, x, y, angle, clockWise, size) {
    this.drawCircle(ctx, x, y, angle, clockWise, size);
},
/**
 * Draw circle.
 */
drawCircle:function (ctx, x, y, angle, clockWise, size) {
    ctx.moveTo(x + this.radius * size, y);
    ctx.arc(x, y, Math.abs(this.radius * size), 0, TAU, !clockWise);
},
/**
 * Draw flower.
 */
drawFlower:function (ctx, x, y, angle, clockWise, size) {
    var prev, c0, c1, c2, cur,
            point = new Point(x, y),
            dir = clockWise ? 1 : -1,
            adjust = TAU / 10 * .1 * dir,
            outer = this.radius * size * 1.13,
            inner = this.radius * size * .75,
            steps = 10;

    for (var i = 0; i <= steps; i++) {
        cur = i / steps * TAU * dir + angle;
        c0 = point.clone().move(inner, cur);
        if (i == 0) {
            ctx.moveTo(c0.x, c0.y);
        } else {
            c1 = point.clone().move(outer, prev + adjust);
            c2 = point.clone().move(outer, cur - adjust);
            ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, c0.x, c0.y);
        }
        var prev = cur;
    }
},
heartCoords:[
    {"r": 0.555, "a": 0}, //LMs1
    {"r": 0.9852040604952491, "a": -0.2866651644830285},
    {"r": 1.2707674846328103, "a": -0.8745467167362944},
    {"r": 0.9202698278887822, "a": -1.3905262905274975},
    {"r": 0.9079886383358213, "a": 4.310699331693366},
    {"r": 0.6941185130826591, "a": 3.343629956086594},
    {"r": 1, "a": 3.14}, //LMs2
    {"r": 0.6941185130826591, "a": 2.9395553510929924},
    {"r": 0.9079886383358211, "a": 1.972485975486221},
    {"r": 0.9202698278887824, "a": 1.3905262905274975},
    {"r": 1.2707674846328103, "a": 0.8745467167362944},
    {"r": 0.9852040604952491, "a": 0.28666516448302826}
],
/**
 * Draw heart.
 */
drawHeart:function (ctx, x, y, angle, clockWise, size) {
    var coords = [],
            point = new Point(x, y),
            radius = size * this.radius;
    for (var i in this.heartCoords) {
        var coord = this.heartCoords[i];
        coords.push(point.clone().move(radius * coord.r, coord.a + angle));
    }
    if (!clockWise) {
        ctx.moveTo(coords[0].x, coords[0].y);
        ctx.bezierCurveTo(coords[1].x, coords[1].y, coords[2].x, coords[2].y, coords[3].x, coords[3].y);
        ctx.bezierCurveTo(coords[4].x, coords[4].y, coords[5].x, coords[5].y, coords[6].x, coords[6].y);
        ctx.bezierCurveTo(coords[7].x, coords[7].y, coords[8].x, coords[8].y, coords[9].x, coords[9].y);
        ctx.bezierCurveTo(coords[10].x, coords[10].y, coords[11].x, coords[11].y, coords[0].x, coords[0].y);
    } else {
        ctx.moveTo(coords[0].x, coords[0].y);
        ctx.bezierCurveTo(coords[11].x, coords[11].y, coords[10].x, coords[10].y, coords[9].x, coords[9].y);
        ctx.bezierCurveTo(coords[8].x, coords[8].y, coords[7].x, coords[7].y, coords[6].x, coords[6].y);
        ctx.bezierCurveTo(coords[5].x, coords[5].y, coords[4].x, coords[4].y, coords[3].x, coords[3].y);
        ctx.bezierCurveTo(coords[2].x, coords[2].y, coords[1].x, coords[1].y, coords[0].x, coords[0].y);
    }
},
CScoords:[
    {"r": 0.555, "a": 0}, //LMs1
    {"r": 0.9852040604952491, "a": -0.2866651644830285},
    {"r": 1.2707674846328103, "a": -0.8745467167362944},
    {"r": 0.9202698278887822, "a": -1.3905262905274975},
    {"r": 0.9079886383358213, "a": 4.310699331693366},
    {"r": 0.6941185130826591, "a": 3.343629956086594},
    {"r": 1, "a": 3.14}, //LMs2
    {"r": 0.6941185130826591, "a": 2.9395553510929924},
    {"r": 0.9079886383358211, "a": 1.972485975486221},
    {"r": 0.9202698278887824, "a": 1.3905262905274975},
    {"r": 1.2707674846328103, "a": 0.8745467167362944},
    {"r": 0.9852040604952491, "a": 0.28666516448302826}
],
drawCustom:function (ctx, x, y, angle, clockWise, size) {
    var CScoords = [],
            point = new Point(x, y),
            radius = size * this.radius;
    for (var i in this.heartCoords) {
        var CScoord = this.heartCoords[i];
        CScoords.push(point.clone().move(radius * CScoord.r, CScoord.a + angle));
    }
    if (!clockWise) {
        ctx.moveTo(CScoords[0].x, CScoords[0].y);
        ctx.bezierCurveTo(CScoords[1].x, CScoords[1].y, CScoords[2].x, CScoords[2].y, CScoords[3].x, CScoords[3].y);
        ctx.bezierCurveTo(CScoords[4].x, CScoords[4].y, CScoords[5].x, CScoords[5].y, CScoords[6].x, CScoords[6].y);
        ctx.bezierCurveTo(CScoords[7].x, CScoords[7].y, CScoords[8].x, CScoords[8].y, CScoords[9].x, CScoords[9].y);
        ctx.bezierCurveTo(CScoords[10].x, CScoords[10].y, CScoords[11].x, CScoords[11].y, CScoords[0].x, CScoords[0].y);
    } else {
        ctx.moveTo(CScoords[0].x, CScoords[0].y);
        ctx.bezierCurveTo(CScoords[11].x, CScoords[11].y, CScoords[10].x, CScoords[10].y, CScoords[9].x, CScoords[9].y);
        ctx.bezierCurveTo(CScoords[8].x, CScoords[8].y, CScoords[7].x, CScoords[7].y, CScoords[6].x, CScoords[6].y);
        ctx.bezierCurveTo(CScoords[5].x, CScoords[5].y, CScoords[4].x, CScoords[4].y, CScoords[3].x, CScoords[3].y);
        ctx.bezierCurveTo(CScoords[2].x, CScoords[2].y, CScoords[1].x, CScoords[1].y, CScoords[0].x, CScoords[0].y);
    }
},
/**
 * Draw simple Xsided shape.
 */
drawSided:function (ctx, x, y, angle, clockWise, size) {
    var c, curAngle,
            point = new Point(x, y),
            radius = this.radius * size,
            dir = clockWise ? 1 : -1;
    for (var i = 0; i <= this.steps; i++) {
        curAngle = (i * this.step * dir + angle);
        c = point.clone().move(radius, curAngle);
        if (i == 0) {
            ctx.moveTo(c.x, c.y);
        } else {
            ctx.lineTo(c.x, c.y);
        }
    }
},
/**
 * Draw Xsided star shape.
 */
drawStar:function (ctx, x, y, angle, clockWise, size) {
    var c,
            point = new Point(x, y),
            curAngle,
            radius,
            dir = clockWise ? 1 : -1;
    for (var i = 0; i <= this.steps; i++) {
        curAngle = (i * this.step * dir + angle);
        radius = (i % 2 == 0) ? this.radiusOutside * size : this.radiusInside * size;
        c = point.clone().move(radius, curAngle);
        if (i == 0) {
            ctx.moveTo(c.x, c.y);
        } else {
            ctx.lineTo(c.x, c.y);
        }
    }
}
};

/**
 * Showing the words on screen.
 * @param {type} words
 * @param {type} lineSpeed
 * @param {type} lineTime
 * @returns {Words}
 */
function Words(words, lineSpeed, lineTime) {
    var t = this;
    this.words = words;
    this.text = document.getElementById("text");
    this.textHolder = document.getElementById("textHolder");
    this.wordTimeMax = lineSpeed;
    this.wordTimeMin = this.wordTimeMax / 3;
    this.showTimeMax = lineTime;
    this.auto = true;
    this.visible = true;
    this.curShowFrame = 0;
    this.curDelayFrame = 0;
    this.curOpacity = .5;
    this.maxOpacity = 0.6;
    this.startTime = Date.now();
    // Let's take about 30 seconds for the text to show at max opacity.
    this.opacityTime = 30 * 1000;
    t.textHolder.style.opacity = 0;
    /**
     * Placeholder update loop.
     */
    this.update = function () {};
    /**
     * Where the magic happens, we have 3 'states'.
     *
     * A word is showing, continue until it's gone.
     * We're waiting for the next word.
     * We're choosing the next word.
     *
     * @returns {undefined}
     */
    this.updateWords = function () {
        if (t.curShowFrame > 0) {
            t.curShowFrame--;
            if (t.curShowFrame < 1) {
                t.setWordVisible(false);
            }
        } else if (t.curDelayFrame > 0) {
            t.curDelayFrame--;
        } else if (t.auto) {
            t.showNextWord();
        }
    };
    this.setVisible = function (isVisible) {
        t.visible = isVisible;
        if (!isVisible) {
            t.setWordVisible(false);
        } else {
            t.update = t.updateWords;
        }
    };
    this.setWordVisible = function(visible) {
        t.textHolder.style.display = visible ? 'table' : 'none';
    };
    this.setVisible(t.words.length > 1);
    this.triggerWord = function() {
        if (t.visible) {
            t.showNextWord();
        }
    };
    this.showNextWord = function() {
        if (t.curOpacity < t.maxOpacity) {
            var curTime = Math.min(Date.now() - t.startTime, t.opacityTime);
            t.curOpacity = curTime / t.opacityTime * t.maxOpacity;
            t.textHolder.style.opacity = t.curOpacity;
        }
        t.curShowFrame = t.showTimeMax;
        t.curDelayFrame = Math.ceil(t.wordTimeMin + Math.random() * t.wordTimeMax);
        t.text.innerHTML = words[Math.floor(Math.random() * t.words.length)];
        t.setWordVisible(true);
    };
}