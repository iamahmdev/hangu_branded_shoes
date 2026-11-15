import React, { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
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
  initialAutoRotate = true,
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

  // Drag tracking refs
  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
  });

  // Smooth ambient float animation (gentle luxury pendulum tilt)
  // Instead of a flat 360 spin that flips the 2D photo into a thin line and reversed mirror,
  // this smoothly glides the shoe between -18° and +18° yaw, and -6° and +6° pitch
  useEffect(() => {
    let animId: number;
    if (isAutoRotating && !isDragging) {
      const startTime = performance.now();
      const step = (time: number) => {
        const elapsed = (time - startTime) * 0.0012;
        const targetY = Math.sin(elapsed) * 18;
        const targetX = Math.cos(elapsed * 0.75) * 6;
        setRotY(targetY);
        setRotX(targetX);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAutoRotating, isDragging]);

  // Pointer Down (Touch & Mouse)
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
      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Pointer Move (Smooth Clamped Tilt)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    // Mobile-tuned sensitivity: clamped to prevent 2D photo flipping/collapsing
    const nextRotY = Math.max(-38, Math.min(38, dragStart.current.rotY + deltaX * 0.35));
    const nextRotX = Math.max(-20, Math.min(20, dragStart.current.rotX - deltaY * 0.25));

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

  // Reset to neutral angle
  const handleReset = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.8, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.85, prev - 0.2));
  };

  // Dynamic studio lighting reflection overlay
  const glareX = 50 + rotY * 1.2;
  const glareY = 50 + rotX * 1.5;

  return (
    <div
      className={`relative w-full h-full select-none flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fbfbfd] via-[#f1f1f4] to-[#e7e7eb] ${className}`}
    >
      {/* 3D Interactive Stage / Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ perspective: 1200 }}
      >
        {/* Dynamic 3D Shoe Container */}
        <div
          className="relative transition-transform duration-75 ease-out will-change-transform flex items-center justify-center"
          style={{
            transform: `perspective(1200px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${zoom})`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Real Shoe Image with 3D Depth & Glare */}
          <div className="relative flex items-center justify-center p-3 sm:p-5">
            <img
              src={resolveProductImage(img)}
              alt={name}
              draggable={false}
              className="max-h-[58vh] max-w-[84vw] sm:max-h-[400px] object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.18)] pointer-events-none select-none transition-all duration-75"
            />

            {/* Realistic Studio Lighting Reflection */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-35 transition-all duration-75 rounded-2xl"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)`,
              }}
            />
          </div>

          {/* Dynamic 3D Ground Shadow */}
          <div
            className="absolute -bottom-4 sm:-bottom-6 w-3/4 h-6 sm:h-8 rounded-full pointer-events-none blur-md transition-all duration-75"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 70%)",
              transform: `scaleX(${1 + Math.abs(rotY) / 100}) skewX(${rotY * 0.22}deg)`,
              opacity: Math.max(0.18, 0.48 - Math.abs(rotX) / 100),
            }}
          />
        </div>

        {/* HUD Info Badge: Top Left */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoRotating ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            3D Depth • {rotY > 0 ? `+${Math.round(rotY)}°` : `${Math.round(rotY)}°`}
          </span>
          {zoom !== 1 && (
            <span className="px-2 py-0.5 rounded-full bg-zinc-950/70 backdrop-blur-md text-zinc-300 text-[10px] font-mono border border-white/10">
              {Math.round(zoom * 100)}%
            </span>
          )}
        </div>

        {/* Touch / Interaction Hint (Disappears once interacted) */}
        {!hasInteracted && !isDragging && (
          <div className="absolute top-3 right-3 sm:top-auto sm:bottom-14 sm:left-1/2 sm:-translate-x-1/2 z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10 shadow-lg pointer-events-none animate-pulse">
            <Move size={12} className="text-emerald-400 shrink-0" />
            <span>Swipe to tilt 3D</span>
          </div>
        )}

        {/* Floating Glassmorphism Toolbar (Bottom Overlay) */}
        {showControls && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-zinc-950/80 backdrop-blur-md text-white rounded-full border border-white/15 shadow-xl">
            {/* Auto-Float Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsAutoRotating(!isAutoRotating);
                setHasInteracted(true);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isAutoRotating
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-white/10 hover:bg-white/20 text-zinc-200"
              }`}
              title={isAutoRotating ? "Pause 3D Float" : "Resume 3D Float"}
            >
              {isAutoRotating ? <Pause size={11} /> : <Play size={11} />}
              <span>{isAutoRotating ? "Float ON" : "Float"}</span>
            </button>

            {/* Reset Angle */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              title="Reset 3D Angle"
            >
              <RotateCcw size={12} />
            </button>

            {/* Zoom In / Out Controls */}
            {allowZoom && (
              <>
                <div className="w-px h-3.5 bg-white/20 mx-0.5" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.85}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 1.8}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={12} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
