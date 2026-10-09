import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface Lens3DExperienceProps {
  className?: string;
}

export const Lens3DExperience: React.FC<Lens3DExperienceProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [apertureVal, setApertureVal] = useState<number>(1.4);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // References for live animation updates
  const bladesRef = useRef<THREE.Mesh[]>([]);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);

  // Set aperture callback
  const handleApertureChange = useCallback((fStop: number) => {
    setApertureVal(fStop);
    // Aperture range f/1.2 (wide open, r=0.7) to f/16 (stopped down, r=0.15)
    const norm = Math.max(0, Math.min(1, (16 - fStop) / (16 - 1.2)));
    const targetRadius = 0.16 + norm * 0.58;

    bladesRef.current.forEach((blade, i) => {
      const angle = (i / bladesRef.current.length) * Math.PI * 2;
      const x = Math.cos(angle) * targetRadius;
      const y = Math.sin(angle) * targetRadius;
      blade.position.set(x, y, 0);
      blade.rotation.z = angle + (1 - norm) * 0.45;
    });
  }, []);

  useEffect(() => {
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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Root Group
    const root = new THREE.Group();
    scene.add(root);

    // --- MATERIALS ---
    const barrelMetalMat = new THREE.MeshStandardMaterial({
      color: 0x121216,
      metalness: 0.9,
      roughness: 0.22,
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.28,
    });

    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0d,
      metalness: 0.3,
      roughness: 0.7,
    });

    const irisBladeMat = new THREE.MeshStandardMaterial({
      color: 0xbfa140,
      metalness: 0.85,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });

    const opticalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x142838,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.5,
      ior: 1.62,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.95,
    });

    // 1. Outer Chassis / Outer Ring
    const chassisGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.8, 64, 1, true);
    chassisGeo.rotateX(Math.PI / 2);
    const chassis = new THREE.Mesh(chassisGeo, barrelMetalMat);
    root.add(chassis);

    // 2. Ribbed Focus Barrel
    const focusRibGeo = new THREE.TorusGeometry(2.12, 0.045, 16, 64);
    const focusRib1 = new THREE.Mesh(focusRibGeo, brushedGoldMat);
    focusRib1.position.z = 0.35;
    root.add(focusRib1);

    const focusRib2 = new THREE.Mesh(focusRibGeo, brushedGoldMat);
    focusRib2.position.z = -0.35;
    root.add(focusRib2);

    // 3. Inner Barrel Steps
    const innerStep1Geo = new THREE.CylinderGeometry(1.85, 1.85, 0.9, 64, 1, true);
    innerStep1Geo.rotateX(Math.PI / 2);
    const innerStep1 = new THREE.Mesh(innerStep1Geo, matteBlackMat);
    root.add(innerStep1);

    const innerStep2Geo = new THREE.CylinderGeometry(1.5, 1.5, 1.1, 64, 1, true);
    innerStep2Geo.rotateX(Math.PI / 2);
    const innerStep2 = new THREE.Mesh(innerStep2Geo, barrelMetalMat);
    root.add(innerStep2);

    // 4. Aperture Iris Blades (9 blades)
    const bladeGroup = new THREE.Group();
    root.add(bladeGroup);
    const blades: THREE.Mesh[] = [];
    const bladeCount = 9;
    const initialRadius = 0.65;

    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(0.7, 0.25);
      bladeShape.lineTo(0.55, 0.65);
      bladeShape.lineTo(-0.15, 0.35);
      bladeShape.closePath();

      const bladeGeo = new THREE.ShapeGeometry(bladeShape);
      const bladeMesh = new THREE.Mesh(bladeGeo, irisBladeMat);
      bladeMesh.position.set(
        Math.cos(angle) * initialRadius,
        Math.sin(angle) * initialRadius,
        (i * 0.005) - 0.02
      );
      bladeMesh.rotation.z = angle + 0.2;
      bladeGroup.add(bladeMesh);
      blades.push(bladeMesh);
    }
    bladesRef.current = blades;

    // 5. Optical Glass Elements (Curved Lenses)
    // Front Glass Element
    const frontLensGeo = new THREE.SphereGeometry(1.48, 36, 18, 0, Math.PI * 2, 0, Math.PI / 3.4);
    frontLensGeo.rotateX(Math.PI / 2);
    const frontLens = new THREE.Mesh(frontLensGeo, opticalGlassMat);
    frontLens.position.z = 0.28;
    root.add(frontLens);

    // Rear Optical Element
    const rearLensGeo = new THREE.SphereGeometry(1.4, 36, 18, 0, Math.PI * 2, 0, Math.PI / 3.6);
    rearLensGeo.rotateX(-Math.PI / 2);
    const rearLens = new THREE.Mesh(rearLensGeo, opticalGlassMat);
    rearLens.position.z = -0.3;
    root.add(rearLens);

    // 6. Orbiting Photographic Slide Discs
    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    const orbitItems: { mesh: THREE.Group; speed: number; angle: number; dist: number }[] = [];
    const colors = [0xd4af37, 0x4f88c6, 0xd47290, 0x4db896, 0xb87d4d];

    for (let i = 0; i < 5; i++) {
      const itemGroup = new THREE.Group();
      const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.3,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      itemGroup.add(ringMesh);

      const discGeo = new THREE.CircleGeometry(0.34, 32);
      const discMat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.2,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.z = 0.005;
      itemGroup.add(discMesh);

      orbitGroup.add(itemGroup);
      orbitItems.push({
        mesh: itemGroup,
        speed: 0.25 + i * 0.08,
        angle: (i / 5) * Math.PI * 2,
        dist: 2.8 + (i % 2) * 0.4,
      });
    }

    // --- LIGHTS ---
    const studioKey = new THREE.DirectionalLight(0xfffaed, 3.2);
    studioKey.position.set(4, 5, 5);
    scene.add(studioKey);

    const goldBacklight = new THREE.PointLight(0xd4af37, 3.5, 10);
    goldBacklight.position.set(0, 0, -2);
    scene.add(goldBacklight);

    const fillBlue = new THREE.DirectionalLight(0x406085, 1.5);
    fillBlue.position.set(-4, -3, 2);
    scene.add(fillBlue);

    const ambient = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambient);

    // --- INTERACTIVE DRAGGING & SCROLL ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY.current += dx * 0.008;
      targetRotationX.current += dy * 0.008;
      targetRotationX.current = Math.max(-0.6, Math.min(0.6, targetRotationX.current));
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Scroll listener for 3D depth reaction
    const onScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = 1 - rect.top / viewportH;
      if (progress >= 0 && progress <= 2) {
        root.rotation.z = (progress - 0.5) * 0.8;
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Touch support for mobile
    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevTouchX = e.touches[0].clientX;
        setIsInteracting(true);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dx = e.touches[0].clientX - prevTouchX;
        prevTouchX = e.touches[0].clientX;
        targetRotationY.current += dx * 0.01;
      }
    };
    const onTouchEnd = () => setIsInteracting(false);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // --- ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Lerp rotations
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, targetRotationY.current, 0.08);
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, targetRotationX.current, 0.08);

      // Idle float
      if (!isDragging) {
        targetRotationY.current += 0.003;
      }

      // Animate orbiting discs
      orbitItems.forEach((item) => {
        const a = item.angle + time * item.speed;
        item.mesh.position.set(
          Math.cos(a) * item.dist,
          Math.sin(a) * (item.dist * 0.65),
          Math.sin(a * 2) * 0.6
        );
        item.mesh.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(() => handleResize());
    resizeObs.observe(container);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      resizeObs.disconnect();
      cancelAnimationFrame(animId);

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

  if (!hasWebGL) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        <div className="p-8 rounded-3xl border border-amber-500/20 bg-zinc-950 text-center max-w-md">
          <div className="text-3xl mb-3">🔍</div>
          <h4 className="text-amber-300 font-serif text-lg">Aperture & Optical Geometry</h4>
          <p className="text-zinc-400 text-xs mt-2">
            Fine-art optical physics rendered with precision German optics and high-index glass.
          </p>
        </div>
      </div>
    );
  }

  const fStops = [1.2, 1.8, 2.8, 5.6, 8.0, 16.0];

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className={`w-full h-[450px] sm:h-[520px] md:h-[600px] cursor-grab active:cursor-grabbing relative ${
          isInteracting ? 'cursor-grabbing' : ''
        }`}
        title="Click and drag horizontally to rotate the lens in 3D"
      />

      {/* Floating Interactive HUD Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 shadow-2xl">
          <span className="text-[11px] font-mono tracking-widest text-amber-300/80 uppercase mr-2">
            Aperture Iris
          </span>
          <div className="flex items-center gap-1">
            {fStops.map((stop) => (
              <button
                key={stop}
                onClick={() => handleApertureChange(stop)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                  apertureVal === stop
                    ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20 scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                ƒ/{stop}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider">
          ✦ Click & Drag to Rotate 360° • Select ƒ-stop to actuate iris blades
        </div>
      </div>
    </div>
  );
};
