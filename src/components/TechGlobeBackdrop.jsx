import React from "react";

export function TechGlobeBackdrop({
  globeScale = 1.16,
  globeOpacity = 0.18,
  globeYOffset = 20,
  gridOpacity = 0.05,
  ringOpacity = 0.12,
  scanLine = true,
}) {
  const globeTransform = `translate(-50%, calc(-50% + ${globeYOffset}px)) scale(${globeScale})`;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <div className="absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute left-[14%] top-[18%] h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute right-[12%] top-[14%] h-80 w-80 rounded-full bg-red-500/8 blur-[100px]" />

        <div
          className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem]"
          style={{ transform: globeTransform, opacity: globeOpacity }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 800 800" className="h-full w-full">
            <defs>
              <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
                <stop offset="55%" stopColor="rgba(220,38,38,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            <circle cx="400" cy="400" r="284" fill="url(#globeGlow)" />
            <circle cx="400" cy="400" r="278" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="218" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="8 10" />
            <circle cx="400" cy="400" r="160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {[
              [278, 278],
              [224, 278],
              [164, 278],
              [98, 278],
            ].map(([rx, ry]) => (
              <ellipse key={`v-${rx}`} cx="400" cy="400" rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
            ))}

            {[278, 230, 176, 116, 58].map((ry) => (
              <ellipse key={`h-${ry}`} cx="400" cy="400" rx="278" ry={ry} fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
            ))}

            {[
              [260, 318], [520, 280], [340, 438], [598, 420], [240, 505], [430, 220], [348, 608], [560, 540],
            ].map(([cx, cy], index) => (
              <g key={`node-${index}`}>
                <circle cx={cx} cy={cy} r="3.5" fill="rgba(248,113,113,0.9)" />
                <circle cx={cx} cy={cy} r="12" fill="none" stroke="rgba(248,113,113,0.22)" strokeWidth="1" />
              </g>
            ))}
          </svg>
        </div>

        <div className="absolute left-1/2 top-1/2 h-[62rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" style={{ opacity: ringOpacity }} />
        <div className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/15 border-dashed animate-[spin_42s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 animate-[spin_30s_linear_infinite_reverse]" />

        {scanLine ? <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-[tech-globe-scan_6s_linear_infinite]" /> : null}

        <div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-transparent to-black/72" />
      </div>

      <style>{`
        @keyframes tech-globe-scan {
          0% { transform: translateY(-10vh); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>
    </>
  );
}

export default TechGlobeBackdrop;
