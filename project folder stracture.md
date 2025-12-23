karkhana-shop/
├── 📁 client/ (React Frontend)
│   ├── 📁 public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── manifest.json
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/ (shadcn components)
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── form.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   ├── tabs.jsx
│   │   │   │   ├── sidebar.jsx
│   │   │   │   ├── avatar.jsx
│   │   │   │   └── ... (all shadcn components)
│   │   │   │
│   │   │   ├── 📁 layout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── 📁 admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── SubscriptionPlans.jsx
│   │   │   │   └── SystemSettings.jsx
│   │   │   │
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── VerifyEmail.jsx
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   └── CompanySwitcher.jsx
│   │   │   │
│   │   │   ├── 📁 company/
│   │   │   │   ├── CompanySetup.jsx
│   │   │   │   ├── CompanyProfile.jsx
│   │   │   │   └── CompanySettings.jsx
│   │   │   │
│   │   │   ├── 📁 workers/
│   │   │   │   ├── WorkerList.jsx
│   │   │   │   ├── WorkerForm.jsx
│   │   │   │   ├── AttendanceSheet.jsx
│   │   │   │   └── AttendanceCalendar.jsx
│   │   │   │
│   │   │   ├── 📁 roles/
│   │   │   │   ├── RoleManagement.jsx
│   │   │   │   ├── RoleForm.jsx
│   │   │   │   └── PermissionMatrix.jsx
│   │   │   │
│   │   │   ├── 📁 products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductCollection.jsx
│   │   │   │   ├── ProductPresentation.jsx
│   │   │   │   └── BarcodeScanner.jsx
│   │   │   │
│   │   │   ├── 📁 inventory/
│   │   │   │   ├── StockManagement.jsx
│   │   │   │   ├── StockCounting.jsx
│   │   │   │   ├── StockAlerts.jsx
│   │   │   │   └── StockTransfer.jsx
│   │   │   │
│   │   │   ├── 📁 sales/
│   │   │   │   ├── POSSystem.jsx
│   │   │   │   ├── SalesDashboard.jsx
│   │   │   │   ├── OrderList.jsx
│   │   │   │   ├── OrderDetails.jsx
│   │   │   │   ├── MemoGenerator.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   │
│   │   │   ├── 📁 customers/
│   │   │   │   ├── CustomerList.jsx
│   │   │   │   ├── CustomerForm.jsx
│   │   │   │   └── CustomerHistory.jsx
│   │   │   │
│   │   │   ├── 📁 salary/
│   │   │   │   ├── SalaryCalculator.jsx
│   │   │   │   ├── SalarySlip.jsx
│   │   │   │   ├── PaymentRegister.jsx
│   │   │   │   └── SalaryReport.jsx
│   │   │   │
│   │   │   ├── 📁 reports/
│   │   │   │   ├── ReportGenerator.jsx
│   │   │   │   ├── DailyReport.jsx
│   │   │   │   ├── MonthlyReport.jsx
│   │   │   │   ├── ProfitLoss.jsx
│   │   │   │   └── ExportOptions.jsx
│   │   │   │
│   │   │   ├── 📁 subscription/
│   │   │   │   ├── SubscriptionPlans.jsx
│   │   │   │   ├── BillingHistory.jsx
│   │   │   │   └── PaymentMethods.jsx
│   │   │   │
│   │   │   └── 📁 shared/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── NotFound.jsx
│   │   │       ├── ConfirmationDialog.jsx
│   │   │       └── ToastNotification.jsx
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📁 admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Companies.jsx
│   │   │   │   └── Settings.jsx
│   │   │   │
│   │   │   ├── 📁 auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── CompanySelect.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   ├── 📁 company/
│   │   │   │   ├── Workers.jsx
│   │   │   │   ├── Roles.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Inventory.jsx
│   │   │   │   ├── Sales.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── Salary.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Settings.jsx
│   │   │   │
│   │   │   └── Home.jsx
│   │   │
│   │   ├── 📁 contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CompanyContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCompany.js
│   │   │   ├── useProducts.js
│   │   │   ├── useSales.js
│   │   │   ├── useInventory.js
│   │   │   └── useToast.js
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── helpers.js
│   │   │   ├── constants.js
│   │   │   └── api.js
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── authService.js
│   │   │   ├── companyService.js
│   │   │   ├── productService.js
│   │   │   ├── salesService.js
│   │   │   ├── salaryService.js
│   │   │   └── reportService.js
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── globals.css
│   │   │   ├── theme.css
│   │   │   └── components.css
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── routes.jsx
│   │   └── store.js (Redux store)
│   │
│   ├── package.json
│   ├── vite.config.js (or webpack.config.js)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
├── 📁 server/ (Express Backend)
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   ├── database.js
│   │   │   ├── auth.js
│   │   │   ├── cloudinary.js
│   │   │   └── payments.js
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── Admin.js
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   ├── CompanyUser.js
│   │   │   ├── Role.js
│   │   │   ├── Worker.js
│   │   │   ├── Group.js
│   │   │   ├── Salary.js
│   │   │   ├── Product.js
│   │   │   ├── Inventory.js
│   │   │   ├── Customer.js
│   │   │   ├── Order.js
│   │   │   ├── Memo.js
│   │   │   ├── Attendance.js
│   │   │   ├── Subscription.js
│   │   │   ├── Transaction.js
│   │   │   └── Report.js
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── companyController.js
│   │   │   ├── userController.js
│   │   │   ├── roleController.js
│   │   │   ├── workerController.js
│   │   │   ├── productController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── salesController.js
│   │   │   ├── customerController.js
│   │   │   ├── salaryController.js
│   │   │   ├── reportController.js
│   │   │   ├── subscriptionController.js
│   │   │   └── paymentController.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── companyRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── roleRoutes.js
│   │   │   ├── workerRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── salesRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── salaryRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── subscriptionRoutes.js
│   │   │   └── paymentRoutes.js
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   ├── emailService.js
│   │   │   ├── pdfGenerator.js
│   │   │   ├── barcodeGenerator.js
│   │   │   └── salaryCalculator.js
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── emailService.js
│   │   │   ├── paymentService.js
│   │   │   ├── reportService.js
│   │   │   └── notificationService.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── 📁 shared/ (Shared code between client and server)
│   ├── constants.js
│   ├── validations.js
│   └── types.js
│
├── 📁 scripts/
│   ├── seedDatabase.js
│   ├── backupDatabase.js
│   └── generateReports.js
│
├── 📁 docs/
│   ├── API_Documentation.md
│   ├── User_Manual.md
│   └── Deployment_Guide.md
│
├── docker-compose.yml
├── Dockerfile (for server)
├── Dockerfile.client (for client)
├── package.json (root)
├── README.md
└── .gitignore
