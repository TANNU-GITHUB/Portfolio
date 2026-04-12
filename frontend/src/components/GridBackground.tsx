import { useRef, useMemo, type ReactNode } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import * as THREE from 'three';
import { WaveEdgeBottom, WaveEdgeTop } from './WaveEdge';

const GRID_SEGMENTS = 72;
/** World width/height of the warped grid plane — larger = fills wide viewports edge-to-edge */
const PLANE_SIZE = 108;

function buildGridGeometries() {
  const seg = GRID_SEGMENTS;
  const w = PLANE_SIZE;
  const vx = seg + 1;
  const vy = seg + 1;

  const basePositions = new Float32Array(vx * vy * 3);
  let p = 0;
  for (let j = 0; j < vy; j++) {
    for (let i = 0; i < vx; i++) {
      basePositions[p] = (i / seg) * w - w / 2;
      basePositions[p + 1] = (j / seg) * w - w / 2;
      basePositions[p + 2] = 0;
      p += 3;
    }
  }

  const lineIndices: number[] = [];
  for (let j = 0; j < vy; j++) {
    for (let i = 0; i < seg; i++) {
      const a = i + j * vx;
      lineIndices.push(a, a + 1);
    }
  }
  for (let i = 0; i < vx; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i + j * vx;
      lineIndices.push(a, a + vx);
    }
  }

  const posAttr = new THREE.BufferAttribute(new Float32Array(basePositions), 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', posAttr);
  lineGeo.setIndex(lineIndices);
  lineGeo.userData.basePositions = new Float32Array(basePositions);

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', posAttr.clone());
  pointsGeo.userData.basePositions = new Float32Array(basePositions);

  return { lineGeo, pointsGeo };
}

function warpZ(x: number, y: number, t: number): number {
  const base =
    Math.sin(x * 0.42 + t * 0.28) * 0.55 +
    Math.sin(y * 0.34 + t * 0.22) * 0.55 +
    Math.sin((x + y) * 0.28 + t * 0.38) * 0.3 +
    Math.sin(x * 0.88 - y * 0.52 + t * 0.18) * 0.18;
  /* Gentle extra waves — visible but not overwhelming */
  const ripple =
    Math.sin(x * 0.3 + t * 0.4) * 0.2 +
    Math.sin(y * 0.26 + t * 0.34) * 0.18 +
    Math.cos(x * 0.5 - t * 0.52) * Math.sin(y * 0.46 + t * 0.48) * 0.12;
  return base + ripple;
}

function syncPositions(
  lineGeo: THREE.BufferGeometry,
  pointsGeo: THREE.BufferGeometry,
  base: Float32Array,
  t: number
) {
  const linePos = lineGeo.getAttribute('position') as THREE.BufferAttribute;
  const ptPos = pointsGeo.getAttribute('position') as THREE.BufferAttribute;
  const la = linePos.array as Float32Array;
  const pa = ptPos.array as Float32Array;
  for (let i = 0; i < base.length; i += 3) {
    const x = base[i];
    const y = base[i + 1];
    const z = warpZ(x, y, t);
    la[i] = x;
    la[i + 1] = y;
    la[i + 2] = z;
    pa[i] = x;
    pa[i + 1] = y;
    pa[i + 2] = z;
  }
  linePos.needsUpdate = true;
  ptPos.needsUpdate = true;
}

function GridMesh({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const timeRef = useRef(0);
  const { lineGeo, pointsGeo } = useMemo(() => buildGridGeometries(), []);

  useFrame((_state: RootState, delta: number) => {
    timeRef.current += delta * 0.19;
    const base = lineGeo.userData.basePositions as Float32Array;
    syncPositions(lineGeo, pointsGeo, base, timeRef.current);
  });

  return (
    <group position={position} rotation={rotation}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.58} depthWrite={false} />
      </lineSegments>
      <points geometry={pointsGeo}>
        <pointsMaterial
          color="#ffffff"
          size={0.062}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function GridCeilingStrip() {
  return (
    <div className="relative h-full w-full min-w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, -1.95, 5.35], fov: 68 }}
        className="!absolute inset-0 h-full w-full"
        style={{ display: 'block' }}
        gl={{ alpha: false, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 22, 58]} />
        <GridMesh position={[0, 1.95, -0.35]} rotation={[Math.PI / 2.32, 0, 0]} />
      </Canvas>
      <WaveEdgeBottom />
    </div>
  );
}

function GridFloorStrip() {
  return (
    <div className="relative h-full w-full min-w-full overflow-hidden bg-black">
      <WaveEdgeTop />
      <Canvas
        camera={{ position: [0, 1.95, 5.35], fov: 68 }}
        className="!absolute inset-0 h-full w-full"
        style={{ display: 'block' }}
        gl={{ alpha: false, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 22, 58]} />
        <GridMesh position={[0, -1.95, -0.35]} rotation={[-Math.PI / 2.32, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default function GridBackground({ children }: { children?: ReactNode }) {
  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-black"
      style={{
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      <div className="pointer-events-none relative h-[20vh] min-h-[64px] w-full min-w-full shrink-0">
        <GridCeilingStrip />
      </div>

      <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center overflow-hidden bg-black px-3 py-2 sm:px-5">
        {children}
      </div>

      <div className="pointer-events-none relative h-[20vh] min-h-[64px] w-full min-w-full shrink-0">
        <GridFloorStrip />
      </div>
    </div>
  );
}
