import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: 'standard' | 'wide' | 'narrow';
  interactive?: boolean;
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  width = 'standard',
  interactive = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!triggerRef) return;
    
    const rect = triggerRef.getBoundingClientRect();
    let top = 0;
    let left = 0;

    // Calculate position based on trigger element and desired placement
    switch (position) {
      case 'top':
        top = rect.top - 10;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 10;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
        break;
    }

    setCoords({ top, left });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (interactive) {
      // Delay closing to allow mouse to move to tooltip
      closeTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    } else {
      setIsVisible(false);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2'
  };

  const widthClasses = {
    standard: 'tooltip-standard',
    wide: 'tooltip-wide',
    narrow: 'tooltip-narrow'
  };

  return (
    <>
      <div 
        ref={setTriggerRef}
        className="relative inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && content && createPortal(
        <AnimatePresence>
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`fixed ${positionClasses[position]} ${interactive ? '' : 'pointer-events-none'} z-[9999]`}
            style={{ 
              top: `${coords.top}px`, 
              left: `${coords.left}px`
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className={`tooltip-container tooltip-text ${widthClasses[width]}`}>
              {content}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}