import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface SecureScreenProps {
  children: React.ReactNode;
  showWatermark?: boolean;
  preventCapture?: boolean;
}

export const SecureScreen: React.FC<SecureScreenProps> = ({
  children,
  showWatermark = true,
  preventCapture = true,
}) => {
  const { user, company } = useAuth();
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!preventCapture) return;

    // Detect PrintScreen key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    // Disable right-click on sensitive screens
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
    };

    // Blur content when tab loses focus (screenshot detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [preventCapture]);

  return (
    <div className="relative">
      {/* Warning overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-destructive/90 z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center text-destructive-foreground p-8">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold mb-2">Screen Capture Not Allowed</h2>
            <p className="text-sm opacity-80">
              Screenshot and screen recording are prohibited on this screen.
            </p>
          </div>
        </div>
      )}

      {/* Content with blur effect when tab is hidden */}
      <div
        className={`transition-all duration-200 select-none ${isBlurred ? 'blur-lg' : ''}`}
        style={{ 
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Watermark overlay */}
      {showWatermark && user && (
        <div 
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-32 opacity-[0.04] rotate-[-30deg] scale-150">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="text-foreground font-mono text-xs whitespace-nowrap">
                <div className="font-semibold">{company.name}</div>
                <div>{user.name} • {user.username}</div>
                <div>{format(new Date(), 'dd/MM/yyyy HH:mm')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
