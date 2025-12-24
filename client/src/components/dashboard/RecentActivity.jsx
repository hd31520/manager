import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  UserPlus, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { formatDate, formatTime } from '../../lib/utils'

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'worker_added',
      user: 'Abdul Karim',
      action: 'added new worker',
      target: 'Raju Ahmed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: UserPlus,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      type: 'sale_completed',
      user: 'Fatima Begum',
      action: 'completed sale',
      target: 'Order #ORD-00123',
      amount: '৳15,000',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: ShoppingCart,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      type: 'salary_paid',
      user: 'System',
      action: 'processed salary for',
      target: 'December 2024',
      amount: '৳250,000',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 4,
      type: 'product_low_stock',
      user: 'System',
      action: 'low stock alert for',
      target: 'Wooden Chair',
      status: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      icon: Package,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      id: 5,
      type: 'attendance_marked',
      user: 'Raju Ahmed',
      action: 'marked attendance',
      target: 'for today',
      status: 'present',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ]

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    
    let interval = seconds / 31536000
    if (interval > 1) {
      return Math.floor(interval) + ' years ago'
    }
    
    interval = seconds / 2592000
    if (interval > 1) {
      return Math.floor(interval) + ' months ago'
    }
    
    interval = seconds / 86400
    if (interval > 1) {
      return Math.floor(interval) + ' days ago'
    }
    
    interval = seconds / 3600
    if (interval > 1) {
      return Math.floor(interval) + ' hours ago'
    }
    
    interval = seconds / 60
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago'
    }
    
    return 'just now'
  }

  const getStatusBadge = (type, status) => {
    switch (type) {
      case 'product_low_stock':
        return (
          <Badge variant="destructive" className="ml-2">
            Critical
          </Badge>
        )
      case 'attendance_marked':
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Present
          </Badge>
        )
      case 'sale_completed':
        return (
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium">{activity.user}</span>
                    <span className="mx-1 text-muted-foreground">
                      {activity.action}
                    </span>
                    <span className="font-medium">{activity.target}</span>
                    {activity.amount && (
                      <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                        {activity.amount}
                      </span>
                    )}
                    {getStatusBadge(activity.type, activity.status)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {getTimeAgo(activity.timestamp)}
                    <span className="mx-2">•</span>
                    {formatDate(activity.timestamp, 'dd MMM yyyy')}
                    <span className="mx-2">•</span>
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            View All Activity →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity