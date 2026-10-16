import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AURA_COLORS = {
  COUPLE: {
    primary: new THREE.Color('#D94E34'),   // Warm Ember
    secondary: new THREE.Color('#DE4D6A'), // Rose Intimacy
    accent: new THREE.Color('#F7D6CD')     // Soft Candlelight
  },
  FRIEND: {
    primary: new THREE.Color('#C6882C'),   // Warm Amber Gold
    secondary: new THREE.Color('#E5A93C'), // Sunbeam
    accent: new THREE.Color('#FDF3E3')     // Champagne
  },
  JUST_MET: {
    primary: new THREE.Color('#387B6A'),   // Contemplative Sage Teal
    secondary: new THREE.Color('#2A5A4E'), // Deep Emerald
    accent: new THREE.Color('#D4EAE2')     // Mist
  }
};

export default function ThreeCanvas({ relationshipType = 'COUPLE' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Create Soft Glow Particle Texture dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(canvas);

    // Particles Geometry
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = [];

    const activeAura = AURA_COLORS[relationshipType] || AURA_COLORS.COUPLE;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 32;
      const z = (Math.random() - 0.5) * 18;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push({ x, y, z, speed: 0.2 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 });

      // Color interpolation based on aura
      const colorChoice = Math.random();
      const col = colorChoice > 0.6 ? activeAura.primary : (colorChoice > 0.3 ? activeAura.secondary : activeAura.accent);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = 1.0 + Math.random() * 2.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating subtle 3D Icosahedron wireframe (subtle sacred geometry / closeness token)
    const geoIco = new THREE.IcosahedronGeometry(7.5, 1);
    const matIco = new THREE.MeshBasicMaterial({
      color: activeAura.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.04
    });
    const icoMesh = new THREE.Mesh(geoIco, matIco);
    icoMesh.position.set(0, 0, -4);
    scene.add(icoMesh);

    // Mouse Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      targetX = (clientX / window.innerWidth - 0.5) * 3;
      targetY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth camera interpolation
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      camera.position.x = currentX;
      camera.position.y = -currentY;
      camera.lookAt(0, 0, 0);

      // Rotate subtle background icosahedron
      icoMesh.rotation.x = time * 0.05;
      icoMesh.rotation.y = time * 0.07;

      // Animate particles with gentle organic breath
      const posArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const orig = originalPositions[i];
        posArray[i * 3 + 1] = orig.y + Math.sin(time * orig.speed + orig.phase) * 1.2;
        posArray[i * 3] = orig.x + Math.cos(time * (orig.speed * 0.8) + orig.phase) * 0.8;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      geoIco.dispose();
      matIco.dispose();
      renderer.dispose();
    };
  }, [relationshipType]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
        transition: 'opacity 0.5s ease-out'
      }}
      aria-hidden="true"
    />
  );
}
