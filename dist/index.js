"use strict";
function canvasPolyfill() {
    if (CanvasRenderingContext2D.prototype.ellipse === undefined) {
        CanvasRenderingContext2D.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            this.save();
            this.translate(x, y);
            this.rotate(rotation);
            this.scale(radiusX, radiusY);
            this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
            this.restore();
        };
    }
    if (CanvasRenderingContext2D.prototype.resetTransform === undefined) {
        CanvasRenderingContext2D.prototype.resetTransform = function () {
            this.setTransform(1, 0, 0, 1, 0, 0);
        };
    }
    (function () {
        if (CanvasRenderingContext2D.prototype.getTransform !== undefined) {
            return;
        }
        CanvasRenderingContext2D.prototype.getTransform = function () {
            return function () {
                var polyfill = this._t2stack && this._t2stack[this._t2stack.length - 1] || { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
                return polyfill;
            };
        }();
        CanvasRenderingContext2D.prototype.save = function () {
            var save = CanvasRenderingContext2D.prototype.save;
            return function () {
                if (!this._t2stack) {
                    this._t2stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
                }
                var t = this._t2stack[this._t2stack.length - 1];
                this._t2stack.push(t && { a: t.a, b: t.b, c: t.c, d: t.d, e: t.e, f: t.f });
                save.call(this);
            };
        }();
        CanvasRenderingContext2D.prototype.restore = function () {
            var restore = CanvasRenderingContext2D.prototype.restore;
            return function () {
                if (this._t2stack)
                    this._t2stack.pop();
                restore.call(this);
            };
        }();
        CanvasRenderingContext2D.prototype.transform = function () {
            var transform = CanvasRenderingContext2D.prototype.transform;
            return function (a, b, c, d, e, f) {
                if (!this._t2stack) {
                    this._t2stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
                }
                var t = this._t2stack[this._t2stack.length - 1], q;
                var na = t.a * a + t.c * b;
                var nb = t.b * a + t.d * b;
                var nc = t.a * c + t.c * d;
                var nd = t.b * c + t.d * d;
                var ne = t.e + t.a * e + t.c * f;
                var nf = t.f + t.b * e + t.d * f;
                t.a = na;
                t.b = nb;
                t.c = nc;
                t.d = nd;
                t.e = ne;
                t.f = nf;
                transform.call(this, a, b, c, d, e, f);
            };
        }();
        CanvasRenderingContext2D.prototype.setTransform = function () {
            var setTransform = CanvasRenderingContext2D.prototype.setTransform;
            return function (a, b, c, d, e, f) {
                if (!this._t2stack) {
                    this._t2stack = [{}];
                }
                if (typeof a === "object" || typeof a === "undefined") {
                    var aa = a.a, b_1 = a.b, c_1 = a.c, d_1 = a.d, e_1 = a.e, f_1 = a.f;
                    this._t2stack[this._t2stack.length - 1] = { a: aa, b: b_1, c: c_1, d: d_1, e: e_1, f: f_1 };
                    setTransform.call(this, aa, b_1, c_1, d_1, e_1, f_1);
                }
                else {
                    this._t2stack[this._t2stack.length - 1] = { a: a, b: b, c: c, d: d, e: e, f: f };
                    setTransform.call(this, a, b, c, d, e, f);
                }
            };
        }();
        CanvasRenderingContext2D.prototype.resetTransform = function () {
            var resetTransform = CanvasRenderingContext2D.prototype.resetTransform;
            return function () {
                if (!this._t2stack) {
                    this._t2stack = [{}];
                }
                this._t2stack[this._t2stack.length - 1] = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
                resetTransform && resetTransform.call(this);
            };
        }();
        CanvasRenderingContext2D.prototype.scale = function () {
            var scale = CanvasRenderingContext2D.prototype.scale;
            return function (sx, sy) {
                if (!this._t2stack) {
                    this._t2stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
                }
                var t = this._t2stack[this._t2stack.length - 1];
                sx = sx || 1;
                sy = sy || sx;
                t.a *= sx;
                t.c *= sy;
                t.b *= sx;
                t.d *= sy;
                scale.call(this, sx, sy);
            };
        }();
        CanvasRenderingContext2D.prototype.rotate = function () {
            var rotate = CanvasRenderingContext2D.prototype.rotate;
            return function (w) {
                if (!this._t2stack) {
                    this._t2stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
                }
                var t = this._t2stack[this._t2stack.length - 1];
                var cw = Math.cos(-w);
                var sw = Math.sin(-w);
                var a = t.a * cw - t.c * sw;
                var b = t.b * cw - t.d * sw;
                var c = t.c * cw + t.a * sw;
                var d = t.d * cw + t.b * sw;
                t.a = a;
                t.b = b;
                t.c = c;
                t.d = d;
                return rotate.call(this, w);
            };
        }();
        CanvasRenderingContext2D.prototype.translate = function () {
            var translate = CanvasRenderingContext2D.prototype.translate;
            return function (x, y) {
                if (!this._t2stack) {
                    this._t2stack = [{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }];
                }
                var t = this._t2stack[this._t2stack.length - 1];
                t.e += x * t.a + y * t.c;
                t.f += x * t.b + y * t.d;
                return translate.call(this, x, y);
            };
        }();
    })();
}
;
canvasPolyfill();
