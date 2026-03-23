
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, Search, Pencil, Trash, Plus, Upload, FileText, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '../../../components/common/PageMeta';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadsService, DownloadResource, DownloadStats } from '../../../services/downloadsService';

const AdminDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadResource[]>([]);
  const [stats, setStats] = useState<DownloadStats>({ totalResources: 0, totalDownloads: 0, totalCategories: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDownload, setCurrentDownload] = useState<any>(null);
  const [isNewDownload, setIsNewDownload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch downloads on mount
  useEffect(() => {
    fetchDownloads();
    fetchStats();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await downloadsService.getAllDownloads();
      if (response.success) {
        setDownloads(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch downloads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await downloadsService.getDownloadStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Filter downloads based on search and filters
  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch = 
      download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (download.id || download._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || download.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (download: DownloadResource) => {
    setCurrentDownload(download);
    setIsNewDownload(false);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleNewDownload = () => {
    setCurrentDownload({
      title: "",
      category: "General",
      date: new Date().toISOString().split('T')[0],
      fileType: "PDF",
      fileSize: "0 MB",
      downloads: 0,
      forLevel: "All Affiliates",
      description: ""
    });
    setIsNewDownload(true);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Auto-populate file info
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      setCurrentDownload((prev: any) => ({
        ...prev,
        fileType: fileExtension,
        fileSize: `${fileSizeMB} MB`,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validation
      if (!currentDownload.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a title",
          variant: "destructive",
        });
        return;
      }

      if (isNewDownload && !selectedFile) {
        toast({
          title: "Validation Error",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('title', currentDownload.title);
      formData.append('category', currentDownload.category);
      formData.append('forLevel', currentDownload.forLevel);
      formData.append('description', currentDownload.description);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      let response;
      if (isNewDownload) {
        response = await downloadsService.createDownload(formData);
      } else {
        response = await downloadsService.updateDownload(currentDownload._id || currentDownload.id, formData);
      }

      if (response.success) {
        toast({
          title: isNewDownload ? "Resource Added" : "Resource Updated",
          description: response.message || `The download resource has been ${isNewDownload ? 'added' : 'updated'} successfully.`,
        });
        setIsDialogOpen(false);
        fetchDownloads();
        fetchStats();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save download resource",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await downloadsService.deleteDownload(id);
      if (response.success) {
        toast({
          title: "Resource Deleted",
          description: `Download resource has been deleted successfully.`,
        });
        fetchDownloads();
        fetchStats();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete download resource",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (download: DownloadResource) => {
    try {
      const id = download._id || download.id;
      if (!id) return;

      // Track download
      await downloadsService.trackDownload(id);

      // Download file
      const blob = await downloadsService.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = download.fileName || download.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh downloads to update count
      fetchDownloads();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'zip': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'pptx': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'docx': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'xlsx': return <FileText className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <PageMeta 
        title="Downloads - ProNet Admin Panel" 
        description="Manage downloadable resources and files" 
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Download Center Management</h1>
          <Button onClick={handleNewDownload} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Resource
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.totalResources}</p>
                  <p className="text-sm text-gray-500">Available for download</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                  <p className="text-sm text-gray-500">All resources combined</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Resource Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.totalCategories}</p>
                  <p className="text-sm text-gray-500">Different categories</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Download Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search resources..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading resources...</span>
                </div>
              ) : filteredDownloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="font-medium">No resources found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDownloads.map((download) => (
                      <TableRow key={download._id || download.id}>
                        <TableCell className="font-medium">{download.id || download._id?.slice(-6)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getFileIcon(download.fileType)}
                            <span className="ml-2">{download.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{download.category}</TableCell>
                        <TableCell>{download.fileType}</TableCell>
                        <TableCell>{download.fileSize}</TableCell>
                        <TableCell>{download.forLevel}</TableCell>
                        <TableCell>{download.downloads}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownload(download)}
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(download)}
                              title="Edit resource"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => handleDelete(download._id || download.id || '')}
                              title="Delete resource"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewDownload ? "Add New Resource" : "Edit Resource"}</DialogTitle>
            <DialogDescription>
              {isNewDownload ? "Add a new downloadable resource for affiliates." : "Make changes to the download resource."}
            </DialogDescription>
          </DialogHeader>
          {currentDownload && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="id" className="text-sm font-medium">ID</label>
                    <Input 
                      id="id" 
                      value={currentDownload._id || currentDownload.id || 'Auto-generated'} 
                      disabled 
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={currentDownload.date}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="text-sm font-medium">Title *</label>
                  <Input 
                    id="title" 
                    value={currentDownload.title} 
                    onChange={(e) => setCurrentDownload({...currentDownload, title: e.target.value})}
                    placeholder="Enter resource title" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="text-sm font-medium">Category *</label>
                    <Select 
                      value={currentDownload.category}
                      onValueChange={(value) => setCurrentDownload({...currentDownload, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="forLevel" className="text-sm font-medium">Access Level *</label>
                    <Select 
                      value={currentDownload.forLevel}
                      onValueChange={(value) => setCurrentDownload({...currentDownload, forLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Users">All Users</SelectItem>
                        <SelectItem value="All Affiliates">All Affiliates</SelectItem>
                        <SelectItem value="Silver & Above">Silver & Above</SelectItem>
                        <SelectItem value="Gold & Above">Gold & Above</SelectItem>
                        <SelectItem value="Platinum Only">Platinum Only</SelectItem>
                        <SelectItem value="Premium Members">Premium Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="description" 
                    rows={3}
                    value={currentDownload.description} 
                    onChange={(e) => setCurrentDownload({...currentDownload, description: e.target.value})}
                    placeholder="Enter resource description..." 
                  />
                </div>
                <div className="pt-4">
                  <label className="text-sm font-medium">
                    {isNewDownload ? 'Upload File *' : 'Change File (Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select a file'}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      type="button"
                    >
                      Select File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                    />
                    {!isNewDownload && !selectedFile && currentDownload.fileType && (
                      <p className="mt-2 text-xs text-gray-400">
                        Current file: {currentDownload.fileType} ({currentDownload.fileSize})
                      </p>
                    )}
                    {selectedFile && (
                      <p className="mt-2 text-xs text-green-600">
                        New file selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isNewDownload ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>{isNewDownload ? 'Upload' : 'Save Changes'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDownloads;
