import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera } from '@react-three/drei';
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

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[scale * 0.5, 0]} />
        <meshPhongMaterial color={color} />
      </mesh>
      <Text
        position={[0, -scale * 0.8, 0]}
        fontSize={scale * 0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
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
    const radius = 15;
    const categoryCount = Object.keys(categories).filter(key => visibleCategories[key]).length;
    let categoryIndex = 0;

    Object.entries(categories).forEach(([key, category]) => {
      if (!visibleCategories[key]) return;

      // Calculate category center position
      const angle = (categoryIndex * 2 * Math.PI) / categoryCount;
      const centerX = Math.cos(angle) * radius;
      const centerZ = Math.sin(angle) * radius;

      // Add category node
      visibleNodes.push({
        position: [centerX, 0, centerZ],
        name: category.title,
        color: '#00ff9f',
        scale: 2
      });

      // Add project nodes around category
      const projectCount = category.projects.length;
      const projectRadius = 5;
      
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
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 20, 35]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <fog attach="fog" args={['#000', 20, 80]} />
        {nodes.map((node, index) => (
          <Node key={`${node.name}-${index}`} {...node} />
        ))}
      </Canvas>
    </div>
  );
};

export default EcosystemMap3D;