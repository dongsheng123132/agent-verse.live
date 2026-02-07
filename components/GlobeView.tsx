import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Zone } from '../types';

interface GlobeViewProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

export const GlobeView: React.FC<GlobeViewProps> = ({ zones, onSelectZone }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // Dark fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 220;
    camera.position.y = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- GLOBE ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Wireframe Sphere (The Grid)
    const geometry = new THREE.IcosahedronGeometry(80, 24);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x1a1a23, 
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const sphere = new THREE.Mesh(geometry, material);
    globeGroup.add(sphere);

    // 2. Points Sphere (The Cities/Nodes)
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x00ff9d,
      size: 1.5,
      transparent: true,
      opacity: 0.4,
    });
    const pointsSphere = new THREE.Points(geometry, pointsMaterial);
    globeGroup.add(pointsSphere);

    // 3. Atmosphere Glow
    const atmosGeo = new THREE.IcosahedronGeometry(80, 24);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          gl_FragColor = vec4(0.0, 1.0, 0.61, 1.0) * intensity * 1.5; 
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    atmosphere.scale.set(1.2, 1.2, 1.2);
    scene.add(atmosphere);

    // --- MARKERS ---
    const markerObjects: THREE.Mesh[] = [];
    const zoneMap = new Map<number, Zone>();

    zones.forEach((zone) => {
      // Convert Lat/Lng to Vector3
      const phi = (90 - zone.lat) * (Math.PI / 180);
      const theta = (zone.lng + 180) * (Math.PI / 180);
      const r = 82; // Slightly above surface

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));

      // Marker Geometry
      const markerGeo = new THREE.SphereGeometry(2, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: zone.highlight ? 0xff0000 : (zone.type === 'finance' ? 0xbd00ff : 0x00ff9d) 
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(x, y, z);
      
      // Add a ring around it for effect
      const ringGeo = new THREE.RingGeometry(3, 3.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: zone.highlight ? 0xff4444 : 0xffffff, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0,0,0);
      
      globeGroup.add(marker);
      globeGroup.add(ring);
      
      markerObjects.push(marker);
      zoneMap.set(marker.id, zone);
    });

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerObjects);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const zone = zoneMap.get(intersects[0].object.id);
        if (zone) setHoveredZone(zone.name);
      } else {
        document.body.style.cursor = 'default';
        setHoveredZone(null);
      }
    };

    const onClick = (event: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerObjects);
      if (intersects.length > 0) {
        const zone = zoneMap.get(intersects[0].object.id);
        if (zone) onSelectZone(zone);
      }
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    // --- ANIMATION LOOP ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // --- CLEANUP ---
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', onMouseMove);
        mountRef.current.removeEventListener('click', onClick);
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [zones, onSelectZone]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-800 bg-[#050508]">
      <div ref={mountRef} className="w-full h-full cursor-move" />
      
      {/* HUD Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h3 className="text-xl font-bold text-claw-accent font-mono animate-pulse">LIVE SATELLITE FEED</h3>
        <p className="text-xs text-gray-400">OPENCLAW GEOSPATIAL DATA</p>
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-none text-xs font-mono text-gray-500 space-y-1">
        <div>ROTATION: AUTO</div>
        <div>NODES DETECTED: {zones.length}</div>
        <div>CONNECTION: SECURE</div>
      </div>

      {hoveredZone && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <div className="bg-black/80 backdrop-blur border border-claw-accent px-4 py-2 rounded text-white font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(0,255,157,0.4)]">
             {hoveredZone}
           </div>
        </div>
      )}
    </div>
  );
};