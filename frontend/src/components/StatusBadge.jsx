// src/components/StatusBadge.jsx

import React from "react";

const StatusBadge = ({ status, config = {} }) => {
  const statusConfig = config?.[status];

  // 想定外の status / config が来ても落ちない
  if (!statusConfig) {
    return (
      <span
        className="
          inline-flex items-center
          whitespace-nowrap
          px-3 py-1 text-sm
          rounded-full
          bg-gray-300 text-gray-700
        "
      >
        {status ?? "不明"}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center
        whitespace-nowrap
        px-3 py-1 text-sm font-semibold
        rounded-full text-white
        ${statusConfig.color}
      `}
    >
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;
