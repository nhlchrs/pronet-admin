import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Users, TrendingUp, Award, DollarSign, ChevronDown, Key } from 'lucide-react';
import teamReferralService, { setAuthToken } from '../../services/teamReferralService';
import { useAuth } from '../../context/AuthContext';
import './OrgChart.css';

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
  targetUserId?: string;
}

interface OrgChartNodeProps {
  member: any;
  targetUserId?: string;
  maxDepth?: number;
  currentDepth?: number;
}

const OrgChartNode = ({ member, targetUserId, maxDepth = 5, currentDepth = 0 }: OrgChartNodeProps) => {
  const hasChildren = member.teamMembers && member.teamMembers.length > 0;
  const isTargetUser = member.userId?._id === targetUserId || member.isTargetUser;

  if (currentDepth > maxDepth) {
    return null;
  }

  const userName = member.userId?.fname && member.userId?.lname 
    ? `${member.userId.fname} ${member.userId.lname}` 
    : member.userId?.name || 'Unknown';

  return (
    <div className="org-node">
      <div className={`org-node-content ${isTargetUser ? 'target-user' : ''}`}>
        <div className="org-node-name">
          {userName}
          {isTargetUser && <span className="target-badge-org">TARGET</span>}
          <span className="level-badge-org">L{member.level}</span>
        </div>
        {member.userId?.email && (
          <div className="org-node-email">{member.userId.email}</div>
        )}
        {member.referralCode && (
          <div className="referral-code-org">🔑 {member.referralCode}</div>
        )}
        <div className="org-node-stats">
          <div className="org-stat">
            <div className="org-stat-value">{member.directCount || 0}</div>
            <div className="org-stat-label">Direct</div>
          </div>
          <div className="org-stat">
            <div className="org-stat-value">{member.totalDownline || 0}</div>
            <div className="org-stat-label">Team</div>
          </div>
          {member.totalEarnings > 0 && (
            <div className="org-stat">
              <div className="org-stat-value">${(member.totalEarnings || 0).toFixed(0)}</div>
              <div className="org-stat-label">Earned</div>
            </div>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className={`org-children ${member.teamMembers.length === 1 ? 'single-child' : ''}`}>
          {member.teamMembers.map((child: any, index: number) => (
            <OrgChartNode
              key={child._id || index}
              member={child}
              targetUserId={targetUserId}
              maxDepth={maxDepth}
              currentDepth={currentDepth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyNode = ({ node, level, targetUserId }: HierarchyNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const userName = node.userId?.fname && node.userId?.lname 
    ? `${node.userId.fname} ${node.userId.lname}`
    : node.userId?.email || 'Unknown User';
  
  const isTargetUser = node.userId?._id === targetUserId || node.isTargetUser;

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
        <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
          isTargetUser 
            ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-400 shadow-xl ring-2 ring-green-300' 
            : 'bg-gradient-to-r from-purple-50 to-indigo-100 border-purple-200 hover:shadow-lg hover:border-purple-400'
        }`}>
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 text-white rounded-full text-sm font-bold shadow-md ${
              isTargetUser 
                ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                : 'bg-gradient-to-br from-purple-600 to-indigo-600'
            }`}>
              {level + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">
                {userName}
                {isTargetUser && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">(Target User)</span>}
              </p>
              <Badge variant="outline" className={`text-xs ${
                isTargetUser 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'bg-purple-50 border-purple-300 text-purple-700'
              }`}>
                Level {node.level}
              </Badge>
              {node.referralCode && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border ${
                  isTargetUser 
                    ? 'text-green-600 bg-green-50 border-green-200' 
                    : 'text-purple-600 bg-purple-50 border-purple-200'
                }`}>
                  <Key className="w-3 h-3" />
                  {node.referralCode}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">{node.userId?.email}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className={`text-sm font-bold ${isTargetUser ? 'text-green-600' : 'text-purple-600'}`}>{node.directCount}</div>
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
            <HierarchyNode key={idx} node={child} level={level + 1} targetUserId={targetUserId} />
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
  const { token } = useAuth();
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId && token) {
      fetchHierarchy();
    }
  }, [userId, token]);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Set auth token before making request
      if (token) {
        setAuthToken(token);
      }
      
      console.log('Fetching hierarchy for userId:', userId, 'with depth:', depth);
      const result = await teamReferralService.getDownlineStructure(userId, depth);
      console.log('Hierarchy API Response:', result);

      if (result.success) {
        setHierarchy(result.data.hierarchy);
        setTargetUserId(result.data.targetUserId || userId);
      } else {
        setError(result.message || 'Failed to load hierarchy');
      }
    } catch (err: any) {
      console.error('Hierarchy fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch hierarchy');
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

  // Count total members recursively
  const countTeamMembers = (node: any): number => {
    if (!node) return 0;
    let count = 1; // Count current node
    if (node.children && node.children.length > 0) {
      count += node.children.reduce((sum: number, child: any) => sum + countTeamMembers(child), 0);
    }
    return count;
  };

  const totalMembers = countTeamMembers(hierarchy);
  const directReferrals = hierarchy?.directCount || 0;
  const totalEarnings = hierarchy?.totalEarnings || 0;

  return (
    <div className="space-y-4">
      {/* Summary Stats with Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Team</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Direct Referrals</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{directReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600 mt-1">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchy Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Complete Team Hierarchy - Organizational Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="org-chart-container">
            <div className="org-tree">
              <OrgChartNode member={hierarchy} targetUserId={targetUserId} maxDepth={5} />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t space-y-2 text-sm">
            <p className="font-semibold text-gray-700">Legend:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• <span className="font-semibold text-green-600">Green boxes</span> highlight the target user</li>
              <li>• <span className="font-semibold text-purple-600">Purple boxes</span> represent other team members</li>
              <li>• Lines connect team members to their sponsors</li>
              <li>• Level (L) = User's achievement level based on direct count</li>
              <li>• Direct = Number of direct referrals, Team = Total downline</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamHierarchy;
