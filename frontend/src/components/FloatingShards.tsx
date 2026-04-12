import { useLayoutEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { SiteTheme } from '../siteTheme';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface ShardData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
  driftSpeed: [number, number, number];
  opacity: number;
  hue: number;
}

function ClearForTheme({ day }: { day: boolean }) {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    if (day) {
      gl.setClearColor(0x000000, 0);
      scene.background = null;
    } else {
      gl.setClearColor(0x050810, 1);
      scene.background = new THREE.Color('#050810');
    }
  }, [day, gl, scene]);
  return null;
}

function Shard({ data }: { data: ShardData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const sides = 3 + Math.floor(seededRandom(data.position[0] * 1000 + 2) * 3);
    const shape = new THREE.Shape();
    const r1 = 0.35 + seededRandom(data.position[1] * 200 + 1) * 0.75;
    const r2 = 0.18 + seededRandom(data.position[2] * 300 + 3) * 0.45;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const r = i % 2 === 0 ? r1 : r2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: false });
  }, [data.position]);

  const color = useMemo(() => {
    const c = new THREE.Color();
    c.setHSL(0.55 + data.hue * 0.08, 0.35, 0.72);
    return c;
  }, [data.hue]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += data.rotSpeed[0] * 0.012;
    meshRef.current.rotation.y += data.rotSpeed[1] * 0.012;
    meshRef.current.rotation.z += data.rotSpeed[2] * 0.012;
    meshRef.current.position.x = data.position[0] + Math.sin(t * data.driftSpeed[0] + data.position[2]) * 0.55;
    meshRef.current.position.y = data.position[1] + Math.cos(t * data.driftSpeed[1] + data.position[0]) * 0.45;
    meshRef.current.position.z = data.position[2] + Math.sin(t * data.driftSpeed[2]) * 0.35;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={data.position} scale={data.scale}>
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={data.opacity}
        roughness={0.08}
        metalness={0.05}
        transmission={0.72}
        thickness={1.4}
        ior={1.52}
        envMapIntensity={1.25}
        clearcoat={1}
        clearcoatRoughness={0.12}
        attenuationColor="#a8c8f0"
        attenuationDistance={0.85}
        side={THREE.DoubleSide}
        emissive="#6a9ecf"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function DustMotes() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 420;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
    }
    return p;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#e8f4ff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShardField() {
  const shards = useMemo<ShardData[]>(() => {
    return Array.from({ length: 44 }, (_, i) => {
      const s = i * 17.17;
      return {
        position: [
          (seededRandom(s) - 0.5) * 20,
          (seededRandom(s + 1) - 0.5) * 13,
          (seededRandom(s + 2) - 0.5) * 11 - 1.5,
        ] as [number, number, number],
        rotation: [
          seededRandom(s + 3) * Math.PI * 2,
          seededRandom(s + 4) * Math.PI * 2,
          seededRandom(s + 5) * Math.PI * 2,
        ] as [number, number, number],
        scale: 0.55 + seededRandom(s + 6) * 1.65,
        rotSpeed: [
          (seededRandom(s + 7) - 0.5) * 0.65,
          (seededRandom(s + 8) - 0.5) * 0.65,
          (seededRandom(s + 9) - 0.5) * 0.65,
        ] as [number, number, number],
        driftSpeed: [
          0.12 + seededRandom(s + 10) * 0.35,
          0.12 + seededRandom(s + 11) * 0.35,
          0.1 + seededRandom(s + 12) * 0.25,
        ] as [number, number, number],
        opacity: 0.42 + seededRandom(s + 13) * 0.38,
        hue: seededRandom(s + 14),
      };
    });
  }, []);

  return (
    <>
      {shards.map((s, i) => (
        <Shard key={i} data={s} />
      ))}
    </>
  );
}

type FloatingShardsProps = { theme: SiteTheme };

export default function FloatingShards({ theme }: FloatingShardsProps) {
  const day = theme === 'day';

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none min-h-[100dvh]"
      style={{ opacity: day ? 0.38 : 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 58 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ClearForTheme day={day} />
        {!day && <color attach="background" args={['#050810']} />}
        <fog attach="fog" args={day ? ['#d4cfc4', 10, 32] : ['#050810', 9, 28]} />
        <Environment preset={day ? 'apartment' : 'night'} />
        <ambientLight intensity={day ? 0.55 : 0.35} />
        <directionalLight position={[8, 12, 10]} intensity={day ? 1.05 : 1.4} color="#ffffff" />
        <directionalLight position={[-10, -6, 6]} intensity={day ? 0.35 : 0.45} color={day ? '#c8d8f0' : '#88c4ff'} />
        <pointLight position={[0, 4, 9]} intensity={day ? 0.75 : 1.2} color="#e8f4ff" distance={40} decay={2} />
        <pointLight position={[6, -2, 4]} intensity={day ? 0.4 : 0.6} color="#a0c8ff" distance={30} decay={2} />
        <ShardField />
        <DustMotes />
      </Canvas>
    </div>
  );
}
