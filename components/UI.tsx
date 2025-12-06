
import React from 'react';
import { LucideIcon, Upload, X, QrCode, Globe, Instagram, Facebook, MessageCircle, Package, Target, Megaphone, AlertTriangle, Gift, ShoppingBag, Image, MapPin, History, CalendarCheck } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }> = ({ className, variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98] active:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-300 focus:ring-brand-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
    outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-brand-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props} />
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; noPadding?: boolean }> = ({ children, className, title, noPadding }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className || ''}`}>
    {title && (
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
    )}
    <div className={noPadding ? '' : 'p-6'}>{children}</div>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>}
    <input
      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium ${className || ''}`}
      {...props}
    />
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' | 'gray' | 'red' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Mobile: Bottom Sheet | Desktop: Modal */}
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 sm:zoom-in-95 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-xl text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ImageUpload: React.FC<{
  className?: string;
  currentImage?: string;
  placeholder?: string;
  onImageUpload: (base64: string) => void
}> = ({ className, currentImage, placeholder, onImageUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-brand-500 transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center ${className || ''}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {currentImage ? (
        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-xs text-center">{placeholder || 'Upload'}</span>
        </div>
      )}
    </div>
  );
};

// --- App Native Components ---

export const AppShell: React.FC<{
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
  className?: string;
}> = ({ children, header, bottomNav, className }) => {
  return (
    <div className={`flex flex-col h-[100dvh] w-full bg-gray-50 ${className || ''}`}>
      {/* Fixed Header */}
      {header && (
        <div className="flex-none bg-white border-b border-gray-100 z-30">
          {header}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24">
        {children}
      </div>

      {/* Fixed Bottom Nav */}
      {bottomNav && (
        <div className="flex-none fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe-area shadow-2xl">
          {bottomNav}
        </div>
      )}
    </div>
  );
};

export const MobileNav: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-around items-center h-16 px-2">
    {children}
  </div>
);

export const MobileNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${active ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`${active ? 'bg-brand-50 p-1.5 rounded-xl' : ''} transition-all duration-300`}>
      {React.cloneElement(icon as React.ReactElement, {
        size: 24,
        strokeWidth: active ? 2.5 : 2,
        className: active ? 'animate-bounce-subtle' : ''
      })}
    </div>
    <span className={`text-[10px] font-bold leading-none ${active ? 'text-brand-700' : ''}`}>{label}</span>
  </button>
);

export const AgendeLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main lowercase 'a' shape - Bold Circle + Vertical Bar */}
    <path fillRule="evenodd" clipRule="evenodd" d="M65 35V80H55V72C52.613 74.5297 49.3377 76.5367 45.5 77.5651C41.6623 78.5935 37.4042 78.6052 33.5 77.6C29.5958 76.5948 26.1558 74.609 23.5 71.8C20.8442 68.991 19 65.45 19 61.5C19 57.55 20.8442 54.009 23.5 51.2C26.1558 48.391 29.5958 46.4052 33.5 45.4C37.4042 44.3948 41.6623 44.4065 45.5 45.4349C49.3377 46.4633 52.613 48.4703 55 51V38C55 35 57 35 65 35ZM55 61.5C55 55.701 50.5228 51 45 51C39.4772 51 35 55.701 35 61.5C35 67.299 39.4772 72 45 72C50.5228 72 55 67.299 55 61.5Z" fill="#e11d48" />

    {/* Horizontal Cut */}
    <rect x="15" y="58" width="55" height="5" fill="white" />

    {/* Plus sign top right */}
    <path d="M78 20V40M68 30H88" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export { QrCode, Globe, Instagram, Facebook, MessageCircle, Package, Target, Megaphone, AlertTriangle, Gift, ShoppingBag, Image, MapPin, History, CalendarCheck };
