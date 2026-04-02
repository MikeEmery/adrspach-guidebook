export type TopoLine = {
  id: string;
  points: [number, number][]; // [x, y] proportional 0-1
  color: string;
  width: number; // relative to 1000px canvas width
};

export type TopoLabel = {
  id: string;
  x: number; // proportional 0-1
  y: number; // proportional 0-1
  text: string;
  color: string;
  fontSize: number; // relative to 1000px canvas width
};

export type TopoDrawingData = {
  lines: TopoLine[];
  labels: TopoLabel[];
};

export type TopoTool = "polyline" | "label" | "select";

export const TOPO_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Yellow", value: "#eab308" },
  { name: "White", value: "#ffffff" },
  { name: "Green", value: "#22c55e" },
];

export const DEFAULT_LINE_WIDTH = 3;
export const DEFAULT_FONT_SIZE = 18;
export const DEFAULT_COLOR = "#ef4444";
