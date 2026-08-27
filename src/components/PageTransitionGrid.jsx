import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { TransitionContext } from '../context/TransitionContext';

/**
 * Grid / Mosaic Curtain Page Transition Component
 * Inspired by modern mosaic curtain reveal effects (animasterlib / codrops).
 * Features:
 * - Dynamic NxM grid tile generation based on viewport aspect ratio
 * - GSAP timeline orchestration with radial grid staggers (center -> out, edges -> in)
 * - Automatic route transition interception + manual trigger API
 */
export default function PageTransitionGrid({ children, rows = 10, cols = 16, tileColor = '#0b1329', accentColor = '#0ea5e9' }) {
  const containerRef = useRef(null);
  const tilesRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingPathRef = useRef(null);
  const isInitialMount = useRef(true);

  // Total tile count
  const totalTiles = rows * cols;

  // Trigger Full Grid In -> Swap -> Grid Out Animation
  const runTransition = useCallback((targetPath) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    pendingPathRef.current = targetPath;

    const tiles = tilesRef.current;
    if (!tiles || tiles.length === 0) {
      if (targetPath) navigate(targetPath);
      setIsTransitioning(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        gsap.set(containerRef.current, { pointerEvents: 'none', visibility: 'hidden' });
      }
    });

    // Make container active & visible
    gsap.set(containerRef.current, { visibility: 'visible', pointerEvents: 'auto' });

    // Phase 1: In-Transition (Tiles scale up from center to fully cover the screen)
    tl.fromTo(
      tiles,
      {
        scale: 0,
        opacity: 0,
        rotate: () => (Math.random() - 0.5) * 20,
        transformOrigin: '50% 50%'
      },
      {
        scale: 1.05,
        opacity: 1,
        rotate: 0,
        duration: 0.38,
        ease: 'power2.inOut',
        stagger: {
          grid: [rows, cols],
          from: 'center',
          amount: 0.3
        }
      }
    );

    // Phase 2: Content Swap (Perform route navigation under solid mosaic cover)
    tl.add(() => {
      if (pendingPathRef.current) {
        navigate(pendingPathRef.current);
        pendingPathRef.current = null;
      }
    }, '+=0.05');

    // Phase 3: Out-Transition (Tiles collapse/scale down outward revealing the new page)
    tl.to(
      tiles,
      {
        scale: 0,
        opacity: 0,
        rotate: () => (Math.random() - 0.5) * 15,
        duration: 0.42,
        ease: 'expo.out',
        stagger: {
          grid: [rows, cols],
          from: 'edges',
          amount: 0.32
        }
      },
      '+=0.08'
    );
  }, [cols, rows, navigate, isTransitioning]);

  // Handle route change transitions automatically when route changes directly
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const tiles = tilesRef.current;
    if (!tiles || tiles.length === 0) return;

    // Trigger Out-Transition reveal on location change
    gsap.set(containerRef.current, { visibility: 'visible', pointerEvents: 'auto' });
    gsap.fromTo(
      tiles,
      { scale: 1.05, opacity: 1, rotate: 0 },
      {
        scale: 0,
        opacity: 0,
        rotate: () => (Math.random() - 0.5) * 16,
        duration: 0.45,
        ease: 'expo.out',
        stagger: {
          grid: [rows, cols],
          from: 'center',
          amount: 0.35
        },
        onComplete: () => {
          gsap.set(containerRef.current, { visibility: 'hidden', pointerEvents: 'none' });
        }
      }
    );
  }, [location.pathname, rows, cols]);

  const navigateWithGrid = useCallback((path) => {
    if (location.pathname === path) return;
    runTransition(path);
  }, [location.pathname, runTransition]);

  return (
    <TransitionContext.Provider value={{ navigateWithGrid, isTransitioning }}>
      {/* Page Content */}
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        {children}
      </div>

      {/* Grid / Mosaic Overlay Layer */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          pointerEvents: isTransitioning ? 'auto' : 'none',
          visibility: 'hidden',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          overflow: 'hidden',
          background: 'transparent'
        }}
      >
        {Array.from({ length: totalTiles }).map((_, index) => {
          // Dynamic cyber-mosaic gradient & accent
          const isAccent = index % 7 === 0;
          return (
            <div
              key={index}
              ref={(el) => (tilesRef.current[index] = el)}
              style={{
                width: '100%',
                height: '100%',
                background: isAccent 
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' 
                  : 'linear-gradient(135deg, #070d1e 0%, #0b152e 100%)',
                boxShadow: isAccent 
                  ? 'inset 0 0 12px rgba(56, 189, 248, 0.4), 0 0 8px rgba(2, 132, 199, 0.3)' 
                  : 'inset 0 0 6px rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.12)',
                transformOrigin: 'center center',
                willChange: 'transform, opacity'
              }}
            />
          );
        })}
      </div>
    </TransitionContext.Provider>
  );
}
