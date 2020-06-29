# @netless/canvas-polyfill

`@netless/canvas-polyfill` is a polyfill for `resetTransform`,`ellipse`,`getTransform`. It is inspired by [canvas-5-polyfill](https://github.com/google/canvas-5-polyfill), [canvas-currentTransform](https://github.com/goessner/canvas-currentTransform/blob/master/currentTransform.js).

This polyfill can work in Android 19 WebView and iOS 10 WKWebView.

## different from these

[canvas-5-polyfill](https://github.com/google/canvas-5-polyfill) implement polyfill for `Path2D` objects and `ellipse()` on `CanvasRenderingContext2D` which doesn't implement `getTransform`. `@netless/canvas-polyfill` doesn't implement `Path2D`, but implement `getTransform`.

[canvas-currentTransform](https://github.com/goessner/canvas-currentTransform/blob/master/currentTransform.js) 's `setTransform` has some problem. `@netless/canvas-polyfill` just fix it and `canvas-currentTransform` not implement `getTransform`. But the `currentTransform` 's `getter` is same as `getTransform`.

## Installation

```shell
yarn install @netless/canvas-polyfill
# or
npm install @netless/canvas-polyfill
```

Use:

```javascript
import "@netless/canvas-polyfill";
```

## Publish

```shell
npm publish --access public
```

## the implement for getTransform

The matrix calculation is just copy from [canvas-currentTransform](https://github.com/goessner/canvas-currentTransform/blob/master/currentTransform.js) for `currentTransform`.  I just fix `setTransform` method which has two forms of parameters:

```ts
interface CanvasTransform {
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
}
```