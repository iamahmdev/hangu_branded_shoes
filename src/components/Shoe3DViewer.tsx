import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Move,
} from "lucide-react";
import { resolveProductImage } from "../utils/image";

interface Shoe3DViewerProps {
  img: string;
  name: string;
  className?: string;
  initialAutoRotate?: boolean;
  allowZoom?: boolean;
  showControls?: boolean;
}

export default function Shoe3DViewer({
  img,
  name,
  className = "",
  initialAutoRotate = false,
  allowZoom = true,
  showControls = true,
}: Shoe3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D rotation state (in degrees)
  const [rotX, setRotX] = useState<number>(0);
  const [rotY, setRotY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(initialAutoRotate);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Drag tracking refs (avoid rerendering during fast mouse drag)
  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
  });

  // Auto-rotate requestAnimationFrame loop
  useEffect(() => {
    let animId: number;
    if (isAutoRotating && !isDragging) {
      const step = () => {
        setRotY((prev) => (prev + 0.8) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAutoRotating, isDragging]);

  // Pointer Down (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY,
    };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    // Sensible rotation sensitivity: 0.5 deg per pixel
    const nextRotY = (dragStart.current.rotY + deltaX * 0.6) % 360;
    // Constrain pitch (X-axis tilt) to natural range (-35deg to +35deg)
    const nextRotX = Math.max(-35, Math.min(35, dragStart.current.rotX - deltaY * 0.4));

    setRotY(nextRotY);
    setRotX(nextRotX);
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Reset to default angle
  const handleReset = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.2, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.85, prev - 0.25));
  };

  // Format angle for HUD badge
  const displayAngle = Math.round(((rotY % 360) + 360) % 360);

  // Lighting reflection gradient shifts with rotation
  const glareX = 50 + (rotY % 180) * 0.4;
  const glareY = 50 + rotX * 0.8;

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {/* 3D Stage / Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ perspective: 1100 }}
      >
        {/* Dynamic 3D Shoe Container */}
        <div
          className="relative transition-transform duration-75 ease-out will-change-transform flex items-center justify-center"
          style={{
            transform: `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Real Shoe Image with 3D Depth */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
            <img
              src={resolveProductImage(img)}
              alt={name}
              draggable={false}
              className="max-h-[85vh] max-w-[85vw] md:max-h-[500px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] pointer-events-none transition-all duration-150"
            />

            {/* Specular Glare / Realistic Studio Lighting Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 transition-all duration-75"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
              }}
            />
          </div>

          {/* Dynamic 3D Ground Shadow that responds to rotation */}
          <div
            className="absolute -bottom-8 w-3/4 h-8 rounded-full pointer-events-none blur-md transition-all duration-75"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
              transform: `scaleX(${1 + Math.abs(rotY % 180 - 90) / 200}) skewX(${rotY * 0.15}deg)`,
              opacity: Math.max(0.2, 0.55 - Math.abs(rotX) / 100),
            }}
          />
        </div>

        {/* HUD Info Badge: Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3D Rotate • {displayAngle}°
          </span>
          {zoom !== 1 && (
            <span className="px-2.5 py-1 rounded-full bg-zinc-950/70 backdrop-blur-md text-zinc-300 text-[10px] font-mono border border-white/10">
              {Math.round(zoom * 100)}%
            </span>
          )}
        </div>

        {/* Interaction Hint (Fades out after user first touches) */}
        {!hasInteracted && !isAutoRotating && (
          <div className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-zinc-900/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/10 shadow-xl pointer-events-none animate-bounce">
            <Move size={14} className="text-emerald-400" />
            <span>Drag mouse or swipe to rotate 360°</span>
          </div>
        )}
      </div>

      {/* 3D Control Toolbar (Bottom) */}
      {showControls && (
        <div className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border-t border-zinc-200/80 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            {/* Auto-Rotate Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsAutoRotating(!isAutoRotating);
                setHasInteracted(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isAutoRotating
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200"
              }`}
              title={isAutoRotating ? "Pause 3D Spin" : "Auto Spin 360°"}
            >
              {isAutoRotating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoRotating ? "Auto Spin: ON" : "Auto Spin"}</span>
            </button>

            {/* Reset Angle */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 transition-colors"
              title="Reset 3D Angle"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Zoom In / Out Controls */}
          {allowZoom && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.85}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 2.2}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

