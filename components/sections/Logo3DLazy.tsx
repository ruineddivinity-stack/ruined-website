"use client";

import dynamic from "next/dynamic";

// Three.js + react-three-fiber add ~870KB of JS. Logo3D already gates its
// actual WebGL work behind a client-only mount check internally, but a
// plain static import still puts that whole dependency graph in the
// critical bundle for any page that renders it (including the homepage).
// Loading it as a separate chunk keeps it out of the initial page load.
export const Logo3D = dynamic(
  () => import("./Logo3D").then((mod) => mod.Logo3D),
  { ssr: false },
);
