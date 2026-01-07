const CompanyUser = require('../models/CompanyUser')
const Role = require('../models/Role')

// Get navigation items based on user role and permissions
exports.getNavigation = async (req, res) => {
  try {
    const user = req.user
    const { companyId } = req.query

    // Admin navigation
    if (user.role === 'admin') {
      return res.json({
        success: true,
        navigation: {
          items: [
            { to: '/admin', label: 'Dashboard', icon: 'Home', permissions: [] },
            { to: '/admin/users', label: 'Users', icon: 'Users', permissions: [] },
            { to: '/admin/companies', label: 'Companies', icon: 'Building', permissions: [] },
            { to: '/admin/settings', label: 'Settings', icon: 'Settings', permissions: [] },
          ],
          quickActions: []
        }
      })
    }

    // ALWAYS RETURN ALL NAVIGATION ITEMS - don't filter by permissions
    const allNavigationItems = [
      { to: '/dashboard', label: 'Dashboard', icon: 'Home', permissions: [] },
      { to: '/dashboard/company-select', label: 'Switch Company', icon: 'Building', permissions: [] },
      { to: '/dashboard/workers', label: 'Workers', icon: 'Users', permissions: ['workers.view'] },
      { to: '/dashboard/roles', label: 'Roles', icon: 'UserCog', permissions: ['workers.view'] },
      { to: '/dashboard/products', label: 'Products', icon: 'Package', permissions: ['products.view'] },
      { to: '/dashboard/inventory', label: 'Inventory', icon: 'Layers', permissions: ['inventory.view'] },
      { to: '/dashboard/sales', label: 'Sales', icon: 'ShoppingCart', permissions: ['sales.view'] },
      { to: '/dashboard/customers', label: 'Customers', icon: 'Users', permissions: ['customers.view'] },
      { to: '/dashboard/salary', label: 'Salary', icon: 'DollarSign', permissions: ['salary.view'] },
      { to: '/dashboard/reports', label: 'Reports', icon: 'BarChart', permissions: ['reports.view'] },
      { to: '/dashboard/settings', label: 'Settings', icon: 'Settings', permissions: ['settings.view'] },
    ]

    // Quick actions based on company selection
    const quickActions = []
    if (companyId) {
      quickActions.push({ 
        label: 'New Sale', 
        icon: 'Tag', 
        to: '/dashboard/sales',
        permissions: ['sales.create']
      })
      quickActions.push({ 
        label: 'Generate Report', 
        icon: 'FileText', 
        to: '/dashboard/reports',
        permissions: ['reports.generate']
      })
      quickActions.push({ 
        label: 'Pay Salary', 
        icon: 'WalletCards', 
        to: '/dashboard/salary',
        permissions: ['salary.pay']
      })
    }

    return res.json({
      success: true,
      navigation: {
        items: allNavigationItems,
        quickActions: quickActions
      }
    })

  } catch (error) {
    console.error('Navigation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching navigation',
      error: error.message
    })
  }
}