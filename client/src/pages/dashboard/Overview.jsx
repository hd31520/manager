import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import StatsCards from '../../components/dashboard/StatsCards'
import QuickActions from '../../components/dashboard/QuickActions'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Calendar, Download, Filter } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Dashboard = () => {
  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 24 },
    { month: 'Feb', sales: 3000, orders: 18 },
    { month: 'Mar', sales: 5000, orders: 30 },
    { month: 'Apr', sales: 4500, orders: 27 },
    { month: 'May', sales: 6000, orders: 36 },
    { month: 'Jun', sales: 5500, orders: 33 },
  ]

  const expenseData = [
    { name: 'Salary', value: 40000, color: '#3B82F6' },
    { name: 'Raw Materials', value: 30000, color: '#10B981' },
    { name: 'Rent', value: 15000, color: '#F59E0B' },
    { name: 'Utilities', value: 8000, color: '#EF4444' },
    { name: 'Others', value: 7000, color: '#8B5CF6' },
  ]

  const attendanceData = [
    { day: 'Mon', present: 85, absent: 15 },
    { day: 'Tue', present: 90, absent: 10 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 92, absent: 8 },
    { day: 'Fri', present: 87, absent: 13 },
    { day: 'Sat', present: 80, absent: 20 },
  ]

  const inventoryData = [
    { name: 'Wooden Chair', stock: 120, min: 50 },
    { name: 'Steel Table', stock: 85, min: 40 },
    { name: 'Sofa Set', stock: 45, min: 20 },
    { name: 'Bed Frame', stock: 60, min: 30 },
    { name: 'Wardrobe', stock: 30, min: 15 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <Tabs defaultValue="sales">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <TabsContent value="sales" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>
                    Monthly sales performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Sales (BDT)"
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Orders"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Attendance</CardTitle>
                  <CardDescription>
                    Worker attendance percentage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="present"
                          fill="#10B981"
                          name="Present %"
                        />
                        <Bar
                          dataKey="absent"
                          fill="#EF4444"
                          name="Absent %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>
                    Current stock levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="stock"
                          fill="#3B82F6"
                          name="Current Stock"
                        />
                        <Bar
                          dataKey="min"
                          fill="#F59E0B"
                          name="Minimum Required"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="col-span-3 space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Monthly expense breakdown
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`৳${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="ml-auto text-sm font-medium">
                    ৳{item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              Pending actions for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Salary Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Due in 3 days for 25 workers
                    </p>
                  </div>
                  <Button size="sm">Process</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Low Stock Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      5 products below minimum stock
                    </p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pending Orders</h4>
                    <p className="text-sm text-muted-foreground">
                      8 orders waiting for confirmation
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monthly Report</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate December 2024 report
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Generate</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard