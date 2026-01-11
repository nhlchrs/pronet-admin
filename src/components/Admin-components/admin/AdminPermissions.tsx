
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Users, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '../../../components/common/PageMeta';

type Role = 'super_admin' | 'admin' | 'manager' | 'support';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RolePermission {
  role: Role;
  permissions: {
    [key: string]: boolean;
  };
}

const AdminPermissions = () => {
  const { toast } = useToast();
  
  // Sample permissions
  const permissions: Permission[] = [
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Access to view the admin dashboard' },
    { id: 'manage_affiliates', name: 'Manage Affiliates', description: 'Create, edit, and delete affiliates' },
    { id: 'approve_kyc', name: 'Approve KYC', description: 'Verify and approve KYC documents' },
    { id: 'manage_withdrawals', name: 'Manage Withdrawals', description: 'Process withdrawal requests' },
    { id: 'manage_epins', name: 'Manage EPins', description: 'Create and manage EPins' },
    { id: 'manage_announcements', name: 'Manage Announcements', description: 'Create and publish announcements' },
    { id: 'manage_support', name: 'Manage Support', description: 'Handle support tickets' },
    { id: 'view_reports', name: 'View Reports', description: 'Access to financial and system reports' },
    { id: 'manage_settings', name: 'Manage Settings', description: 'Change system settings' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and manage user roles' },
  ];

  // Initial role permissions
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    {
      role: 'super_admin',
      permissions: permissions.reduce((acc, permission) => {
        acc[permission.id] = true;
        return acc;
      }, {} as { [key: string]: boolean }),
    },
    {
      role: 'admin',
      permissions: {
        view_dashboard: true,
        manage_affiliates: true,
        approve_kyc: true,
        manage_withdrawals: true,
        manage_epins: true,
        manage_announcements: true,
        manage_support: true,
        view_reports: true,
        manage_settings: false,
        manage_roles: false,
      },
    },
    {
      role: 'manager',
      permissions: {
        view_dashboard: true,
        manage_affiliates: true,
        approve_kyc: true,
        manage_withdrawals: false,
        manage_epins: true,
        manage_announcements: true,
        manage_support: false,
        view_reports: true,
        manage_settings: false,
        manage_roles: false,
      },
    },
    {
      role: 'support',
      permissions: {
        view_dashboard: true,
        manage_affiliates: false,
        approve_kyc: false,
        manage_withdrawals: false,
        manage_epins: false,
        manage_announcements: false,
        manage_support: true,
        view_reports: false,
        manage_settings: false,
        manage_roles: false,
      },
    },
  ]);

  // Toggle permission for a role
  const togglePermission = (role: Role, permissionId: string) => {
    const updatedRoles = rolePermissions.map((rolePermission) => {
      if (rolePermission.role === role) {
        return {
          ...rolePermission,
          permissions: {
            ...rolePermission.permissions,
            [permissionId]: !rolePermission.permissions[permissionId],
          },
        };
      }
      return rolePermission;
    });

    setRolePermissions(updatedRoles);
  };

  // Save changes
  const saveChanges = () => {
    // In a real app, this would save to backend
    toast({
      title: "Permissions Updated",
      description: "Role permissions have been saved successfully.",
    });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    // Reset permissions to initial state
    toast({
      title: "Permissions Reset",
      description: "Role permissions have been reset to defaults.",
    });
  };

  return (
    <>
      <PageMeta 
        title="Permissions - ProNext Admin Panel" 
        description="Manage role-based access control" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Role Permissions</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Permission Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Customize which permissions are granted to different admin roles in your system.
                Changes will affect all users with the corresponding role.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Super Admin</span>
                  <div className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    All permissions
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Admin</span>
                  <div className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">
                    Most permissions
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Manager</span>
                  <div className="ml-auto text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded">
                    Limited permissions
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Support</span>
                  <div className="ml-auto text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                    Support permissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Permission</TableHead>
                      <TableHead className="text-center">Super Admin</TableHead>
                      <TableHead className="text-center">Admin</TableHead>
                      <TableHead className="text-center">Manager</TableHead>
                      <TableHead className="text-center">Support</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{permission.name}</p>
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={true}
                            disabled={true}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={rolePermissions.find(r => r.role === 'admin')?.permissions[permission.id] || false}
                            onCheckedChange={() => togglePermission('admin', permission.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={rolePermissions.find(r => r.role === 'manager')?.permissions[permission.id] || false}
                            onCheckedChange={() => togglePermission('manager', permission.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={rolePermissions.find(r => r.role === 'support')?.permissions[permission.id] || false}
                            onCheckedChange={() => togglePermission('support', permission.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminPermissions;
