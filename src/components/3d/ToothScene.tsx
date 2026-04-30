"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  ContactShadows,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Dental Implant 3D Model (procedural geometry) ─────────────────────────
function DentalImplant({ mouse }: { mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  // Track scroll position
  if (typeof window !== "undefined") {
    const updateScroll = () => {
      scrollRef.current = window.scrollY / (window.innerHeight * 0.8);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", updateScroll, { passive: true });
    }
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Mouse follow rotation (subtle)
    const targetX = (mouse.current?.y ?? 0) * 0.3;
    const targetY = (mouse.current?.x ?? 0) * 0.3;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX + Math.sin(t * 0.3) * 0.05,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY + t * 0.1,
      0.05
    );

    // Gentle floating motion
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;

    // Scale based on scroll
    const scale = Math.max(0.6, 1 - scrollRef.current * 0.3);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {/* Crown (tooth top) — glossy white */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshPhysicalMaterial
          color="#F0EDE8"
          roughness={0.15}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Crown base (wider, flat bottom) */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.5, 0.5, 64]} />
        <meshPhysicalMaterial
          color="#EDE8E0"
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Abutment (connector piece) — titanium look */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
        <meshStandardMaterial
          color="#C4A265"
          roughness={0.3}
          metalness={0.9}
          envMapIntensity={2}
        />
      </mesh>

      {/* Implant screw body — metallic titanium */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.15, 1.4, 32]} />
        <meshStandardMaterial
          color="#8A9AAE"
          roughness={0.25}
          metalness={0.95}
          envMapIntensity={2}
        />
      </mesh>

      {/* Screw threads */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[0, -0.05 - i * 0.16, 0]}
          castShadow
        >
          <torusGeometry args={[0.32 - i * 0.018, 0.03, 8, 32]} />
          <meshStandardMaterial
            color="#7A8A9E"
            roughness={0.2}
            metalness={0.95}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}

      {/* Implant tip */}
      <mesh position={[0, -1.35, 0]} castShadow>
        <coneGeometry args={[0.15, 0.3, 32]} />
        <meshStandardMaterial
          color="#8A9AAE"
          roughness={0.25}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
}

// ─── Floating gold particles around the implant ────────────────────────────
function GoldParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 3 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C4A265"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Orbital rings ─────────────────────────────────────────────────────────
function OrbitalRing({ radius, speed, opacity }: { radius: number; speed: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color="#C4A265" transparent opacity={opacity} />
    </mesh>
  );
}

// ─── Glowing background sphere ─────────────────────────────────────────────
function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <sphereGeometry args={[3, 32, 32]} />
      <MeshDistortMaterial
        color="#1B3A5C"
        roughness={0.8}
        metalness={0.2}
        distort={0.15}
        speed={1.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────
function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number } | null> }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#C4A265" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#C4A265" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#ffffff"
      />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <DentalImplant mouse={mouse} />
      </Float>

      <GoldParticles />
      <OrbitalRing radius={2.5} speed={0.05} opacity={0.15} />
      <OrbitalRing radius={3.2} speed={-0.03} opacity={0.1} />
      <OrbitalRing radius={4} speed={0.02} opacity={0.06} />
      <GlowSphere />

      <Sparkles
        count={40}
        scale={8}
        size={1.5}
        speed={0.3}
        color="#C4A265"
        opacity={0.3}
      />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.3}
        scale={10}
        blur={2.5}
        far={4}
      />

      <Environment preset="city" />
    </>
  );
}

// ─── Exported Canvas Component ─────────────────────────────────────────────
export default function ToothScene() {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
