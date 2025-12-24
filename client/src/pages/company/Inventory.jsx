import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Package,
  PackagePlus,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Barcode,
  Move,
  History
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const inventoryData = [
    {
      id: 1,
      productCode: 'PROD-001',
      productName: 'Wooden Dining Chair',
      category: 'Furniture',
      currentStock: 85,
      minStock: 50,
      maxStock: 200,
      unit: 'pcs',
      value: '৳212,500',
      lastUpdated: '2024-01-15',
      status: 'in-stock',
    },
    {
      id: 2,
      productCode: 'PROD-002',
      productName: 'Steel Office Table',
      category: 'Furniture',
      currentStock: 42,
      minStock: 40,
      maxStock: 100,
      unit: 'pcs',
      value: '৳285,600',
      lastUpdated: '2024-01-14',
      status: 'in-stock',
    },
    {
      id: 3,
      productCode: 'PROD-003',
      productName: 'Leather Sofa Set',
      category: 'Furniture',
      currentStock: 15,
      minStock: 20,
      maxStock: 50,
      unit: 'set',
      value: '৳480,000',
      lastUpdated: '2024-01-13',
      status: 'low-stock',
    },
    {
      id: 4,
      productCode: 'PROD-004',
      productName: 'Wooden Bed Frame',
      category: 'Furniture',
      currentStock: 28,
      minStock: 30,
      maxStock: 80,
      unit: 'pcs',
      value: '৳238,000',
      lastUpdated: '2024-01-12',
      status: 'low-stock',
    },
    {
      id: 5,
      productCode: 'PROD-005',
      productName: 'Metal Wardrobe',
      category: 'Furniture',
      currentStock: 60,
      minStock: 25,
      maxStock: 100,
      unit: 'pcs',
      value: '৳690,000',
      lastUpdated: '2024-01-11',
      status: 'in-stock',
    },
  ]

  const movementData = [
    { date: 'Jan 10', incoming: 50, outgoing: 35 },
    { date: 'Jan 11', incoming: 30, outgoing: 42 },
    { date: 'Jan 12', incoming: 45, outgoing: 28 },
    { date: 'Jan 13', incoming: 25, outgoing: 38 },
    { date: 'Jan 14', incoming: 60, outgoing: 45 },
    { date: 'Jan 15', incoming: 40, outgoing: 32 },
  ]

  const categoryData = [
    { category: 'Chairs', stock: 120, value: '৳300,000' },
    { category: 'Tables', stock: 85, value: '৳578,000' },
    { category: 'Sofas', stock: 45, value: '৳720,000' },
    { category: 'Beds', stock: 60, value: '৳510,000' },
    { category: 'Wardrobes', stock: 30, value: '৳345,000' },
  ]

  const filteredInventory = inventoryData.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    const colors = {
      'in-stock': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'low-stock': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your inventory in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Stock Count
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2.45M</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +8.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              -3 items from last count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8x</div>
            <p className="text-xs text-muted-foreground">
              Annual inventory turnover
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">All Items</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Movement</CardTitle>
                <CardDescription>
                  Daily incoming and outgoing stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={movementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="incoming"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Incoming Stock"
                      />
                      <Line
                        type="monotone"
                        dataKey="outgoing"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Outgoing Stock"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock by Category</CardTitle>
                <CardDescription>
                  Inventory distribution across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="stock"
                        fill="#8B5CF6"
                        name="Stock Quantity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common inventory management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                  <Barcode className="mb-2 h-5 w-5" />
                  <span className="text-sm">Scan Items</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                  <Move className="mb-2 h-5 w-5" />
                  <span className="text-sm">Transfer Stock</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                  <PackagePlus className="mb-2 h-5 w-5" />
                  <span className="text-sm">Receive Stock</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                  <History className="mb-2 h-5 w-5" />
                  <span className="text-sm">View History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Inventory Items</CardTitle>
                  <CardDescription>
                    Detailed view of all inventory items
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      className="w-64 pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Levels</TableHead>
                    <TableHead>Stock Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productCode}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current: {item.currentStock} {item.unit}</span>
                            <span className="text-muted-foreground">
                              Min: {item.minStock}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-full ${
                                item.status === 'in-stock'
                                  ? 'bg-green-600'
                                  : 'bg-amber-600'
                              }`}
                              style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.value}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.lastUpdated}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>
                Track all inventory movements and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: '2024-01-15 10:30',
                      product: 'Wooden Dining Chair',
                      type: 'Sale',
                      quantity: -5,
                      reference: 'ORD-00123',
                      by: 'Sharmin Akter',
                      remarks: 'Customer order',
                    },
                    {
                      date: '2024-01-14 14:20',
                      product: 'Steel Office Table',
                      type: 'Purchase',
                      quantity: +20,
                      reference: 'PUR-00456',
                      by: 'Abdul Karim',
                      remarks: 'Supplier delivery',
                    },
                    {
                      date: '2024-01-13 11:15',
                      product: 'Leather Sofa Set',
                      type: 'Sale',
                      quantity: -2,
                      reference: 'ORD-00122',
                      by: 'Sharmin Akter',
                      remarks: 'Corporate order',
                    },
                    {
                      date: '2024-01-12 09:45',
                      product: 'Wooden Bed Frame',
                      type: 'Adjustment',
                      quantity: -3,
                      reference: 'ADJ-00789',
                      by: 'System',
                      remarks: 'Damaged stock write-off',
                    },
                    {
                      date: '2024-01-11 16:30',
                      product: 'Metal Wardrobe',
                      type: 'Transfer',
                      quantity: +10,
                      reference: 'TRF-00321',
                      by: 'Kamal Hossain',
                      remarks: 'Warehouse transfer',
                    },
                  ].map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{movement.date}</TableCell>
                      <TableCell className="font-medium">{movement.product}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === 'Sale'
                              ? 'destructive'
                              : movement.type === 'Purchase'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{movement.reference}</TableCell>
                      <TableCell className="text-sm">{movement.by}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {movement.remarks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Summary</CardTitle>
                <CardDescription>
                  Inventory breakdown by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryData.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.stock} items
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(category.stock / 340) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stock Value</span>
                        <span className="font-medium">{category.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Add or edit product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input id="category-name" placeholder="Enter category name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parent-category">Parent Category (Optional)</Label>
                    <select
                      id="parent-category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select parent category</option>
                      <option value="furniture">Furniture</option>
                      <option value="electronics">Electronics</option>
                      <option value="textile">Textile</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-description">Description</Label>
                    <Input id="category-description" placeholder="Brief description" />
                  </div>
                  
                  <Button className="w-full">Add Category</Button>
                </div>
                
                <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h4 className="mb-2 font-medium">Category Tips</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use clear, descriptive category names</li>
                    <li>• Create hierarchical categories for better organization</li>
                    <li>• Regularly review and update categories</li>
                    <li>• Assign products to appropriate categories</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Inventory
