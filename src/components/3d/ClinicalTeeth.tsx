"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Tooth profiles traced from reference silhouettes ──────────────────────

function createIncisorShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Narrow blade-like tooth with rounded top and long single root
  s.moveTo(0, -1.2); // root tip
  s.quadraticCurveTo(0.08, -0.9, 0.12, -0.5); // root widens
  s.quadraticCurveTo(0.16, -0.2, 0.22, 0); // crown starts
  s.quadraticCurveTo(0.26, 0.15, 0.24, 0.35); // crown widens
  s.quadraticCurveTo(0.22, 0.48, 0.15, 0.52); // crown rounds
  s.quadraticCurveTo(0, 0.56, -0.15, 0.52); // crown top
  s.quadraticCurveTo(-0.22, 0.48, -0.24, 0.35);
  s.quadraticCurveTo(-0.26, 0.15, -0.22, 0);
  s.quadraticCurveTo(-0.16, -0.2, -0.12, -0.5);
  s.quadraticCurveTo(-0.08, -0.9, 0, -1.2);
  return s;
}

function createCanineShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Pointed crown, long fang-like root
  s.moveTo(0, -1.4); // long root tip
  s.quadraticCurveTo(0.07, -1.0, 0.1, -0.6);
  s.quadraticCurveTo(0.14, -0.3, 0.2, 0);
  s.quadraticCurveTo(0.24, 0.15, 0.22, 0.3);
  s.quadraticCurveTo(0.18, 0.45, 0.08, 0.55); // slopes to point
  s.quadraticCurveTo(0, 0.62, -0.08, 0.55); // pointed tip
  s.quadraticCurveTo(-0.18, 0.45, -0.22, 0.3);
  s.quadraticCurveTo(-0.24, 0.15, -0.2, 0);
  s.quadraticCurveTo(-0.14, -0.3, -0.1, -0.6);
  s.quadraticCurveTo(-0.07, -1.0, 0, -1.4);
  return s;
}

function createPremolarShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Wider crown with two cusps, shorter root
  s.moveTo(0, -1.0); // root tip
  s.quadraticCurveTo(0.06, -0.7, 0.1, -0.4);
  s.quadraticCurveTo(0.15, -0.15, 0.25, 0);
  s.quadraticCurveTo(0.3, 0.1, 0.28, 0.25);
  s.quadraticCurveTo(0.26, 0.35, 0.18, 0.42); // first cusp
  s.quadraticCurveTo(0.1, 0.38, 0, 0.4); // valley between cusps
  s.quadraticCurveTo(-0.1, 0.38, -0.18, 0.42); // second cusp
  s.quadraticCurveTo(-0.26, 0.35, -0.28, 0.25);
  s.quadraticCurveTo(-0.3, 0.1, -0.25, 0);
  s.quadraticCurveTo(-0.15, -0.15, -0.1, -0.4);
  s.quadraticCurveTo(-0.06, -0.7, 0, -1.0);
  return s;
}

function createMolarShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Wide crown, multiple cusps, split roots
  // Left root
  s.moveTo(-0.1, -1.1);
  s.quadraticCurveTo(-0.15, -0.8, -0.18, -0.5);
  s.quadraticCurveTo(-0.22, -0.25, -0.3, -0.05);
  s.quadraticCurveTo(-0.35, 0.1, -0.32, 0.25);
  s.quadraticCurveTo(-0.3, 0.35, -0.22, 0.42); // cusp 1
  s.quadraticCurveTo(-0.12, 0.38, -0.05, 0.4);
  s.quadraticCurveTo(0, 0.42, 0.05, 0.4); // cusp 2
  s.quadraticCurveTo(0.12, 0.38, 0.22, 0.42); // cusp 3
  s.quadraticCurveTo(0.3, 0.35, 0.32, 0.25);
  s.quadraticCurveTo(0.35, 0.1, 0.3, -0.05);
  s.quadraticCurveTo(0.22, -0.25, 0.18, -0.5);
  s.quadraticCurveTo(0.15, -0.8, 0.1, -1.1); // right root
  // Connect roots at bottom
  s.quadraticCurveTo(0.05, -1.0, 0, -0.85); // root fork
  s.quadraticCurveTo(-0.05, -1.0, -0.1, -1.1);
  return s;
}

// ─── Extruded Tooth Component ──────────────────────────────────────────────
function ExtrudedTooth({
  position,
  rotation,
  scale = 1,
  toothType,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  toothType: "incisor" | "canine" | "premolar" | "molar";
}) {
  const ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    let shape: THREE.Shape;
    let depth: number;

    switch (toothType) {
      case "incisor":
        shape = createIncisorShape();
        depth = 0.18;
        break;
      case "canine":
        shape = createCanineShape();
        depth = 0.22;
        break;
      case "premolar":
        shape = createPremolarShape();
        depth = 0.28;
        break;
      case "molar":
        shape = createMolarShape();
        depth = 0.35;
        break;
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 12,
      curveSegments: 24,
    });

    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [toothType]);

  // Gentle floating
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const offset = position[0] * 0.5; // unique phase per tooth
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + offset) * 0.08;
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.2 + offset) * 0.05;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#F0ECE4"
        roughness={0.1}
        metalness={0.01}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        envMapIntensity={2.0}
        sheen={0.6}
        sheenRoughness={0.3}
        sheenColor={new THREE.Color("#E0D8CC")}
        transmission={0.05}
        thickness={0.5}
        ior={1.5}
      />
    </mesh>
  );
}

// ─── Scene with scattered teeth ────────────────────────────────────────────
function TeethScene({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Camera orbit based on scroll
  useFrame(({ camera }) => {
    const s = scrollProgress.current ?? 0;

    // Full 360 orbit + height change + zoom
    const angle = s * Math.PI * 2;
    const radius = 6 - s * 2;
    const height = 2 - s * 4;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(angle) * radius, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, height, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.cos(angle) * radius, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* 4 large individual teeth spread in space */}

      {/* Incisor — front center */}
      <ExtrudedTooth
        position={[-2.5, 0.5, 0]}
        rotation={[0, 0.3, 0.05]}
        scale={1.8}
        toothType="incisor"
      />

      {/* Canine — right */}
      <ExtrudedTooth
        position={[0.5, -0.3, -1]}
        rotation={[0.1, -0.4, -0.05]}
        scale={1.6}
        toothType="canine"
      />

      {/* Premolar — left back */}
      <ExtrudedTooth
        position={[-1, 0, 2]}
        rotation={[-0.05, 0.8, 0.03]}
        scale={1.7}
        toothType="premolar"
      />

      {/* Molar — right back, biggest */}
      <ExtrudedTooth
        position={[2.5, 0.2, 1]}
        rotation={[0.05, -0.6, -0.03]}
        scale={1.9}
        toothType="molar"
      />

      {/* Extra teeth for depth — smaller, further away */}
      <ExtrudedTooth
        position={[1.5, 1.5, -3]}
        rotation={[0.2, 1.2, 0.1]}
        scale={1.0}
        toothType="incisor"
      />
      <ExtrudedTooth
        position={[-3, -1, -2]}
        rotation={[-0.15, -0.8, 0.08]}
        scale={1.1}
        toothType="canine"
      />
      <ExtrudedTooth
        position={[3.5, -0.8, 2.5]}
        rotation={[0.1, 0.5, -0.1]}
        scale={1.2}
        toothType="premolar"
      />
      <ExtrudedTooth
        position={[-2, 1.2, 3]}
        rotation={[-0.08, 1.5, 0.05]}
        scale={0.9}
        toothType="molar"
      />
    </group>
  );
}

// ─── Full Scene ────────────────────────────────────────────────────────────
function Scene({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  return (
    <>
      {/* High-key lighting */}
      <directionalLight position={[3, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} color="#fff" />
      <directionalLight position={[-4, 6, -3]} intensity={1.5} color="#F0E8DC" />
      <directionalLight position={[0, -3, 4]} intensity={0.5} color="#C4A265" />
      <ambientLight intensity={0.7} color="#F5F0EB" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#fff" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={0.8} intensity={1.5} color="#fff" />

      <TeethScene scrollProgress={scrollProgress} />

      <ContactShadows position={[0, -3, 0]} opacity={0.08} scale={20} blur={4} far={6} />
      <Environment preset="studio" />
    </>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────
export default function ClinicalTeeth() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
