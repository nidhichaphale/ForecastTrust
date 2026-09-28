import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { IconButton } from './IconButton'

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl bg-[#0b172a] border border-[#1a2e4c] shadow-2xl p-6 space-y-4 text-slate-100',
          'animate-in fade-in zoom-in-95 duration-150',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
          <IconButton
            icon={<X className="w-4 h-4" />}
            aria-label="Close dialog"
            size="sm"
            onClick={onClose}
          />
        </div>

        <div className="text-sm text-slate-300 py-1">{children}</div>

        {footer && <div className="pt-3 border-t border-[#1a2e4c] flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
