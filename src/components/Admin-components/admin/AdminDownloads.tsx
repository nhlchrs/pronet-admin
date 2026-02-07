
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, Search, Pencil, Trash, Plus, Upload, FileText
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

// Mock downloads data
const mockDownloads = [
  {
    id: "DOC001",
    title: "Affiliate Marketing Guide",
    category: "Marketing",
    date: "2023-05-15",
    fileType: "PDF",
    fileSize: "2.4 MB", 
    downloads: 145,
    forLevel: "All Affiliates",
    description: "A comprehensive guide to affiliate marketing strategies and best practices."
  },
  {
    id: "DOC002",
    title: "Commission Structure Document",
    category: "Finance",
    date: "2023-06-02",
    fileType: "PDF",
    fileSize: "1.2 MB",
    downloads: 203,
    forLevel: "All Affiliates",
    description: "Detailed information about the commission structure and payment methods."
  },
  {
    id: "DOC003",
    title: "Social Media Templates",
    category: "Marketing",
    date: "2023-06-20",
    fileType: "ZIP",
    fileSize: "8.7 MB",
    downloads: 78,
    forLevel: "Gold & Above",
    description: "Collection of social media templates for promotions and marketing campaigns."
  },
  {
    id: "DOC004",
    title: "AI Trading Bot User Guide",
    category: "Product",
    date: "2023-07-10",
    fileType: "PDF",
    fileSize: "3.5 MB",
    downloads: 92,
    forLevel: "Premium Members",
    description: "Complete user guide for setting up and using the AI trading bot."
  },
  {
    id: "DOC005",
    title: "Presentation Slides",
    category: "Marketing",
    date: "2023-07-18",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    downloads: 64,
    forLevel: "Silver & Above",
    description: "Ready-to-use presentation slides for affiliate meetings and presentations."
  }
];

const AdminDownloads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDownload, setCurrentDownload] = useState<any>(null);
  const [isNewDownload, setIsNewDownload] = useState(false);
  const { toast } = useToast();

  // Filter downloads based on search and filters
  const filteredDownloads = mockDownloads.filter((download) => {
    const matchesSearch = 
      download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || download.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (download: any) => {
    setCurrentDownload(download);
    setIsNewDownload(false);
    setIsDialogOpen(true);
  };

  const handleNewDownload = () => {
    setCurrentDownload({
      id: `DOC${String(mockDownloads.length + 1).padStart(3, '0')}`,
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
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: isNewDownload ? "Resource Added" : "Resource Updated",
      description: `The download resource has been ${isNewDownload ? 'added' : 'updated'} successfully.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Resource Deleted",
      description: `Download resource ${id} has been deleted.`,
    });
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
          <Button onClick={handleNewDownload}>
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
              <p className="text-2xl font-bold">{mockDownloads.length}</p>
              <p className="text-sm text-gray-500">Available for download</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockDownloads.reduce((acc, curr) => acc + curr.downloads, 0)}</p>
              <p className="text-sm text-gray-500">All resources combined</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Resource Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{new Set(mockDownloads.map(item => item.category)).size}</p>
              <p className="text-sm text-gray-500">Different categories</p>
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
                    <TableRow key={download.id}>
                      <TableCell className="font-medium">{download.id}</TableCell>
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
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(download)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDelete(download.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                      value={currentDownload.id} 
                      disabled 
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <Input 
                      id="date" 
                      type="date" 
                      defaultValue={currentDownload.date}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title" 
                    defaultValue={currentDownload.title} 
                    placeholder="Enter resource title" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select defaultValue={currentDownload.category}>
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
                    <label htmlFor="forLevel" className="text-sm font-medium">Access Level</label>
                    <Select defaultValue={currentDownload.forLevel}>
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
                    defaultValue={currentDownload.description} 
                    placeholder="Enter resource description..." 
                  />
                </div>
                <div className="pt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag and drop a file here, or click to select a file
                    </p>
                    <Button variant="outline" className="mt-4">
                      Select File
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                    />
                    {!isNewDownload && (
                      <p className="mt-2 text-xs text-gray-400">
                        Current file: {currentDownload.fileType} ({currentDownload.fileSize})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isNewDownload ? "Upload" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDownloads;
