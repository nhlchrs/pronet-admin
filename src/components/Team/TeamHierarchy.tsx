import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Users, TrendingUp, ChevronDown } from 'lucide-react';
import teamReferralService from '../../services/teamReferralService';

// Card and Badge components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'outline'; className?: string }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-700',
    outline: 'bg-white border border-gray-300 text-gray-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface HierarchyNodeProps {
  node: any;
  level: number;
}

const HierarchyNode = ({ node, level }: HierarchyNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-2">
      {/* Node */}
      <div
        style={{
          marginLeft: `${level * 24}px`,
          paddingLeft: `${level > 0 ? '16px' : '0'}px`,
          borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
        }}
      >
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
              {level + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">
                {node.userId?.fname} {node.userId?.lname}
              </p>
              <Badge variant="outline" className="text-xs">
                Level {node.level}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">{node.userId?.email}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-sm font-bold text-blue-600">{node.directCount}</div>
            <p className="text-xs text-gray-500">directs</p>
          </div>
          {node.totalEarnings > 0 && (
            <div className="flex-shrink-0 text-right ml-2 pl-2 border-l border-gray-300">
              <div className="text-sm font-bold text-green-600">
                ${(node.totalEarnings || 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">earnings</p>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && (
        <div>
          {node.children.map((child: any, idx: number) => (
            <HierarchyNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TeamHierarchyProps {
  userId: string;
  depth?: number;
}

export const TeamHierarchy = ({ userId, depth = 5 }: TeamHierarchyProps) => {
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHierarchy();
  }, [userId]);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await teamReferralService.getDownlineStructure(userId, depth);

      if (result.success) {
        setHierarchy(result.data.hierarchy);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch hierarchy');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-2">Loading team hierarchy...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hierarchy) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No team hierarchy data available</p>
        </CardContent>
      </Card>
    );
  }

  // Count total members
  const countMembers = (node: any): number => {
    let count = 1;
    if (node.children) {
      count += node.children.reduce((sum: number, child: any) => sum + countMembers(child), 0);
    }
    return count;
  };

  const totalMembers = countMembers(hierarchy);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-gray-600">All levels included</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Direct Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{hierarchy.directCount}</div>
            <p className="text-xs text-gray-600">Level 1 members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(hierarchy.totalEarnings || 0).toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">Network income</p>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchy Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Team Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 overflow-x-auto">
          <HierarchyNode node={hierarchy} level={0} />

          {/* Legend */}
          <div className="mt-6 pt-4 border-t space-y-2 text-sm">
            <p className="font-semibold text-gray-700">Legend:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Number in circle = Position in hierarchy (1 = You, 2 = Your directs, etc.)</li>
              <li>• Vertical lines connect team members to their sponsors</li>
              <li>• Level = User's achievement level based on direct count</li>
              <li>• Direct count shown on the right = Number of direct referrals</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamHierarchy;
