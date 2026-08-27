import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Unified NodeGraph Canvas Component
 * Renders continuous drifting cyber-nodes with perpetual cruising velocity,
 * harmonic oscillation, laser proximity lines, and mouse popout sparkles.
 * 
 * Supports:
 *  - theme: 'bluish-green' (default post-login white background) | 'cyan' (dark obsidian) | 'emerald' (light glass)
 *  - fullscreen: true (fixed 100vw/100vh behind all pages) | false (absolute inside parent container)
 */
export default function NodeGraph({
  theme: themeProp = 'bluish-green',
  fullscreen = false,
  nodeCount,
  style = {}
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const popParticlesRef = useRef([]);
  const lastMousePosRef = useRef({ x: -1000, y: -1000 });

  // Theme palettes
  const palettes = {
    'bluish-green': {
      particle: '13, 148, 136',
      line: 'rgba(13, 148, 136, ',
      laserGlow: 'rgba(6, 182, 212, ',
      laserCore: 'rgba(13, 148, 136, ',
      reticle: 'rgba(13, 148, 136, 0.45)',
      reticleDot: '#0D9488',
      reticleShadow: '#06B6D4',
      nodeGlow: '6, 182, 212',
      nodeRing: 'rgba(13, 148, 136, ',
      nodeCore: 'rgba(13, 148, 136, ',
      poppedCore: '#0F766E',
    },
    cyan: {
      particle: '186, 230, 253',
      line: 'rgba(186, 230, 253, ',
      laserGlow: 'rgba(56, 189, 248, ',
      laserCore: 'rgba(255, 255, 255, ',
      reticle: 'rgba(56, 189, 248, 0.4)',
      reticleDot: '#38BDF8',
      reticleShadow: '#0EA5E9',
      nodeGlow: '56, 189, 248',
      nodeRing: 'rgba(186, 230, 253, ',
      nodeCore: 'rgba(224, 242, 254, ',
      poppedCore: '#FFFFFF',
    },
    emerald: {
      particle: '5, 150, 105',
      line: 'rgba(16, 185, 129, ',
      laserGlow: 'rgba(16, 185, 129, ',
      laserCore: 'rgba(5, 150, 105, ',
      reticle: 'rgba(5, 150, 105, 0.5)',
      reticleDot: '#059669',
      reticleShadow: '#10B981',
      nodeGlow: '16, 185, 129',
      nodeRing: 'rgba(5, 150, 105, ',
      nodeCore: 'rgba(5, 150, 105, ',
      poppedCore: '#047857',
    }
  };

  const t = palettes[themeProp] || palettes['bluish-green'];
  const totalNodes = nodeCount || (fullscreen ? 55 : 48);
  const CONNECTION_DIST = 185;
  const MOUSE_ATTRACT_DIST = 235;

  const createNodes = useCallback((w, h) => {
    return Array.from({ length: totalNodes }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.45 + 0.3;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2.5 + 1.8,
        pulsePhase: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.35 + 0.5,
        popScale: 1,
      };
    });
  }, [totalNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = fullscreen ? window.innerWidth : canvas.offsetWidth || 600;
    let h = fullscreen ? window.innerHeight : canvas.offsetHeight || 600;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = fullscreen ? window.innerWidth : canvas.offsetWidth || 600;
      h = fullscreen ? window.innerHeight : canvas.offsetHeight || 600;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      if (fullscreen) {
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnPopout = (x, y) => {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 1.0;
        popParticlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.9,
          decay: Math.random() * 0.035 + 0.025,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.2
        });
      }
      if (popParticlesRef.current.length > 50) popParticlesRef.current.shift();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      mouseRef.current = { x: newX, y: newY, active: true };

      const dist = Math.hypot(newX - lastMousePosRef.current.x, newY - lastMousePosRef.current.y);
      if (dist > 22) {
        spawnPopout(newX, newY);
        lastMousePosRef.current = { x: newX, y: newY };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    if (fullscreen) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    } else {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;
    const animate = () => {
      time += 0.012;
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Draw Popout Sparkles
      for (let i = popParticlesRef.current.length - 1; i >= 0; i--) {
        const p = popParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          popParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(${t.particle}, ${Math.max(0, p.alpha * 0.85)})`;
        
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Update nodes
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_ATTRACT_DIST && dist > 1) {
          const force = (1 - dist / MOUSE_ATTRACT_DIST) * 0.022;
          node.vx += dx * force;
          node.vy += dy * force;
          const popTarget = 1.35 + (1 - dist / MOUSE_ATTRACT_DIST) * 0.8;
          node.popScale += (popTarget - node.popScale) * 0.12;
        } else {
          node.popScale += (1.0 - node.popScale) * 0.08;
        }

        node.vx *= 0.96;
        node.vy *= 0.96;

        const harmonicX = Math.cos(time + node.pulsePhase) * 0.18;
        const harmonicY = Math.sin(time * 0.8 + node.pulsePhase) * 0.18;

        node.x += node.baseVx + node.vx + harmonicX;
        node.y += node.baseVy + node.vy + harmonicY;

        if (node.x < -20) node.x = w + 20;
        if (node.x > w + 20) node.x = -20;
        if (node.y < -20) node.y = h + 20;
        if (node.y > h + 20) node.y = -20;
      }

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${t.line}${alpha})`;
            ctx.lineWidth = alpha > 0.18 ? 1.0 : 0.6;
            ctx.stroke();
          }
        }
      }

      // Mouse laser proximity connections
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        for (const node of nodes) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_ATTRACT_DIST) {
            const alpha = (1 - dist / MOUSE_ATTRACT_DIST) * 0.75;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `${t.laserGlow}${alpha * 0.5})`;
            ctx.lineWidth = 2.0;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `${t.laserCore}${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Mouse Reticle
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = t.reticle;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = t.reticleDot;
        ctx.shadowColor = t.reticleShadow;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      for (const node of nodes) {
        const pulse = Math.sin(time * 1.5 + node.pulsePhase) * 0.2 + 0.8;
        const currentRadius = node.radius * node.popScale * pulse;
        const alpha = Math.min(1, node.baseAlpha * pulse * (node.popScale > 1.1 ? 1.4 : 1));
        const isPopped = node.popScale > 1.25;

        // Glow halo
        const glowRadius = currentRadius * (isPopped ? 3.5 : 2.5);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(${t.nodeGlow}, ${alpha * (isPopped ? 0.6 : 0.35)})`);
        gradient.addColorStop(1, `rgba(${t.nodeGlow}, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Popped outer ring
        if (isPopped) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = `${t.nodeRing}${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Inner solid core
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = isPopped ? t.poppedCore : `${t.nodeCore}${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      if (fullscreen) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [createNodes, fullscreen, t, totalNodes]);

  if (fullscreen) {
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          ...style
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        ...style
      }}
    />
  );
}
