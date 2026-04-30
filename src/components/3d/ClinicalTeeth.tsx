"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// ─── Porcelain material shared across all teeth ────────────────────────────
function ToothMaterial() {
  return (
    <meshPhysicalMaterial
      color="#F2EDE6"
      roughness={0.12}
      metalness={0.01}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      envMapIntensity={1.8}
      sheen={0.5}
      sheenColor={new THREE.Color("#DDD5C8")}
    />
  );
}

// ─── Individual tooth — built from multiple shapes for realism ─────────────
function Tooth({
  position,
  rotation = [0, 0, 0],
  toothType,
  spreadFactor,
  isUpper,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  toothType: "incisor" | "lateral" | "canine" | "premolar" | "molar";
  spreadFactor: React.RefObject<number>;
  isUpper: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const spreadDir = useMemo(() => {
    const dir = basePos.clone();
    dir.y = 0;
    dir.normalize();
    return dir;
  }, [basePos]);

  useFrame(() => {
    if (!ref.current) return;
    const spread = spreadFactor.current ?? 0;
    ref.current.position.x = basePos.x + spreadDir.x * spread * 1.8;
    ref.current.position.y = basePos.y + (isUpper ? 1 : -1) * spread * 0.5;
    ref.current.position.z = basePos.z + spreadDir.z * spread * 1.8;
  });

  // Dimensions based on tooth type
  const dims = useMemo(() => {
    switch (toothType) {
      case "incisor":
        return { crownW: 0.22, crownH: 0.28, crownD: 0.12, rootW: 0.06, rootH: 0.22 };
      case "lateral":
        return { crownW: 0.18, crownH: 0.26, crownD: 0.11, rootW: 0.055, rootH: 0.2 };
      case "canine":
        return { crownW: 0.2, crownH: 0.32, crownD: 0.14, rootW: 0.07, rootH: 0.28 };
      case "premolar":
        return { crownW: 0.2, crownH: 0.22, crownD: 0.2, rootW: 0.06, rootH: 0.22 };
      case "molar":
        return { crownW: 0.26, crownH: 0.2, crownD: 0.24, rootW: 0.08, rootH: 0.2 };
    }
  }, [toothType]);

  const rootDir = isUpper ? 1 : -1;

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Crown — rounded box */}
      <RoundedBox
        args={[dims.crownW, dims.crownH, dims.crownD]}
        radius={0.04}
        smoothness={8}
        position={[0, 0, 0]}
        castShadow
      >
        <ToothMaterial />
      </RoundedBox>

      {/* Root — tapered cylinder */}
      <mesh
        position={[0, rootDir * (dims.crownH / 2 + dims.rootH / 2 - 0.02), 0]}
        castShadow
      >
        <cylinderGeometry args={[dims.rootW, dims.rootW * 0.3, dims.rootH, 12]} />
        <ToothMaterial />
      </mesh>

      {/* Canine point */}
      {toothType === "canine" && (
        <mesh position={[0, -rootDir * 0.02, 0]} castShadow>
          <coneGeometry args={[dims.crownW * 0.4, 0.08, 12]} />
          <ToothMaterial />
        </mesh>
      )}

      {/* Molar cusps */}
      {(toothType === "molar" || toothType === "premolar") && (
        <>
          <mesh position={[-0.04, -rootDir * (dims.crownH / 2 - 0.04), -0.04]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <ToothMaterial />
          </mesh>
          <mesh position={[0.04, -rootDir * (dims.crownH / 2 - 0.04), 0.04]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <ToothMaterial />
          </mesh>
          {toothType === "molar" && (
            <>
              <mesh position={[0.04, -rootDir * (dims.crownH / 2 - 0.04), -0.04]} castShadow>
                <sphereGeometry args={[0.045, 12, 12]} />
                <ToothMaterial />
              </mesh>
              <mesh position={[-0.04, -rootDir * (dims.crownH / 2 - 0.04), 0.04]} castShadow>
                <sphereGeometry args={[0.045, 12, 12]} />
                <ToothMaterial />
              </mesh>
            </>
          )}
        </>
      )}
    </group>
  );
}

// ─── Full Arch ─────────────────────────────────────────────────────────────
function ToothArch({
  isUpper,
  spreadFactor,
}: {
  isUpper: boolean;
  spreadFactor: React.RefObject<number>;
}) {
  const teeth = useMemo(() => {
    const types: Array<"molar" | "molar" | "premolar" | "premolar" | "canine" | "lateral" | "incisor"> = [
      "molar", "molar", "premolar", "premolar", "canine",
      "lateral", "incisor", "incisor", "lateral",
      "canine", "premolar", "premolar", "molar", "molar",
    ];

    const result: {
      pos: [number, number, number];
      rot: [number, number, number];
      type: "incisor" | "lateral" | "canine" | "premolar" | "molar";
    }[] = [];

    const count = types.length;
    const archW = 1.8;
    const archD = 1.0;
    const y = isUpper ? 0.18 : -0.18;

    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI;
      const x = Math.cos(t) * archW;
      const z = Math.sin(t) * archD - archD * 0.3;
      const angle = t - Math.PI / 2;

      result.push({
        pos: [x, y, z],
        rot: [0, angle, 0],
        type: types[i] as "incisor" | "lateral" | "canine" | "premolar" | "molar",
      });
    }
    return result;
  }, [isUpper]);

  return (
    <group>
      {teeth.map((tooth, i) => (
        <Tooth
          key={`${isUpper ? "u" : "l"}-${i}`}
          position={tooth.pos}
          rotation={tooth.rot}
          toothType={tooth.type}
          spreadFactor={spreadFactor}
          isUpper={isUpper}
        />
      ))}
    </group>
  );
}

// ─── Gum line — subtle pink arch ───────────────────────────────────────────
function GumLine({ isUpper }: { isUpper: boolean }) {
  const y = isUpper ? 0.35 : -0.35;
  return (
    <mesh position={[0, y, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.6, 0.12, 8, 48, Math.PI]} />
      <meshPhysicalMaterial
        color="#E8B4A8"
        roughness={0.6}
        metalness={0}
        clearcoat={0.3}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// ─── Teeth Assembly ────────────────────────────────────────────────────────
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

    groupRef.current.rotation.y += ((6 * Math.PI) / 180) * delta;

    if (clicked.current && !lastClicked.current) {
      chompTarget.current = 1;
      setTimeout(() => { chompTarget.current = 0; }, 150);
    }
    lastClicked.current = clicked.current ?? false;

    const chompSpeed = chompTarget.current === 1 ? 0.3 : 0.06;
    chompPhase.current = THREE.MathUtils.lerp(chompPhase.current, chompTarget.current, chompSpeed);

    if (upperRef.current) upperRef.current.position.y = 0.1 - chompPhase.current * 0.25;
    if (lowerRef.current) lowerRef.current.position.y = -0.1 + chompPhase.current * 0.25;

    const scroll = scrollProgress.current ?? 0;
    spreadFactor.current = THREE.MathUtils.lerp(spreadFactor.current, scroll * 2.5, 0.05);
  });

  return (
    <group ref={groupRef} scale={1.3}>
      <group ref={upperRef} position={[0, 0.1, 0]}>
        <ToothArch isUpper={true} spreadFactor={spreadFactor} />
        <GumLine isUpper={true} />
      </group>
      <group ref={lowerRef} position={[0, -0.1, 0]}>
        <ToothArch isUpper={false} spreadFactor={spreadFactor} />
        <GumLine isUpper={false} />
      </group>
    </group>
  );
}

// ─── Camera orbit on scroll ────────────────────────────────────────────────
function CameraOrbit({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  useFrame(({ camera }) => {
    const s = scrollProgress.current ?? 0;
    const angle = s * Math.PI * 1.2;
    const radius = 4.5 - s * 1;
    const height = 1 - s * 1.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(angle) * radius, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, height, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.cos(angle) * radius, 0.04);
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
      <directionalLight position={[2, 8, 4]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} color="#fff" />
      <directionalLight position={[-3, -4, 2]} intensity={0.4} color="#C4A265" />
      <ambientLight intensity={0.6} color="#F0E8DC" />
      <pointLight position={[-4, 3, -2]} intensity={0.6} color="#C4A265" />
      <pointLight position={[4, 1, 3]} intensity={0.3} color="#A0B8D0" />
      <spotLight position={[0, 6, 0]} angle={0.4} penumbra={0.8} intensity={1} color="#fff" />

      <CameraOrbit scrollProgress={scrollProgress} />
      <TeethAssembly clicked={clicked} scrollProgress={scrollProgress} />

      <ContactShadows position={[0, -1.2, 0]} opacity={0.1} scale={10} blur={3} far={3} />
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
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
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
        camera={{ position: [0, 1, 4.5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene clicked={clicked} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
