import { useEffect, useRef } from "react";

export default function WaveBackground({ children, waveCount = 6, yRatioMin = 0.20, yRatioMax = 0.75 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999, inside: false });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;
    let t = 0;

    const waves = Array.from({ length: waveCount }, (_, i) => {
      const phaseStep = (Math.PI * 2 / waveCount) * i;
      const yRatio = yRatioMin + (i / (waveCount - 1)) * (yRatioMax - yRatioMin);
      const opacity = 0.30 + (i / (waveCount - 1)) * 0.35;
      return {
        phase: phaseStep,
        amp: 25 + i * 6,
        speed: 0.007 + i * 0.001,
        yRatio,
        opacity,
      };
    });

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      t += 1;

      waves.forEach((w) => {
        w.phase += w.speed;
        ctx.beginPath();
        ctx.moveTo(0, w.yRatio * H);
        for (let x = 0; x <= W; x += 4) {
          const y = w.yRatio * H + Math.sin((x / W) * Math.PI * 3 + w.phase) * w.amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${w.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Spotlight on hover
      const { x, y, inside } = mouseRef.current;
      if (inside) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 160);
        grad.addColorStop(0, "rgba(255,255,255,0.18)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.06)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(loop);
    }

    resize();
    loop();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  }

  function handleMouseLeave() {
    mouseRef.current.inside = false;
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      inside: true,
    };
  }

  function handleTouchEnd() {
    mouseRef.current.inside = false;
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      style={{ backgroundColor: "#2264c0" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Konten di atas canvas */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}