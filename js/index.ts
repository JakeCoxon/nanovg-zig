import { createWasmEnv } from './wasm.js';
import { createWebGLContext } from './webgl.js';

export class NanoVgZig {
  instance: any;
  memory: any;
  exports: any;
  isInitialized: boolean;
  canvas: HTMLCanvasElement | null;
  env: any;

  constructor() {
    this.instance = null;
    this.memory = null;
    this.exports = null;
    this.isInitialized = false;
  }

  async init(canvas: HTMLCanvasElement, wasmPath = 'zig-out/bin/demo.wasm') {
    this.canvas = canvas;
    try {
      // Import the WASM and WebGL modules

      const opts = { memory: null, wasmEnv: null! as any }
      opts.wasmEnv = createWasmEnv(opts);
      const webgl = createWebGLContext(canvas, opts);
      const env = {
        ...opts.wasmEnv,
        ...webgl,
      };
      this.env = env;

      // Fetch and instantiate WASM
      const response = await fetch(wasmPath);
      const bytes = await response.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, { env });

      this.instance = instance;
      this.memory = instance.exports.memory;
      opts.memory = this.memory;
      this.exports = instance.exports;

      // Initialize the WASM module
      this.exports.onInit();
      this.isInitialized = true;

      return this;
    } catch (error) {
      console.error('Failed to initialize NanoVG Zig:', error);
      throw error;
    }
  }

  // Canvas setup and resize
  setupCanvas(width: number, height: number, devicePixelRatio = 1) {
    if (!this.isInitialized) {
      throw new Error('NanoVG Zig not initialized. Call init() first.');
    }

    if (!this.canvas) throw new Error('Canvas not initialized');

    this.canvas.width = devicePixelRatio * width;
    this.canvas.height = devicePixelRatio * height;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";

    this.exports.onResize(width, height, devicePixelRatio);
  }

  // Drawing methods
  beginFrame(width: number, height: number, devicePixelRatio = 1) {
    this.exports.beginFrame(width, height, devicePixelRatio);
  }

  endFrame() {
    this.exports.endFrame();
  }

  clear(r: number, g: number, b: number, a: number) {
    this.exports.clear(r, g, b, a);
  }

  // Path operations
  beginPath() {
    this.exports.beginPath();
  }

  moveTo(x: number, y: number) {
    this.exports.moveTo(x, y);
  }

  lineTo(x: number, y: number) {
    this.exports.lineTo(x, y);
  }

  bezierTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
    this.exports.bezierTo(c1x, c1y, c2x, c2y, x, y);
  }

  quadTo(cx: number, cy: number, x: number, y: number) {
    this.exports.quadTo(cx, cy, x, y);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.exports.arcTo(x1, y1, x2, y2, radius);
  }

  closePath() {
    this.exports.closePath();
  }

  // Shapes
  rect(x: number, y: number, width: number, height: number) {
    this.exports.rect(x, y, width, height);
  }

  roundedRect(x: number, y: number, width: number, height: number, radius: number) {
    this.exports.roundedRect(x, y, width, height, radius);
  }

  roundedRectVarying(x: number, y: number, width: number, height: number, radTopLeft: number, radTopRight: number, radBottomRight: number, radBottomLeft: number) {
    this.exports.roundedRectVarying(x, y, width, height, radTopLeft, radTopRight, radBottomRight, radBottomLeft);
  }

  circle(x: number, y: number, radius: number) {
    this.exports.circle(x, y, radius);
  }

  ellipse(x: number, y: number, rx: number, ry: number) {
    this.exports.ellipse(x, y, rx, ry);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, direction: number) {
    this.exports.arc(x, y, radius, startAngle, endAngle, direction);
  }

  // Styling
  fillColorRgbaf(r: number, g: number, b: number, a: number) {
    this.exports.fillColorRgbaf(r, g, b, a);
  }

  strokeColorRgbaf(r: number, g: number, b: number, a: number) {
    this.exports.strokeColorRgbaf(r, g, b, a);
  }

  fillColor(color: ColorRgba) {
    this.exports.fillColor(color.r, color.g, color.b, color.a);
  }

  strokeColor(color: ColorRgba) {
    this.exports.strokeColor(color.r, color.g, color.b, color.a);
  }

  strokeWidth(width: number) {
    this.exports.strokeWidth(width);
  }

  lineCap(cap: number) {
    this.exports.lineCap(cap);
  }

  lineJoin(join: number) {
    this.exports.lineJoin(join);
  }

  miterLimit(limit: number) {
    this.exports.miterLimit(limit);
  }

  globalAlpha(alpha: number) {
    this.exports.globalAlpha(alpha);
  }

  // Transforms
  save() {
    this.exports.save();
  }

  restore() {
    this.exports.restore();
  }

  resetTransform() {
    this.exports.resetTransform();
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.exports.transform(a, b, c, d, e, f);
  }

  translate(x: number, y: number) {
    this.exports.translate(x, y);
  }

  rotate(angle: number) {
    this.exports.rotate(angle);
  }

  scale(x: number, y: number) {
    this.exports.scale(x, y);
  }

  skewX(angle: number) {
    this.exports.skewX(angle);
  }

  skewY(angle: number) {
    this.exports.skewY(angle);
  }

  // Clipping
  clip() {
    this.exports.clip();
  }

  clearClip() {
    this.exports.clearClip();
  }

  // Path winding
  pathWinding(winding: number) {
    this.exports.pathWinding(winding);
  }

  // Drawing
  fill() {
    this.exports.fill();
  }

  stroke() {
    this.exports.stroke();
  }

  // Gradients and patterns

  linearGradient(x0: number, y0: number, x1: number, y1: number, outerColor: ColorRgba, innerColor: ColorRgba) {
    return new LinearGradient(x0, y0, x1, y1, outerColor, innerColor);
  }

  radialGradient(cx: number, cy: number, inr: number, outr: number, outerColor: ColorRgba, innerColor: ColorRgba) {
    return new RadialGradient(cx, cy, inr, outr, outerColor, innerColor);
  }

  boxGradient(x: number, y: number, w: number, h: number, r: number, f: number, outerColor: ColorRgba, innerColor: ColorRgba) {
    return new BoxGradient(x, y, w, h, r, f, outerColor, innerColor);
  }

  imagePattern(ox: number, oy: number, ex: number, ey: number, angle: number, imageHandle: ImageHandle, alpha: number) {
    return new ImagePattern(ox, oy, ex, ey, angle, imageHandle, alpha);
  }

  _setNextPaint(paint: Paint) {
    if (paint instanceof LinearGradient) {
      this.exports.setPaintLinearGradient(paint.x0, paint.y0, paint.x1, paint.y1, paint.outerColor.r, paint.outerColor.g, paint.outerColor.b, paint.outerColor.a, paint.innerColor.r, paint.innerColor.g, paint.innerColor.b, paint.innerColor.a);
    } else if (paint instanceof RadialGradient) {
      this.exports.setPaintRadialGradient(paint.cx, paint.cy, paint.inr, paint.outr, paint.outerColor.r, paint.outerColor.g, paint.outerColor.b, paint.outerColor.a, paint.innerColor.r, paint.innerColor.g, paint.innerColor.b, paint.innerColor.a);
    } else if (paint instanceof BoxGradient) {
      this.exports.setPaintBoxGradient(paint.x, paint.y, paint.w, paint.h, paint.r, paint.f, paint.outerColor.r, paint.outerColor.g, paint.outerColor.b, paint.outerColor.a, paint.innerColor.r, paint.innerColor.g, paint.innerColor.b, paint.innerColor.a);
    } else if (paint instanceof ImagePattern) {
      this.exports.setPaintImagePattern(paint.ox, paint.oy, paint.ex, paint.ey, paint.angle, paint.imageHandle.handle, paint.alpha);
    }
  }

  setFillPaint(paint: Paint) {
    this._setNextPaint(paint);
    this.exports.setFillPaint();
  }

  setStrokePaint(paint: Paint) {
    this._setNextPaint(paint);
    this.exports.setStrokePaint();
  }

  // Images
  createImageRGBA(width: number, height: number, generateMipmaps: boolean, repeatX: boolean, repeatY: boolean, flipY: boolean, premultiplied: boolean, nearest: boolean, data: number[]) {
    return this.exports.createImageRGBA(width, height, generateMipmaps, repeatX, repeatY, flipY, premultiplied, nearest, data);
  }

  createImageFromData(opts: CreateImageRGBAOptions) {
    const width = opts.width ?? (opts.data instanceof HTMLImageElement ? opts.data.width : undefined);
    const height = opts.height ?? (opts.data instanceof HTMLImageElement ? opts.data.height : undefined);
    if (!width || !height) throw new Error('Width and height are required');

    const handle = this.exports.createImageRGBA(width, height, opts.generateMipmaps, opts.repeatX, opts.repeatY, opts.flipY, opts.premultiplied, opts.nearest, null);
    if (opts.data instanceof HTMLImageElement) {
      const img = opts.data;
      const tex = this.findTexture(handle);
      this.env.jsLoadTextureIMG2(tex, img);
    } else if (opts.data instanceof Uint8Array) {
      const tex = this.findTexture(handle);
      this.exports.loadImageTexture(tex, opts.data);
    }
    return new ImageHandle(handle);
  }

  findTexture(handle: number) {
    return this.exports.findTexture(handle);
  }

  // Utility methods
  rgba(r: number, g: number, b: number, a: number) {
    return new ColorRgba(r, g, b, a);
  }

  rgbf(r: number, g: number, b: number) {
    return new ColorRgba(r, g, b, 1);
  }
}

export class ColorRgba {
  constructor(public r: number, public g: number, public b: number, public a: number) {}
}

export class LinearGradient {
  constructor(public x0: number, public y0: number, public x1: number, public y1: number, public outerColor: ColorRgba, public innerColor: ColorRgba) {}
}

export class RadialGradient {
  constructor(public cx: number, public cy: number, public inr: number, public outr: number, public outerColor: ColorRgba, public innerColor: ColorRgba) {}
}

export class BoxGradient {
  constructor(public x: number, public y: number, public w: number, public h: number, public r: number, public f: number, public outerColor: ColorRgba, public innerColor: ColorRgba) {}
}

export class ImagePattern {
  constructor(public ox: number, public oy: number, public ex: number, public ey: number, public angle: number, public imageHandle: ImageHandle, public alpha: number) {}
}

export type Paint = LinearGradient | RadialGradient | BoxGradient | ImagePattern;

export class ImageHandle {
  constructor(public handle: number) {}
}

export type CreateImageRGBAOptions = {
  width?: number;
  height?: number;
  generateMipmaps?: boolean;
  repeatX?: boolean;
  repeatY?: boolean;
  flipY?: boolean;
  premultiplied?: boolean;
  nearest?: boolean;
  data: HTMLImageElement | Uint8Array;
}

// Export the class as default
export default NanoVgZig;

// Also export a convenience function for quick setup
export function createNanoVg() {
  const nvg = new NanoVgZig();
  return nvg;
} 