import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, children, title = '', size = 'md', showCloseButton = true, blurBackground = true, closeOnClickOutside = true }) {
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    const escapeHandler = (evt) => {
      if (evt.key === 'Escape' && isOpen) onClose();
    };
    
    document.addEventListener('keydown', escapeHandler);
    return () => document.removeEventListener('keydown', escapeHandler);
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen) {
      setAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setAnimating(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const backdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnClickOutside) onClose();
  };
  
  if (!isOpen && !animating) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <div 
      className={`fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center ${blurBackground ? 'backdrop-blur-sm' : ''} transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={backdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`absolute top-0 left-0 w-full h-full bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div 
        className={`relative w-full bg-slate-800 rounded-4xl shadow-green-400/30 shadow-2xl transform transition-all duration-300 ${sizes[size]} ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            {title && <h3 className="text-xl text-white font-semibold audiowide-regular">{title}</h3>}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors duration-200 ml-auto p-1 rounded-full hover:bg-slate-700 focus:outline-none"
                aria-label="Close modal"
              >
                <X size={24} className="hover:text-red-500" />
              </button>
            )}
          </div>
        )}
        
        <div className="p-6 text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal; 