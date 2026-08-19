"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { traceAlphaShapes, type Point } from "@/lib/logoContours";

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
          <ambientLight intensity={0.4} />
          <hemisphereLight args={["#f1f2f7", "#030304", 0.5]} />
          <directionalLight position={[2, 3, 4]} intensity={0.7} />
          <OrbitingLights />
          <LogoMesh />
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

function useLogoGeometry(url: string) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      const targetWidth = 320;
      const targetHeight = Math.round(
        targetWidth * (img.naturalHeight / img.naturalWidth),
      );

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

      const shapes = traceAlphaShapes(
        imageData.data,
        targetWidth,
        targetHeight,
        100,
      );
      if (shapes.length === 0 || cancelled) return;

      const cx = targetWidth / 2;
      const cy = targetHeight / 2;
      const toVec = ([x, y]: Point) => new THREE.Vector2(x - cx, -(y - cy));

      const threeShapes = shapes.map((s) => {
        const shape = new THREE.Shape(s.outer.map(toVec));
        shape.holes = s.holes.map((hole) => new THREE.Path(hole.map(toVec)));
        return shape;
      });

      const depth = targetHeight * 0.24;
      const geo = new THREE.ExtrudeGeometry(threeShapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: targetHeight * 0.02,
        bevelSize: targetHeight * 0.018,
        bevelSegments: 4,
        curveSegments: 8,
      });

      geo.computeBoundingBox();
      const bbox = geo.boundingBox;
      if (bbox) {
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geo.translate(-center.x, -center.y, -center.z);
      }

      geo.computeBoundingSphere();
      const radius = geo.boundingSphere?.radius || 1;
      geo.scale(1 / radius, 1 / radius, 1 / radius);

      if (!cancelled) setGeometry(geo);
    };
    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return geometry;
}

function LogoMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const geometry = useLogoGeometry("/logo.png");

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const idle = state.clock.elapsedTime * 0.12;
    const targetY = idle + state.pointer.x * 0.5;
    const targetX = -state.pointer.y * 0.3;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.06);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.06);
    group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;

    const fit = Math.min(state.viewport.width, state.viewport.height) * 0.85;
    const targetScale = fit / 2;
    const nextScale = THREE.MathUtils.lerp(group.scale.x || targetScale, targetScale, 0.15);
    group.scale.setScalar(nextScale);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#cfd3e6"
          metalness={0.45}
          roughness={0.1}
          transmission={0.6}
          thickness={0.6}
          ior={1.45}
          clearcoat={0.6}
          clearcoatRoughness={0.12}
          attenuationColor="#c9a8e6"
          attenuationDistance={1.4}
          envMapIntensity={1.3}
        />
      </mesh>
    </group>
  );
}
