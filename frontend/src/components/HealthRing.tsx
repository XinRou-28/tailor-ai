import React from 'react';

interface HealthRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showScore?: boolean;
}

export default function HealthRing({ score, size = 48, strokeWidth = 6, showScore = true }: HealthRingProps) {
  // Determine color based on health score (risk level)
  const getColor = () => {
    if (score < 40) return '#EF4444'; // red for Critical/High risk
    if (score < 70) return '#F59E0B'; // amber for Medium risk
    return '#10B981'; // green for healthy/Opportunity
  };

  const color = getColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          className="progress-ring"
          style={{ stroke: color }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </svg>
      {showScore && (
        <span className="absolute text-xs font-bold" style={{ color }}>
          {score}
        </span>
      )}
    </div>
  );
}