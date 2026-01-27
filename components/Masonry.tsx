"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  // Use defaultValue for SSR and initial client render so server and first paint match
  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
    setValue(get());
    const handler = () => setValue(get());
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface Item {
  id: string;
  img: string;
  url?: string;
  height: number;
  loaded?: boolean;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: Item, index: number) => void;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick
}) => {
  useEffect(() => {
    gsap.config({ nullTargetWarn: false });
  }, []);
  const queries = useMemo(() => 
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'], 
    []
  );
  const values = useMemo(() => [5, 4, 3, 2], []);
  const columns = useMedia(queries, values, 2);

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Track which images have loaded
  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  }, []);

  const getInitialPosition = useCallback((item: GridItem) => {
    // Relative positioning instead of absolute window items
    const offset = 200;
    
    // For random direction
    let direction = animateFrom;
    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: item.y - offset };
      case 'bottom':
        return { x: item.x, y: item.y + offset };
      case 'left':
        return { x: item.x - offset, y: item.y };
      case 'right':
        return { x: item.x + offset, y: item.y };
      case 'center':
        return {
          x: item.x + (item.w / 2),
          y: item.y + (item.h / 2)
        };
      default:
        // Default fallthrough to bottom animation
        return { x: item.x, y: item.y + offset };
    }
  }, [animateFrom]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const gap = 12; // Gap between items
    const columnWidth = Math.max(1, (width - (columns - 1) * gap) / columns);
    const colHeights = new Array(columns).fill(0);

    // Clamp aspect ratio to avoid extreme tall/short tiles and layout bugs
    const MIN_ASPECT = 0.35;
    const MAX_ASPECT = 2.5;
    const BASE_WIDTH = 400;

    const gridItems = items.map(child => {
      // Find the shortest column
      const col = colHeights.indexOf(Math.min(...colHeights));
      
      // Calculate position
      const x = columnWidth * col + col * gap;
      
      // Scale height based on column width; clamp aspect ratio to prevent stacking/slivers
      const rawAspect = child.height / BASE_WIDTH;
      const aspectRatio = Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, rawAspect));
      const height = Math.max(80, columnWidth * aspectRatio);
      
      // Get current y position for this column
      const y = colHeights[col];

      // Update column height (add item height + gap for next item)
      colHeights[col] += height + gap;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    return gridItems;
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  // Calculate container height based on tallest column from grid items
  const containerHeight = useMemo(() => {
    if (grid.length === 0 || !width) return 0;
    
    // Find the maximum bottom position of all items
    let maxHeight = 0;
    grid.forEach(item => {
      const bottom = item.y + item.h;
      if (bottom > maxHeight) {
        maxHeight = bottom;
      }
    });
    
    return maxHeight + 20; // Add some padding
  }, [grid, width]);

  const animatedIds = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (grid.length === 0) {
      // Clean up refs when grid is empty
      itemRefs.current.clear();
      return;
    }

    // Clean up animatedIds for items that are no longer in the grid
    const currentIds = new Set(grid.map(item => item.id));
    animatedIds.current.forEach(id => {
      if (!currentIds.has(id)) {
        animatedIds.current.delete(id);
      }
    });

    // Wait a frame to ensure all refs are set
    requestAnimationFrame(() => {
      grid.forEach((item, index) => {
        const element = itemRefs.current.get(item.id);
        if (!element) return;

        const animationProps = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h
        };

        const isNewItem = !animatedIds.current.has(item.id);

        if (isNewItem) {
          // Animate entry: keep layout position from React (avoids stacking); only animate opacity/blur
          gsap.set(element, {
            opacity: 0,
            ...(blurToFocus && { filter: 'blur(10px)' })
          });
          gsap.to(element, {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.6,
            ease: 'power3.out',
            delay: (index % columns) * stagger,
            overwrite: 'auto'
          });

          // Mark as animated
          animatedIds.current.add(item.id);
        } else {
          // Existing item update (resize or reorder)
          gsap.to(element, {
            ...animationProps,
            duration: duration,
            ease: ease,
            overwrite: 'auto'
          });
        }
      });

      hasMounted.current = true;
    });
  }, [grid, stagger, animateFrom, blurToFocus, duration, ease, columns, getInitialPosition]);

  const handleMouseEnter = (e: React.MouseEvent, item: GridItem) => {
    const element = itemRefs.current.get(item.id);
    if (!element) return;

    if (scaleOnHover) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent, item: GridItem) => {
    const element = itemRefs.current.get(item.id);
    if (!element) return;

    if (scaleOnHover) {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="list"
      style={{ 
        height: containerHeight > 0 ? `${containerHeight}px` : 'auto',
        minHeight: grid.length > 0 ? '400px' : '0px',
        position: 'relative'
      }}
    >
      {grid.map((item, index) => {
        const isPriority = index < 12; // First 12 images get priority loading
        const isEager = index < 20; // First 20 images load eagerly (above the fold)
        
        return (
          <div
            key={item.id}
            data-key={item.id}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.id, el);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            className="item-wrapper"
            style={{ 
              cursor: onItemClick || item.url ? 'pointer' : 'default',
              width: `${item.w}px`,
              height: `${item.h}px`,
              transform: `translate(${item.x}px, ${item.y}px)`,
            }}
            onClick={() => {
              if (onItemClick) {
                onItemClick(item, index);
              } else if (item.url) {
                window.open(item.url, '_blank', 'noopener');
              }
            }}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="item-img">
              {/* Native img - always render, loads immediately */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt=""
                crossOrigin="anonymous"
                className={`masonry-image ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '12px',
                  transition: 'opacity 0.2s ease-in-out',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
                loading={isEager ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={isPriority ? 'high' : 'auto'}
                onLoad={() => handleImageLoad(item.id)}
                onError={(e) => {
                  console.error('[Masonry] Image failed to load:', item.img, e)
                  handleImageLoad(item.id) // Mark as loaded even on error to hide skeleton
                }}
              />
              {/* Skeleton placeholder - shows behind image while loading */}
              {!loadedImages.has(item.id) && (
                <div className="image-skeleton" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
              )}
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '8px'
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
