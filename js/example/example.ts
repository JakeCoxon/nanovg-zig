import { createNanoVg } from '../index.ts';

const canvas = document.createElement("canvas") as HTMLCanvasElement;
document.body.appendChild(canvas);

const vg = createNanoVg()
await vg.init(canvas)

vg.setupCanvas(window.innerWidth, window.innerHeight, window.devicePixelRatio);


const image = new Image()
image.src = `./examples/images/baboon.jpg`
const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
  image.onload = () => {
    resolve(image)
  }
})

Promise.all([
  imagePromise,
]).then(([image]) => {

  

  let mx = 0, my = 0;

  const baboon = vg.createImageFromData({ data: image });

  // Function to draw a glossy button
  function drawGlossyButton(x: number, y: number, width: number, height: number, isHovered = false, time = 0) {
    const radius = Math.min(width, height) * 0.2; // 20% of smaller dimension
    const hoverOffset = isHovered ? -2 : 0;
    
    // Button shadow
    vg.save();
    vg.translate(x + 3, y + 3);
    vg.beginPath();
    vg.roundedRect(0, 0, width, height, radius);
    vg.setFillPaint(vg.boxGradient(0, 0, width, height, radius, 0.8, vg.rgba(0, 0, 0, 0.3), vg.rgba(0, 0, 0, 0.1)));
    vg.fill();
    vg.restore();
    
    // Button background with gradient
    vg.beginPath();
    vg.roundedRect(x + hoverOffset, y + hoverOffset, width, height, radius);
    const bgGradientTop = isHovered ? 0.98 : 0.95;
    const bgGradientBottom = isHovered ? 0.88 : 0.85;
    const bg = vg.linearGradient(x + hoverOffset, y + hoverOffset, 
                              x + hoverOffset, y + hoverOffset + height, 
                              vg.rgba(bgGradientTop, bgGradientTop, bgGradientTop, 1), 
                              vg.rgba(bgGradientBottom, bgGradientBottom, bgGradientBottom, 1));
    vg.setFillPaint(bg);
    vg.fill();
    
    // Button highlight (top edge)
    vg.beginPath();
    vg.roundedRect(x + 2 + hoverOffset, y + 2 + hoverOffset, width - 4, height / 2 - 2, radius - 2);
    const highlightAlpha = isHovered ? 0.5 : 0.4;
    const highlight = vg.linearGradient(x + 2 + hoverOffset, y + 2 + hoverOffset, 
                              x + 2 + hoverOffset, y + hoverOffset + height / 2, 
                              vg.rgba(1, 1, 1, highlightAlpha), 
                              vg.rgba(1, 1, 1, 0.1));
    vg.setFillPaint(highlight);
    vg.fill();
    
    // Button border
    vg.beginPath();
    vg.roundedRect(x + hoverOffset, y + hoverOffset, width, height, radius);
    const borderTop = isHovered ? 0.7 : 0.6;
    const borderBottom = isHovered ? 0.5 : 0.4;
    const border = vg.linearGradient(x + hoverOffset, y + hoverOffset, 
                              x + hoverOffset, y + hoverOffset + height, 
                              vg.rgba(borderTop, borderTop, borderTop, 1), 
                              vg.rgba(borderBottom, borderBottom, borderBottom, 1));
    vg.setStrokePaint(border);
    vg.strokeWidth(1.5);
    vg.stroke();
    
    // Glossy overlay - main reflection
    vg.beginPath();
    vg.roundedRect(x + 2 + hoverOffset, y + 2 + hoverOffset, width - 4, height * 0.6, radius - 2);
    const overlay = vg.linearGradient(x + 2 + hoverOffset, y + 2 + hoverOffset, 
                              x + 2 + hoverOffset, y + hoverOffset + height * 0.6, 
                              vg.rgba(1, 1, 1, 0.3), 
                              vg.rgba(1, 1, 1, 0.05));
    vg.setFillPaint(overlay);
    vg.fill();
    
    // Glossy overlay - secondary reflection (smaller, more intense)
    vg.beginPath();
    vg.roundedRect(x + 4 + hoverOffset, y + 4 + hoverOffset, width - 8, height * 0.4, radius - 4);
    const overlay2 = vg.linearGradient(x + 4 + hoverOffset, y + 4 + hoverOffset, 
                              x + 4 + hoverOffset, y + hoverOffset + height * 0.4, 
                              vg.rgba(1, 1, 1, 0.5), 
                              vg.rgba(1, 1, 1, 0.1));
    vg.setFillPaint(overlay2);
    vg.fill();
    
    // Button text shadow
    vg.save();
    vg.translate(x + width/2 + 1 + hoverOffset, y + height/2 + 1 + hoverOffset);
    vg.fillColorRgbaf(0, 0, 0, 0.3);
    vg.beginPath();
    vg.rect(-30, -8, 60, 16);
    vg.fill();
    vg.restore();
    
    // Button text
    vg.save();
    vg.translate(x + width/2 + hoverOffset, y + height/2 + hoverOffset);
    vg.fillColorRgbaf(0.2, 0.2, 0.2, 1);
    vg.beginPath();
    vg.rect(-30, -8, 60, 16);
    vg.fill();
    vg.restore();
  }

  // Function to draw animated rotating triangle
  function drawRotatingTriangle(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);
    vg.rotate(time);
    
    vg.beginPath();
    vg.moveTo(0, -30);
    vg.lineTo(25, 15);
    vg.lineTo(-25, 15);
    vg.closePath();
    vg.fillColorRgbaf(0.2, 0.6, 1.0, 0.8);
    vg.fill();
    vg.strokeColorRgbaf(0.1, 0.3, 0.8, 1);
    vg.strokeWidth(2);
    vg.stroke();
    vg.restore();
  }

  // Function to draw radial gradient circle
  function drawRadialGradientCircle(x: number, y: number, radius: number) {
    vg.save();
    vg.translate(x, y);
    
    vg.beginPath();
    vg.circle(0, 0, radius);
    const radialGradient = vg.radialGradient(0, 0, 0, radius, 
                              vg.rgba(1, 0.5, 0, 1), 
                              vg.rgba(0.8, 0.2, 0.8, 0.3));
    vg.setFillPaint(radialGradient);
    vg.fill();
    vg.restore();
  }

  // Function to draw animated rounded rectangle
  function drawAnimatedRoundedRect(x: number, y: number, width: number, height: number, time: number) {
    const pulse = Math.sin(time * 3) * 0.1 + 0.9;
    
    vg.beginPath();
    vg.roundedRect(x, y, width * pulse, height * pulse, 8);
    const linearGradient = vg.linearGradient(x, y, x + width, y + height, 
                              vg.rgba(0.9, 0.3, 0.1, 1), 
                              vg.rgba(0.1, 0.8, 0.9, 1));
    vg.setFillPaint(linearGradient);
    vg.fill();
    vg.strokeColorRgbaf(0.2, 0.2, 0.2, 1);
    vg.strokeWidth(2);
    vg.stroke();
  }

  // Function to draw complex bezier curve shape
  function drawBezierCurveShape(x: number, y: number, scale = 1.0) {
    vg.save();
    vg.translate(x, y);
    vg.scale(scale, scale);
    
    vg.beginPath();
    vg.moveTo(-50, 0);
    vg.bezierTo(-30, -30, 30, -30, 50, 0);
    vg.bezierTo(30, 30, -30, 30, -50, 0);
    vg.closePath();
    const boxGradient = vg.boxGradient(-50, -50, 100, 100, 10, 0.8, 
                              vg.rgba(0.8, 0.2, 0.8, 1), 
                              vg.rgba(0.2, 0.8, 0.2, 0.3));
    vg.setFillPaint(boxGradient);
    vg.fill();
    vg.restore();
  }

  // Function to draw animated ellipses
  function drawAnimatedEllipses(x: number, y: number, count: number, time: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time;
      const ellipseX = x + Math.cos(angle) * 100;
      const ellipseY = y + Math.sin(angle) * 30;
      const scale = Math.sin(time * 2 + i) * 0.3 + 0.7;
      
      vg.save();
      vg.translate(ellipseX, ellipseY);
      vg.scale(scale, scale);
      
      vg.beginPath();
      vg.ellipse(0, 0, 20, 15);
      vg.fillColorRgbaf(0.8, 0.4, 0.1, 0.7);
      vg.fill();
      vg.strokeColorRgbaf(0.6, 0.2, 0, 1);
      vg.strokeWidth(1.5);
      vg.stroke();
      vg.restore();
    }
  }

  // Function to draw star-shaped clipping example
  function drawStarClippingExample(x: number, y: number) {
    vg.save();
    vg.translate(x, y);
    
    // Create a star-shaped clip
    vg.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = i % 2 === 0 ? 30 : 15;
      const clipX = Math.cos(angle) * radius;
      const clipY = Math.sin(angle) * radius;
      if (i === 0) vg.moveTo(clipX, clipY);
      else vg.lineTo(clipX, clipY);
    }
    vg.closePath();
    vg.clip();
    
    // Draw pattern inside clip
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        vg.beginPath();
        vg.circle(i * 15 - 30, j * 15 - 30, 5);
        vg.fillColorRgbaf(0.1 + i * 0.1, 0.5 + j * 0.1, 0.8, 0.8);
        vg.fill();
      }
    }
    vg.restore();
    vg.clearClip();
  }

  // Function to draw animated arcs
  function drawAnimatedArcs(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);
    vg.rotate(time);
    
    vg.beginPath();
    vg.arc(0, 0, 25, 0, Math.PI * 1.5, 0); // 0 = clockwise
    vg.strokeColorRgbaf(0.9, 0.1, 0.5, 1);
    vg.strokeWidth(4);
    vg.lineCap(1); // round cap
    vg.stroke();
    
    vg.beginPath();
    vg.arc(0, 0, 35, Math.PI * 1.5, Math.PI * 2, 1); // 1 = counter-clockwise
    vg.strokeColorRgbaf(0.1, 0.9, 0.5, 1);
    vg.strokeWidth(4);
    vg.stroke();
    vg.restore();
  }

  // Function to draw rounded rectangle with varying corner radii
  function drawRoundedRectVarying(x: number, y: number, width: number, height: number, topLeft: number, topRight: number, bottomRight: number, bottomLeft: number) {
    vg.beginPath();
    vg.roundedRectVarying(x, y, width, height, topLeft, topRight, bottomRight, bottomLeft);
    const linearGradient = vg.linearGradient(x, y, x + width, y + height, 
                              vg.rgba(0.2, 0.8, 0.2, 1), 
                              vg.rgba(0.8, 0.2, 0.8, 1));
    vg.setFillPaint(linearGradient);
    vg.fill();
    vg.strokeColorRgbaf(0.3, 0.3, 0.3, 1);
    vg.strokeWidth(3);
    vg.stroke();
  }

  // Function to draw mouse-following shape
  // Mouse trail storage
  const mouseTrail: { x: number, y: number, time: number }[] = [];
  const maxTrailLength = 20;
  
  function drawMouseFollowingShape(mouseX: number, mouseY: number, time: number) {
    // Add current position to trail
    mouseTrail.push({ x: mouseX, y: mouseY, time: time });
    
    // Keep only the last maxTrailLength positions
    if (mouseTrail.length > maxTrailLength) {
      mouseTrail.shift();
    }
    
    // Draw trail shapes
    for (let i = 0; i < mouseTrail.length; i++) {
      const pos = mouseTrail[i];
      const age = (time - pos.time) * 2; // How old this position is
      const alpha = Math.max(0, 1 - age); // Fade out over time
      const scale = Math.max(0.1, 1 - age * 0.5); // Shrink over time
      
      if (alpha <= 0) continue;
      
      vg.save();
      vg.translate(pos.x, pos.y);
      vg.rotate(time * 2 + i * 0.5); // Different rotation for each trail piece
      vg.scale(scale, scale);
      
      // Draw different shapes based on position in trail
      if (i === mouseTrail.length - 1) {
        // Current position - draw triangle
        vg.beginPath();
        vg.moveTo(0, -20);
        vg.lineTo(15, 10);
        vg.lineTo(-15, 10);
        vg.closePath();
        vg.fillColorRgbaf(1, 0.5, 0, alpha * 0.9);
        vg.fill();
        vg.strokeColorRgbaf(0.8, 0.3, 0, alpha);
        vg.strokeWidth(2);
        vg.stroke();
      } else if (i % 3 === 0) {
        // Every 3rd position - draw circle
        vg.beginPath();
        vg.circle(0, 0, 12);
        vg.fillColorRgbaf(0.2, 0.8, 1, alpha * 0.7);
        vg.fill();
        vg.strokeColorRgbaf(0.1, 0.6, 0.9, alpha);
        vg.strokeWidth(1.5);
        vg.stroke();
      } else if (i % 3 === 1) {
        // Every other position - draw square
        vg.beginPath();
        vg.rect(-10, -10, 20, 20);
        vg.fillColorRgbaf(1, 0.8, 0.2, alpha * 0.6);
        vg.fill();
        vg.strokeColorRgbaf(0.9, 0.6, 0.1, alpha);
        vg.strokeWidth(1);
        vg.stroke();
      } else {
        // Remaining positions - draw diamond
        vg.beginPath();
        vg.moveTo(0, -12);
        vg.lineTo(12, 0);
        vg.lineTo(0, 12);
        vg.lineTo(-12, 0);
        vg.closePath();
        vg.fillColorRgbaf(0.8, 0.2, 0.8, alpha * 0.5);
        vg.fill();
        vg.strokeColorRgbaf(0.6, 0.1, 0.6, alpha);
        vg.strokeWidth(1);
        vg.stroke();
      }
      
      vg.restore();
    }
  }

  // Function to draw text-like pattern
  function drawTextLikePattern(x: number, y: number, scale = 1.0) {
    vg.save();
    vg.translate(x, y);
    vg.scale(scale, scale);
    
    // Draw a simple "N" shape
    vg.beginPath();
    vg.moveTo(-30, -20);
    vg.lineTo(-30, 20);
    vg.lineTo(-10, -10);
    vg.lineTo(10, 20);
    vg.lineTo(10, -20);
    vg.strokeColorRgbaf(0.1, 0.1, 0.1, 1);
    vg.strokeWidth(8);
    vg.lineCap(1); // round caps
    vg.lineJoin(1); // round joins
    vg.stroke();
    vg.restore();
  }

  // Function to draw quadratic curves with path winding
  function drawQuadraticCurvesWithWinding(x: number, y: number) {
    vg.save();
    vg.translate(x, y);
    
    // Outer shape (clockwise)
    vg.beginPath();
    vg.moveTo(-20, -20);
    vg.quadTo(0, -40, 20, -20);
    vg.quadTo(40, 0, 20, 20);
    vg.quadTo(0, 40, -20, 20);
    vg.quadTo(-40, 0, -20, -20);
    vg.pathWinding(0); // clockwise
    
    // Inner shape (counter-clockwise) - creates a hole
    vg.moveTo(0, -10);
    vg.quadTo(10, 0, 0, 10);
    vg.quadTo(-10, 0, 0, -10);
    vg.pathWinding(1); // counter-clockwise
    
    vg.fillColorRgbaf(0.7, 0.2, 0.9, 0.8);
    vg.fill();
    vg.strokeColorRgbaf(0.5, 0.1, 0.7, 1);
    vg.strokeWidth(2);
    vg.stroke();
    vg.restore();
  }

  // Function to draw skewed rectangle with global alpha
  function drawSkewedRectangle(x: number, y: number, width: number, height: number, time: number) {
    vg.save();
    vg.translate(x, y);
    vg.globalAlpha(0.6);
    vg.skewX(Math.sin(time) * 0.3);
    vg.skewY(Math.cos(time) * 0.2);
    
    vg.beginPath();
    vg.rect(-width/2, -height/2, width, height);
    vg.fillColorRgbaf(0.1, 0.8, 0.4, 1);
    vg.fill();
    vg.restore();
  }

  // Function to draw advanced transition effect with morphing clip path
  function drawAdvancedTransitionEffect(x: number, y: number, time: number) {
    const size = 120;
    const centerX = x;
    const centerY = y;
    
    // Create a complex morphing clip path
    vg.save();
    vg.translate(centerX, centerY);
    
    // Phase 1: Circle to star transition (0-2 seconds)
    const phase1 = Math.max(0, Math.min(1, time / 2));
    const phase2 = Math.max(0, Math.min(1, (time - 2) / 2)); // 2-4 seconds
    const phase3 = Math.max(0, Math.min(1, (time - 4) / 2)); // 4-6 seconds
    
    vg.beginPath();
    
    if (phase1 < 1) {
      // Morph from circle to star
      const points = 5;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = size * (0.3 + 0.7 * phase1);
        const morphFactor = Math.sin(angle * 2.5) * phase1 * 0.5;
        const finalRadius = radius * (1 + morphFactor);
        
        const px = Math.cos(angle) * finalRadius;
        const py = Math.sin(angle) * finalRadius;
        
        if (i === 0) vg.moveTo(px, py);
        else vg.lineTo(px, py);
      }
    } else if (phase2 < 1) {
      // Morph from star to wave
      const points = 20;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const baseRadius = size * 0.6;
        const waveAmplitude = size * 0.3 * phase2;
        const waveFrequency = 3;
        const wave = Math.sin(angle * waveFrequency) * waveAmplitude;
        const finalRadius = baseRadius + wave;
        
        const px = Math.cos(angle) * finalRadius;
        const py = Math.sin(angle) * finalRadius;
        
        if (i === 0) vg.moveTo(px, py);
        else vg.lineTo(px, py);
      }
    } else if (phase3 < 1) {
      // Morph from wave to spiral
      const points = 50;
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = t * Math.PI * 4 + phase3 * Math.PI * 2;
        const spiralRadius = size * 0.8 * t * (1 - phase3 * 0.5);
        const waveRadius = size * 0.3 * Math.sin(t * 8) * phase3;
        const finalRadius = spiralRadius + waveRadius;
        
        const px = Math.cos(angle) * finalRadius;
        const py = Math.sin(angle) * finalRadius;
        
        if (i === 0) vg.moveTo(px, py);
        else vg.lineTo(px, py);
      }
    } else {
      // Final state: rotating diamond
      const rotation = (time - 6) * 0.5;
      const points = 4;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2 + rotation;
        const radius = size * 0.7;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) vg.moveTo(px, py);
        else vg.lineTo(px, py);
      }
    }
    
    vg.closePath();
    vg.clip();

    // vg.beginPath();
    vg.rect(-size, -size, size * 2, size * 2);
    vg.fillColorRgbaf(0, 0, 0, 0.5);
    vg.fill();
    
    // Draw the content that will be revealed by the clip
    // Background gradient
    const radialGradient = vg.radialGradient(0, 0, 0, size, 
                              vg.rgba(0.8, 0.2, 0.9, 1), 
                              vg.rgba(0.2, 0.8, 0.3, 1));
    vg.setFillPaint(radialGradient);
    // vg.beginPath();
    vg.rect(-size, -size, size * 2, size * 2);
    vg.fill();
    
    // // Animated pattern overlay
    const patternCount = 8;
    for (let i = 0; i < patternCount; i++) {
      const angle = (i / patternCount) * Math.PI * 2 + time;
      const radius = size * 0.6;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      
      vg.beginPath();
      vg.circle(px, py, 8);
      vg.fillColorRgbaf(1, 1, 1, 0.6);
      vg.fill();
      
      // Inner highlight
      vg.beginPath();
      vg.circle(px - 2, py - 2, 3);
      vg.fillColorRgbaf(1, 1, 1, 0.8);
      vg.fill();
    }
    
    // Central element
    vg.beginPath();
    vg.circle(0, 0, size * 0.2);
    const linearGradient = vg.linearGradient(-size * 0.2, -size * 0.2, size * 0.2, size * 0.2,
                              vg.rgba(1, 1, 1, 1), 
                              vg.rgba(0.9, 0.9, 0.9, 0.5));
    vg.setFillPaint(linearGradient);
    vg.fill();
    
    // Pulsing ring
    const pulseScale = Math.sin(time * 3) * 0.1 + 0.9;
    vg.beginPath();
    vg.circle(0, 0, size * 0.3 * pulseScale);
    vg.strokeColorRgbaf(1, 1, 1, 0.8);
    vg.strokeWidth(3);
    vg.stroke();
    
    vg.restore();
    
    // Draw the clip path outline for debugging (optional)
    vg.save();
    vg.translate(centerX, centerY);
    vg.globalAlpha(0.3);
    vg.strokeColorRgbaf(1, 1, 1, 1);
    vg.strokeWidth(2);
    vg.stroke();
    vg.restore();
    vg.clearClip();
  }

  function drawImagePattern(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);
    vg.beginPath();
    vg.rect(0, 0, 100, 100);
    vg.fillColorRgbaf(0, 1, 0, 1);
    vg.fill();
    const imagePattern = vg.imagePattern(0, 0, 100, 100, 0, baboon, 1);
    vg.setFillPaint(imagePattern);
    vg.fill();
    vg.restore();
  }

  // Pulsing Flower Pattern
  function drawPulsingFlower(x: number, y: number, time: number) {
    const petals = 8;
    const pulseScale = Math.sin(time * 3) * 0.3 + 1.0;

    vg.save();
    vg.translate(x, y);
    vg.scale(pulseScale, pulseScale);

    for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const petalScale = Math.sin(time * 2 + i * 0.5) * 0.2 + 0.8;
        
        vg.save();
        vg.rotate(angle);
        vg.scale(petalScale, 1);
        
        vg.beginPath();
        vg.ellipse(0, -25, 12, 20);
        vg.fillColorRgbaf(1, 0.3 + Math.sin(time + i) * 0.2, 0.5, 0.8);
        vg.fill();
        vg.strokeColorRgbaf(0.8, 0.1, 0.3, 1);
        vg.strokeWidth(1);
        vg.stroke();
        vg.restore();
    }

    // Center circle
    vg.beginPath();
    vg.ellipse(0, 0, 8, 8);
    vg.fillColorRgbaf(1, 1, 0, 1);
    vg.fill();
    vg.restore();
  }

  // Morphing Blob
  function drawMorphingBlob(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);

    const points = 12;
    const baseRadius = 40;

    vg.beginPath();
    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise = Math.sin(time * 2 + i * 0.8) * Math.cos(time * 1.5 + i * 0.3);
        const radius = baseRadius + noise * 15;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
            vg.moveTo(px, py);
        } else {
            vg.lineTo(px, py);
        }
    }
    vg.closePath();

    const colorShift = Math.sin(time) * 0.5 + 0.5;
    vg.fillColorRgbaf(0.2 + colorShift * 0.6, 0.8 - colorShift * 0.3, 1, 0.7);
    vg.fill();
    vg.strokeColorRgbaf(0, 0.5, 0.8, 1);
    vg.strokeWidth(2);
    vg.stroke();
    vg.restore();
  }

  // Clipped Spinning Gears
  function drawClippedGears(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);

    // Create clipping mask - hexagon
    vg.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const px = Math.cos(angle) * 60;
        const py = Math.sin(angle) * 60;
        if (i === 0) vg.moveTo(px, py);
        else vg.lineTo(px, py);
    }
    vg.closePath();
    vg.clip();

    // Draw spinning gears inside clip
    for (let gearIndex = 0; gearIndex < 3; gearIndex++) {
        const gearX = Math.cos(gearIndex * 2.1) * 30;
        const gearY = Math.sin(gearIndex * 2.1) * 30;
        const rotation = time * (1 + gearIndex * 0.5);
        
        vg.save();
        vg.translate(gearX, gearY);
        vg.rotate(rotation);
        
        // Gear teeth
        const teeth = 8;
        vg.beginPath();
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const innerRadius = 15;
            const outerRadius = 25;
            
            const x1 = Math.cos(angle) * innerRadius;
            const y1 = Math.sin(angle) * innerRadius;
            const x2 = Math.cos(angle) * outerRadius;
            const y2 = Math.sin(angle) * outerRadius;
            const x3 = Math.cos(angle + 0.3) * outerRadius;
            const y3 = Math.sin(angle + 0.3) * outerRadius;
            const x4 = Math.cos(angle + 0.3) * innerRadius;
            const y4 = Math.sin(angle + 0.3) * innerRadius;
            
            if (i === 0) vg.moveTo(x1, y1);
            vg.lineTo(x2, y2);
            vg.lineTo(x3, y3);
            vg.lineTo(x4, y4);
            if (i === teeth - 1) vg.closePath();
        }
        
        vg.fillColorRgbaf(0.7, 0.7, 0.7, 0.9);
        vg.fill();
        vg.strokeColorRgbaf(0.3, 0.3, 0.3, 1);
        vg.strokeWidth(1.5);
        vg.stroke();
        
        // Center hole
        vg.beginPath();
        vg.ellipse(0, 0, 5, 5);
        vg.fillColorRgbaf(0.1, 0.1, 0.1, 1);
        vg.fill();
        
        vg.restore();
    }
    vg.restore();
  }

  // Bouncing Particles with Trails
  function drawBouncingParticles(x: number, y: number, time: number) {
  const particleCount = 6;

  for (let i = 0; i < particleCount; i++) {
      const phase = (i / particleCount) * Math.PI * 2;
      const bounceHeight = Math.abs(Math.sin(time * 2 + phase)) * 80;
      const px = x + Math.cos(phase + time * 0.5) * 60;
      const py = y - bounceHeight;
      
      // Trail effect
      for (let trail = 0; trail < 5; trail++) {
          const trailTime = time - trail * 0.1;
          const trailBounce = Math.abs(Math.sin(trailTime * 2 + phase)) * 80;
          const trailX = px + Math.cos(phase + trailTime * 0.5) * 60 - Math.cos(phase + time * 0.5) * 60;
          const trailY = py + bounceHeight - trailBounce;
          const alpha = (5 - trail) / 5 * 0.3;
          
          vg.beginPath();
          vg.ellipse(trailX, trailY, 4 - trail, 4 - trail);
          vg.fillColorRgbaf(1, 0.5, 0, alpha);
          vg.fill();
      }
      
      // Main particle
      vg.beginPath();
      vg.ellipse(0, 0, 6, 6);
      vg.save();
      vg.translate(px, py);
      vg.fillColorRgbaf(1, 0.2, 0.8, 0.9);
      vg.fill();
      vg.strokeColorRgbaf(1, 1, 1, 1);
      vg.strokeWidth(1);
      vg.stroke();
      vg.restore();
  }
  }

  // Spiral Galaxy
  function drawSpiralGalaxy(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);
    vg.rotate(time * 0.3);

    const arms = 3;
    const pointsPerArm = 20;

    for (let arm = 0; arm < arms; arm++) {
        const armAngle = (arm / arms) * Math.PI * 2;
        
        for (let i = 0; i < pointsPerArm; i++) {
            const t = i / pointsPerArm;
            const radius = t * 80;
            const angle = armAngle + t * Math.PI * 4;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            const size = (1 - t) * 4 + Math.sin(time * 3 + i * 0.5) * 1;
            const brightness = (1 - t) * 0.8 + 0.2;
            
            vg.beginPath();
            vg.ellipse(px, py, size, size);
            vg.fillColorRgbaf(brightness, brightness * 0.8, brightness * 1.2, 0.8);
            vg.fill();
        }
    }

    // Central core
    const coreSize = Math.sin(time * 2) * 3 + 12;
    vg.beginPath();
    vg.ellipse(0, 0, coreSize, coreSize);
    vg.fillColorRgbaf(1, 1, 0.8, 1);
    vg.fill();
    vg.strokeColorRgbaf(1, 0.8, 0.4, 1);
    vg.strokeWidth(2);
    vg.stroke();

    vg.restore();
  }

  // Waving Flag
  function drawWavingFlag(x: number, y: number, time: number) {
    vg.save();
    vg.translate(x, y);

    const width = 120;
    const height = 80;
    const segments = 20;

    // Flag background
    vg.beginPath();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const segmentX = t * width;
        const wave = Math.sin(time * 3 + t * Math.PI * 2) * (t * 8);
        const segmentY = wave;
        
        if (i === 0) {
            vg.moveTo(segmentX, segmentY);
            vg.lineTo(segmentX, segmentY + height);
        } else if (i === segments) {
            vg.lineTo(segmentX, segmentY + height + Math.sin(time * 3 + t * Math.PI * 2) * (t * 8));
            vg.lineTo(segmentX, segmentY);
        } else {
            vg.lineTo(segmentX, segmentY);
        }
    }

    for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const segmentX = t * width;
        const wave = Math.sin(time * 3 + t * Math.PI * 2) * (t * 8);
        vg.lineTo(segmentX, wave + height);
    }
    vg.closePath();

    // Gradient-like effect with multiple fills
    vg.fillColorRgbaf(0.8, 0.2, 0.2, 0.9);
    vg.fill();

    // Flag stripes
    for (let stripe = 0; stripe < 3; stripe++) {
        vg.beginPath();
        const stripeY = (stripe + 1) * height / 4;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const segmentX = t * width;
            const wave = Math.sin(time * 3 + t * Math.PI * 2) * (t * 8);
            const y1 = stripeY + wave - 5;
            const y2 = stripeY + wave + 5;
            
            if (i === 0) {
                vg.moveTo(segmentX, y1);
            } else {
                vg.lineTo(segmentX, y1);
            }
        }
        for (let i = segments; i >= 0; i--) {
            const t = i / segments;
            const segmentX = t * width;
            const wave = Math.sin(time * 3 + t * Math.PI * 2) * (t * 8);
            vg.lineTo(segmentX, stripeY + wave + 5);
        }
        vg.closePath();
        vg.fillColorRgbaf(1, 1, 1, 0.8);
        vg.fill();
    }

    // Flagpole
    vg.beginPath();
    vg.moveTo(-5, -20);
    vg.lineTo(-5, height + 20);
    vg.strokeColorRgbaf(0.4, 0.2, 0, 1);
    vg.strokeWidth(4);
    vg.stroke();

    vg.restore();
  }

  // document.addEventListener('keydown', e => instance.exports.onKeyDown(e.keyCode));
  // document.addEventListener('keyup', e => instance.exports.onKeyUp(e.keyCode, 0));
  // document.addEventListener('mousedown', e => instance.exports.onMouseDown(e.button, e.x, e.y));
  // document.addEventListener('mouseup', e => instance.exports.onMouseUp(e.button, e.x, e.y));
  document.addEventListener('mousemove', e => {
    mx = e.x;
    my = e.y;
    // vg.onMouseMove(e.x, e.y);
  });

  function step(timestamp: number) {
    // onAnimationFrame(timestamp);

    vg.beginFrame(window.innerWidth, window.innerHeight, window.devicePixelRatio);
    vg.clear(0.95, 0.95, 0.95, 1);

    const time = timestamp / 1000;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // ===== NANOVG FUNCTION EXAMPLES =====
    // This demonstrates various NanoVG functions available in your WASM bindings

    // Example 1: Animated rotating shapes
    drawRotatingTriangle(centerX - 200, centerY, time);

    // Example 2: Gradient circles with different patterns
    drawRadialGradientCircle(centerX + 200, centerY, 40);

    // Example 3: Animated rounded rectangle with linear gradient
    drawAnimatedRoundedRect(50, 50, 120, 80, time);

    // Example 4: Complex path with bezier curves
    drawBezierCurveShape(centerX, centerY + 150, 0.8);

    // Example 5: Animated ellipses
    drawAnimatedEllipses(centerX, centerY - 200, 5, time);

    // Example 6: Clipping example
    drawStarClippingExample(centerX - 300, centerY + 200);

    // Example 7: Animated arc
    drawAnimatedArcs(centerX + 300, centerY + 200, time);

    // Example 8: Rounded rectangle with varying corner radii
    drawRoundedRectVarying(50, 350, 150, 80, 20, 5, 15, 10);

    // Example 9: Mouse-following shape
    const mouseX = mx || centerX;
    const mouseY = my || centerY;
    drawMouseFollowingShape(mouseX, mouseY, time);

    // Example 10: Animated text-like pattern using paths
    drawTextLikePattern(centerX, centerY - 300, 0.5);

    // Example 11: Quadratic curves and path winding
    drawQuadraticCurvesWithWinding(centerX - 400, centerY + 100);

    // Example 12: Global alpha and transforms
    drawSkewedRectangle(centerX + 400, centerY + 100, 50, 50, time);


    // Example 14: High-quality button with vector gradients
    const buttonX = centerX - 100;
    const buttonY = centerY + 300;
    const buttonW = 200;
    const buttonH = 60;
    
    // Check if mouse is hovering over button
    const isHovered = mx >= buttonX && mx <= buttonX + buttonW && 
                      my >= buttonY && my <= buttonY + buttonH;
    
    // Draw the glossy button using our reusable function
    drawGlossyButton(buttonX, buttonY, buttonW, buttonH, isHovered, time);
    
    // Example 15: Multiple buttons demonstrating reusability
    // Small button
    const smallButtonX = centerX + 150;
    const smallButtonY = centerY + 300;
    const isSmallHovered = mx >= smallButtonX && mx <= smallButtonX + 120 && 
                          my >= smallButtonY && my <= smallButtonY + 40;
    drawGlossyButton(smallButtonX, smallButtonY, 120, 40, isSmallHovered, time);
    
    // Large button
    const largeButtonX = centerX - 300;
    const largeButtonY = centerY + 400;
    const isLargeHovered = mx >= largeButtonX && mx <= largeButtonX + 250 && 
                          my >= largeButtonY && my <= largeButtonY + 80;
    drawGlossyButton(largeButtonX, largeButtonY, 250, 80, isLargeHovered, time);

    // Example 13: Advanced transition effect with morphing clip path
    drawAdvancedTransitionEffect(centerX, centerY + 400, time);

    drawImagePattern(centerX, centerY + 200, time);

    drawBouncingParticles(100, 100, time);
    drawSpiralGalaxy(200, 100, time);
    drawWavingFlag(300, 100, time);
    drawPulsingFlower(500, 100, time);
    drawMorphingBlob(600, 100, time);
    drawClippedGears(100, 200, time)



    vg.endFrame();

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
});
