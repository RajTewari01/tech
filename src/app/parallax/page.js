'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function NeoParallaxPage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Floating shapes parallax
  const yFast = useTransform(smoothProgress, [0, 1], ['0%', '-300%']);
  const yMedium = useTransform(smoothProgress, [0, 1], ['0%', '-150%']);
  const ySlow = useTransform(smoothProgress, [0, 1], ['0%', '-50%']);
  const yReverse = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const rotateFast = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotateSlow = useTransform(smoothProgress, [0, 1], [0, -180]);

  // Section specific triggers
  const heroTextX = useTransform(smoothProgress, [0, 0.2], ['0%', '-20%']);
  const heroImgScale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);

  const cardsX = useTransform(smoothProgress, [0.1, 0.4], ['50%', '0%']);
  
  return (
    <main ref={containerRef} className="relative bg-grid text-black overflow-hidden selection:bg-black selection:text-white" style={{ height: '400vh' }}>
      
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full bg-[#FFFDF7] brutal-border border-b-4 border-black z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brutal-yellow brutal-border flex items-center justify-center font-bold text-xl">
            ▲
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Techfest</span>
        </div>
        <div className="hidden md:flex gap-8 font-bold uppercase text-sm">
          <a href="#" className="hover:underline decoration-4 underline-offset-4">Accommodation</a>
          <a href="#" className="hover:underline decoration-4 underline-offset-4">Workshops</a>
          <a href="#" className="hover:underline decoration-4 underline-offset-4">Competitions</a>
        </div>
        <button className="bg-brutal-pink px-6 py-2 font-black uppercase tracking-wider brutal-btn">
          Sign In
        </button>
      </nav>

      {/* ── Global Floating Decor ── */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <motion.div style={{ y: yFast, rotate: rotateFast }} className="absolute top-[20%] left-[10%] w-24 h-24 bg-brutal-yellow brutal-border rounded-full flex items-center justify-center text-4xl font-bold">
          *
        </motion.div>
        <motion.div style={{ y: yMedium, rotate: rotateSlow }} className="absolute top-[50%] right-[15%] w-32 h-12 bg-brutal-pink brutal-border skew-x-12" />
        <motion.div style={{ y: yReverse, rotate: rotateFast }} className="absolute top-[80%] left-[8%] w-16 h-16 bg-brutal-cyan brutal-border transform rotate-45" />
        <motion.div style={{ y: ySlow }} className="absolute top-[30%] right-[5%] text-[8rem] font-black opacity-20">
          !
        </motion.div>
      </div>

      {/* ── Section 1: Hero ── */}
      <section className="fixed inset-0 flex flex-col justify-center px-6 md:px-16 pt-24 z-0">
        <motion.div style={{ x: heroTextX, scale: heroImgScale }} className="max-w-5xl">
          <h1 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            <span className="block text-[#FFFDF7]" style={{ WebkitTextStroke: '3px black' }}>Interactive</span>
            <span className="block">Techfest</span>
            <span className="block bg-brutal-yellow inline-block px-4 border-4 border-black">Experience</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl border-l-8 border-brutal-pink pl-6 mt-12 bg-white/80 p-4 brutal-border">
            Framer Motion combined with Neo-Brutalism creates unforgettable user experiences. Scroll down to see it in action.
          </p>
        </motion.div>
      </section>

      {/* ── Section 2: Marquee ── */}
      <motion.div 
        className="absolute top-[100vh] w-full bg-brutal-cyan border-y-4 border-black py-4 z-20 overflow-hidden flex whitespace-nowrap"
      >
        <div className="animate-marquee flex gap-12 items-center text-4xl font-black uppercase tracking-widest">
          <span>PARALLAX EFFECTS</span>
          <span>✦</span>
          <span>NEO-BRUTALISM</span>
          <span>✦</span>
          <span>FRAMER MOTION</span>
          <span>✦</span>
          <span>PARALLAX EFFECTS</span>
          <span>✦</span>
          <span>NEO-BRUTALISM</span>
          <span>✦</span>
          <span>FRAMER MOTION</span>
          <span>✦</span>
          <span>PARALLAX EFFECTS</span>
          <span>✦</span>
          <span>NEO-BRUTALISM</span>
          <span>✦</span>
          <span>FRAMER MOTION</span>
          <span>✦</span>
        </div>
      </motion.div>

      {/* ── Section 3: Cards ── */}
      <section className="absolute top-[120vh] w-full min-h-screen z-20 px-6 md:px-16 py-24 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            viewport={{ once: false, margin: "-100px" }}
            className="bg-brutal-pink p-8 md:p-12 brutal-border brutal-shadow-lg"
          >
            <div className="text-6xl font-black mb-6">01</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Raw & Unpolished</h2>
            <p className="text-lg md:text-xl font-bold leading-relaxed bg-[#FFFDF7] p-6 brutal-border">
              Embrace flat colors, harsh borders, and heavy shadows. Neo-brutalism strips away the subtle gradients and blurred shadows of modern UI to deliver a striking, rebellious aesthetic.
            </p>
          </motion.div>

          <motion.div 
            style={{ x: cardsX }}
            className="bg-brutal-yellow p-8 md:p-12 brutal-border brutal-shadow-lg md:mt-24"
          >
            <div className="text-6xl font-black mb-6">02</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Fluid Motion</h2>
            <p className="text-lg md:text-xl font-bold leading-relaxed bg-[#FFFDF7] p-6 brutal-border">
              The starkness of the design is perfectly balanced by the fluidity of Framer Motion. By animating raw structural elements, we create tension that makes the page feel alive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4: CTA ── */}
      <section className="absolute top-[280vh] w-full min-h-screen z-20 px-6 md:px-16 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          className="bg-white brutal-border p-12 md:p-24 w-full max-w-5xl brutal-shadow text-center relative overflow-hidden"
        >
          {/* Background striped pattern inside the card */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }}></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-6">Ready to Ship?</h2>
            <p className="text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto">
              You've seen the layout, you've felt the parallax. It's time to submit your Neo-Brutalist creation.
            </p>
            <button className="bg-brutal-green text-3xl md:text-5xl px-12 py-6 font-black uppercase tracking-wider brutal-btn w-full md:w-auto">
              Submit Task
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="absolute bottom-0 w-full bg-black text-white px-6 py-12 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center font-bold uppercase">
          <div className="text-4xl font-black tracking-tighter mb-6 md:mb-0">Techfest</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brutal-pink">Instagram</a>
            <a href="#" className="hover:text-brutal-cyan">Twitter</a>
            <a href="#" className="hover:text-brutal-yellow">LinkedIn</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
