// src/hooks/useDropdownBehavior.ts
/**
 * Encapsulates all dropdown lifecycle logic used by Navbar:
 * - open / close state
 * - click-outside detection
 * - Escape key handling
 * - refs for toggle + menu
 */

import { useEffect, useRef, useState } from 'react';

export const useDropdownBehavior = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const hitMenu = menuRef.current?.contains(target);
      const hitToggle = toggleRef.current?.contains(target);
      if (!hitMenu && !hitToggle) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close,
    menuRef,
    toggleRef,
  };
};

export default useDropdownBehavior;
