"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Single Tooth ──────────────────────────────────────────────────────────
function Tooth({
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  spreadFactor,
  index,
}: {
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  spreadFactor: React.RefObject<number>;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const spreadDir = useMemo(() => {
    const dir = basePos.clone().normalize();
    dir.y *= 0.3; // spread mostly outward, not much vertically
    return dir;
  }, [basePos]);

  useFrame(() => {
    if (!ref.current) return;
    const spread = spreadFactor.current ?? 0;
    ref.current.position.x = basePos.x + spreadDir.x * spread * 1.2;
    ref.current.position.y = basePos.y + spreadDir.y * spread * 0.5;
    ref.current.position.z = basePos.z + spreadDir.z * spread * 1.2;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
    >
      {/* Tooth shape: rounded box */}
      <boxGeometry args={[0.22, 0.35, 0.2, 4, 4, 4]} />
      <meshPhysicalMaterial
        color="#f8f6f0"
        roughness={0.18}
        metalness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.08}
        envMapIntensity={1.2}
        sheen={0.3}
        sheenColor={new THREE.Color("#e8e4dc")}
      />
    </mesh>
  );
}

// ─── Tooth Arch Generator ──────────────────────────────────────────────────
function ToothArch({
  isUpper,
  spreadFactor,
}: {
  isUpper: boolean;
  spreadFactor: React.RefObject<number>;
}) {
  const teeth = useMemo(() => {
    const result: {
      pos: [number, number, number];
      scale: [number, number, number];
      rot: [number, number, number];
    }[] = [];

    const count = 14;
    const archWidth = 2.2;
    const archDepth = 1.4;
    const y = isUpper ? 0.22 : -0.22;

    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI; // 0 to PI for half circle
      const x = Math.cos(t) * archWidth;
      const z = Math.sin(t) * archDepth - archDepth * 0.5;
      const angle = t - Math.PI / 2;

      // Front teeth are thinner and taller, molars are wider and shorter
      const isFront = i > 4 && i < 10;
      const scaleX = isFront ? 0.8 : 1.1;
      const scaleY = isFront ? 1.2 : 0.9;
      const scaleZ = isFront ? 0.7 : 1.0;

      result.push({
        pos: [x, y, z],
        scale: [scaleX, scaleY, scaleZ],
        rot: [0, angle, 0],
      });
    }
    return result;
  }, [isUpper]);

  return (
    <group>
      {teeth.map((tooth, i) => (
        <Tooth
          key={`${isUpper ? "upper" : "lower"}-${i}`}
          position={tooth.pos}
          scale={tooth.scale}
          rotation={tooth.rot}
          spreadFactor={spreadFactor}
          index={i}
        />
      ))}
    </group>
  );
}

// ─── Main Teeth Assembly ───────────────────────────────────────────────────
function TeethAssembly({
  mouse,
  clicked,
  scrollProgress,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  clicked: React.RefObject<boolean>;
  scrollProgress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const upperRef = useRef<THREE.Group>(null);
  const lowerRef = useRef<THREE.Group>(null);
  const spreadFactor = useRef(0);
  const chompPhase = useRef(0); // 0=open, 1=closed
  const chompTarget = useRef(0);
  const lastClicked = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Exact 8 degrees/second Y rotation
    const rotSpeed = (8 * Math.PI) / 180;
    groupRef.current.rotation.y += rotSpeed * delta;

    // Cursor tracking — upper jaw tilts toward cursor, linear, no overshoot
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;
    if (upperRef.current) {
      upperRef.current.rotation.x = THREE.MathUtils.lerp(
        upperRef.current.rotation.x,
        my * 0.12,
        0.08 // ~200ms linear feel at 60fps
      );
      upperRef.current.rotation.z = THREE.MathUtils.lerp(
        upperRef.current.rotation.z,
        mx * 0.06,
        0.08
      );
    }

    // Click chomp
    if (clicked.current && !lastClicked.current) {
      chompTarget.current = 1;
      setTimeout(() => {
        chompTarget.current = 0;
      }, 150);
    }
    lastClicked.current = clicked.current ?? false;

    // Chomp interpolation — sharp snap in, slower release out
    const chompSpeed = chompTarget.current === 1 ? 0.25 : 0.06;
    chompPhase.current = THREE.MathUtils.lerp(
      chompPhase.current,
      chompTarget.current,
      chompSpeed
    );

    if (upperRef.current) {
      upperRef.current.position.y = 0.15 - chompPhase.current * 0.35;
    }
    if (lowerRef.current) {
      lowerRef.current.position.y = -0.15 + chompPhase.current * 0.35;
    }

    // Scroll disassembly — teeth spread outward
    const scroll = scrollProgress.current ?? 0;
    spreadFactor.current = THREE.MathUtils.lerp(
      spreadFactor.current,
      scroll * 1.5,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      <group ref={upperRef} position={[0, 0.15, 0]}>
        <ToothArch isUpper={true} spreadFactor={spreadFactor} />
      </group>
      <group ref={lowerRef} position={[0, -0.15, 0]}>
        <ToothArch isUpper={false} spreadFactor={spreadFactor} />
      </group>
    </group>
  );
}

// ─── Clinical Lighting ─────────────────────────────────────────────────────
function ClinicalLighting() {
  return (
    <>
      {/* Strong overhead key light — white, surgical */}
      <directionalLight
        position={[0, 10, 3]}
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        color="#ffffff"
      />
      {/* Cool fill from below */}
      <directionalLight
        position={[0, -5, 2]}
        intensity={0.3}
        color="#cce8ec"
      />
      {/* Ambient — high key, overlit feel */}
      <ambientLight intensity={0.8} color="#f0f2f5" />
      {/* Subtle rim light */}
      <pointLight position={[-5, 3, -3]} intensity={0.4} color="#e0e5ea" />
    </>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────
function Scene({
  mouse,
  clicked,
  scrollProgress,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  clicked: React.RefObject<boolean>;
  scrollProgress: React.RefObject<number>;
}) {
  return (
    <>
      <ClinicalLighting />

      <TeethAssembly
        mouse={mouse}
        clicked={clicked}
        scrollProgress={scrollProgress}
      />

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.15}
        scale={8}
        blur={3}
        far={3}
        color="#0a0a0a"
      />

      <Environment preset="studio" />
    </>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────
export default function ClinicalTeeth() {
  const mouse = useRef({ x: 0, y: 0 });
  const clicked = useRef(false);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handleMouseDown = () => { clicked.current = true; };
    const handleMouseUp = () => { clicked.current = false; };

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      scrollProgress.current = Math.min(1, Math.max(0, window.scrollY / heroHeight));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene mouse={mouse} clicked={clicked} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
