# Canvas Polyfill

iOS 10 缺少的 API

1. `getTransform`
2. `getContextAttributes`(未使用)

Android 19 缺少的 API

1. `getTransform`
2. `resetTransform`
3. `ellipse`
4. `direction`(未使用)
5. `drawFocusIfNeeded`(未使用)
6. `getContextAttributes`(未使用)

## Polyfill 处理

### ellipse
`ellipse`有 google 的 [polyfill](https://github.com/google/canvas-5-polyfill/blob/master/canvas.js)，`ellipse`有简单的代码。

```javascript
if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
  CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    this.scale(radiusX, radiusY);
    this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    this.restore();
  }
}
```

### resetTransform

`resetTransform`的 polyfill 非常简单，直接调用`setTransform(1, 0, 0, 1, 0, 0)`即可。

## getTransform

`getTransform`则需要对各种计算进行结果保存。

* polyfill 参考

[ctx-polyfill](https://github.com/lifaon74/ctx-polyfill#readme)
[canvas-currentTransform](https://github.com/goessner/canvas-currentTransform/blob/master/currentTransform.js)

根据[HTML 规范 - 4.12.5.1.7 Transformations](https://html.spec.whatwg.org/multipage/canvas.html#current-transformation-matrix)的定义:

```js
matrix = context . getTransform()
Returns a copy of the current transformation matrix, as a newly created DOMMatrix object.


The getTransform() method, when invoked, must return a newly created DOMMatrix representing a copy of the current transformation matrix matrix of the context.
```

`getTransform`就是`contenxt.currentTransform`的深拷贝副本，然而问题是后者实现的更少更晚。

* setTransform 导致计算问题

`setTransform`API有两种参数形式。
`canvas-currentTransform`对`setTransform`替换有缺陷，只考虑 6 个参数的调用，没有考虑只给一个的。在标准里说，如果传的参数有NaN，会直接返回。当传入undefinded 时，就为NaN，所以会出现问题。不过这个库是唯一考虑了