const std = @import("std");
const builtin = @import("builtin");

const nvg = @import("nanovg");

const wasm = @import("web/wasm.zig");
pub const std_options = std.Options{
    .log_level = .info,
    .logFn = wasm.log,
};
const gl = @import("web/webgl.zig");
const keys = @import("web/keys.zig");

const Demo = @import("demo.zig");
const PerfGraph = @import("perf.zig");

var video_width: f32 = 1280;
var video_height: f32 = 720;
var video_scale: f32 = 1;

var global_arena: std.heap.ArenaAllocator = undefined;
var gpa: std.heap.GeneralPurposeAllocator(.{
    .safety = false,
}) = undefined;
var allocator: std.mem.Allocator = undefined;

var vg: nvg = undefined;
var demo: Demo = undefined;
var fps: PerfGraph = undefined;

var prevt: f32 = 0;
var mx: f32 = 0;
var my: f32 = 0;
var blowup: bool = false;
var screenshot: bool = false;
var premult: bool = false;

const logger = std.log.scoped(.example_wasm);

export fn onInit() void {
    global_arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    gpa = .{
        .backing_allocator = global_arena.allocator(),
    };
    allocator = gpa.allocator();

    wasm.global_allocator = allocator;

    vg = nvg.gl.init(allocator, .{ .stencil_strokes = true }) catch {
        logger.err("Failed to create NanoVG", .{});
        return;
    };

    demo.load(vg);
    fps = PerfGraph.init(.fps, "Frame Time");

    prevt = wasm.performanceNow() / 1000.0;
}

export fn onResize(w: c_uint, h: c_uint, s: f32) void {
    video_width = @floatFromInt(w);
    video_height = @floatFromInt(h);
    video_scale = s;
    gl.glViewport(0, 0, @intFromFloat(s * video_width), @intFromFloat(s * video_height));
}

export fn onKeyDown(key: c_uint) void {
    if (key == keys.KEY_SPACE) blowup = !blowup;
    if (key == keys.KEY_S) screenshot = true;
    if (key == keys.KEY_P) premult = !premult;
}

export fn onMouseMove(x: i32, y: i32) void {
    mx = @floatFromInt(x);
    my = @floatFromInt(y);
}

export fn beginFrame(w: f32, h: f32, s: f32) void {
    vg.beginFrame(w, h, s);
}

export fn clear(r: f32, g: f32, b: f32, a: f32) void {
    gl.glClearColor(r, g, b, a);
    gl.glClear(gl.GL_COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);
}

export fn roundedRect(x: f32, y: f32, w: f32, h: f32, r: f32) void {
    vg.roundedRect(x, y, w, h, r);
}

export fn rect(x: f32, y: f32, w: f32, h: f32) void {
    vg.rect(x, y, w, h);
}

export fn circle(x: f32, y: f32, r: f32) void {
    vg.circle(x, y, r);
}

export fn arc(x: f32, y: f32, r: f32, a0: f32, a1: f32, dir: i32) void {
    vg.arc(x, y, r, a0, a1, if (dir == 0) nvg.Winding.cw else nvg.Winding.ccw);
}

export fn roundedRectVarying(x: f32, y: f32, w: f32, h: f32, radTopLeft: f32, radTopRight: f32, radBottomRight: f32, radBottomLeft: f32) void {
    vg.roundedRectVarying(x, y, w, h, radTopLeft, radTopRight, radBottomRight, radBottomLeft);
}

export fn ellipse(x: f32, y: f32, rx: f32, ry: f32) void {
    vg.ellipse(x, y, rx, ry);
}

export fn clip() void {
    vg.clip();
}

export fn clearClip() void {
    vg.clearClip();
}

export fn pathWinding(winding: i32) void {
    vg.pathWinding(if (winding == 0) nvg.Winding.cw else nvg.Winding.ccw);
}

export fn save() void {
    vg.save();
}

export fn restore() void {
    vg.restore();
}

export fn moveTo(x: f32, y: f32) void {
    vg.moveTo(x, y);
}

export fn lineTo(x: f32, y: f32) void {
    vg.lineTo(x, y);
}

export fn bezierTo(c1x: f32, c1y: f32, c2x: f32, c2y: f32, x: f32, y: f32) void {
    vg.bezierTo(c1x, c1y, c2x, c2y, x, y);
}

export fn quadTo(cx: f32, cy: f32, x: f32, y: f32) void {
    vg.quadTo(cx, cy, x, y);
}

export fn arcTo(x1: f32, y1: f32, x2: f32, y2: f32, r: f32) void {
    vg.arcTo(x1, y1, x2, y2, r);
}

export fn closePath() void {
    vg.closePath();
}

pub const Color = extern struct {
    r: f32,
    g: f32,
    b: f32,
    a: f32,
};

export fn strokeColorRgbaf(r: f32, g: f32, b: f32, a: f32) void {
    vg.strokeColor(nvg.rgbaf(r, g, b, a));
}

export fn strokeWidth(w: f32) void {
    vg.strokeWidth(w);
}

export fn miterLimit(limit: f32) void {
    vg.miterLimit(limit);
}

export fn lineCap(cap: i32) void {
    vg.lineCap(if (cap == 0) nvg.LineCap.butt else if (cap == 1) nvg.LineCap.round else nvg.LineCap.square);
}

export fn lineJoin(join: i32) void {
    vg.lineJoin(if (join == 0) nvg.LineJoin.miter else if (join == 1) nvg.LineJoin.round else nvg.LineJoin.bevel);
}

export fn globalAlpha(alpha: f32) void {
    vg.globalAlpha(alpha);
}

export fn resetTransform() void {
    vg.resetTransform();
}

export fn transform(a: f32, b: f32, c: f32, d: f32, e: f32, f: f32) void {
    vg.transform(a, b, c, d, e, f);
}

export fn translate(x: f32, y: f32) void {
    vg.translate(x, y);
}

export fn rotate(angle: f32) void {
    vg.rotate(angle);
}

export fn skewX(angle: f32) void {
    vg.skewX(angle);
}

export fn skewY(angle: f32) void {
    vg.skewY(angle);
}

export fn scale(x: f32, y: f32) void {
    vg.scale(x, y);
}

//

export fn createImageRGBA(
    w: u32,
    h: u32,
    generate_mipmaps: bool,
    repeat_x: bool,
    repeat_y: bool,
    flip_y: bool,
    premultiplied: bool,
    nearest: bool,
    data_ptr: [*]const u8,
) i32 {
    const flags = nvg.ImageFlags{
        .generate_mipmaps = generate_mipmaps,
        .repeat_x = repeat_x,
        .repeat_y = repeat_y,
        .flip_y = flip_y,
        .premultiplied = premultiplied,
        .nearest = nearest,
    };
    // Compute byte length safely (avoid overflow in case caller passes huge dims).
    const w_usize = @as(usize, w);
    const h_usize = @as(usize, h);
    const pixel_count = w_usize * h_usize; // you can wrap in checked mul if desired
    const byte_len = pixel_count * 4; // RGBA8 = 4 bytes

    const data_slice: []const u8 = data_ptr[0..byte_len];

    return vg.createImageRGBA(w, h, flags, data_slice).handle;
}

//

export fn stroke() void {
    vg.stroke();
}

export fn fillColorRgbaf(r: f32, g: f32, b: f32, a: f32) void {
    vg.fillColor(nvg.rgbaf(r, g, b, a));
}

export fn fill() void {
    vg.fill();
}

export fn beginPath() void {
    vg.beginPath();
}

export fn rgba(r: u8, g: u8, b: u8, a: u8) Color {
    const c = nvg.rgba(r, g, b, a);
    return .{ .r = c.r, .g = c.g, .b = c.b, .a = c.a };
}

export fn rgbf(r: f32, g: f32, b: f32) Color {
    const c = nvg.rgbf(r, g, b);
    return .{ .r = c.r, .g = c.g, .b = c.b, .a = c.a };
}

var nextPaint: nvg.Paint = undefined;

export fn setPaintLinearGradient(x0: f32, y0: f32, x1: f32, y1: f32, outer_r: f32, outer_g: f32, outer_b: f32, outer_a: f32, inner_r: f32, inner_g: f32, inner_b: f32, inner_a: f32) void {
    nextPaint = vg.linearGradient(x0, y0, x1, y1, nvg.rgbaf(outer_r, outer_g, outer_b, outer_a), nvg.rgbaf(inner_r, inner_g, inner_b, inner_a));
}

export fn setPaintBoxGradient(x: f32, y: f32, w: f32, h: f32, r: f32, f: f32, outer_r: f32, outer_g: f32, outer_b: f32, outer_a: f32, inner_r: f32, inner_g: f32, inner_b: f32, inner_a: f32) void {
    nextPaint = vg.boxGradient(x, y, w, h, r, f, nvg.rgbaf(outer_r, outer_g, outer_b, outer_a), nvg.rgbaf(inner_r, inner_g, inner_b, inner_a));
}

export fn setPaintRadialGradient(cx: f32, cy: f32, inr: f32, outr: f32, outer_r: f32, outer_g: f32, outer_b: f32, outer_a: f32, inner_r: f32, inner_g: f32, inner_b: f32, inner_a: f32) void {
    nextPaint = vg.radialGradient(cx, cy, inr, outr, nvg.rgbaf(outer_r, outer_g, outer_b, outer_a), nvg.rgbaf(inner_r, inner_g, inner_b, inner_a));
}

export fn setPaintImagePattern(ox: f32, oy: f32, ex: f32, ey: f32, angle: f32, image_handle: i32, alpha: f32) void {
    const image = nvg.Image{ .handle = image_handle };
    nextPaint = vg.imagePattern(ox, oy, ex, ey, angle, image, alpha);
}

export fn setFillPaint() void {
    vg.fillPaint(nextPaint);
}

export fn setStrokePaint() void {
    vg.strokePaint(nextPaint);
}

export fn endFrame() void {
    vg.endFrame();
}

export fn drawDemo() void {
    const t = wasm.performanceNow() / 1000.0;
    demo.draw(vg, mx, my, video_width, video_height, t, blowup);
}

export fn findTexture(handle: i32) u32 {
    const gl_ctx: *nvg.gl.GLContext = nvg.gl.GLContext.castPtr(vg.ctx.params.user_ptr);
    return gl_ctx.findTexture(handle).?.tex;
}

export fn onAnimationFrame() void {
    //    const t = wasm.performanceNow() / 1000.0;
    //    const dt = t - prevt;
    //    prevt = t;
    //    fps.update(dt);
    //
    //    if (premult) {
    //        gl.glClearColor(0, 0, 0, 0);
    //    } else {
    //        gl.glClearColor(0.3, 0.3, 0.32, 1.0);
    //    }
    //    gl.glClear(gl.GL_COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);
    //
    //    vg.beginFrame(video_width, video_height, video_scale);
    //
    //    demo.draw(vg, mx, my, video_width, video_height, t, blowup);
    //    fps.draw(vg, 5, 5);
    //
    //    vg.endFrame();
    //
    //    if (screenshot) {
    //        screenshot = false;
    //        const w: i32 = @intFromFloat(video_width * video_scale);
    //        const h: i32 = @intFromFloat(video_height * video_scale);
    //        const data = Demo.saveScreenshot(allocator, w, h, premult) catch return;
    //        defer allocator.free(data);
    //        const filename = "dump.png";
    //        const mimetype = "image/png";
    //        wasm.download(filename, filename.len, mimetype, mimetype.len, data.ptr, data.len);
    //    }
}
