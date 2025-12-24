import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  BarChart,
  PieChart,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Printer,
  Mail
} from 'lucide-react'
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
} from 'recharts'

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales')
  
  const salesData = [
    { month: 'Jan', sales: 400000, target: 350000 },
    { month: 'Feb', sales: 300000, target: 350000 },
    { month: 'Mar', sales: 500000, target: 400000 },
    { month: 'Apr', sales: 450000, target: 400000 },
    { month: 'May', sales: 600000, target: 450000 },
    { month: 'Jun', sales: 550000, target: 500000 },
  ]

  const expenseData = [
    { name: 'Salary', value: 400000, color: '#3B82F6' },
    { name: 'Raw Materials', value: 300000, color: '#10B981' },
    { name: 'Rent & Utilities', value: 150000, color: '#F59E0B' },
    { name: 'Marketing', value: 50000, color: '#8B5CF6' },
    { name: 'Others', value: 75000, color: '#EC4899' },
  ]

  const productPerformance = [
    { product: 'Wooden Chair', sales: 425000, units: 170, growth: '+12%' },
    { product: 'Office Table', sales: 285600, units: 42, growth: '+8%' },
    { product: 'Sofa Set', sales: 480000, units: 15, growth: '+25%' },
    { product: 'Bed Frame', sales: 238000, units: 28, growth: '+5%' },
    { product: 'Wardrobe', sales: 345000, units: 30, growth: '+18%' },
  ]

  const recentReports = [
    { id: 1, name: 'Monthly Sales Report', type: 'Sales', date: '2024-01-15', size: '2.4 MB' },
    { id: 2, name: 'Salary Report - Jan 2024', type: 'Salary', date: '2024-01-31', size: '1.8 MB' },
    { id: 3, name: 'Inventory Status', type: 'Inventory', date: '2024-01-30', size: '3.2 MB' },
    { id: 4, name: 'Customer Analysis', type: 'Customer', date: '2024-01-28', size: '2.1 MB' },
    { id: 5, name: 'Profit & Loss Statement', type: 'Financial', date: '2024-01-25', size: '4.5 MB' },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate insights and download business reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2.8M</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +15.5% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1.05M</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              -3.2% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1.75M</div>
            <p className="text-xs text-muted-foreground">
              62.5% profit margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +8 from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>
                  Monthly sales vs target comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']} />
                      <Legend />
                      <Bar dataKey="sales" fill="#10B981" name="Actual Sales" />
                      <Bar dataKey="target" fill="#3B82F6" name="Target Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Top selling products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales Revenue</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productPerformance.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>৳{product.sales.toLocaleString()}</TableCell>
                        <TableCell>{product.units}</TableCell>
                        <TableCell>
                          <Badge variant={product.growth.startsWith('+') ? 'default' : 'destructive'}>
                            {product.growth}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>
                  Breakdown of business expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>
                  Quarterly financial summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-medium text-green-600">৳2,800,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost of Goods Sold</span>
                      <span className="font-medium text-red-600">৳1,200,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Profit</span>
                      <span className="font-medium">৳1,600,000</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Operating Expenses</span>
                      <span className="font-medium text-red-600">৳450,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salary Expenses</span>
                      <span className="font-medium text-red-600">৳400,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Expenses</span>
                      <span className="font-medium text-red-600">৳200,000</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Net Profit</span>
                      <span className="text-xl text-green-600">৳1,750,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Profit Margin</span>
                      <span>62.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Analysis</CardTitle>
                <CardDescription>
                  Stock levels and turnover rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', stock: 120, sales: 85 },
                        { month: 'Feb', stock: 110, sales: 78 },
                        { month: 'Mar', stock: 95, sales: 92 },
                        { month: 'Apr', stock: 130, sales: 65 },
                        { month: 'May', stock: 145, sales: 88 },
                        { month: 'Jun', stock: 125, sales: 95 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="stock" stroke="#3B82F6" name="Stock Level" />
                      <Line type="monotone" dataKey="sales" stroke="#10B981" name="Units Sold" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Turnover</CardTitle>
                  <CardDescription>
                    Inventory turnover by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Furniture', turnover: '2.8x', days: 32 },
                      { category: 'Electronics', turnover: '4.2x', days: 22 },
                      { category: 'Textile', turnover: '3.5x', days: 26 },
                      { category: 'Accessories', turnover: '5.1x', days: 18 },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-sm text-muted-foreground">
                            Avg. {item.days} days
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.turnover}</div>
                          <div className="text-sm text-muted-foreground">Turnover rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>
                    Products needing restocking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { product: 'Leather Sofa Set', stock: 15, min: 20 },
                      { product: 'Wooden Bed Frame', stock: 28, min: 30 },
                      { product: 'Coffee Table', stock: 8, min: 15 },
                      { product: 'Dining Chair', stock: 25, min: 50 },
                    ].map((item) => (
                      <div key={item.product} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.product}</div>
                            <div className="text-sm text-muted-foreground">
                              Stock: {item.stock} | Min: {item.min}
                            </div>
                          </div>
                          <Badge variant="destructive">Low Stock</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analysis</CardTitle>
                <CardDescription>
                  Customer segmentation and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { segment: 'Corporate', count: 15, revenue: 1750000 },
                        { segment: 'Wholesale', count: 25, revenue: 850000 },
                        { segment: 'Retail', count: 45, revenue: 200000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segment" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Customer Count" />
                      <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue (BDT)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Loyalty</CardTitle>
                  <CardDescription>
                    Repeat customer analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { level: 'New Customers', count: 8, percentage: 9.4 },
                      { level: 'Regular (1-5 orders)', count: 45, percentage: 52.9 },
                      { level: 'Loyal (6-10 orders)', count: 25, percentage: 29.4 },
                      { level: 'VIP (10+ orders)', count: 7, percentage: 8.2 },
                    ].map((item) => (
                      <div key={item.level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.level}</span>
                          <span className="text-sm text-muted-foreground">{item.count} customers</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>
                    Highest spending customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { customer: 'DEF Enterprises', spent: '৳2,100,000', orders: 42 },
                      { customer: 'ABC Corporation', spent: '৳1,250,000', orders: 35 },
                      { customer: 'GHI Traders', spent: '৳950,000', orders: 28 },
                      { customer: 'XYZ Retail', spent: '৳850,000', orders: 25 },
                    ].map((customer, index) => (
                      <div key={customer.customer} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{customer.customer}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.orders} orders
                            </div>
                          </div>
                        </div>
                        <div className="font-bold">{customer.spent}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>All Generated Reports</CardTitle>
              <CardDescription>
                Access and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{report.date}</TableCell>
                      <TableCell className="text-sm">{report.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>
                  Create a report with specific parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <select
                      id="report-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select report type</option>
                      <option value="sales">Sales Report</option>
                      <option value="inventory">Inventory Report</option>
                      <option value="financial">Financial Report</option>
                      <option value="customer">Customer Report</option>
                      <option value="salary">Salary Report</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <select
                      id="format"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>
                  Predefined report templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Monthly Sales Summary', desc: 'Sales performance overview' },
                    { name: 'Inventory Status Report', desc: 'Stock levels and alerts' },
                    { name: 'Customer Purchase History', desc: 'Detailed customer analysis' },
                    { name: 'Salary Payment Report', desc: 'Salary breakdown and payments' },
                    { name: 'Profit & Loss Statement', desc: 'Financial performance' },
                  ].map((template) => (
                    <div key={template.name} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.desc}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports