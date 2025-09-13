import React, { useEffect, useState } from 'react';

let dispatchToast;
export const toast = (message, opts = {}) => {
  if (dispatchToast) dispatchToast({ id: Date.now() + Math.random(), message, ...opts });
};

const Toasts = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    dispatchToast = (t) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration || 1800);
    };
    return () => {
      dispatchToast = undefined;
    };
  }, []);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {items.map((t) => (
        <div key={t.id} className="toast glass">
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toasts;
