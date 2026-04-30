"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Realistic Tooth Shape using Lathe geometry ────────────────────────────
function RealisticTooth({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  toothType,
  spreadFactor,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  toothType: "incisor" | "canine" | "premolar" | "molar";
  spreadFactor: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const spreadDir = useMemo(() => {
    const dir = basePos.clone().normalize();
    dir.y *= 0.2;
    return dir;
  }, [basePos]);

  // Create tooth profile based on type
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];

    if (toothType === "incisor") {
      // Flat, blade-like front teeth
      points.push(new THREE.Vector2(0, -0.18));
      points.push(new THREE.Vector2(0.06, -0.16));
      points.push(new THREE.Vector2(0.08, -0.08));
      points.push(new THREE.Vector2(0.1, 0));
      points.push(new THREE.Vector2(0.1, 0.06));
      points.push(new THREE.Vector2(0.09, 0.12));
      points.push(new THREE.Vector2(0.07, 0.16));
      points.push(new THREE.Vector2(0.04, 0.19));
      points.push(new THREE.Vector2(0, 0.2));
    } else if (toothType === "canine") {
      // Pointed, fang-like
      points.push(new THREE.Vector2(0, -0.2));
      points.push(new THREE.Vector2(0.06, -0.17));
      points.push(new THREE.Vector2(0.09, -0.08));
      points.push(new THREE.Vector2(0.11, 0));
      points.push(new THREE.Vector2(0.1, 0.08));
      points.push(new THREE.Vector2(0.07, 0.15));
      points.push(new THREE.Vector2(0.03, 0.22));
      points.push(new THREE.Vector2(0, 0.25));
    } else if (toothType === "premolar") {
      // Medium, two cusps
      points.push(new THREE.Vector2(0, -0.15));
      points.push(new THREE.Vector2(0.07, -0.12));
      points.push(new THREE.Vector2(0.1, -0.04));
      points.push(new THREE.Vector2(0.12, 0.02));
      points.push(new THREE.Vector2(0.12, 0.08));
      points.push(new THREE.Vector2(0.1, 0.12));
      points.push(new THREE.Vector2(0.08, 0.14));
      points.push(new THREE.Vector2(0.05, 0.15));
      points.push(new THREE.Vector2(0, 0.16));
    } else {
      // Molar — wide, flat top
      points.push(new THREE.Vector2(0, -0.14));
      points.push(new THREE.Vector2(0.08, -0.11));
      points.push(new THREE.Vector2(0.12, -0.04));
      points.push(new THREE.Vector2(0.14, 0.02));
      points.push(new THREE.Vector2(0.14, 0.06));
      points.push(new THREE.Vector2(0.13, 0.09));
      points.push(new THREE.Vector2(0.11, 0.11));
      points.push(new THREE.Vector2(0.07, 0.12));
      points.push(new THREE.Vector2(0, 0.12));
    }

    return new THREE.LatheGeometry(points, 24);
  }, [toothType]);

  useFrame(() => {
    if (!ref.current) return;
    const spread = spreadFactor.current ?? 0;
    ref.current.position.x = basePos.x + spreadDir.x * spread * 1.5;
    ref.current.position.y = basePos.y + spreadDir.y * spread * 0.8;
    ref.current.position.z = basePos.z + spreadDir.z * spread * 1.5;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
    >
      <meshPhysicalMaterial
        color="#F5F0E8"
        roughness={0.15}
        metalness={0.02}
        clearcoat={1.0}
        clearcoatRoughness={0.06}
        envMapIntensity={1.5}
        sheen={0.4}
        sheenColor={new THREE.Color("#E8E0D4")}
      />
    </mesh>
  );
}

// ─── Tooth Arch with realistic tooth types ─────────────────────────────────
function ToothArch({
  isUpper,
  spreadFactor,
}: {
  isUpper: boolean;
  spreadFactor: React.RefObject<number>;
}) {
  const teeth = useMemo(() => {
    // Tooth types in order: molars -> premolars -> canine -> incisors -> canine -> premolars -> molars
    const types: Array<"molar" | "premolar" | "canine" | "incisor"> = [
      "molar", "molar", "premolar", "premolar", "canine",
      "incisor", "incisor", "incisor", "incisor",
      "canine", "premolar", "premolar", "molar", "molar",
    ];

    const result: {
      pos: [number, number, number];
      rot: [number, number, number];
      type: "incisor" | "canine" | "premolar" | "molar";
      scale: number;
    }[] = [];

    const count = types.length;
    const archWidth = 2.0;
    const archDepth = 1.2;
    const y = isUpper ? 0.2 : -0.2;

    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI;
      const x = Math.cos(t) * archWidth;
      const z = Math.sin(t) * archDepth - archDepth * 0.4;
      const angle = t - Math.PI / 2;

      const type = types[i];
      const scaleMap = { molar: 1.1, premolar: 0.95, canine: 1.0, incisor: 0.85 };

      result.push({
        pos: [x, y, z],
        rot: [isUpper ? 0 : Math.PI, angle, 0],
        type,
        scale: scaleMap[type],
      });
    }
    return result;
  }, [isUpper]);

  return (
    <group>
      {teeth.map((tooth, i) => (
        <RealisticTooth
          key={`${isUpper ? "u" : "l"}-${i}`}
          position={tooth.pos}
          rotation={tooth.rot}
          scale={tooth.scale}
          toothType={tooth.type}
          spreadFactor={spreadFactor}
        />
      ))}
    </group>
  );
}

// ─── Main Teeth Assembly with scroll-driven camera orbit ───────────────────
function TeethAssembly({
  clicked,
  scrollProgress,
}: {
  clicked: React.RefObject<boolean>;
  scrollProgress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const upperRef = useRef<THREE.Group>(null);
  const lowerRef = useRef<THREE.Group>(null);
  const spreadFactor = useRef(0);
  const chompPhase = useRef(0);
  const chompTarget = useRef(0);
  const lastClicked = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow constant rotation
    const rotSpeed = (6 * Math.PI) / 180;
    groupRef.current.rotation.y += rotSpeed * delta;

    // Click chomp
    if (clicked.current && !lastClicked.current) {
      chompTarget.current = 1;
      setTimeout(() => { chompTarget.current = 0; }, 150);
    }
    lastClicked.current = clicked.current ?? false;

    const chompSpeed = chompTarget.current === 1 ? 0.25 : 0.06;
    chompPhase.current = THREE.MathUtils.lerp(chompPhase.current, chompTarget.current, chompSpeed);

    if (upperRef.current) {
      upperRef.current.position.y = 0.15 - chompPhase.current * 0.3;
    }
    if (lowerRef.current) {
      lowerRef.current.position.y = -0.15 + chompPhase.current * 0.3;
    }

    // Scroll disassembly
    const scroll = scrollProgress.current ?? 0;
    spreadFactor.current = THREE.MathUtils.lerp(spreadFactor.current, scroll * 2, 0.06);
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

// ─── Camera controller — orbits based on scroll ────────────────────────────
function CameraOrbit({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  useFrame(({ camera }) => {
    const scroll = scrollProgress.current ?? 0;

    // Orbit camera around the teeth as user scrolls
    const angle = scroll * Math.PI * 1.5; // 270 degrees over full scroll
    const radius = 5 - scroll * 1.5; // Come closer as we scroll
    const height = 1.5 - scroll * 2; // Go from above to below

    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius;
    const targetY = height;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene ─────────────────────────────────────────────────────────────────
function Scene({
  clicked,
  scrollProgress,
}: {
  clicked: React.RefObject<boolean>;
  scrollProgress: React.RefObject<number>;
}) {
  return (
    <>
      {/* Lighting */}
      <directionalLight position={[0, 10, 3]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} color="#ffffff" />
      <directionalLight position={[0, -5, 2]} intensity={0.4} color="#C4A265" />
      <ambientLight intensity={0.5} color="#E8E0D6" />
      <pointLight position={[-5, 3, -3]} intensity={0.5} color="#C4A265" />
      <pointLight position={[5, 2, 3]} intensity={0.3} color="#89A4C4" />

      <CameraOrbit scrollProgress={scrollProgress} />

      <TeethAssembly clicked={clicked} scrollProgress={scrollProgress} />

      <ContactShadows position={[0, -1, 0]} opacity={0.12} scale={8} blur={3} far={3} color="#0a0a0a" />

      <Environment preset="studio" />
    </>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────
export default function ClinicalTeeth() {
  const clicked = useRef(false);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleMouseDown = () => { clicked.current = true; };
    const handleMouseUp = () => { clicked.current = false; };

    const handleScroll = () => {
      // Use total document scroll for the orbit
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene clicked={clicked} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
