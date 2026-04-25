import React from "react";

const EARTH_VIDEO =
  "https://upload.wikimedia.org/wikipedia/commons/8/81/Rotating_Blue_Marble.webm";

export function TechGlobeBackdrop({
  globeOpacity = 0.25,
  globeYOffset = 0,
  gridOpacity = 0.06,
  ringOpacity = 0.6,
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: globeOpacity }}
      >
        {/* Ambient blur blobs */}
        <div className="absolute top-[-12%] left-[-8%] w-[68%] h-[68%] bg-red-600/14 blur-[170px] rounded-full" />
        <div className="absolute bottom-[-14%] right-[-8%] w-[58%] h-[58%] bg-blue-600/8 blur-[170px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_36%)]" />

        {/* Globe sphere */}
        <div
          className="absolute left-1/2 h-[48rem] w-[48rem] opacity-70"
          style={{
            top: "50%",
            transform: `translateX(-50%) translateY(calc(-54% + ${globeYOffset}px))`,
          }}
        >
          <div className="absolute inset-0 rounded-full border border-white/[0.12] shadow-[0_0_120px_-18px_rgba(255,255,255,0.18)]" />
          <div className="absolute inset-5 rounded-full border border-red-500/[0.22] shadow-[0_0_140px_-35px_rgba(220,38,38,0.8)]" />
          <div className="absolute inset-12 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.18),transparent_60%)]" />

          {/* Rotating Earth video clipped to sphere */}
          <div className="absolute inset-[13%] overflow-hidden rounded-full border border-white/10 shadow-[0_0_60px_-15px_rgba(255,255,255,0.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_60%_70%,rgba(220,38,38,0.14),transparent_35%)] mix-blend-screen z-10" />
            <video
              className="h-full w-full scale-[1.2] object-cover brightness-100 contrast-125 saturate-0 opacity-20"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src={EARTH_VIDEO}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(5,5,7,0.85)_100%)] z-10" />
          </div>

          {/* Latitude / longitude wireframe — spins 26 s */}
          <svg
            className="absolute inset-0 h-full w-full animate-[spin_26s_linear_infinite]"
            viewBox="0 0 600 600"
            fill="none"
          >
            <circle cx="300" cy="300" r="230" stroke="rgba(255,255,255,0.11)" strokeWidth="1.8" />
            <ellipse cx="300" cy="300" rx="230" ry="86"  stroke="rgba(255,255,255,0.14)" strokeWidth="1.4" />
            <ellipse cx="300" cy="300" rx="230" ry="150" stroke="rgba(220,38,38,0.2)"   strokeWidth="1.4" />
            <ellipse cx="300" cy="300" rx="230" ry="196" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
            <ellipse cx="300" cy="300" rx="88"  ry="230" stroke="rgba(255,255,255,0.14)" strokeWidth="1.4" />
            <ellipse cx="300" cy="300" rx="152" ry="230" stroke="rgba(220,38,38,0.2)"   strokeWidth="1.4" />
            <ellipse cx="300" cy="300" rx="196" ry="230" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
            <path d="M70 300H530"   stroke="rgba(255,255,255,0.14)" strokeWidth="1.3" strokeDasharray="8 10" />
            <path d="M300 70V530"   stroke="rgba(255,255,255,0.14)" strokeWidth="1.3" strokeDasharray="8 10" />
          </svg>

          {/* Geographic overlay — spins 36 s reverse */}
          <svg
            className="absolute inset-[8%] h-[84%] w-[84%] animate-[spin_36s_linear_infinite_reverse]"
            viewBox="0 0 400 400"
            fill="none"
          >
            <circle cx="200" cy="200" r="188" stroke="rgba(220,38,38,0.22)" strokeWidth="1.6" strokeDasharray="12 10" />
            <path d="M56 136C108 98 179 87 249 95C293 101 328 118 349 145"       stroke="rgba(255,255,255,0.18)" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M50 226C113 209 176 212 244 227C291 238 326 258 350 285"    stroke="rgba(220,38,38,0.24)"   strokeWidth="1.7" strokeLinecap="round" />
            <path d="M108 52C93 126 96 226 126 347"                              stroke="rgba(255,255,255,0.16)" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M268 48C291 128 294 217 271 350"                            stroke="rgba(220,38,38,0.24)"   strokeWidth="1.7" strokeLinecap="round" />
            <path d="M118 180C144 162 176 155 212 156C251 157 285 171 314 202"  stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="274" cy="120" r="6"   fill="rgba(248,250,252,0.82)" />
            <circle cx="142" cy="244" r="6"   fill="rgba(220,38,38,0.95)"  />
            <circle cx="238" cy="284" r="5.5" fill="rgba(248,250,252,0.78)" />
          </svg>

          {/* Orbiting glowing dots — spins 18 s */}
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
            <div className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_24px_rgba(220,38,38,0.85)]" />
            <div className="absolute right-12 top-[28%] h-3.5 w-3.5 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
            <div className="absolute bottom-14 left-20 h-3.5 w-3.5 rounded-full bg-red-400/85 shadow-[0_0_18px_rgba(248,113,113,0.7)]" />
            <div className="absolute left-10 top-1/2 h-3 w-3 rounded-full bg-white/65 shadow-[0_0_16px_rgba(255,255,255,0.35)]" />
          </div>

          {/* Pulsing outer halo */}
          <div className="absolute inset-[-4%] rounded-full border border-red-500/10 animate-[pulse_5s_ease-in-out_infinite]" />
        </div>

        {/* Far orbit ring */}
        <div
          className="absolute left-1/2 top-1/2 h-[54rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/[0.08]"
          style={{ opacity: ringOpacity }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/12 to-transparent h-[2px] w-full animate-[scan_4s_linear_infinite]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100vh); }
          to   { transform: translateY(100vh);  }
        }
      `}</style>
    </>
  );
}

export default TechGlobeBackdrop;
