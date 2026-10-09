import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090c, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Root Assembly Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Camera Body Group
    const cameraBodyGroup = new THREE.Group();
    rootGroup.add(cameraBodyGroup);

    // --- MATERIALS ---
    const obsidianMetalMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.9,
      roughness: 0.25,
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.3,
    });

    const leatheretteMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      metalness: 0.1,
      roughness: 0.85,
    });

    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f1c24,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 1.2,
      ior: 1.55,
      transparent: true,
      opacity: 0.92,
      reflectivity: 0.9,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xdfba55,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x2a2205,
      emissiveIntensity: 0.2,
    });

    // 1. Main Rangefinder Body
    const mainBodyGeo = new THREE.BoxGeometry(2.8, 1.6, 1.1);
    const mainBody = new THREE.Mesh(mainBodyGeo, obsidianMetalMat);
    cameraBodyGroup.add(mainBody);

    // 2. Leatherette Wrap Center Section
    const gripWrapGeo = new THREE.BoxGeometry(2.82, 1.1, 1.12);
    const gripWrap = new THREE.Mesh(gripWrapGeo, leatheretteMat);
    gripWrap.position.y = -0.15;
    cameraBodyGroup.add(gripWrap);

    // 3. Top Plate (Titanium Bevel)
    const topPlateGeo = new THREE.BoxGeometry(2.81, 0.25, 1.11);
    const topPlate = new THREE.Mesh(topPlateGeo, obsidianMetalMat);
    topPlate.position.y = 0.85;
    cameraBodyGroup.add(topPlate);

    // 4. Lens Barrel
    const lensBaseGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.45, 48);
    lensBaseGeo.rotateX(Math.PI / 2);
    const lensBase = new THREE.Mesh(lensBaseGeo, obsidianMetalMat);
    lensBase.position.set(0.2, -0.05, 0.75);
    cameraBodyGroup.add(lensBase);

    // Gold Aperture Accent Ring
    const goldRingGeo = new THREE.TorusGeometry(0.86, 0.035, 16, 48);
    const goldRing = new THREE.Mesh(goldRingGeo, brushedGoldMat);
    goldRing.position.set(0.2, -0.05, 0.95);
    cameraBodyGroup.add(goldRing);

    // Focus Ribbed Ring
    const focusRingGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.45, 48);
    focusRingGeo.rotateX(Math.PI / 2);
    const focusRing = new THREE.Mesh(focusRingGeo, obsidianMetalMat);
    focusRing.position.set(0.2, -0.05, 1.15);
    cameraBodyGroup.add(focusRing);

    // Lens Outer Bezel
    const frontBezelGeo = new THREE.TorusGeometry(0.79, 0.05, 16, 48);
    const frontBezel = new THREE.Mesh(frontBezelGeo, brushedGoldMat);
    frontBezel.position.set(0.2, -0.05, 1.38);
    cameraBodyGroup.add(frontBezel);

    // Convex Front Lens Glass Element
    const glassGeo = new THREE.SphereGeometry(0.76, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3.2);
    glassGeo.rotateX(Math.PI / 2);
    const lensGlass = new THREE.Mesh(glassGeo, lensGlassMat);
    lensGlass.position.set(0.2, -0.05, 1.3);
    cameraBodyGroup.add(lensGlass);

    // 5. Controls & Dials (Top Plate)
    // Shutter Button with Gold Rim
    const shutterCollarGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24);
    const shutterCollar = new THREE.Mesh(shutterCollarGeo, brushedGoldMat);
    shutterCollar.position.set(-0.85, 1.05, 0.15);
    cameraBodyGroup.add(shutterCollar);

    const shutterButtonGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.22, 24);
    const shutterButton = new THREE.Mesh(shutterButtonGeo, obsidianMetalMat);
    shutterButton.position.set(-0.85, 1.12, 0.15);
    cameraBodyGroup.add(shutterButton);

    // Shutter Speed Dial
    const dial1Geo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 32);
    const dial1 = new THREE.Mesh(dial1Geo, brushedGoldMat);
    dial1.position.set(-0.35, 1.06, 0.05);
    cameraBodyGroup.add(dial1);

    // ISO Dial
    const dial2Geo = new THREE.CylinderGeometry(0.2, 0.2, 0.16, 32);
    const dial2 = new THREE.Mesh(dial2Geo, obsidianMetalMat);
    dial2.position.set(0.75, 1.05, 0.05);
    cameraBodyGroup.add(dial2);

    // Viewfinder Eyepiece
    const viewfinderGeo = new THREE.BoxGeometry(0.35, 0.22, 0.25);
    const viewfinder = new THREE.Mesh(viewfinderGeo, obsidianMetalMat);
    viewfinder.position.set(-0.9, 0.55, 0.58);
    cameraBodyGroup.add(viewfinder);

    const vfGlassGeo = new THREE.PlaneGeometry(0.28, 0.16);
    const vfGlass = new THREE.Mesh(vfGlassGeo, lensGlassMat);
    vfGlass.position.set(-0.9, 0.55, 0.71);
    cameraBodyGroup.add(vfGlass);

    // Signature Studio Gold Badge
    const badgeGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.03, 32);
    badgeGeo.rotateX(Math.PI / 2);
    const badge = new THREE.Mesh(badgeGeo, goldTrimMat);
    badge.position.set(1.05, 0.5, 0.57);
    cameraBodyGroup.add(badge);

    // --- FLOATING PHOTOGRAPHIC SLIDES ---
    const slidesGroup = new THREE.Group();
    rootGroup.add(slidesGroup);

    interface FloatingFrame {
      mesh: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeed: number;
      floatPhase: number;
    }

    const floatingFrames: FloatingFrame[] = [];
    const framePositions = [
      { x: -2.8, y: 1.2, z: -0.6, rotY: 0.35, rotZ: -0.1 },
      { x: 2.7, y: 1.4, z: -0.4, rotY: -0.4, rotZ: 0.12 },
      { x: -2.4, y: -1.3, z: 0.8, rotY: 0.28, rotZ: 0.18 },
      { x: 2.5, y: -1.2, z: 0.5, rotY: -0.3, rotZ: -0.15 },
    ];

    framePositions.forEach((pos, idx) => {
      const cardGroup = new THREE.Group();
      cardGroup.position.set(pos.x, pos.y, pos.z);
      cardGroup.rotation.y = pos.rotY;
      cardGroup.rotation.z = pos.rotZ;

      // Outer Card Frame (Dark Obsidian with Gold Border)
      const borderGeo = new THREE.BoxGeometry(1.4, 1.0, 0.03);
      const borderMesh = new THREE.Mesh(borderGeo, brushedGoldMat);
      cardGroup.add(borderMesh);

      // Inner Photo Mat (Canvas / Photo Area)
      const photoGeo = new THREE.PlaneGeometry(1.28, 0.88);
      const photoColors = [0x1e2430, 0x2b1e24, 0x1f2920, 0x28231d];
      const photoMat = new THREE.MeshStandardMaterial({
        color: photoColors[idx % photoColors.length],
        roughness: 0.5,
        metalness: 0.1,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.02;
      cardGroup.add(photoMesh);

      // Add a subtle golden grid line or corner marker
      const cornerGeo = new THREE.BoxGeometry(0.12, 0.12, 0.04);
      const cornerMesh = new THREE.Mesh(cornerGeo, goldTrimMat);
      cornerMesh.position.set(0.55, 0.35, 0.02);
      cardGroup.add(cornerMesh);

      slidesGroup.add(cardGroup);
      floatingFrames.push({
        mesh: cardGroup,
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        rotSpeed: 0.4 + idx * 0.15,
        floatPhase: idx * 1.5,
      });
    });

    // --- LIGHTING ---
    // Warm Key Light (Champagne Gold)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Cool Rim Light (Moody Obsidian Studio)
    const rimLight = new THREE.DirectionalLight(0x7da4d9, 1.8);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xd4af37, 0.65);
    scene.add(ambientLight);

    // Front Specular Spot for Lens Flare Glow
    const frontSpot = new THREE.PointLight(0xfff5e6, 2.5, 12);
    frontSpot.position.set(0.2, 0, 3.2);
    scene.add(frontSpot);

    // --- INTERACTION & ANIMATION LOOP ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax Lerping
      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.35;

      cameraBodyGroup.rotation.y = THREE.MathUtils.lerp(
        cameraBodyGroup.rotation.y,
        targetRotY + Math.sin(elapsedTime * 0.6) * 0.08,
        0.05
      );
      cameraBodyGroup.rotation.x = THREE.MathUtils.lerp(
        cameraBodyGroup.rotation.x,
        targetRotX + Math.cos(elapsedTime * 0.5) * 0.05,
        0.05
      );

      // Subtle breathing float on whole group
      rootGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Animate floating photo slides
      floatingFrames.forEach((frame) => {
        frame.mesh.position.y =
          frame.baseY + Math.sin(elapsedTime * frame.rotSpeed + frame.floatPhase) * 0.18;
        frame.mesh.rotation.y += Math.sin(elapsedTime * 0.4 + frame.floatPhase) * 0.002;
        frame.mesh.rotation.x = THREE.MathUtils.lerp(
          frame.mesh.rotation.x,
          targetRotX * 0.3,
          0.04
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      motionQuery.removeEventListener('change', motionListener);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-black p-4 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-4 rounded-2xl border border-amber-500/10 flex flex-col items-center justify-center text-center p-6">
            <span className="text-4xl mb-3">📷</span>
            <div className="text-amber-300 font-serif text-lg tracking-wider">LUMINA ARTISAN</div>
            <div className="text-zinc-400 text-xs mt-1">Optical Precision & Fine Art</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] pointer-events-none select-none ${className}`}
      aria-label="Interactive 3D Camera and Floating Artwork"
    />
  );
};
