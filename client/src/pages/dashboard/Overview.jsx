import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import StatsCards from '../../components/dashboard/StatsCards'
import QuickActions from '../../components/dashboard/QuickActions'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
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
  const { currentCompany } = useAuth()

  // Fetch recent orders (sales), inventory, inventory alerts, customers, and transactions
  const { data: ordersRes, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/sales/orders', { params: { companyId: currentCompany?.id, limit: 6 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const { data: inventoryRes, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/inventory', { params: { companyId: currentCompany?.id, limit: 6 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const { data: alertsRes, isLoading: alertsLoading } = useQuery({
    queryKey: ['inventoryAlerts', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/inventory/alerts', { params: { companyId: currentCompany?.id } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const { data: customersRes, isLoading: customersLoading } = useQuery({
    queryKey: ['customers', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/customers', { params: { companyId: currentCompany?.id, limit: 6 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const { data: transactionsRes, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/payments/transactions', { params: { companyId: currentCompany?.id, limit: 50 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const orders = ordersRes?.orders || []
  const inventory = inventoryRes?.inventory || []
  const alerts = alertsRes?.alerts || { lowStock: 0, outOfStock: 0, products: { lowStock: [], outOfStock: [] } }
  const customers = customersRes?.customers || []
  const transactions = transactionsRes?.transactions || []

  const { data: workersRes } = useQuery({
    queryKey: ['workers', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/workers', { params: { companyId: currentCompany?.id, limit: 6 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const { data: productsRes } = useQuery({
    queryKey: ['products', currentCompany?.id],
    queryFn: async () => {
      const res = await api.get('/products', { params: { companyId: currentCompany?.id, limit: 6 } })
      return res.data ? res.data : res
    },
    enabled: !!currentCompany,
  })

  const workers = workersRes?.workers || []
  const products = productsRes?.products || []

  const statsData = useMemo(() => ({
    totalWorkers: workersRes?.total || workers.length || 0,
    totalSales: transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0),
    monthlySalary: 0,
    totalProducts: productsRes?.total || products.length || 0,
    activeOrders: ordersRes?.count || orders.length || 0,
    todayAttendance: 0,
  }), [workersRes, productsRes, transactions, ordersRes, workers, products, orders])

  const salesData = useMemo(() => {
    // Build monthly sales data from transactions (group by month)
    if (!transactions || transactions.length === 0) return []
    const map = {}
    transactions.forEach(t => {
      if (t.type !== 'income') return
      const d = new Date(t.date || t.createdAt)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      map[key] = map[key] || { month: `${d.getMonth() + 1}/${d.getFullYear()}`, sales: 0, orders: 0 }
      map[key].sales += t.amount || 0
      map[key].orders += 1
    })
    return Object.values(map).slice(-6)
  }, [transactions])

  const expenseData = useMemo(() => {
    if (!transactions || transactions.length === 0) return []
    const grouped = {}
    transactions.forEach(t => {
      if (t.type !== 'expense') return
      const name = t.description || 'Expense'
      grouped[name] = (grouped[name] || 0) + (t.amount || 0)
    })
    return Object.entries(grouped).map(([name, value], idx) => ({ name, value, color: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'][idx % 5] }))
  }, [transactions])

  const attendanceData = [] // attendance requires separate endpoint — keep empty if not available

  const inventoryData = useMemo(() => {
    if (!inventory || inventory.length === 0) return []
    return inventory.slice(0,6).map(item => ({ name: item.product?.name || item.name || 'Unknown', stock: item.quantity || item.inventory?.quantity || 0, min: item.product?.inventory?.minStock || item.min || 0 }))
  }, [inventory])

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

      <StatsCards data={statsData} />

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
                    {transactionsLoading ? (
                      <div className="flex h-full items-center justify-center">Loading sales...</div>
                    ) : salesData.length === 0 ? (
                      <div className="flex h-full items-center justify-center">No sales data</div>
                    ) : (
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
                    )}
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
                    {attendanceData.length === 0 ? (
                      <div className="flex h-full items-center justify-center">No attendance data</div>
                    ) : (
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
                    )}
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
                    {inventoryLoading ? (
                      <div className="flex h-full items-center justify-center">Loading inventory...</div>
                    ) : inventoryData.length === 0 ? (
                      <div className="flex h-full items-center justify-center">No inventory data</div>
                    ) : (
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
                    )}
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
              {transactionsLoading ? (
                <div className="flex h-full items-center justify-center">Loading expenses...</div>
              ) : expenseData.length === 0 ? (
                <div className="flex h-full items-center justify-center">No expense data</div>
              ) : (
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
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {expenseData.length === 0 ? (
                <div className="col-span-2 text-center text-sm text-muted-foreground">No expenses recorded</div>
              ) : (
                expenseData.map((item) => (
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
                ))
              )}
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
                      Due in 3 days
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
                      {alerts.lowStock ?? 0} products below minimum stock
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
                      {ordersRes?.count ?? orders.length} orders waiting for confirmation
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