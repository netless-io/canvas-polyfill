# 0.0.1

- 添加以下 `getTransform`,`resetTransform`,`ellipse` polyfill

# 0.0.2

- 修复旧`setTransform`只支持`setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;`，不支持`setTransform(transform?: DOMMatrix2DInit): void;`的问题