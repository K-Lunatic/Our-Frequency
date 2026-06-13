import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Moon() {
  return (
    <Sphere args={[3, 64, 64]} position={[5, 5, -10]}> 
      <meshStandardMaterial color="#FDE08B" emissive="#FDE08B" emissiveIntensity={0.6} roughness={0.9} />
    </Sphere>
  );
}

function RabbitModel() {
  const { scene } = useGLTF('/models/rabbit-transformed.glb'); 
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current.y = x * 1; 
      targetRotation.current.x = -y * 0.8; 
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, 0.05);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.6} position={[0, -0.8, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={2.8} /> 
        <directionalLight position={[0, 5, 10]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-5, 0, 5]} intensity={1.0} color="#FDE08B" />
        <Moon />
        <RabbitModel />
        <Environment preset="city" blur={0.5} />
      </Canvas>
    </div>
  );
}