# Homepage motion hero

`HeroMotion` replaces the homepage's PNG cluster with the approved Ruined RX 3D scene at **1.7×** playback speed. The existing hero copy, promotions, navigation and shopping actions remain in `Hero.tsx`.

The scene is self-hosted under `public/hero-orbit/v1/`, served by the same Next.js/Vercel deployment as the storefront. It does not embed the private ChatGPT preview or depend on access to that preview. The complete label PNGs, foil texture and vendored Three.js r180 modules are included, preserving the approved materials and motion from the motion study.

The isolated scene has a transparent canvas and document background, no preview chrome, and responsive framing. The parent fades from the existing `HeroVialCluster` once the first 3D frame has rendered. A load failure or WebGL context failure restores that PNG cluster. A small pause/play button controls the scene; reduced-motion preferences start paused. Parent visibility messages stop the render loop when the hero is offscreen, and document visibility stops it in background tabs. Both sides validate message origin and window identity.

The approved scene already caps pixel density, uses lower rendering resolution on touch devices and reduces quality if frames consistently run slowly. Vial geometry, holographic textures, ring tracks, lighting and the existing randomized motion are copied from the approved study. The default speed is specified by the embedded document's speed input, which the animation reads at startup.

Update the full versioned scene folder together when bringing in later approved motion changes. The source of this snapshot is the `ruinedrx-orbital-hero` study at commit `322446c1b7bdbb6805f9ee589e647a94ea12308d`, with a website-specific transparent background, 1.7× default and lifecycle messaging in `main.js`.

Production rollout uses the normal website branch and Vercel deployment flow. The homepage switch is the `HeroMotion` import and render in `Hero.tsx`; restoring `HeroVialCluster` there returns to the prior PNG hero.
