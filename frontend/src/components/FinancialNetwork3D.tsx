import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';

export const FinancialNetwork3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useApp();
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    try {
      // 1. Scene Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 45;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS animation', e);
      setHasWebGlError(true);
      return;
    }

    // Colors matching Purple + Neon Fintech theme
    const isDark = theme === 'dark';
    const primaryPurple = isDark ? 0x8b5cf6 : 0x7c3aed;
    const accentNeon = isDark ? 0xc084fc : 0x9333ea;
    const lineColor = isDark ? 0x4c1d95 : 0xc4b5fd;
    const particleColor = isDark ? 0xd8b4fe : 0x6d28d9;

    // 2. Financial Network Nodes (Nodes in 3D Space)
    const nodeCount = isMobile ? 32 : 55;
    const nodeGeometry = new THREE.SphereGeometry(0.5, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: primaryPurple,
      wireframe: false,
    });

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodePositions: THREE.Vector3[] = [];
    const maxRange = 26;

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * maxRange * 1.5;
      const y = (Math.random() - 0.5) * maxRange;
      const z = (Math.random() - 0.5) * maxRange * 0.8;
      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      mesh.position.copy(pos);
      // Random scale for financial hierarchy (major institutional hubs vs individual assets)
      const scale = 0.5 + Math.random() * 1.2;
      mesh.scale.set(scale, scale, scale);
      nodesGroup.add(mesh);
    }

    // 3. Connective Financial Lattice Lines
    const linePositions: number[] = [];
    const maxDistance = isMobile ? 9.5 : 8.5;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const linesMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
    });
    const networkLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    nodesGroup.add(networkLines);

    // 4. Floating Data Particles Field
    const particleCount = isMobile ? 80 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 50;
      particleCoords[i + 1] = (Math.random() - 0.5) * 35;
      particleCoords[i + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.4,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 5. Interactive Mouse Parallax (Slow & Subtle)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Handle Window Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow financial rotation
        nodesGroup.rotation.y = elapsedTime * 0.04;
        nodesGroup.rotation.x = Math.sin(elapsedTime * 0.03) * 0.08;
        particleField.rotation.y = elapsedTime * 0.015;

        // Smooth mouse dampening
        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        camera.position.x = targetX * 4;
        camera.position.y = targetY * 3;
        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  // Fallback CSS animation if WebGL is unavailable or errors
  if (hasWebGlError) {
    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-500/20 blur-3xl animate-pulse" />
        <div className="border border-purple-500/20 rounded-3xl w-72 h-72 rotate-12 animate-[spin_40s_linear_infinite] flex items-center justify-center">
          <div className="border border-purple-400/30 rounded-2xl w-52 h-52 -rotate-12" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[420px] max-h-[560px] relative pointer-events-none select-none"
      aria-label="Interactive 3D Financial Network Visual"
    />
  );
};
