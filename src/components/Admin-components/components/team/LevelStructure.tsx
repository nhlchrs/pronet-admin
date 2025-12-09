
import React from 'react';
import { Card } from '@/components/ui/card';

// Mock data for level structure
const levelData = [
  { level: 1, members: 8, active: 8, inactive: 0, volume: '$4,500.00' },
  { level: 2, members: 24, active: 22, inactive: 2, volume: '$12,750.00' },
  { level: 3, members: 56, active: 48, inactive: 8, volume: '$28,400.00' },
  { level: 4, members: 94, active: 78, inactive: 16, volume: '$36,900.00' },
];

const LevelStructure = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {levelData.map((level) => (
        <Card key={level.level} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="font-medium">Level {level.level}</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              {level.members} Members
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">Active Members:</div>
            <div className="text-sm font-medium text-right">{level.active}</div>
            
            <div className="text-sm text-muted-foreground">Inactive Members:</div>
            <div className="text-sm font-medium text-right">{level.inactive}</div>
            
            <div className="text-sm text-muted-foreground">Level Volume:</div>
            <div className="text-sm font-medium text-right">{level.volume}</div>
            
            <div className="text-sm text-muted-foreground">Completion:</div>
            <div className="text-sm font-medium text-right">
              {Math.round((level.active / level.members) * 100)}%
            </div>
          </div>

          <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.round((level.active / level.members) * 100)}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LevelStructure;
