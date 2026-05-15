import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial 
        color="#10b981" 
        attach="material" 
        distort={0.4} 
        speed={2} 
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

export default function AI3DVisualizer() {
  return (
    <div className="w-full h-full min-h-[250px] relative rounded-2xl overflow-hidden bg-slate-950">
      <div className="absolute top-4 left-4 z-10">
        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest animate-pulse">
          AI Nexus Core Active
        </p>
      </div>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#059669" />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
