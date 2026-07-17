'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/* ── Deterministic star generator (avoids hydration mismatch) ── */
function makeStars(n, seed = 42) {
  const out = [];
  let s = seed;
  const next = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  for (let i = 0; i < n; i++) {
    out.push({
      x: next() * 100, y: next() * 100,
      size: next() * 2.5 + 0.5,
      opacity: next() * 0.7 + 0.3,
      dur: next() * 4 + 2,
      delay: next() * 5,
    });
  }
  return out;
}

/* ── Star Layer ── */
function Stars({ count, seed, className }) {
  const stars = useMemo(() => makeStars(count, seed), [count, seed]);
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      {stars.map((s, i) => (
        <div key={i} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          opacity: s.opacity,
          '--dur': `${s.dur}s`, '--delay': `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Gradient Orb ── */
function Orb({ color, size, top, left, delay = 0 }) {
  return (
    <div className="orb" style={{
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      width: size, height: size, top, left,
      animationDelay: `${delay}s`,
    }} />
  );
}

/* ── Animated Counter ── */
function Counter({ target, label, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-7xl font-extrabold gradient-text-violet" style={{ animation: 'counter-glow 3s ease-in-out infinite' }}>
        {val}{suffix}
      </div>
      <div className="mt-3 text-sm md:text-base uppercase tracking-[0.25em] text-gray-400 font-medium">{label}</div>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: false, margin: '-80px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass glass-hover rounded-3xl p-8 md:p-10 transition-all duration-500 group cursor-default"
    >
      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}

/* ── Geometric Shape ── */
function Shape({ type, size, color, top, left, delay = 0, speed = 'slow' }) {
  const cls = speed === 'slow' ? 'floating' : 'floating-reverse';
  const style = {
    position: 'absolute', top, left, width: size, height: size,
    animationDelay: `${delay}s`,
    border: `1.5px solid ${color}`,
    opacity: 0.25,
  };
  if (type === 'circle') return <div className={cls} style={{ ...style, borderRadius: '50%' }} />;
  if (type === 'diamond') return <div className={cls} style={{ ...style, transform: 'rotate(45deg)' }} />;
  return <div className={cls} style={{ ...style, borderRadius: '4px' }} />;
}

/* ════════════════════════════════════════════
   MAIN PARALLAX PAGE
   ════════════════════════════════════════════ */
export default function ParallaxPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 28, restDelta: 0.0005 });

  /* ── Background layer transforms ── */
  const starsSlowY  = useTransform(smooth, [0, 1], ['0%', '25%']);
  const starsMidY   = useTransform(smooth, [0, 1], ['0%', '45%']);
  const starsFastY  = useTransform(smooth, [0, 1], ['0%', '70%']);
  const orbY        = useTransform(smooth, [0, 1], ['0%', '35%']);

  /* ── Hero transforms ── */
  const heroY       = useTransform(smooth, [0, 0.15], ['0%', '-60%']);
  const heroOpacity = useTransform(smooth, [0, 0.12], [1, 0]);
  const heroScale   = useTransform(smooth, [0, 0.15], [1, 0.85]);

  /* ── Section 2 ── */
  const s2Scale     = useTransform(smooth, [0.1, 0.22], [0.88, 1]);
  const s2Opacity   = useTransform(smooth, [0.1, 0.22], [0, 1]);
  const s2LeftX     = useTransform(smooth, [0.1, 0.25], ['-80px', '0px']);
  const s2RightX    = useTransform(smooth, [0.1, 0.25], ['80px', '0px']);

  /* ── Section 3 cards ── */
  const s3Opacity   = useTransform(smooth, [0.28, 0.38], [0, 1]);

  /* ── Section 4 horizontal ── */
  const s4X         = useTransform(smooth, [0.5, 0.7], ['60%', '-10%']);
  const s4Opacity   = useTransform(smooth, [0.48, 0.55], [0, 1]);

  /* ── Section 5 stats ── */
  const s5Scale     = useTransform(smooth, [0.7, 0.8], [0.9, 1]);
  const s5Opacity   = useTransform(smooth, [0.7, 0.8], [0, 1]);

  /* ── Section 6 CTA ── */
  const ctaScale    = useTransform(smooth, [0.85, 0.95], [0.92, 1]);
  const ctaOpacity  = useTransform(smooth, [0.85, 0.95], [0, 1]);

  return (
    <main ref={containerRef} className="relative bg-[#030014] text-white" style={{ height: '600vh' }}>

      {/* ╔══════════════════════════════════════╗
          ║   FIXED BACKGROUND LAYERS           ║
          ╚══════════════════════════════════════╝ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Star layers */}
        <motion.div style={{ y: starsSlowY }} className="absolute inset-0 will-change-transform">
          <Stars count={180} seed={1} />
        </motion.div>
        <motion.div style={{ y: starsMidY }} className="absolute inset-0 will-change-transform">
          <Stars count={90} seed={200} />
        </motion.div>
        <motion.div style={{ y: starsFastY }} className="absolute inset-0 will-change-transform">
          <Stars count={40} seed={500} />
        </motion.div>

        {/* Gradient orbs */}
        <motion.div style={{ y: orbY }} className="absolute inset-0 will-change-transform">
          <Orb color="rgba(139,92,246,0.3)" size="600px" top="-10%" left="-10%" delay={0} />
          <Orb color="rgba(6,182,212,0.2)" size="500px" top="30%" left="70%" delay={2} />
          <Orb color="rgba(244,114,182,0.15)" size="450px" top="60%" left="20%" delay={4} />
          <Orb color="rgba(251,191,36,0.1)" size="350px" top="80%" left="60%" delay={1} />
        </motion.div>

        {/* Geometric shapes */}
        <Shape type="circle" size="80px" color="rgba(139,92,246,0.4)" top="15%" left="8%" delay={0} />
        <Shape type="diamond" size="40px" color="rgba(6,182,212,0.4)" top="25%" left="85%" delay={1} speed="reverse" />
        <Shape type="square" size="50px" color="rgba(244,114,182,0.3)" top="55%" left="92%" delay={2} />
        <Shape type="circle" size="60px" color="rgba(251,191,36,0.3)" top="70%" left="5%" delay={3} speed="reverse" />
        <Shape type="diamond" size="35px" color="rgba(139,92,246,0.3)" top="40%" left="50%" delay={0.5} />
        <Shape type="circle" size="25px" color="rgba(6,182,212,0.5)" top="85%" left="75%" delay={1.5} />
      </div>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 1 — HERO                  ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="fixed inset-0 flex flex-col items-center justify-center px-6"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale, zIndex: 10 }}
      >
        {/* Decorative ring */}
        <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-white/[0.04]" style={{ animation: 'gradient-rotate 30s linear infinite' }}>
          <div className="absolute -top-1 left-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
        </div>
        <div className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-white/[0.03]" style={{ animation: 'gradient-rotate 20s linear reverse infinite' }}>
          <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter text-center leading-none"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 50%, rgba(139,92,246,0.4) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          PARALLAX
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 md:mt-6 text-lg md:text-2xl text-center font-light tracking-[0.2em] uppercase"
          style={{ color: 'rgba(165,180,252,0.7)' }}
        >
          An Interactive Scrolling Experience
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 flex flex-col items-center gap-2"
          style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 2 — DEPTH INTRO           ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="absolute w-full flex items-center justify-center px-6 md:px-12"
        style={{ top: '110vh', minHeight: '100vh', scale: s2Scale, opacity: s2Opacity, zIndex: 20 }}
      >
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div style={{ x: s2LeftX }}>
            <span className="text-xs tracking-[0.3em] uppercase text-violet-400 font-semibold">Depth & Motion</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold leading-tight gradient-text-violet">
              Creating Immersive Depth
            </h2>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
              Parallax scrolling transforms a flat page into a living, breathing canvas. 
              Background and foreground elements dance at different velocities, crafting 
              an illusion of three-dimensional space that draws you deeper into the experience.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="glass rounded-2xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-xs text-gray-500 mt-1">Layers</div>
              </div>
              <div className="glass rounded-2xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-white">60fps</div>
                <div className="text-xs text-gray-500 mt-1">Smooth</div>
              </div>
              <div className="glass rounded-2xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-xs text-gray-500 mt-1">Depth</div>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ x: s2RightX }} className="relative">
            {/* Stacked glass cards showing depth */}
            <div className="relative h-[400px] md:h-[450px]">
              <div className="absolute inset-0 glass rounded-3xl transform rotate-3 translate-x-4 translate-y-4 opacity-30" />
              <div className="absolute inset-0 glass rounded-3xl transform -rotate-1 translate-x-2 translate-y-2 opacity-50" />
              <div className="absolute inset-0 glass rounded-3xl overflow-hidden shimmer-border">
                <div className="p-8 md:p-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <pre className="text-sm text-gray-300 font-mono leading-loose">
{`const { scrollY } = useScroll()

const bgSpeed  = useTransform(
  scrollY, [0, 1], ["0%", "25%"]
)
const fgSpeed  = useTransform(
  scrollY, [0, 1], ["0%", "70%"]
)

// Depth = speed difference`}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>parallax.js — live</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 3 — FEATURES              ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="absolute w-full flex flex-col items-center justify-center px-6 md:px-12"
        style={{ top: '220vh', minHeight: '100vh', opacity: s3Opacity, zIndex: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-cyan-400 font-semibold">What Makes It Special</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold gradient-text-cyan">Core Principles</h2>
        </motion.div>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon="🌌"
            title="Multi-Layer Depth"
            desc="Three distinct star layers, gradient orbs, and geometric shapes all moving at unique velocities create a convincing 3D space."
            delay={0}
          />
          <FeatureCard
            icon="⚡"
            title="Spring Physics"
            desc="Every motion is powered by spring-based interpolation — no linear easing. The result is organic, fluid movement that feels alive."
            delay={0.15}
          />
          <FeatureCard
            icon="✨"
            title="Micro-Animations"
            desc="Twinkling stars, pulsing orbs, floating shapes, and shimmer effects add ambient life to every pixel of the experience."
            delay={0.3}
          />
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
          <FeatureCard
            icon="🎨"
            title="Glassmorphism Design"
            desc="Frosted glass surfaces with subtle borders and backdrop blur create an ethereal, premium aesthetic that layers beautifully over the parallax background."
            delay={0.1}
          />
          <FeatureCard
            icon="🚀"
            title="GPU Accelerated"
            desc="All transforms use will-change and composite-only properties (transform, opacity) ensuring silky 60fps performance even on complex layouts."
            delay={0.2}
          />
        </div>
      </motion.section>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 4 — HORIZONTAL SHOWCASE   ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="absolute w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ top: '340vh', minHeight: '100vh', opacity: s4Opacity, zIndex: 20 }}
      >
        <div className="text-center mb-12 px-6">
          <span className="text-xs tracking-[0.3em] uppercase text-pink-400 font-semibold">Scroll-Driven Motion</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold" style={{
            background: 'linear-gradient(135deg, #f472b6, #c084fc, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Horizontal Parallax
          </h2>
          <p className="mt-4 text-gray-400 max-w-lg mx-auto">
            Vertical scrolling drives horizontal motion — another dimension of depth.
          </p>
        </div>

        <motion.div
          className="flex gap-6 md:gap-8 px-6"
          style={{ x: s4X }}
        >
          {[
            { title: 'Layer 1: Stars', sub: 'Speed: 25%', color: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/20' },
            { title: 'Layer 2: Nebula', sub: 'Speed: 45%', color: 'from-cyan-500/20 to-blue-600/20', border: 'border-cyan-500/20' },
            { title: 'Layer 3: Dust', sub: 'Speed: 70%', color: 'from-pink-500/20 to-rose-600/20', border: 'border-pink-500/20' },
            { title: 'Layer 4: Text', sub: 'Speed: 100%', color: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/20' },
            { title: 'Layer 5: Shapes', sub: 'Speed: 130%', color: 'from-emerald-500/20 to-teal-600/20', border: 'border-emerald-500/20' },
          ].map((item, i) => (
            <div key={i} className={`shrink-0 w-[260px] md:w-[300px] h-[320px] md:h-[360px] rounded-3xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm p-8 flex flex-col justify-end`}>
              <div className="text-6xl font-black text-white/10 mb-4">0{i + 1}</div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{item.sub}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 5 — STATS                 ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="absolute w-full flex flex-col items-center justify-center px-6"
        style={{ top: '450vh', minHeight: '80vh', scale: s5Scale, opacity: s5Opacity, zIndex: 20 }}
      >
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-semibold">By The Numbers</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold gradient-text-warm">Performance Metrics</h2>
        </div>

        <div className="max-w-4xl w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <Counter target={310} label="Stars Rendered" suffix="+" />
          <Counter target={5} label="Parallax Layers" />
          <Counter target={60} label="Frames / Second" suffix="fps" />
          <Counter target={100} label="CSS Powered" suffix="%" />
        </div>

        {/* Decorative divider */}
        <div className="mt-16 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </motion.section>

      {/* ╔══════════════════════════════════════╗
          ║   SECTION 6 — CTA / FOOTER          ║
          ╚══════════════════════════════════════╝ */}
      <motion.section
        className="absolute w-full flex flex-col items-center justify-center px-6"
        style={{ top: '520vh', minHeight: '80vh', scale: ctaScale, opacity: ctaOpacity, zIndex: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: false }}
          className="text-center max-w-3xl"
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none" style={{
            background: 'linear-gradient(135deg, #ffffff 30%, #c084fc 60%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Experience Complete
          </h2>
          <p className="mt-6 md:mt-8 text-gray-400 text-lg md:text-xl leading-relaxed">
            You&apos;ve scrolled through five parallax layers, spring-driven physics, 
            glassmorphism surfaces, and hundreds of animated stars. 
            This is what depth feels like.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(139,92,246,0.5), 0 0 100px rgba(6,182,212,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 md:mt-12 px-12 py-5 rounded-full font-semibold text-lg text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(6,182,212,0.15)',
            }}
          >
            Back to Top ↑
          </motion.button>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-600">
            <span>Framer Motion</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Next.js</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Tailwind CSS</span>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Fixed scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{
          scaleX: smooth,
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #f472b6)',
        }}
      />
    </main>
  );
}
