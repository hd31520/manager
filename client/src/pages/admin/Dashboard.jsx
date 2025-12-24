import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Download,
  MoreVertical
} from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,248', icon: Users, change: '+12%', trend: 'up' },
    { title: 'Active Companies', value: '156', icon: Building, change: '+8%', trend: 'up' },
    { title: 'Monthly Revenue', value: '৳78,500', icon: DollarSign, change: '+23%', trend: 'up' },
    { title: 'Platform Uptime', value: '99.8%', icon: Activity, change: '+0.2%', trend: 'up' },
  ]

  const recentCompanies = [
    { id: 1, name: 'Karim Furniture', type: 'Wood Factory', users: 25, plan: 'Premium', status: 'active' },
    { id: 2, name: 'Textile Mart', type: 'Textile Shop', users: 12, plan: 'Standard', status: 'active' },
    { id: 3, name: 'Metal Works Inc', type: 'Iron Factory', users: 8, plan: 'Basic', status: 'active' },
    { id: 4, name: 'Food Processing', type: 'Food Factory', users: 18, plan: 'Premium', status: 'pending' },
    { id: 5, name: 'Plastic Products', type: 'Plastic Factory', users: 6, plan: 'Basic', status: 'suspended' },
  ]

  const recentUsers = [
    { id: 1, name: 'Abdul Karim', email: 'abdul@example.com', company: 'Karim Furniture', role: 'Owner', status: 'active' },
    { id: 2, name: 'Fatima Begum', email: 'fatima@example.com', company: 'Textile Mart', role: 'Manager', status: 'active' },
    { id: 3, name: 'Raju Ahmed', email: 'raju@example.com', company: 'Metal Works', role: 'Worker', status: 'inactive' },
    { id: 4, name: 'Sharmin Akter', email: 'sharmin@example.com', company: 'Textile Mart', role: 'Sales', status: 'active' },
    { id: 5, name: 'Kamal Hossain', email: 'kamal@example.com', company: 'Karim Furniture', role: 'Worker', status: 'active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform statistics and activities
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={`mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                </span>
                from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
            <CardDescription>
              Latest companies registered on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.type}</TableCell>
                    <TableCell>{company.users}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          company.status === 'active'
                            ? 'default'
                            : company.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>
              System performance and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Server Status</div>
                  <div className="text-sm text-muted-foreground">All systems operational</div>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Database</div>
                  <div className="text-sm text-muted-foreground">245.6 MB used</div>
                </div>
                <Badge variant="outline">Healthy</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Last Backup</div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">API Response Time</div>
                  <div className="text-sm text-muted-foreground">Average 120ms</div>
                </div>
                <Badge variant="outline">Fast</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                <Users className="mb-2 h-5 w-5" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                <Building className="mb-2 h-5 w-5" />
                <span className="text-sm">Manage Companies</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                <DollarSign className="mb-2 h-5 w-5" />
                <span className="text-sm">View Revenue</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                <TrendingUp className="mb-2 h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard