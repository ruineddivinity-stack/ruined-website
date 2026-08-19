"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const HOLO_COLORS = ["#8c52c7", "#4f7df2", "#f262b6", "#f2c14e"] as const;

export function Logo3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full max-w-xl">
      {mounted && (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.4], fov: 32 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneEnvironment />
          <ambientLight intensity={0.35} />
          <hemisphereLight args={["#f1f2f7", "#030304", 0.45]} />
          <directionalLight position={[2, 3, 4]} intensity={0.55} />
          <OrbitingLights />
          <Suspense fallback={null}>
            <LogoPlate />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

function SceneEnvironment() {
  const { gl, scene } = useThree();

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return rt.texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envMap;
    return () => {
      scene.environment = null;
    };
  }, [scene, envMap]);

  return null;
}

function OrbitingLights() {
  const refs = useRef<(THREE.PointLight | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    HOLO_COLORS.forEach((_, i) => {
      const phase = (i / HOLO_COLORS.length) * Math.PI * 2;
      const angle = t * 0.35 + phase;
      const light = refs.current[i];
      if (!light) return;
      light.position.set(
        Math.cos(angle) * 3.4,
        Math.sin(angle * 0.7) * 1.8,
        Math.sin(angle) * 3.4,
      );
    });
  });

  return (
    <>
      {HOLO_COLORS.map((color, i) => (
        <pointLight
          key={color}
          ref={(el) => {
            refs.current[i] = el;
          }}
          color={color}
          intensity={7}
          distance={9}
          decay={2}
        />
      ))}
    </>
  );
}

function LogoPlate() {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, "/logo.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const aspect = 2400 / 1027;
  const width = 3;
  const height = width / aspect;
  const depth = 0.14;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const idle = state.clock.elapsedTime * 0.12;
    const targetY = idle + state.pointer.x * 0.5;
    const targetX = -state.pointer.y * 0.3;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.06);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.06);
    group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#cbceda" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.004]}>
        <planeGeometry args={[width * 0.94, height * 0.94]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.004]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.94, height * 0.94]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
