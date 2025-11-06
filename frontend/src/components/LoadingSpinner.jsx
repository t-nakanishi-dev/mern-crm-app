// components/LoadingSpinner.jsx

import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
