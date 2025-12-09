
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

const BinaryTree = () => {
  // This is a simplified binary tree visualization
  // In a real app, this would be dynamically rendered based on data
  
  return (
    <div className="flex justify-center min-w-[900px] p-4">
      <div className="flex flex-col items-center">
        {/* Root Node */}
        <div className="pb-10 relative">
          <NodeCard id="node-1" name="John Doe" position="Root" volume={12500} className="border-primary" />
          
          {/* Connector to Level 1 */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
        </div>
        
        {/* Level 1 */}
        <div className="flex justify-between w-[600px] pb-10 relative">
          <div className="relative">
            <NodeCard id="node-2" name="Alice Smith" position="Left" volume={8200} />
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
          </div>
          <div className="relative">
            <NodeCard id="node-3" name="Bob Johnson" position="Right" volume={4300} />
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
          </div>
          
          {/* Horizontal connector between nodes */}
          <div className="absolute top-10 left-[150px] w-[300px] h-0.5 bg-gray-300"></div>
        </div>
        
        {/* Level 2 */}
        <div className="flex justify-between w-[800px]">
          {/* Left side of Level 2 */}
          <div className="flex justify-between w-[250px] relative">
            <NodeCard id="node-4" name="Carol Williams" position="Left" volume={4500} />
            <NodeCard id="node-5" name="David Brown" position="Right" volume={3700} />
            
            {/* Horizontal connector */}
            <div className="absolute top-10 left-[75px] w-[100px] h-0.5 bg-gray-300"></div>
          </div>
          
          {/* Right side of Level 2 */}
          <div className="flex justify-between w-[250px] relative">
            <NodeCard id="node-6" name="Eve Davis" position="Left" volume={2300} />
            <NodeCard id="node-7" name="Frank Miller" position="Right" volume={2000} />
            
            {/* Horizontal connector */}
            <div className="absolute top-10 left-[75px] w-[100px] h-0.5 bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NodeCardProps {
  id: string;
  name: string;
  position: string;
  volume: number;
  className?: string;
}

const NodeCard = ({ id, name, position, volume, className = '' }: NodeCardProps) => {
  const getPositionColor = () => {
    switch (position.toLowerCase()) {
      case 'left': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'right': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <Card className={`w-40 cursor-pointer hover:shadow-md transition-shadow affiliate-node ${className}`} data-id={id}>
      <CardContent className="p-3 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div className="font-medium text-sm">{name}</div>
        <Badge variant="outline" className={`mt-1 text-xs ${getPositionColor()}`}>
          {position}
        </Badge>
        <div className="text-xs text-gray-500 mt-1">
          Volume: ${volume.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default BinaryTree;
