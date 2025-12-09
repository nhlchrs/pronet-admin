import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, ZoomIn, ZoomOut, Download, RefreshCw, Network, GitFork
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BinaryTree from '@/components/hierarchy/BinaryTree';
import OrganizationTree from '@/components/hierarchy/OrganizationTree';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AffiliateProfile, { AffiliateData } from '@/components/affiliate/AffiliateProfile';

const AffiliateTree = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [treeType, setTreeType] = useState('organization');
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateData | null>(null);
  
  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement search logic here
  };

  // Mock function to show the affiliate profile when a node is clicked
  const handleNodeClick = (affiliateId: string) => {
    // In a real app, you would fetch the affiliate data from your API
    // For now, we'll use mock data
    const mockAffiliate: AffiliateData = {
      id: affiliateId,
      name: `John Doe (${affiliateId})`,
      email: 'johndoe@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, Country',
      joinDate: '2023-06-15',
      status: 'active',
      level: 'Gold',
      teamSize: 24,
      directReferrals: 5,
      earnings: {
        total: 5280,
        monthly: 420,
        pending: 150
      },
      kyc: 'verified'
    };
    
    setSelectedAffiliate(mockAffiliate);
  };

  React.useEffect(() => {
    // Add event listeners to tree nodes for demo purposes
    const setupTreeNodeListeners = () => {
      setTimeout(() => {
        const treeNodes = document.querySelectorAll('.affiliate-node');
        
        treeNodes.forEach((node) => {
          node.addEventListener('click', (e) => {
            const nodeId = (e.currentTarget as HTMLElement).dataset.id || 'node-1';
            handleNodeClick(nodeId);
          });
        });
      }, 500); // Give time for the tree to render
    };

    setupTreeNodeListeners();
    
    // Re-setup listeners when tree type changes
    return () => {
      const treeNodes = document.querySelectorAll('.affiliate-node');
      treeNodes.forEach((node) => {
        node.removeEventListener('click', () => {});
      });
    };
  }, [treeType]);

  return (
    <div>
      <div className="space-y-6">
     <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
  <h1 className="text-2xl font-bold text-center sm:text-left">
    Affiliate Tree Structure
  </h1>

  <div className="flex flex-wrap justify-center sm:justify-end gap-2">
    <Button variant="outline" className="w-full sm:w-auto">
      <Download className="mr-2 h-4 w-4" />
      Export Tree
    </Button>
    <Button
      variant="outline"
      onClick={() => setZoomLevel(100)}
      className="w-full sm:w-auto"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Reset View
    </Button>
  </div>
</div>

        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex justify-between items-center">
              <span>Network Visualization</span>
              <div className="flex items-center space-x-2 text-sm">
                <span>Zoom: {zoomLevel}%</span>
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <form onSubmit={handleSearch} className="flex w-full sm:w-1/3 relative">
                <Input 
                  placeholder="Search affiliate by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="submit"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm">Tree Type:</span>
                <Select 
                  value={treeType} 
                  onValueChange={setTreeType}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue>
                      {treeType === 'organization' ? (
                        <div className="flex items-center">
                          <Network className="mr-2 h-4 w-4" />
                          <span>Organization</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <GitFork className="mr-2 h-4 w-4" />
                          <span>Binary</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organization">
                      <div className="flex items-center">
                        <Network className="mr-2 h-4 w-4" />
                        <span>Organization Tree</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="binary">
                      <div className="flex items-center">
                        <GitFork className="mr-2 h-4 w-4" />
                        <span>Binary Tree</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs value={treeType} onValueChange={setTreeType}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="organization">Organization Tree</TabsTrigger>
                <TabsTrigger value="binary">Binary Tree</TabsTrigger>
              </TabsList>
              <TabsContent value="organization" className="border rounded-lg p-4">
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', minHeight: '500px' }}>
                  <OrganizationTree />
                </div>
              </TabsContent>
              <TabsContent value="binary" className="border rounded-lg p-4">
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', minHeight: '500px' }}>
                  <BinaryTree />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                <strong>Note:</strong> Click on an affiliate to see their details and expand/collapse their downline. 
                Use the search box to find specific affiliates in the structure.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Network Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Affiliates</span>
                  <span className="font-medium">285</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Maximum Depth</span>
                  <span className="font-medium">8 levels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Width at Level 1</span>
                  <span className="font-medium">12 affiliates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Most Active Branch</span>
                  <span className="font-medium">Left branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weakest Branch</span>
                  <span className="font-medium">Right branch</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { level: 'Level 1', count: 12, percentage: 90 },
                  { level: 'Level 2', count: 35, percentage: 80 },
                  { level: 'Level 3', count: 68, percentage: 65 },
                  { level: 'Level 4', count: 85, percentage: 50 },
                  { level: 'Level 5+', count: 85, percentage: 30 },
                ].map((level) => (
                  <div key={level.level} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{level.level}</span>
                      <span>{level.count} affiliates</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${level.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance by Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Left Branch</span>
                  <span className="font-medium">157 affiliates</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Right Branch</span>
                  <span className="font-medium">128 affiliates</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Left Sales Volume</span>
                    <span className="font-medium">$124,580</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Right Sales Volume</span>
                    <span className="font-medium">$86,320</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Balance</span>
                    <span className="font-medium text-amber-600">69.3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Profile Dialog */}
        <Dialog open={!!selectedAffiliate} onOpenChange={(open) => !open && setSelectedAffiliate(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            {selectedAffiliate && (
              <AffiliateProfile 
                affiliate={selectedAffiliate}
                onClose={() => setSelectedAffiliate(null)}
                isAdmin={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>  );
};

export default AffiliateTree;
