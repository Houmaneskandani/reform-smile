"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// ─── Loaded Tooth Model ────────────────────────────────────────────────────
function ToothModel({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const gltf = useLoader(GLTFLoader, "/models/tooth.glb");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gltf.scene) return;

    // Override materials to porcelain white
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#F0ECE4"),
          roughness: 0.1,
          metalness: 0.01,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          envMapIntensity: 2.0,
          sheen: 0.5,
          sheenRoughness: 0.3,
          sheenColor: new THREE.Color("#DDD5C8"),
        });
      }
    });
  }, [gltf]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollProgress.current ?? 0;

    // Scroll-driven rotation — full 360° orbit feel
    ref.current.rotation.y = s * Math.PI * 3 + t * 0.1;

    // Tilt changes as you scroll
    ref.current.rotation.x = Math.sin(s * Math.PI) * 0.4;
    ref.current.rotation.z = Math.sin(s * Math.PI * 0.5) * 0.15;

    // Scale — visible but not overwhelming
    const scale = 18 + Math.sin(s * Math.PI) * 5;
    ref.current.scale.setScalar(scale);

    // Position — stays on the right, shifts as you scroll
    ref.current.position.y = -0.3 + Math.sin(s * Math.PI * 2) * 0.4;
    ref.current.position.x = 1.8 + Math.sin(s * Math.PI) * 0.5;
  });

  return (
    <group ref={ref} position={[1.8, -0.3, 0]} scale={18}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}

// ─── Loading fallback ──────────────────────────────────────────────────────
function LoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[1.5, 0, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshPhysicalMaterial
        color="#F0ECE4"
        roughness={0.1}
        clearcoat={1}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────
function Scene({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  return (
    <>
      {/* High-quality lighting */}
      <directionalLight position={[3, 8, 5]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} color="#fff" />
      <directionalLight position={[-4, 4, -3]} intensity={1.2} color="#F0E8DC" />
      <directionalLight position={[0, -3, 4]} intensity={0.4} color="#C4A265" />
      <ambientLight intensity={0.6} color="#F5F0EB" />
      <pointLight position={[-3, 2, 4]} intensity={0.6} color="#C4A265" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={0.8} intensity={1.5} color="#fff" />

      <Suspense fallback={<LoadingFallback />}>
        <ToothModel scrollProgress={scrollProgress} />
      </Suspense>

      <ContactShadows position={[0, -2, 0]} opacity={0.1} scale={12} blur={3} far={5} />
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
        camera={{ position: [0, 0.5, 4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
