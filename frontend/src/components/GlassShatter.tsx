import { useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh, Object3D, WebGLRenderer } from 'three';
import type { SiteTheme } from '../siteTheme';

/** Frost on the “BREAK THROUGH” overlay — increase for stronger blur */
const BREAKTHROUGH_OVERLAY_BLUR_PX = 15;

interface Crack {
  id: number;
  x: number;
  y: number;
  lines: { x1: number; y1: number; x2: number; y2: number }[];
}

function crackRng(seed: number) {
  let s = Math.floor(Math.abs(seed)) % 2147483646 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Branching, irregular cracks + radial stress lines — reads more like real glass fracture */
function generateRealisticCrackNetwork(cx: number, cy: number, seed: number, maxLen: number) {
  const rand = crackRng(seed);
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const rays = 8 + Math.floor(rand() * 6);
  for (let r = 0; r < rays; r++) {
    const baseAngle = (r / rays) * Math.PI * 2 + (rand() - 0.5) * 0.4;
    let x = cx;
    let y = cy;
    let curAngle = baseAngle;
    const segments = 6 + Math.floor(rand() * 5);
    for (let s = 0; s < segments; s++) {
      const segLen = (maxLen / segments) * (0.45 + rand() * 0.75);
      curAngle += (rand() - 0.5) * 0.65;
      const nx = x + Math.cos(curAngle) * segLen;
      const ny = y + Math.sin(curAngle) * segLen;
      lines.push({ x1: x, y1: y, x2: nx, y2: ny });
      if (s > 1 && rand() > 0.68) {
        const branch = curAngle + (rand() > 0.5 ? 0.85 : -0.85) + (rand() - 0.5) * 0.35;
        const bl = segLen * (0.32 + rand() * 0.45);
        lines.push({ x1: x, y1: y, x2: x + Math.cos(branch) * bl, y2: y + Math.sin(branch) * bl });
      }
      x = nx;
      y = ny;
    }
  }
  const micro = 10 + Math.floor(rand() * 10);
  for (let m = 0; m < micro; m++) {
    const len = maxLen * (0.08 + rand() * 0.22);
    const ang = rand() * Math.PI * 2;
    const mx = cx + Math.cos(ang) * len * (0.2 + rand() * 0.5);
    const my = cy + Math.sin(ang) * len * (0.2 + rand() * 0.5);
    lines.push({ x1: cx, y1: cy, x2: mx, y2: my });
  }
  return lines;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AC();
  }
  return sharedAudioCtx;
}

/** Short synthesized glass crack — no external assets */
function playGlassCrack(phase: 1 | 2) {
  const ctx = getAudioContext();
  void ctx.resume();

  const duration = phase === 1 ? 0.11 : 0.16;
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  const decay = phase === 1 ? 62 : 48;
  const noiseGain = phase === 1 ? 0.42 : 0.48;
  const ringHz = 2600 + phase * 350;

  for (let i = 0; i < sampleCount; i++) {
    const t = i / ctx.sampleRate;
    const env = Math.exp(-t * decay);
    const noise = (Math.random() * 2 - 1) * noiseGain;
    const ring = Math.sin(2 * Math.PI * ringHz * t) * Math.exp(-t * 95) * 0.38;
    const crackle = Math.sin(2 * Math.PI * (7200 + Math.random() * 400) * t) * Math.exp(-t * 120) * 0.12;
    data[i] = (noise + ring + crackle) * env * 0.9;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 750;
  const bp = ctx.createBiquadFilter();
  bp.type = 'peaking';
  bp.frequency.value = 3200;
  bp.Q.value = 0.6;
  bp.gain.value = phase === 2 ? 4 : 2;
  const gain = ctx.createGain();
  gain.gain.value = 0.52 + phase * 0.06;
  src.connect(hp);
  hp.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

/** Heavy glass break: low thump + shard noise + bright ring — plays on final shatter */
function playGlassShatterSound() {
  const ctx = getAudioContext();
  void ctx.resume();

  const makeNoiseBuffer = (duration: number, brightness: number) => {
    const n = Math.ceil(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      const t = i / ctx.sampleRate;
      const env = Math.exp(-t * (18 + brightness * 8));
      const n0 = (Math.random() * 2 - 1) * (0.55 + brightness * 0.25);
      const grit = Math.sin(2 * Math.PI * (2400 + Math.random() * 6000) * t) * Math.exp(-t * 90) * 0.22;
      d[i] = (n0 + grit) * env;
    }
    return buf;
  };

  const master = ctx.createGain();
  master.gain.value = 0.72;
  master.connect(ctx.destination);

  const low = ctx.createOscillator();
  low.type = 'sine';
  low.frequency.setValueAtTime(95, ctx.currentTime);
  low.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.28);
  const lowG = ctx.createGain();
  lowG.gain.setValueAtTime(0.38, ctx.currentTime);
  lowG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  low.connect(lowG);
  lowG.connect(master);
  low.start();
  low.stop(ctx.currentTime + 0.36);

  const n1 = ctx.createBufferSource();
  n1.buffer = makeNoiseBuffer(0.38, 1.2);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2200;
  bp.Q.value = 0.85;
  const ng = ctx.createGain();
  ng.gain.value = 0.62;
  n1.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  n1.start();

  const n2 = ctx.createBufferSource();
  n2.buffer = makeNoiseBuffer(0.22, 0.6);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 4500;
  const n2g = ctx.createGain();
  n2g.gain.value = 0.35;
  n2.connect(hp);
  hp.connect(n2g);
  n2g.connect(master);
  n2.start(ctx.currentTime + 0.02);

  const ring = ctx.createOscillator();
  ring.type = 'sine';
  ring.frequency.setValueAtTime(4800, ctx.currentTime);
  ring.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
  const rg = ctx.createGain();
  rg.gain.setValueAtTime(0.12, ctx.currentTime);
  rg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  ring.connect(rg);
  rg.connect(master);
  ring.start();
  ring.stop(ctx.currentTime + 0.2);
}

function AnimatedCrackLine({
  line,
  delay,
  lineIndex,
  stroke,
}: {
  line: { x1: number; y1: number; x2: number; y2: number };
  delay: number;
  lineIndex: number;
  stroke: string;
}) {
  const len = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke={stroke}
      strokeWidth={1.05 + (lineIndex % 5) * 0.14}
      strokeLinecap="round"
      initial={{ strokeDashoffset: len, opacity: 0.85 }}
      animate={{ strokeDashoffset: 0, opacity: 1 }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ strokeDasharray: len }}
    />
  );
}

type Kinematic = { vx: number; vy: number; vz: number; rx: number; ry: number; rz: number };

function ShatterBurst({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<Group>(null);
  const { viewport } = useThree();
  const doneRef = useRef(false);
  const startRef = useRef<number | null>(null);
  const kinematicsRef = useRef<Kinematic[]>([]);

  const cols = 12;
  const rows = 9;

  const shardLayouts = useMemo(() => {
    const w = viewport.width;
    const h = viewport.height;
    const cw = w / cols;
    const ch = h / rows;
    const list: { x: number; y: number; z: number; w: number; h: number; d: number }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -w / 2 + c * cw + cw / 2;
        const y = -h / 2 + r * ch + ch / 2;
        list.push({
          x,
          y,
          z: (Math.random() - 0.5) * 0.06,
          w: cw * 0.96,
          h: ch * 0.96,
          d: 0.045 + Math.random() * 0.055,
        });
      }
    }
    return list;
  }, [viewport.width, viewport.height]);

  useLayoutEffect(() => {
    kinematicsRef.current = shardLayouts.map(() => ({
      vx: (Math.random() - 0.5) * 5.5,
      vy: (Math.random() - 0.5) * 5.5,
      vz: 4.5 + Math.random() * 7,
      rx: (Math.random() - 0.5) * 9,
      ry: (Math.random() - 0.5) * 9,
      rz: (Math.random() - 0.5) * 9,
    }));
  }, [shardLayouts]);

  useFrame((_state: RootState, delta: number) => {
    const g = groupRef.current;
    if (!g) return;
    if (startRef.current === null) startRef.current = performance.now() / 1000;
    const t = performance.now() / 1000 - startRef.current;

    g.children.forEach((child: Object3D, i: number) => {
      const mesh = child as Mesh;
      const k = kinematicsRef.current[i];
      if (!k) return;
      mesh.position.x += k.vx * delta;
      mesh.position.y += k.vy * delta;
      mesh.position.z += k.vz * delta;
      k.vz += delta * 2.4;
      mesh.rotation.x += k.rx * delta;
      mesh.rotation.y += k.ry * delta;
      mesh.rotation.z += k.rz * delta;
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      const fade = Math.max(0, 1 - t * 0.98);
      mat.opacity = Math.min(1, fade * 0.94);
      mat.transmission = 0.78 * fade + 0.06;
      mat.emissiveIntensity = 0.22 * fade;
    });

    if (!doneRef.current && t > 1.35) {
      doneRef.current = true;
      onComplete();
    }
  });

  return (
    <group ref={groupRef}>
      {shardLayouts.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[s.w, s.h, s.d]} />
          <meshPhysicalMaterial
            color="#dce8fc"
            metalness={0.06}
            roughness={0.11}
            transparent
            opacity={0.92}
            transmission={0.82}
            thickness={1.15}
            ior={1.54}
            envMapIntensity={1.4}
            clearcoat={1}
            clearcoatRoughness={0.14}
            emissive="#5080c8"
            emissiveIntensity={0.2}
            attenuationColor="#a8c4f0"
            attenuationDistance={0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

function ShatterDust() {
  const ref = useRef<THREE.Points>(null);
  const velRef = useRef<Float32Array | null>(null);
  const { viewport } = useThree();
  const n = 720;

  const geometry = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const vel = new Float32Array(n * 3);
    const w = Math.max(viewport.width, 8);
    const h = Math.max(viewport.height, 6);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * w;
      positions[i * 3 + 1] = (Math.random() - 0.5) * h;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      vel[i * 3] = (Math.random() - 0.5) * 5;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 5;
      vel[i * 3 + 2] = 4 + Math.random() * 12;
    }
    velRef.current = vel;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [viewport.width, viewport.height]);

  useFrame((_, dt) => {
    if (!ref.current || !velRef.current) return;
    const pos = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const vel = velRef.current;
    for (let i = 0; i < n; i++) {
      arr[i * 3] += vel[i * 3] * dt;
      arr[i * 3 + 1] += vel[i * 3 + 1] * dt;
      arr[i * 3 + 2] += vel[i * 3 + 2] * dt;
      vel[i * 3 + 2] -= dt * 2.8;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#e8f4ff"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShatterCanvas({ onComplete }: { onComplete: () => void }) {
  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      frameloop="always"
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 200 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }: { gl: WebGLRenderer }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ touchAction: 'none' }}
    >
      <Environment preset="night" />
      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 10, 14]} intensity={1.55} color="#ffffff" />
      <directionalLight position={[-8, -6, 10]} intensity={0.45} color="#88b8ff" />
      <pointLight position={[0, 2, 14]} intensity={1.1} color="#e0eeff" distance={50} decay={2} />
      <pointLight position={[6, -4, 8]} intensity={0.55} color="#a0c8ff" distance={40} decay={2} />
      <ShatterBurst onComplete={onComplete} />
      <ShatterDust />
    </Canvas>
  );
}

interface GlassShatterProps {
  onReveal: () => void;
  theme?: SiteTheme;
}

export default function GlassShatter({ onReveal, theme = 'night' }: GlassShatterProps) {
  const day = theme === 'day';
  const crackStroke = day ? 'rgba(45,52,68,0.55)' : 'rgba(255,255,255,0.78)';
  const impactFill = day ? 'rgba(40,48,62,0.85)' : 'rgba(255,255,255,0.92)';
  const [clickCount, setClickCount] = useState(0);
  const [cracks, setCracks] = useState<Crack[]>([]);
  const [phase, setPhase] = useState<'glass' | 'shatter3d' | 'gone'>('glass');
  const containerRef = useRef<HTMLDivElement>(null);
  const crackIdRef = useRef(0);
  const revealedRef = useRef(false);

  const finishReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setPhase('gone');
    onReveal();
  }, [onReveal]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (phase !== 'glass') return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setClickCount((prev) => {
        const next = prev + 1;
        if (next <= 2) {
          playGlassCrack(next as 1 | 2);
          const cid = crackIdRef.current++;
          const newCrack: Crack = {
            id: cid,
            x,
            y,
            lines: generateRealisticCrackNetwork(x, y, cid * 9973 + y * 0.37, next === 1 ? 102 : 182),
          };
          setCracks((c) => [...c, newCrack]);
        } else if (next === 3) {
          playGlassShatterSound();
          setPhase('shatter3d');
        }
        return next;
      });
    },
    [phase]
  );

  if (phase === 'gone') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex min-h-screen w-full cursor-pointer select-none flex-col"
      onClick={phase === 'glass' ? handleClick : undefined}
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence mode="wait">
        {phase === 'glass' && (
          <motion.div
            key="glass2d"
            className="absolute inset-0 min-h-screen w-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 min-h-screen w-full"
              style={{
                background: day
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(230,245,242,0.35) 50%, rgba(220,210,255,0.28) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(200,220,255,0.06) 50%, rgba(255,255,255,0.07) 100%)',
                backdropFilter: `blur(${BREAKTHROUGH_OVERLAY_BLUR_PX}px) saturate(${day ? 155 : 100}%)`,
                WebkitBackdropFilter: `blur(${BREAKTHROUGH_OVERLAY_BLUR_PX}px) saturate(${day ? 155 : 100}%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: day
                  ? 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0,0,0,0.02) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0,0,0,0.02) 50px)'
                  : 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.035) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.035) 50px)',
              }}
            />
            <div
              className="absolute top-4 left-8 right-8 h-px"
              style={{
                background: day
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
              }}
            />
            <div
              className="absolute bottom-4 left-8 right-8 h-px"
              style={{
                background: day
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              }}
            />
            <svg className="pointer-events-none absolute inset-0 h-full min-h-screen w-full">
              {cracks.map((crack) =>
                crack.lines.map((line, li) => (
                  <AnimatedCrackLine
                    key={`${crack.id}-${li}`}
                    line={line}
                    delay={li * 0.014}
                    lineIndex={li}
                    stroke={crackStroke}
                  />
                ))
              )}
              {cracks.map((crack) => (
                <motion.circle
                  key={`c-${crack.id}`}
                  cx={crack.x}
                  cy={crack.y}
                  fill={impactFill}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 4, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex min-h-screen items-center justify-center">
              <div className="text-center" style={{ color: day ? 'rgba(55,58,72,0.42)' : 'rgba(255,255,255,0.38)' }}>
                <div className="mb-3 text-4xl" style={{ letterSpacing: '0.15em', fontWeight: 300 }}>
                  BREAK THROUGH
                </div>
                <div className="text-sm" style={{ letterSpacing: '0.3em' }}>
                  {clickCount === 0 ? 'CLICK TO CRACK' : clickCount === 1 ? 'CLICK AGAIN...' : 'ONE MORE...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'shatter3d' && (
        <motion.div
          className="absolute inset-0 min-h-screen w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: day ? 'rgba(245,242,236,0.72)' : 'rgba(3,6,12,0.8)',
              backdropFilter: 'blur(1px)',
            }}
          />
          <ShatterCanvas onComplete={finishReveal} />
        </motion.div>
      )}
    </div>
  );
}
