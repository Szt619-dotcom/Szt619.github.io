// Butterfly Flying Effect for Hexo Butterfly Theme
// Creates beautiful butterflies that fly across the page

(function() {
  'use strict';

  const config = {
    butterflyCount: 15,        // Number of butterflies
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#fd79a8'],
    size: { min: 15, max: 30 },
    speed: { min: 0.3, max: 1.2 }
  };

  class Butterfly {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.size = config.size.min + Math.random() * (config.size.max - config.size.min);
      this.speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.angle = Math.random() * Math.PI * 2;
      this.flapAngle = 0;
      this.flapSpeed = 0.08 + Math.random() * 0.06;
      this.direction = Math.random() * Math.PI * 2;
      this.turnSpeed = 0.01 + Math.random() * 0.02;
      this.waveOffset = Math.random() * Math.PI * 2;
      this.waveSpeed = 0.02 + Math.random() * 0.03;
      this.opacity = 0.5 + Math.random() * 0.5;
    }

    update() {
      // Update direction with some randomness
      this.direction += (Math.random() - 0.5) * this.turnSpeed;
      
      // Move butterfly
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed + Math.sin(Date.now() * 0.001 + this.waveOffset) * 0.5;
      
      // Update wing flap
      this.flapAngle += this.flapSpeed;
      
      // Wrap around edges
      const margin = 50;
      if (this.x < -margin) this.x = this.canvas.width + margin;
      if (this.x > this.canvas.width + margin) this.x = -margin;
      if (this.y < -margin) this.y = this.canvas.height + margin;
      if (this.y > this.canvas.height + margin) this.y = -margin;
    }

    draw() {
      const ctx = this.ctx;
      const flapScale = Math.sin(this.flapAngle);
      
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.direction + Math.PI / 2);
      
      // Left wing
      ctx.save();
      ctx.scale(flapScale, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -this.size * 0.5, -this.size * 0.3,
        -this.size, -this.size * 0.8,
        -this.size * 0.3, -this.size * 1.2
      );
      ctx.bezierCurveTo(
        -this.size * 0.1, -this.size * 0.6,
        0, -this.size * 0.3,
        0, 0
      );
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
      
      // Right wing
      ctx.save();
      ctx.scale(-flapScale, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -this.size * 0.5, -this.size * 0.3,
        -this.size, -this.size * 0.8,
        -this.size * 0.3, -this.size * 1.2
      );
      ctx.bezierCurveTo(
        -this.size * 0.1, -this.size * 0.6,
        0, -this.size * 0.3,
        0, 0
      );
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
      
      // Body
      ctx.beginPath();
      ctx.ellipse(0, -this.size * 0.2, this.size * 0.08, this.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      
      // Antennae
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.4);
      ctx.quadraticCurveTo(-this.size * 0.15, -this.size * 0.7, -this.size * 0.1, -this.size * 0.8);
      ctx.moveTo(0, -this.size * 0.4);
      ctx.quadraticCurveTo(this.size * 0.15, -this.size * 0.7, this.size * 0.1, -this.size * 0.8);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      ctx.restore();
    }
  }

  function initButterflyEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'butterfly-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Create butterflies
    const butterflies = [];
    for (let i = 0; i < config.butterflyCount; i++) {
      butterflies.push(new Butterfly(canvas, ctx));
    }

    // Handle resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      butterflies.forEach(butterfly => {
        butterfly.update();
        butterfly.draw();
      });
      
      requestAnimationFrame(animate);
    }

    animate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButterflyEffect);
  } else {
    initButterflyEffect();
  }
})();
