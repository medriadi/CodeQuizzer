import React, { useEffect, useState } from "react";
export default function LoadingState({ children = "Getting things ready…" }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="center-state" role="status">
      <span className="loader" />
      {children}
      {slow && (
        <p className="loading-hint">
          Your first visit may take up to a minute. Thanks for your patience.
        </p>
      )}
    </div>
  );
}
