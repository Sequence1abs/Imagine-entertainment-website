import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

// Register GSAP plugins if needed
if (typeof window !== 'undefined') {
  gsap.config({ nullTargetWarn: false });
}

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    setValue(get());
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

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

const preloadImages = async (urls: string[]): Promise<void> => {
  if (typeof window === 'undefined') return;
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
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
  colorShiftOnHover = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    2
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const getInitialPosition = (item: GridItem) => {
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
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const gap = 12; // Gap between items
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const colHeights = new Array(columns).fill(0);

    return items.map(child => {
      // Find the shortest column
      const col = colHeights.indexOf(Math.min(...colHeights));
      
      // Calculate position
      const x = columnWidth * col + col * gap;
      
      // Scale height based on column width to maintain aspect ratio
      // child.height is the height for a base width of 400, so scale it proportionally
      const aspectRatio = child.height / 400; // 400 is the base width used in gallery
      const height = columnWidth * aspectRatio;
      
      // Get current y position for this column
      const y = colHeights[col];

      // Update column height (add item height + gap for next item)
      colHeights[col] += height + gap;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  // Calculate container height based on tallest column
  const containerHeight = useMemo(() => {
    if (grid.length === 0 || !width) return 0
    const gap = 12
    const columnWidth = (width - (columns - 1) * gap) / columns
    const colHeights = new Array(columns).fill(0)
    
    // Recalculate column heights from grid items
    grid.forEach(item => {
      const col = Math.round(item.x / (columnWidth + gap))
      if (col >= 0 && col < columns) {
        colHeights[col] = Math.max(colHeights[col], item.y + item.h)
      }
    })
    
    return Math.max(...colHeights, 0) + 20 // Add some padding
  }, [grid, columns, width])

  const animatedIds = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return;

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
        // It's a new item (or first load), animate entry
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' })
        };

        // Set initial state immediately
        gsap.set(element, initialState);
        
        // Animate to final position
        gsap.to(element, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: isNewItem ? (index % columns) * stagger : 0 
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
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, columns]);

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
      style={{ height: containerHeight > 0 ? `${containerHeight}px` : 'auto' }}
    >
      {grid.map(item => {
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
              cursor: item.url ? 'pointer' : 'default',
              width: `${item.w}px`,
              height: `${item.h}px`
            }}
            onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="item-img" style={{ backgroundImage: item.loaded ? `url(${item.img})` : 'none' }}>
              {/* Skeleton placeholder - shows while image is loading */}
              {!item.loaded && (
                <div className="image-skeleton" />
              )}
              {/* Actual image - fades in when loaded */}
              {item.loaded && (
                <div 
                  className="image-loaded"
                  style={{ 
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px'
                  }}
                />
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
