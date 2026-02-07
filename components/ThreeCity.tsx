import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

    // --- 1. SCENE SETUP (Divine Sci-Fi Atmosphere) ---
    const scene = new THREE.Scene();
    // Gradient Sky simulation using background color + fog
    scene.background = new THREE.Color(0x0a101f); 
    scene.fog = new THREE.FogExp2(0x0a101f, 0.003);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 1, 3000);
    camera.position.set(0, 150, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above water
    controls.minDistance = 100;
    controls.maxDistance = 600;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5; // Faster rotation for more dynamic feel

    // --- 2. LIGHTING (Cinematic) ---
    const ambientLight = new THREE.AmbientLight(0x404060, 1.5); // Cool ambient
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdfba, 2.5); // Warm sun
    sunLight.position.set(100, 200, 100);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x00ffff, 1.5); // Cyber rim light
    blueRimLight.position.set(-100, 50, -100);
    scene.add(blueRimLight);

    // --- 3. DIGITAL OCEAN (Shader Material) ---
    // A flowing grid representing the data substrate
    const oceanGeo = new THREE.PlaneGeometry(2000, 2000, 128, 128);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x001e36) }, // Deep Blue
        color2: { value: new THREE.Color(0x00ff9d) }  // Neon Cyan highlight
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        void main() {
          vUv = uv;
          vec3 pos = position;
          // Create waves
          float wave1 = sin(pos.x * 0.01 + time) * 10.0;
          float wave2 = cos(pos.y * 0.01 + time * 0.8) * 10.0;
          float wave3 = sin(pos.x * 0.03 + pos.y * 0.03 + time * 1.5) * 5.0;
          pos.z = wave1 + wave2 + wave3;
          vElevation = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying float vElevation;
        varying vec2 vUv;
        void main() {
          float mixStrength = (vElevation + 20.0) / 40.0;
          vec3 color = mix(color1, color2, pow(mixStrength, 5.0));
          
          // Grid lines with Retro-wave scrolling
          float gridX = step(0.98, fract((vUv.x + time * 0.05) * 50.0));
          float gridY = step(0.98, fract((vUv.y + time * 0.05) * 50.0));
          float grid = max(gridX, gridY) * 0.5; // Increased brightness
          
          gl_FragColor = vec4(color + grid, 0.8);
        }
      `,
      transparent: true,
      wireframe: false,
      side: THREE.DoubleSide
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    scene.add(ocean);

    // --- 4. ARCHITECTURE: CRYSTAL SPIRES (Procedural) ---
    // Instead of boxes, we build complex "Arcologies"
    const structuresGroup = new THREE.Group();
    scene.add(structuresGroup);

    const spireCount = 40;
    const spireMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.2, // Glass-like
      thickness: 1.0,
      clearcoat: 1.0,
      emissive: 0x002244,
      emissiveIntensity: 0.2
    });

    for (let i = 0; i < spireCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 300 + 50; // Don't put in exact center
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const height = Math.random() * 80 + 40;
        const scale = Math.random() * 2 + 1;

        // Base geometry: Cylinder tapered to point
        const geo = new THREE.CylinderGeometry(0, scale * 4, height, 5);
        const mesh = new THREE.Mesh(geo, spireMaterial);
        mesh.position.set(x, height / 2, z);
        
        // Add glowing rings around spires
        const ringGeo = new THREE.TorusGeometry(scale * 3, 0.2, 16, 5);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = height * 0.8; // High up
        mesh.add(ring);

        // Add floating bits
        const bitGeo = new THREE.OctahedronGeometry(scale);
        const bit = new THREE.Mesh(bitGeo, ringMat);
        bit.position.y = height / 2 + 10;
        bit.position.x = scale * 5;
        mesh.add(bit);

        structuresGroup.add(mesh);
    }

    // --- 5. HERO ZONES (The "Landmarks") ---
    const heroObjects: THREE.Object3D[] = [];
    const zoneMap = new Map<number, Zone>();

    zones.forEach((zone) => {
        const x = (zone.x - 50) * 6; // Spread out more
        const z = (zone.y - 50) * 6;
        
        const group = new THREE.Group();
        group.position.set(x, 20, z); // Floating above water

        let mainMesh;
        const color = zone.highlight ? 0xff3333 : 0x00aaff;
        
        if (zone.type === 'social') {
            // The Spring Festival: Massive Lotus / Sun shape
            const geo = new THREE.TorusKnotGeometry(12, 3, 100, 16);
            const mat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.2, metalness: 1, emissive: 0xff0000, emissiveIntensity: 0.5 });
            mainMesh = new THREE.Mesh(geo, mat);
            
            // Particles around it
            const pGeo = new THREE.BufferGeometry();
            const pPos = new Float32Array(300);
            for(let i=0;i<300;i++) pPos[i] = (Math.random()-0.5)*50;
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            const pMat = new THREE.PointsMaterial({ color: 0xffaa00, size: 0.5 });
            const p = new THREE.Points(pGeo, pMat);
            group.add(p);

        } else if (zone.type === 'civic') {
            // The Citadel: Floating Rings
            mainMesh = new THREE.Group();
            for(let i=1; i<=3; i++) {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(i*6, 0.5, 16, 100),
                    new THREE.MeshBasicMaterial({ color: 0x00ffff })
                );
                ring.rotation.x = Math.PI/2;
                ring.userData = { speed: i * 0.02 };
                mainMesh.add(ring);
            }
            const core = new THREE.Mesh(new THREE.OctahedronGeometry(4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            mainMesh.add(core);

        } else {
            // Standard High-Tech Node: Icosahedron
            const geo = new THREE.IcosahedronGeometry(10, 1);
            const mat = new THREE.MeshPhongMaterial({ 
                color: color, 
                flatShading: true,
                shininess: 100,
                emissive: color,
                emissiveIntensity: 0.3
            });
            mainMesh = new THREE.Mesh(geo, mat);
        }

        group.add(mainMesh);
        
        // Connection Beam to Water
        const beamGeo = new THREE.CylinderGeometry(0.5, 4, 40, 8, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = -20;
        group.add(beam);

        scene.add(group);
        heroObjects.push(mainMesh.type === 'Group' ? mainMesh.children[0] : mainMesh); // Raycast target
        if (mainMesh.type === 'Group') {
             // add all children to raycast
             mainMesh.children.forEach(c => {
                 zoneMap.set(c.id, zone);
                 heroObjects.push(c);
             });
        } else {
             zoneMap.set(mainMesh.id, zone);
             heroObjects.push(mainMesh);
        }

        // Animation data
        group.userData = { 
            floatSpeed: Math.random() * 0.002 + 0.001,
            floatOffset: Math.random() * Math.PI,
            rotSpeed: Math.random() * 0.01
        };
    });


    // --- 6. AERIAL TRAFFIC (The "Swarm") ---
    // Smooth curves for ships
    const shipCount = 100;
    const ships: THREE.Mesh[] = [];
    const shipGeo = new THREE.ConeGeometry(0.5, 2, 4);
    shipGeo.rotateX(Math.PI/2);
    const shipMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    
    for(let i=0; i<shipCount; i++) {
        const ship = new THREE.Mesh(shipGeo, shipMat);
        scene.add(ship);
        ships.push(ship);
        ship.userData = {
            t: Math.random(), // position along curve
            speed: Math.random() * 0.001 + 0.0005,
            radius: Math.random() * 200 + 50,
            yOffset: Math.random() * 50 + 50,
            yAmp: Math.random() * 20
        };
    }

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
        const rect = mountRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(heroObjects);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            // Find the zone (handle groups)
            const obj = intersects[0].object;
            const zone = zoneMap.get(obj.id);
            if (zone) setHoveredZone(zone.name);
        } else {
            document.body.style.cursor = 'default';
            setHoveredZone(null);
        }
    };

    const onClick = (event: MouseEvent) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(heroObjects);
        if (intersects.length > 0) {
            const zone = zoneMap.get(intersects[0].object.id);
            if (zone) onSelectZone(zone);
        }
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    // --- ANIMATION LOOP ---
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.03; // 3x speed for shader and waves
      
      controls.update();

      // Update Shader Time
      oceanMat.uniforms.time.value = time;

      // Animate Hero Zones
      scene.children.forEach(child => {
          if (child.userData.floatSpeed) {
              // Faster floating
              child.position.y += Math.sin(time * 2 + child.userData.floatOffset) * 0.2;
              child.rotation.y += child.userData.rotSpeed * 2; // Faster rotation
              
              // Special rotation for citadel rings
              child.children.forEach(c => {
                  if (c.userData && c.userData.speed) {
                      c.rotation.x += c.userData.speed * 3; // Much faster rings
                      c.rotation.y += c.userData.speed * 3;
                  }
              })
          }
      });

      // Animate Ships (Orbiting)
      ships.forEach(ship => {
          const ud = ship.userData;
          ud.t += ud.speed * 5; // 5x Speed for ships
          const angle = ud.t * Math.PI * 2;
          
          const x = Math.cos(angle) * ud.radius;
          const z = Math.sin(angle) * ud.radius;
          const y = ud.yOffset + Math.sin(angle * 3) * ud.yAmp;

          ship.position.set(x, y, z);
          ship.lookAt(0, y, 0); // Look center roughly
          // Better lookat: look at next point
          const nextAngle = (ud.t + 0.01) * Math.PI * 2;
          ship.lookAt(Math.cos(nextAngle)*ud.radius, y, Math.sin(nextAngle)*ud.radius);
      });

      renderer.render(scene, camera);
    };
    animate();

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
      controls.dispose();
      oceanGeo.dispose();
      oceanMat.dispose();
    };
  }, [zones, onSelectZone]);

  return (
    <div className="relative w-full h-[700px] rounded-2xl overflow-hidden border border-gray-700 bg-black shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-move" />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <h1 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            CELESTIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">CITY</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
            <div className="h-[1px] w-12 bg-white/50"></div>
            <p className="text-xs text-blue-200 font-mono tracking-[0.3em] uppercase">AI-Native Reality // v9.0</p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 pointer-events-none text-right z-10">
         <div className="text-6xl font-thin text-white/10 font-mono">2049</div>
      </div>

      {hoveredZone && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
           <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-[20px] opacity-30 rounded-full"></div>
                <div className="relative bg-black/40 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-white font-light text-xl tracking-[0.2em] shadow-xl">
                    {hoveredZone}
                </div>
             </div>
             <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent mt-2"></div>
           </div>
        </div>
      )}
    </div>
  );
};