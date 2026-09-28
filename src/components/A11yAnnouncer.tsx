import React, { createContext, useContext, useState, useCallback } from 'react';

interface AnnouncerContextType {
  announce: (message: string) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announce: () => {},
});

export const useA11yAnnouncer = () => useContext(AnnouncerContext);

export const A11yAnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>('');

  const announce = useCallback((msg: string) => {
    // Schedule asynchronously to guarantee we never update state during another component's render
    setTimeout(() => {
      setMessage('');
      setTimeout(() => {
        setMessage(msg);
      }, 50);
    }, 0);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Live region for assistive technologies */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
};
