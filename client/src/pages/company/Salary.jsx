import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  DollarSign,
  CreditCard,
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Printer,
  Mail
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

const Salary = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('payroll')
  
  const salaryData = [
    {
      id: 1,
      employee: 'Raju Ahmed',
      employeeId: 'EMP-001',
      role: 'Carpenter',
      baseSalary: '৳25,000',
      overtime: '৳5,250',
      bonus: '৳2,000',
      deductions: '৳1,500',
      netSalary: '৳30,750',
      month: 'January 2024',
      status: 'Paid',
      paymentDate: '2024-01-31',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 2,
      employee: 'Kamal Hossain',
      employeeId: 'EMP-002',
      role: 'Welder',
      baseSalary: '৳22,000',
      overtime: '৳3,850',
      bonus: '৳1,500',
      deductions: '৳1,200',
      netSalary: '৳26,150',
      month: 'January 2024',
      status: 'Paid',
      paymentDate: '2024-01-31',
      paymentMethod: 'Cash',
    },
    {
      id: 3,
      employee: 'Sharmin Akter',
      employeeId: 'EMP-003',
      role: 'Sales Executive',
      baseSalary: '৳18,000',
      overtime: '৳2,250',
      bonus: '৳5,000',
      deductions: '৳800',
      netSalary: '৳24,450',
      month: 'January 2024',
      status: 'Paid',
      paymentDate: '2024-01-31',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 4,
      employee: 'Abdul Malik',
      employeeId: 'EMP-004',
      role: 'Painter',
      baseSalary: '৳20,000',
      overtime: '৳4,200',
      bonus: '৳1,200',
      deductions: '৳1,000',
      netSalary: '৳24,400',
      month: 'January 2024',
      status: 'Pending',
      paymentDate: '-',
      paymentMethod: '-',
    },
    {
      id: 5,
      employee: 'Fatima Begum',
      employeeId: 'EMP-005',
      role: 'Quality Checker',
      baseSalary: '৳21,000',
      overtime: '৳3,150',
      bonus: '৳1,800',
      deductions: '৳1,300',
      netSalary: '৳24,650',
      month: 'January 2024',
      status: 'Hold',
      paymentDate: '-',
      paymentMethod: '-',
    },
  ]

  const filteredSalary = salaryData.filter(item =>
    item.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'Hold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
          <p className="text-muted-foreground">
            Process salaries, track payments, and manage deductions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Process Salary
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳525,000</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳425,850</div>
            <p className="text-xs text-muted-foreground">
              For 20 employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Salary</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳99,150</div>
            <p className="text-xs text-muted-foreground">
              5 employees pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳48,900</div>
            <p className="text-xs text-muted-foreground">
              156 overtime hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>January 2024 Payroll</CardTitle>
                  <CardDescription>
                    Salary details for all employees
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
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
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalary.map((salary) => (
                    <TableRow key={salary.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{salary.employee}</div>
                          <div className="text-sm text-muted-foreground">
                            {salary.employeeId} • {salary.role}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{salary.baseSalary}</TableCell>
                      <TableCell className="text-amber-600">{salary.overtime}</TableCell>
                      <TableCell className="text-green-600">{salary.bonus}</TableCell>
                      <TableCell className="text-red-600">{salary.deductions}</TableCell>
                      <TableCell className="font-bold">{salary.netSalary}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(salary.status)}>
                          {salary.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{salary.paymentDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Salary
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Slip
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Slip
                            </DropdownMenuItem>
                            {salary.status !== 'Paid' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredSalary.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No salary records found</h3>
                  <p className="mt-2 text-muted-foreground">
                    No records match your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Summary</CardTitle>
                <CardDescription>
                  Breakdown of salary components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { component: 'Base Salary', amount: '৳460,000', percentage: 88 },
                    { component: 'Overtime', amount: '৳48,900', percentage: 9 },
                    { component: 'Bonus', amount: '৳11,500', percentage: 2 },
                    { component: 'Deductions', amount: '৳5,800', percentage: 1 },
                  ].map((item) => (
                    <div key={item.component} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.component}</span>
                        <span className="text-sm text-muted-foreground">{item.amount}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div
                          className={`h-full rounded-full ${
                            item.component === 'Base Salary' ? 'bg-blue-500' :
                            item.component === 'Overtime' ? 'bg-amber-500' :
                            item.component === 'Bonus' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Net Salary</span>
                      <span className="text-xl font-bold">৳525,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common salary operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                    <CreditCard className="mb-2 h-5 w-5" />
                    <span className="text-sm">Bulk Payment</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                    <Download className="mb-2 h-5 w-5" />
                    <span className="text-sm">Export Payroll</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                    <Printer className="mb-2 h-5 w-5" />
                    <span className="text-sm">Print All Slips</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
                    <Calendar className="mb-2 h-5 w-5" />
                    <span className="text-sm">Salary Schedule</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Process Monthly Salary</CardTitle>
                <CardDescription>
                  Calculate and process salary for selected month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary-month">Select Month</Label>
                      <Input id="salary-month" type="month" defaultValue="2024-01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-date">Payment Date</Label>
                      <Input id="payment-date" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Salary Components</Label>
                    <div className="rounded-lg border p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ot-rate">Overtime Rate</Label>
                          <Input id="ot-rate" placeholder="৳350" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bonus-rate">Bonus %</Label>
                          <Input id="bonus-rate" placeholder="5%" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="advance-ded">Advance Deduction</Label>
                          <Input id="advance-ded" placeholder="৳0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-rate">Tax Rate</Label>
                          <Input id="tax-rate" placeholder="10%" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Employees</Label>
                    <div className="rounded-lg border">
                      <div className="max-h-60 overflow-y-auto p-4">
                        {[
                          { id: 1, name: 'Raju Ahmed', selected: true },
                          { id: 2, name: 'Kamal Hossain', selected: true },
                          { id: 3, name: 'Sharmin Akter', selected: true },
                          { id: 4, name: 'Abdul Malik', selected: false },
                          { id: 5, name: 'Fatima Begum', selected: false },
                        ].map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`emp-${employee.id}`}
                                defaultChecked={employee.selected}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label htmlFor={`emp-${employee.id}`}>{employee.name}</Label>
                            </div>
                            <Badge variant="outline">৳25,000</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Total Amount</h4>
                        <p className="text-sm text-muted-foreground">For 3 selected employees</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">৳81,350</div>
                        <div className="text-sm text-muted-foreground">Net payable amount</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Calculate Only</Button>
                    <Button>Process Payment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Reports</CardTitle>
                <CardDescription>
                  Generate and download salary reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Monthly Salary Report</h4>
                        <p className="text-sm text-muted-foreground">Detailed salary breakdown</p>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Overtime Report</h4>
                        <p className="text-sm text-muted-foreground">Overtime hours and payments</p>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Bonus Report</h4>
                        <p className="text-sm text-muted-foreground">Bonus distribution</p>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Tax Report</h4>
                        <p className="text-sm text-muted-foreground">Tax deductions and calculations</p>
                      </div>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Salary