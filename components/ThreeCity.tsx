import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Zone } from '../types';

interface ThreeCityProps {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}

export const ThreeCity: React.FC<ThreeCityProps> = ({ zones, onSelectZone }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Ensure black background
    scene.fog = new THREE.FogExp2(0x000000, 0.0005); // Deep space fog

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 5000);
    camera.position.set(0, 100, 250);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.5;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.minDistance = 50;
    controls.maxDistance = 1000;

    // --- Galaxy Generation ---
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Galaxy Parameters
    const parameters = {
        count: 50000,
        size: 0.2,
        radius: 300,
        branches: 5,
        spin: 1.5,
        randomness: 0.5,
        randomnessPower: 3,
        insideColor: new THREE.Color('#ff6030'),
        outsideColor: new THREE.Color('#1b3984')
    };

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateGalaxy = () => {
        if (points !== null) {
            geometry?.dispose();
            material?.dispose();
            galaxyGroup.remove(points);
        }

        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 2; // Flatter galaxy
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // Color
            const mixedColor = parameters.insideColor.clone();
            mixedColor.lerp(parameters.outsideColor, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        points = new THREE.Points(geometry, material);
        galaxyGroup.add(points);
    };

    generateGalaxy();

    // --- Star Systems (Zones) ---
    const systemsGroup = new THREE.Group();
    scene.add(systemsGroup);
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactableObjects: THREE.Object3D[] = [];
    const zoneMap = new Map<number, Zone>();

    // Procedural Planet Texture Generator
    const createPlanetTexture = (color1: string, color2: string, seed: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.CanvasTexture(canvas);

        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 512, 256);

        // Clouds/Bands
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? color2 : color1;
            ctx.globalAlpha = 0.1 + Math.random() * 0.2;
            ctx.fillRect(0, Math.random() * 256, 512, Math.random() * 40 + 5);
        }

        // Noise
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.05;
            const x = Math.random() * 512;
            const y = Math.random() * 256;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    };

    zones.forEach((zone, index) => {
        const angle = (index / zones.length) * Math.PI * 2;
        const radius = 80 + Math.random() * 100; // Distribute in the habitable zone
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 20;

        const systemContainer = new THREE.Group();
        systemContainer.position.set(x, y, z);
        systemsGroup.add(systemContainer);

        // 1. The Star (Clickable Target)
        const starSize = 4 + Math.random() * 2;
        const starGeo = new THREE.SphereGeometry(starSize, 32, 32);
        
        let color = '#fff';
        if (zone.type === 'game') color = '#00ffaa';
        if (zone.type === 'finance') color = '#ffd700';
        if (zone.type === 'creative') color = '#ff00aa';
        if (zone.type === 'culture') color = '#aa00ff';
        
        const starMat = new THREE.MeshBasicMaterial({ color: color });
        const star = new THREE.Mesh(starGeo, starMat);
        systemContainer.add(star);
        
        // Glow effect
        const glowGeo = new THREE.SphereGeometry(starSize * 2, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.2, 
            side: THREE.BackSide 
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        systemContainer.add(glow);

        // 2. Orbiting Planets (Visuals)
        const planetCount = 1 + Math.floor(Math.random() * 3);
        for(let i=0; i<planetCount; i++) {
            const pRadius = starSize * 3 + i * 5;
            const pSize = 0.5 + Math.random();
            const pGeo = new THREE.SphereGeometry(pSize, 16, 16);
            const pMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: createPlanetTexture(color, '#000000', i)
            });
            const planet = new THREE.Mesh(pGeo, pMat);
            
            // Pivot for rotation
            const pivot = new THREE.Group();
            pivot.add(planet);
            planet.position.x = pRadius;
            systemContainer.add(pivot);
            
            // Animation data
            pivot.userData = { rotSpeed: 0.02 + Math.random() * 0.03 };
        }

        // 3. Label / Beacon
        const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.y = 10;
        systemContainer.add(beacon);

        // Interaction
        star.userData = { id: zone.id, isStar: true };
        interactableObjects.push(star);
        zoneMap.set(star.id, zone);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 500);
    scene.add(pointLight);

    // --- Interaction Logic ---
    const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            const obj = intersects[0].object;
            const zone = zoneMap.get(obj.id);
            if (zone) setHoveredZone(zone.name);
        } else {
            document.body.style.cursor = 'default';
            setHoveredZone(null);
        }
    };

    const handleClick = (event: MouseEvent) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const zone = zoneMap.get(obj.id);
            if (zone) {
                // Camera fly-to animation could go here
                onSelectZone(zone);
            }
        }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Rotate Galaxy
        galaxyGroup.rotation.y = elapsedTime * 0.05;

        // Rotate Systems
        systemsGroup.children.forEach((system) => {
             // Self rotation of the system container slightly
             system.rotation.y = elapsedTime * 0.1;
             
             // Rotate planets around star
             system.children.forEach((child) => {
                 if (child.type === 'Group' && child.userData.rotSpeed) {
                     child.rotation.y += child.userData.rotSpeed;
                 }
             });
        });

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('click', handleClick);
        }
        geometry?.dispose();
        material?.dispose();
    };
  }, [zones, onSelectZone]);

  return (
    <div className="relative w-full h-[600px] bg-black overflow-hidden rounded-xl">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
          <h3 className="text-white font-mono text-sm tracking-widest opacity-70">
              GALAXY_VIEW // <span className="text-blue-400">SECTOR_01</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-gray-400 font-mono">LIVE FEED</span>
          </div>
      </div>

      {hoveredZone && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="border border-blue-500/50 bg-black/80 backdrop-blur-md p-4 rounded-lg text-center animate-in fade-in zoom-in duration-200">
                <div className="text-blue-400 text-xs font-mono mb-1">SYSTEM DETECTED</div>
                <div className="text-white font-bold text-xl tracking-wider">{hoveredZone.toUpperCase()}</div>
                <div className="text-gray-400 text-xs mt-1">CLICK TO INITIALIZE LINK</div>
            </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 pointer-events-none text-right">
          <div className="text-[10px] text-gray-500 font-mono">
              STARS: 50,000<br/>
              SYSTEMS: {zones.length}<br/>
              ZOOM: LOCKED
          </div>
      </div>
    </div>
  );
};