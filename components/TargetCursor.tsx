"use client"

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

// Default corner positions relative to center (0,0)
const DEFAULT_CORNER_POSITIONS = [
  { x: -16, y: -16 },  // TL
  { x: 6, y: -16 },    // TR
  { x: 6, y: 6 },      // BR
  { x: -16, y: 6 }     // BL
];

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const activeTargetRef = useRef<Element | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Use state for mobile detection to handle hydration properly
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
      setIsMobile((hasTouchScreen && isSmallScreen) || isMobileUserAgent);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const constants = useMemo(() => ({ borderWidth: 2, cornerSize: 10 }), []);

  // Reset corners to default positions
  const resetCorners = useCallback(() => {
    isHovering.current = false;
    activeTargetRef.current = null;
    
    cornersRef.current.forEach((corner, i) => {
      if (corner) {
        gsap.killTweensOf(corner);
        gsap.to(corner, {
          x: DEFAULT_CORNER_POSITIONS[i].x,
          y: DEFAULT_CORNER_POSITIONS[i].y,
          duration: 0.25,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });

    // Resume spin after corners reset
    setTimeout(() => {
      if (!isHovering.current && spinTl.current) {
        spinTl.current.restart();
      }
    }, 100);
  }, []);

  // Calculate corner positions for a target element
  const calculateCornerPositions = useCallback((target: Element, cursorX: number, cursorY: number) => {
    const rect = target.getBoundingClientRect();
    const { borderWidth, cornerSize } = constants;
    
    return [
      { x: rect.left - borderWidth - cursorX, y: rect.top - borderWidth - cursorY },
      { x: rect.right + borderWidth - cornerSize - cursorX, y: rect.top - borderWidth - cursorY },
      { x: rect.right + borderWidth - cornerSize - cursorX, y: rect.bottom + borderWidth - cornerSize - cursorY },
      { x: rect.left - borderWidth - cursorX, y: rect.bottom + borderWidth - cornerSize - cursorY }
    ];
  }, [constants]);

  // Update corner positions (used for scroll and parallax)
  const updateCornerPositions = useCallback((cursorX: number, cursorY: number, duration = 0.15) => {
    if (!isHovering.current || !activeTargetRef.current) return;
    
    const positions = calculateCornerPositions(activeTargetRef.current, cursorX, cursorY);
    
    cornersRef.current.forEach((corner, i) => {
      if (corner) {
        gsap.to(corner, {
          x: positions[i].x,
          y: positions[i].y,
          duration: duration,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
    });
  }, [calculateCornerPositions]);

  // Initialize corners at default positions
  const initCorners = useCallback(() => {
    cornersRef.current.forEach((corner, i) => {
      if (corner) {
        gsap.set(corner, {
          x: DEFAULT_CORNER_POSITIONS[i].x,
          y: DEFAULT_CORNER_POSITIONS[i].y
        });
      }
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    
    // Initialize corner positions
    initCorners();

    // Set initial cursor position
    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Create spin animation
    spinTl.current = gsap.timeline({ repeat: -1 })
      .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });

    // Mouse move handler
    const moveHandler = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power3.out' });
      
      // Update corner positions if hovering (parallax effect)
      if (isHovering.current && parallaxOn) {
        updateCornerPositions(e.clientX, e.clientY);
      }
    };
    window.addEventListener('mousemove', moveHandler);

    // Scroll handler - critical for fixing the scroll issue
    const scrollHandler = () => {
      if (!isHovering.current || !activeTargetRef.current) return;
      
      // Check if mouse is still over the target after scroll
      const elementUnderMouse = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      const isStillOverTarget = elementUnderMouse && 
        (elementUnderMouse === activeTargetRef.current || 
         elementUnderMouse.closest(targetSelector) === activeTargetRef.current);
      
      if (isStillOverTarget) {
        // Update corner positions to follow the scrolled element
        updateCornerPositions(mousePos.current.x, mousePos.current.y, 0.1);
      } else {
        // Mouse is no longer over target after scroll, reset
        resetCorners();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Mouse down/up handlers
    const mouseDownHandler = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
        gsap.to(cursor, { scale: 0.9, duration: 0.2 });
      }
    };

    const mouseUpHandler = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // Hover enter handler
    const enterHandler = (e: MouseEvent) => {
      const target = (e.target as Element).closest(targetSelector);
      if (!target) return;
      
      // Same target, ignore
      if (activeTargetRef.current === target) return;
      
      // If already hovering on something else, reset first
      if (isHovering.current && activeTargetRef.current !== target) {
        // Quick reset before snapping to new target
        cornersRef.current.forEach((corner) => {
          if (corner) gsap.killTweensOf(corner);
        });
      }

      isHovering.current = true;
      activeTargetRef.current = target;
      spinTl.current?.pause();
      gsap.set(cursor, { rotation: 0 });

      const cursorX = gsap.getProperty(cursor, 'x') as number;
      const cursorY = gsap.getProperty(cursor, 'y') as number;
      const positions = calculateCornerPositions(target, cursorX, cursorY);

      // Animate corners to target positions
      cornersRef.current.forEach((corner, i) => {
        if (corner) {
          gsap.killTweensOf(corner);
          gsap.to(corner, {
            x: positions[i].x,
            y: positions[i].y,
            duration: hoverDuration,
            ease: 'power2.out'
          });
        }
      });

      // Leave handler
      const leaveHandler = () => {
        target.removeEventListener('mouseleave', leaveHandler);
        
        // Only reset if this is still the active target
        if (activeTargetRef.current === target) {
          resetCorners();
        }
      };

      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, hideDefaultCursor, isMobile, hoverDuration, parallaxOn, constants, resetCorners, initCorners, updateCornerPositions, calculateCornerPositions]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div ref={el => { if (el) cornersRef.current[0] = el; }} className="target-cursor-corner corner-tl" />
      <div ref={el => { if (el) cornersRef.current[1] = el; }} className="target-cursor-corner corner-tr" />
      <div ref={el => { if (el) cornersRef.current[2] = el; }} className="target-cursor-corner corner-br" />
      <div ref={el => { if (el) cornersRef.current[3] = el; }} className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;
