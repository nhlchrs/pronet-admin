
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Users,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageBonusStructure = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Bonus structure updated",
      description: "The bonus structure has been updated successfully.",
    });
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bonus Structure Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Direct Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="10"
                  className="text-right font-semibold" 
                />
                <span className="text-lg font-semibold">%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-orange-500" />
                Team Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="5"
                  className="text-right font-semibold" 
                />
                <span className="text-lg font-semibold">%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Monthly Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="8"
                  className="text-right font-semibold" 
                />
                <span className="text-lg font-semibold">%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Percent className="mr-2 h-5 w-5 text-blue-500" />
                Lifestyle Fund
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="2"
                  className="text-right font-semibold" 
                />
                <span className="text-lg font-semibold">%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Level-wise Bonus Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Direct Bonus (%)</TableHead>
                  <TableHead>Team Bonus (%)</TableHead>
                  <TableHead>Monthly Target</TableHead>
                  <TableHead>Monthly Bonus (%)</TableHead>
                  <TableHead>Binary Bonus (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { level: "Bronze", direct: 10, team: 3, target: "$1,000", monthly: 5, binary: 2 },
                  { level: "Silver", direct: 12, team: 5, target: "$3,000", monthly: 8, binary: 3 },
                  { level: "Gold", direct: 15, team: 7, target: "$5,000", monthly: 10, binary: 5 },
                  { level: "Platinum", direct: 20, team: 10, target: "$10,000", monthly: 12, binary: 7 },
                  { level: "Diamond", direct: 25, team: 12, target: "$20,000", monthly: 15, binary: 10 },
                ].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.level}</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={row.direct} className="w-20 text-right" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={row.team} className="w-20 text-right" />
                    </TableCell>
                    <TableCell>{row.target}</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={row.monthly} className="w-20 text-right" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={row.binary} className="w-20 text-right" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>  );
};

export default ManageBonusStructure;
