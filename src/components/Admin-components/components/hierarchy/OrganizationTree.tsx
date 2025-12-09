
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface OrganizationTreeProps {
  highlightNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
}

const OrganizationTree = ({ highlightNodes = [], onNodeClick }: OrganizationTreeProps) => {
  // This is a simplified version of an organizational tree component
  // In a real app, this would receive data to render a dynamic tree
  
  const handleNodeClick = (id: string) => {
    if (onNodeClick) {
      onNodeClick(id);
    }
  };
  
  return (
    <div className="flex flex-col items-center min-w-[800px] p-4">
      {/* Root Node */}
      <div className="pb-10 relative">
        <NodeCard 
          id="node-1" 
          name="John Doe" 
          role="Root Affiliate" 
          statusColor="green" 
          isRoot={true} 
          isHighlighted={highlightNodes.includes('node-1')} 
          onClick={() => handleNodeClick('node-1')}
        />
        
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
      </div>
      
      {/* Level 1 */}
      <div className="flex justify-center gap-10 pb-10">
        <div className="relative">
          <NodeCard 
            id="node-2" 
            name="Alice Smith" 
            role="Gold Affiliate" 
            statusColor="amber" 
            isHighlighted={highlightNodes.includes('node-2')} 
            onClick={() => handleNodeClick('node-2')}
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
        </div>
        <div className="relative">
          <NodeCard 
            id="node-3" 
            name="Bob Johnson" 
            role="Silver Affiliate" 
            statusColor="blue" 
            isHighlighted={highlightNodes.includes('node-3')} 
            onClick={() => handleNodeClick('node-3')}
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
        </div>
        <div className="relative">
          <NodeCard 
            id="node-4" 
            name="Carol Williams" 
            role="Gold Affiliate" 
            statusColor="amber" 
            isHighlighted={highlightNodes.includes('node-4')} 
            onClick={() => handleNodeClick('node-4')}
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-10"></div>
        </div>
      </div>
      
      {/* Level 2 - Under Alice */}
      <div className="flex justify-center gap-6 pb-10">
        <div className="flex gap-4">
          <NodeCard 
            id="node-5" 
            name="Dave Brown" 
            role="Bronze Affiliate" 
            statusColor="orange" 
            isHighlighted={highlightNodes.includes('node-5')} 
            onClick={() => handleNodeClick('node-5')}
          />
          <NodeCard 
            id="node-6" 
            name="Eve Davis" 
            role="Bronze Affiliate" 
            statusColor="orange" 
            isHighlighted={highlightNodes.includes('node-6')} 
            onClick={() => handleNodeClick('node-6')}
          />
        </div>
        
        {/* Level 2 - Under Bob */}
        <div className="flex gap-4">
          <NodeCard 
            id="node-7" 
            name="Frank Miller" 
            role="Bronze Affiliate" 
            statusColor="orange" 
            isHighlighted={highlightNodes.includes('node-7')} 
            onClick={() => handleNodeClick('node-7')}
          />
        </div>
        
        {/* Level 2 - Under Carol */}
        <div className="flex gap-4">
          <NodeCard 
            id="node-8" 
            name="Grace Wilson" 
            role="Silver Affiliate" 
            statusColor="blue" 
            isHighlighted={highlightNodes.includes('node-8')} 
            onClick={() => handleNodeClick('node-8')}
          />
          <NodeCard 
            id="node-9" 
            name="Henry Moore" 
            role="Bronze Affiliate" 
            statusColor="orange" 
            isHighlighted={highlightNodes.includes('node-9')} 
            onClick={() => handleNodeClick('node-9')}
          />
        </div>
      </div>

      {/* The tree could continue with more levels */}
    </div>
  );
};

interface NodeCardProps {
  id: string;
  name: string;
  role: string;
  statusColor: string;
  isRoot?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const NodeCard = ({ id, name, role, statusColor, isRoot = false, isHighlighted = false, onClick }: NodeCardProps) => {
  // Customize the status color based on role
  const getBadgeColor = () => {
    switch (statusColor) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'amber': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card 
      className={`w-40 cursor-pointer hover:shadow-md transition-shadow ${
        isRoot ? 'border-primary' : ''
      } ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      } affiliate-node`} 
      data-id={id}
      onClick={onClick}
    >
      <CardContent className="p-3 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div className="font-medium text-sm">{name}</div>
        <Badge variant="outline" className={`mt-1 text-xs ${getBadgeColor()}`}>
          {role}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default OrganizationTree;
