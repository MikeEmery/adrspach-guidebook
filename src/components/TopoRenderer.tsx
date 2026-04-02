import type { TopoDrawingData } from "@/lib/topo-types";

type Props = {
  imageUrl: string;
  drawingData: TopoDrawingData;
  alt: string;
};

export default function TopoRenderer({ imageUrl, drawingData, alt }: Props) {
  const hasDrawings =
    drawingData.lines.length > 0 || drawingData.labels.length > 0;

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {hasDrawings && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          style={{ pointerEvents: "none" }}
        >
          {/* Lines */}
          {drawingData.lines.map((line) => {
            if (line.points.length < 2) return null;
            const pointsStr = line.points
              .map(([x, y]) => `${x * 1000},${y * 1000}`)
              .join(" ");
            return (
              <polyline
                key={line.id}
                points={pointsStr}
                fill="none"
                stroke={line.color}
                strokeWidth={line.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Labels */}
          {drawingData.labels.map((label) => {
            const cx = label.x * 1000;
            const cy = label.y * 1000;
            const fs = label.fontSize * 0.9;
            const r = fs * 1.1;
            const textColor =
              label.color === "#ffffff" || label.color === "#eab308"
                ? "#000000"
                : "#ffffff";

            return (
              <g key={label.id}>
                <circle cx={cx} cy={cy} r={r} fill={label.color} />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={fs}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {label.text}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
