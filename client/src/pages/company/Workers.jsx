import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { cn } from '../../lib/utils'
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
    const { currentCompany } = useAuth()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    // Fetch workers from API. If currentCompany is available, pass companyId
        const { data, isLoading, error } = useQuery({
            queryKey: ['workers', currentCompany?.id, page, limit],
            queryFn: () => api.get('/workers', { params: { companyId: currentCompany?.id, page, limit } }).then(res => res.data),
            enabled: !!currentCompany,
        })

        const workers = data?.workers || []
        const total = data?.total ?? workers.length
        const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)))

        const { data: attendanceToday, isLoading: attendanceLoading } = useQuery({
            queryKey: ['attendanceToday', currentCompany?.id],
            queryFn: () => api.get('/workers/attendance/today', { params: { companyId: currentCompany?.id } }).then(res => res.data),
            enabled: !!currentCompany,
        })

        const { data: salariesData, isLoading: salariesLoading } = useQuery({
            queryKey: ['salarySummary', currentCompany?.id],
            queryFn: () => {
                const now = new Date()
                const month = now.getMonth() + 1
                const year = now.getFullYear()
                return api.get('/salary', { params: { companyId: currentCompany?.id, month, year, limit: 100 } }).then(res => res.data)
            },
            enabled: !!currentCompany,
        })

        const monthlySalary = (salariesData?.salaries || []).reduce((s, r) => s + (r.netSalary || 0), 0)

    const filteredWorkers = workers.filter(worker =>
        (worker.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (worker.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (worker.role || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                            <div className="text-2xl font-bold">{data?.total ?? workers.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {data?.total ? `${data.total - (data.prevTotal || 0)} from last month` : '—'}
                            </p>
                        </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendanceToday?.present ?? 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {attendanceToday ? `${attendanceToday.percentage}% attendance rate` : '—'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{monthlySalary.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {salariesData?.total ? `${salariesData.count} salaries this month` : '—'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{/* fallback until overtime endpoint added */}0</div>
                        <p className="text-xs text-muted-foreground">
                            Overtime hours this month
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
                                                <AvatarImage src={worker.avatar} alt={worker.name || 'Worker'} />
                                                <AvatarFallback>
                                                    {(worker.name || '').split(' ').map(n => n[0]).join('') || 'W'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{worker.name || 'Unnamed Worker'}</div>
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
                            Showing {filteredWorkers.length} of {total} workers
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                Previous
                            </Button>
                            {(() => {
                                const pages = []
                                const start = Math.max(1, page - 2)
                                const end = Math.min(totalPages, start + 4)
                                for (let i = start; i <= end; i++) {
                                    pages.push(i)
                                }
                                return pages.map(pn => (
                                    <Button
                                        key={pn}
                                        variant={pn === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setPage(pn)}
                                    >
                                        {pn}
                                    </Button>
                                ))
                            })()}
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
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