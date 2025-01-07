import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CategorizedProjects } from '@/types/projects';

interface NodeProps {
  position: [number, number, number];
  name: string;
  color?: string;
  scale?: number;
}

const Node: React.FC<NodeProps> = ({ position, name, color = '#1e88e5', scale = 1 }) => {
  const mesh = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[scale * 0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      <Text
        position={[0, -scale * 0.8, 0]}
        fontSize={scale * 0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        {name}
      </Text>
    </group>
  );
};

interface EcosystemMap3DProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const EcosystemMap3D: React.FC<EcosystemMap3DProps> = ({ categories, visibleCategories }) => {
  const nodes = useMemo(() => {
    const visibleNodes: NodeProps[] = [];
    const radius = 25; // Increased from 15 to give more space
    const categoryCount = Object.keys(categories).filter(key => visibleCategories[key]).length;
    let categoryIndex = 0;

    Object.entries(categories).forEach(([key, category]) => {
      if (!visibleCategories[key]) return;

      const angle = (categoryIndex * 2 * Math.PI) / categoryCount;
      const centerX = Math.cos(angle) * radius;
      const centerZ = Math.sin(angle) * radius;

      visibleNodes.push({
        position: [centerX, 0, centerZ],
        name: category.title,
        color: '#00ff9f',
        scale: 2
      });

      const projectCount = category.projects.length;
      const projectRadius = 8; // Increased from 5 to spread projects out more
      
      category.projects.forEach((project, projectIndex) => {
        const projectAngle = (projectIndex * 2 * Math.PI) / projectCount;
        const projectX = centerX + Math.cos(projectAngle) * projectRadius;
        const projectZ = centerZ + Math.sin(projectAngle) * projectRadius;
        
        visibleNodes.push({
          position: [projectX, 0, projectZ],
          name: project.name,
          scale: 1
        });
      });

      categoryIndex++;
    });

    return visibleNodes;
  }, [categories, visibleCategories]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        camera={{ 
          position: [0, 30, 50], // Adjusted camera position for better view
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#0a1929' }}
      >
        <color attach="background" args={['#0a1929']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={100} // Increased to allow viewing the larger layout
          makeDefault
        />
        <fog attach="fog" args={['#0a1929', 30, 100]} /> // Adjusted fog distance
        {nodes.map((node, index) => (
          <Node key={`${node.name}-${index}`} {...node} />
        ))}
      </Canvas>
    </div>
  );
};

export default EcosystemMap3D;