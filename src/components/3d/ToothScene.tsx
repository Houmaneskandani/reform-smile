"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  ContactShadows,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Dental Implant 3D Model ───────────────────────────────────────────────
function DentalImplant({ mouse }: { mouse: React.RefObject<{ x: number; y: number } | null> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Strong mouse follow — very noticeable
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      my * 0.5 + Math.sin(t * 0.4) * 0.08,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mx * 0.8 + t * 0.15,
      0.08
    );
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.03;

    // Obvious floating
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.25;
    groupRef.current.position.x = Math.sin(t * 0.4) * 0.1;
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Crown (tooth top) — glossy white */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshPhysicalMaterial
          color="#F0EDE8"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={2}
        />
      </mesh>

      {/* Crown base */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.5, 0.5, 64]} />
        <meshPhysicalMaterial
          color="#EDE8E0"
          roughness={0.15}
          metalness={0.05}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Abutment — gold accent */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
        <meshStandardMaterial
          color="#C4A265"
          roughness={0.2}
          metalness={0.95}
          envMapIntensity={3}
        />
      </mesh>

      {/* Implant screw body */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.15, 1.4, 32]} />
        <meshStandardMaterial
          color="#4A5568"
          roughness={0.2}
          metalness={0.97}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Screw threads — more visible */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, -0.05 - i * 0.16, 0]} castShadow>
          <torusGeometry args={[0.32 - i * 0.018, 0.035, 8, 48]} />
          <meshStandardMaterial
            color="#5A6A7E"
            roughness={0.15}
            metalness={0.97}
            envMapIntensity={2}
          />
        </mesh>
      ))}

      {/* Implant tip */}
      <mesh position={[0, -1.35, 0]} castShadow>
        <coneGeometry args={[0.15, 0.3, 32]} />
        <meshStandardMaterial
          color="#4A5568"
          roughness={0.2}
          metalness={0.97}
        />
      </mesh>
    </group>
  );
}

// ─── Pulsing glow ring around the implant ──────────────────────────────────
function PulsingGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 1.2) * 0.15;
    ref.current.scale.set(scale, scale, 1);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.08 + Math.sin(t * 1.2) * 0.04;
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
      <ringGeometry args={[2, 2.8, 64]} />
      <meshBasicMaterial color="#C4A265" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Floating gold particles ───────────────────────────────────────────────
function GoldParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 2.5 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#C4A265" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ─── Orbital rings — more visible, animated ────────────────────────────────
function OrbitalRing({ radius, speed, tilt, opacity }: { radius: number; speed: number; tilt: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.012, 16, 128]} />
      <meshBasicMaterial color="#C4A265" transparent opacity={opacity} />
    </mesh>
  );
}

// ─── Small orbiting sphere (like an electron) ──────────────────────────────
function OrbitingSphere({ radius, speed, size, color }: { radius: number; speed: number; size: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * 0.5;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

// ─── Glowing background sphere ─────────────────────────────────────────────
function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -4]}>
      <sphereGeometry args={[3.5, 32, 32]} />
      <MeshDistortMaterial
        color="#1B3A5C"
        roughness={0.8}
        metalness={0.2}
        distort={0.2}
        speed={2}
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────
function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number } | null> }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={2} castShadow color="#ffffff" />
      <directionalLight position={[-3, 4, -5]} intensity={0.8} color="#C4A265" />
      <pointLight position={[0, -3, 4]} intensity={1} color="#C4A265" distance={10} />
      <pointLight position={[3, 2, -2]} intensity={0.5} color="#89CFF0" distance={8} />
      <spotLight position={[0, 10, 0]} angle={0.25} penumbra={1} intensity={1.5} castShadow color="#ffffff" />

      {/* Main implant */}
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
        <DentalImplant mouse={mouse} />
      </Float>

      {/* Effects */}
      <PulsingGlow />
      <GoldParticles />

      {/* Orbital rings at different tilts */}
      <OrbitalRing radius={2.8} speed={0.08} tilt={Math.PI / 2.5} opacity={0.2} />
      <OrbitalRing radius={3.5} speed={-0.05} tilt={Math.PI / 2} opacity={0.12} />
      <OrbitalRing radius={4.2} speed={0.03} tilt={Math.PI / 3} opacity={0.08} />

      {/* Small orbiting spheres */}
      <OrbitingSphere radius={3} speed={0.4} size={0.06} color="#C4A265" />
      <OrbitingSphere radius={3.8} speed={-0.3} size={0.04} color="#C4A265" />
      <OrbitingSphere radius={2.5} speed={0.5} size={0.05} color="#89CFF0" />

      <GlowSphere />

      <Sparkles count={60} scale={10} size={2} speed={0.4} color="#C4A265" opacity={0.4} />

      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={12} blur={2.5} far={4} />

      <Environment preset="city" />
    </>
  );
}

// ─── Exported Canvas Component ─────────────────────────────────────────────
export default function ToothScene() {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
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
