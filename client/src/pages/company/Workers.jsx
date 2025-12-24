import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Download,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Phone,
    Mail,
    Calendar,
    DollarSign
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

const Workers = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [workers] = useState([
        {
            id: 1,
            name: 'Raju Ahmed',
            employeeId: 'EMP-001',
            role: 'Carpenter',
            type: 'Permanent',
            department: 'Production',
            salary: '৳25,000',
            phone: '+8801712345678',
            email: 'raju@example.com',
            joinDate: '2023-01-15',
            status: 'active',
            avatar: '',
            attendance: '95%',
            skillLevel: 'Senior',
        },
        {
            id: 2,
            name: 'Kamal Hossain',
            employeeId: 'EMP-002',
            role: 'Welder',
            type: 'Permanent',
            department: 'Metal Works',
            salary: '৳22,000',
            phone: '+8801712345679',
            email: 'kamal@example.com',
            joinDate: '2023-02-20',
            status: 'active',
            avatar: '',
            attendance: '92%',
            skillLevel: 'Senior',
        },
        {
            id: 3,
            name: 'Sharmin Akter',
            employeeId: 'EMP-003',
            role: 'Sales Executive',
            type: 'Permanent',
            department: 'Sales',
            salary: '৳18,000',
            phone: '+8801712345680',
            email: 'sharmin@example.com',
            joinDate: '2023-03-10',
            status: 'active',
            avatar: '',
            attendance: '98%',
            skillLevel: 'Junior',
        },
        {
            id: 4,
            name: 'Abdul Malik',
            employeeId: 'EMP-004',
            role: 'Painter',
            type: 'Contract',
            department: 'Finishing',
            salary: '৳20,000',
            phone: '+8801712345681',
            email: 'malik@example.com',
            joinDate: '2023-04-05',
            status: 'active',
            avatar: '',
            attendance: '90%',
            skillLevel: 'Junior',
        },
        {
            id: 5,
            name: 'Fatima Begum',
            employeeId: 'EMP-005',
            role: 'Quality Checker',
            type: 'Permanent',
            department: 'QC',
            salary: '৳21,000',
            phone: '+8801712345682',
            email: 'fatima@example.com',
            joinDate: '2023-05-12',
            status: 'inactive',
            avatar: '',
            attendance: '85%',
            skillLevel: 'Expert',
        },
    ])

    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const getSkillColor = (skill) => {
        const colors = {
            'Trainee': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'Junior': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Senior': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
            'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        }
        return colors[skill] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Worker Management</h1>
                    <p className="text-muted-foreground">
                        Manage your workers, track attendance, and handle salaries
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Worker
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22</div>
                        <p className="text-xs text-muted-foreground">
                            88% attendance rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳525,000</div>
                        <p className="text-xs text-muted-foreground">
                            +5% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Workers</CardTitle>
                            <CardDescription>
                                List of all workers in your company
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search workers..."
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
                                <TableHead>Worker</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Role & Department</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWorkers.map((worker) => (
                                <TableRow key={worker.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={worker.avatar} />
                                                <AvatarFallback>
                                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{worker.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Joined {worker.joinDate}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{worker.employeeId}</div>
                                        <Badge className="mt-1" variant="outline">
                                            {worker.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{worker.role}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {worker.department}
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={cn("mt-1", getSkillColor(worker.skillLevel))}
                                        >
                                            {worker.skillLevel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{worker.salary}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Monthly
                                        </div>
                                        <div className="text-sm text-green-600">
                                            Attendance: {worker.attendance}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3 w-3" />
                                                {worker.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3" />
                                                {worker.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(worker.status)}>
                                            {worker.status}
                                        </Badge>
                                    </TableCell>
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
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Attendance
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DollarSign className="mr-2 h-4 w-4" />
                                                    Salary
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredWorkers.length === 0 && (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No workers found</h3>
                            <p className="mt-2 text-muted-foreground">
                                No workers match your search criteria.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredWorkers.length} of {workers.length} workers
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Workers