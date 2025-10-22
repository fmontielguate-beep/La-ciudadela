
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full bg-green-200 rounded-full h-4 my-6 shadow-inner">
      <div
        className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
       <p className="text-center text-sm font-medium text-green-800 mt-1">
        Módulo {current} de {total}
      </p>
    </div>
  );
};

export default ProgressBar;
