"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  TopoDrawingData,
  TopoLine,
  TopoLabel,
  TopoTool,
} from "@/lib/topo-types";
import { DEFAULT_LINE_WIDTH, DEFAULT_FONT_SIZE, DEFAULT_COLOR } from "@/lib/topo-types";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useTopoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tool, setTool] = useState<TopoTool>("polyline");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [lineWidth, setLineWidth] = useState(DEFAULT_LINE_WIDTH);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const [drawingData, setDrawingData] = useState<TopoDrawingData>({
    lines: [],
    labels: [],
  });
  const [undoStack, setUndoStack] = useState<TopoDrawingData[]>([]);

  // Active polyline being drawn (not yet committed)
  const [activePoints, setActivePoints] = useState<[number, number][]>([]);

  // Selected element for deletion
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Label placement
  const [pendingLabel, setPendingLabel] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Dragging state for moving labels
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStartRef = useRef<{ labelX: number; labelY: number } | null>(null);

  // Image dimensions (natural)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Canvas pixel dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Convert pixel coords to proportional
  const toProportional = useCallback(
    (px: number, py: number): [number, number] => {
      if (canvasSize.width === 0 || canvasSize.height === 0) return [0, 0];
      return [px / canvasSize.width, py / canvasSize.height];
    },
    [canvasSize]
  );

  // Convert proportional to pixel
  const toPixel = useCallback(
    (rx: number, ry: number): [number, number] => {
      return [rx * canvasSize.width, ry * canvasSize.height];
    },
    [canvasSize]
  );

  // Push current state to undo stack
  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-20), { ...drawingData }]);
  }, [drawingData]);

  const undo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setDrawingData(last);
      setDirty(true);
      return prev.slice(0, -1);
    });
    setSelectedId(null);
    setActivePoints([]);
  }, []);

  // Load an image onto the canvas
  const loadImage = useCallback((url: string) => {
    setImageUrl(url);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  }, []);

  // Load existing drawing data
  const loadDrawingData = useCallback((data: TopoDrawingData) => {
    setDrawingData(data);
    setUndoStack([]);
    setActivePoints([]);
    setSelectedId(null);
    setPendingLabel(null);
    setDirty(false);
  }, []);

  // Resize canvas to fit container while maintaining aspect ratio
  useEffect(() => {
    if (!containerRef.current || imageSize.width === 0) return;

    const resizeObserver = new ResizeObserver(() => {
      const container = containerRef.current;
      if (!container || imageSize.width === 0) return;
      const containerWidth = container.clientWidth;
      const aspect = imageSize.height / imageSize.width;
      const w = containerWidth;
      const h = containerWidth * aspect;
      setCanvasSize({ width: w, height: h });
    });

    resizeObserver.observe(containerRef.current);
    // Trigger initial size
    const containerWidth = containerRef.current.clientWidth;
    const aspect = imageSize.height / imageSize.width;
    setCanvasSize({
      width: containerWidth,
      height: containerWidth * aspect,
    });

    return () => resizeObserver.disconnect();
  }, [imageSize]);

  // Redraw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;
    if (!canvas || !ctx || !img || canvasSize.width === 0) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw background image
    ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);

    const scale = canvasSize.width / 1000;

    // Draw committed lines
    for (const line of drawingData.lines) {
      if (line.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const [sx, sy] = toPixel(line.points[0][0], line.points[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < line.points.length; i++) {
        const [px, py] = toPixel(line.points[i][0], line.points[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Highlight if selected
      if (line.id === selectedId) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = (line.width + 2) * scale;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        const [sx2, sy2] = toPixel(line.points[0][0], line.points[0][1]);
        ctx.moveTo(sx2, sy2);
        for (let i = 1; i < line.points.length; i++) {
          const [px, py] = toPixel(line.points[i][0], line.points[i][1]);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw active polyline (in progress)
    if (activePoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const [sx, sy] = toPixel(activePoints[0][0], activePoints[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < activePoints.length; i++) {
        const [px, py] = toPixel(activePoints[i][0], activePoints[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw points
      for (const pt of activePoints) {
        const [px, py] = toPixel(pt[0], pt[1]);
        ctx.beginPath();
        ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Draw labels
    for (const label of drawingData.labels) {
      const [px, py] = toPixel(label.x, label.y);
      const fs = label.fontSize * scale;

      // Background circle/pill
      ctx.font = `bold ${fs}px sans-serif`;
      const metrics = ctx.measureText(label.text);
      const padding = 8 * scale;
      const bgWidth = metrics.width + padding * 2;
      const bgHeight = fs + padding * 2;

      ctx.fillStyle = label.id === selectedId ? "#00ffff" : label.color;
      ctx.beginPath();
      ctx.roundRect(
        px - bgWidth / 2,
        py - bgHeight / 2,
        bgWidth,
        bgHeight,
        bgHeight / 2
      );
      ctx.fill();

      // Text
      ctx.fillStyle = label.color === "#ffffff" || label.color === "#eab308" ? "#000000" : "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.text, px, py);
    }
  }, [canvasSize, drawingData, activePoints, color, lineWidth, selectedId, toPixel]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Get mouse position relative to canvas
  const getCanvasPos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
      const canvas = canvasRef.current;
      if (!canvas) return [0, 0];
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    },
    []
  );

  // Hit test: find nearest line or label
  const hitTest = useCallback(
    (px: number, py: number): string | null => {
      const [rx, ry] = toProportional(px, py);
      const scale = canvasSize.width / 1000;
      const threshold = 15 / canvasSize.width; // 15px tolerance

      // Check labels first (on top)
      for (const label of [...drawingData.labels].reverse()) {
        const dx = Math.abs(label.x - rx);
        const dy = Math.abs(label.y - ry);
        const labelRadius = (label.fontSize * scale * 1.5) / canvasSize.width;
        if (dx < labelRadius && dy < labelRadius) {
          return label.id;
        }
      }

      // Check lines
      for (const line of [...drawingData.lines].reverse()) {
        for (let i = 0; i < line.points.length - 1; i++) {
          const [ax, ay] = line.points[i];
          const [bx, by] = line.points[i + 1];
          const dist = pointToSegmentDist(rx, ry, ax, ay, bx, by);
          if (dist < threshold) {
            return line.id;
          }
        }
      }

      return null;
    },
    [drawingData, toProportional, canvasSize]
  );

  // Handle canvas click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Ignore clicks that were part of a drag
      if (dragging) return;

      const [px, py] = getCanvasPos(e);

      if (tool === "polyline") {
        const [rx, ry] = toProportional(px, py);
        setActivePoints((prev) => [...prev, [rx, ry]]);
      } else if (tool === "label") {
        const [rx, ry] = toProportional(px, py);
        setPendingLabel({ x: rx, y: ry });
      } else if (tool === "select") {
        const id = hitTest(px, py);
        setSelectedId(id);
      }
    },
    [tool, getCanvasPos, toProportional, hitTest, dragging]
  );

  // Mouse down: start dragging a selected label
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool !== "select") return;
      const [px, py] = getCanvasPos(e);
      const id = hitTest(px, py);
      if (!id) return;

      // Check if it's a label
      const label = drawingData.labels.find((l) => l.id === id);
      if (!label) return;

      setSelectedId(id);
      setDragging(id);
      dragStartRef.current = { labelX: label.x, labelY: label.y };
    },
    [tool, getCanvasPos, hitTest, drawingData.labels]
  );

  // Mouse move: drag label
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging) return;
      const [px, py] = getCanvasPos(e);
      const [rx, ry] = toProportional(px, py);

      setDrawingData((prev) => ({
        ...prev,
        labels: prev.labels.map((l) =>
          l.id === dragging ? { ...l, x: rx, y: ry } : l
        ),
      }));
    },
    [dragging, getCanvasPos, toProportional]
  );

  // Mouse up: finish dragging
  const handleMouseUp = useCallback(() => {
    if (!dragging) return;

    // Check if label actually moved
    const label = drawingData.labels.find((l) => l.id === dragging);
    if (label && dragStartRef.current) {
      const moved =
        Math.abs(label.x - dragStartRef.current.labelX) > 0.001 ||
        Math.abs(label.y - dragStartRef.current.labelY) > 0.001;
      if (moved) {
        pushUndo();
        setDirty(true);
      }
    }

    setDragging(null);
    dragStartRef.current = null;
  }, [dragging, drawingData.labels, pushUndo]);

  // Handle double-click to finish polyline
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool === "polyline" && activePoints.length >= 2) {
        e.preventDefault();
        // Remove the last point added by the single click
        const points = activePoints.slice(0, -1);
        if (points.length >= 2) {
          pushUndo();
          const newLine: TopoLine = {
            id: generateId(),
            points,
            color,
            width: lineWidth,
          };
          setDrawingData((prev) => ({
            ...prev,
            lines: [...prev.lines, newLine],
          }));
          setDirty(true);
        }
        setActivePoints([]);
      }
    },
    [tool, activePoints, color, lineWidth, pushUndo]
  );

  // Confirm a label
  const confirmLabel = useCallback(
    (text: string) => {
      if (!pendingLabel || !text.trim()) {
        setPendingLabel(null);
        return;
      }
      pushUndo();
      const newLabel: TopoLabel = {
        id: generateId(),
        x: pendingLabel.x,
        y: pendingLabel.y,
        text: text.trim(),
        color,
        fontSize,
      };
      setDrawingData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel],
      }));
      setPendingLabel(null);
      setDirty(true);
    },
    [pendingLabel, color, fontSize, pushUndo]
  );

  // Delete selected element
  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    pushUndo();
    setDrawingData((prev) => ({
      lines: prev.lines.filter((l) => l.id !== selectedId),
      labels: prev.labels.filter((l) => l.id !== selectedId),
    }));
    setSelectedId(null);
    setDirty(true);
  }, [selectedId, pushUndo]);

  // Cancel active drawing
  const cancelActive = useCallback(() => {
    setActivePoints([]);
    setPendingLabel(null);
    setSelectedId(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && !(e.target instanceof HTMLInputElement)) {
          e.preventDefault();
          deleteSelected();
        }
      }
      if (e.key === "Escape") {
        cancelActive();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, deleteSelected, cancelActive, undo]);

  return {
    // Refs
    canvasRef,
    containerRef,
    // State
    tool,
    setTool,
    color,
    setColor,
    lineWidth,
    setLineWidth,
    fontSize,
    setFontSize,
    drawingData,
    activePoints,
    selectedId,
    pendingLabel,
    imageSize,
    canvasSize,
    imageUrl,
    dirty,
    undoStack,
    // Actions
    loadImage,
    loadDrawingData,
    handleClick,
    handleDoubleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    dragging,
    confirmLabel,
    deleteSelected,
    cancelActive,
    undo,
    toPixel,
    setDirty,
  };
}

// Point-to-line-segment distance
function pointToSegmentDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
