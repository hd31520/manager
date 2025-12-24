import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Building, Plus, Search, Users, DollarSign, Check } from 'lucide-react'

const CompanySelect = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const companies = [
    {
      id: 1,
      name: 'Karim Furniture Factory',
      type: 'Wood Factory',
      workers: 25,
      sales: '৳1,250,000',
      plan: 'Premium',
      status: 'active',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Karim Textile Mart',
      type: 'Textile Shop',
      workers: 12,
      sales: '৳850,000',
      plan: 'Standard',
      status: 'active',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Karim Metal Works',
      type: 'Iron Factory',
      workers: 8,
      sales: '৳650,000',
      plan: 'Basic',
      status: 'active',
      lastActive: '3 days ago',
    },
    {
      id: 4,
      name: 'Karim Showroom',
      type: 'Furniture Showroom',
      workers: 6,
      sales: '৳450,000',
      plan: 'Basic',
      status: 'inactive',
      lastActive: '1 week ago',
    },
  ]

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Select Company</h1>
        <p className="text-muted-foreground">
          Choose a company to manage or create a new one
        </p>
      </div>

      <Tabs defaultValue="my-companies">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-companies">My Companies</TabsTrigger>
          <TabsTrigger value="create-new">Create New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-companies" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCompany?.id === company.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : ''
                }`}
                onClick={() => setSelectedCompany(company)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{company.name}</CardTitle>
                        <CardDescription>{company.type}</CardDescription>
                      </div>
                    </div>
                    {selectedCompany?.id === company.id && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-2xl font-bold">{company.workers}</div>
                        <div className="text-xs text-muted-foreground">Workers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-2xl font-bold">{company.sales}</div>
                        <div className="text-xs text-muted-foreground">Sales</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      company.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {company.status}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {company.plan} Plan
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last active: {company.lastActive}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No companies found</h3>
                <p className="mt-2 text-muted-foreground">
                  No companies match your search. Try a different search term or create a new company.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button disabled={!selectedCompany}>
              Continue to {selectedCompany?.name || 'Company'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="create-new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Company</CardTitle>
              <CardDescription>
                Set up a new business profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter company name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-type">Business Type</Label>
                <select
                  id="company-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select business type</option>
                  <option value="factory">Factory</option>
                  <option value="shop">Shop</option>
                  <option value="showroom">Showroom</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Category</Label>
                <Input id="industry" placeholder="e.g., Furniture, Textile, Metal Works" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workers">Number of Workers</Label>
                <Input
                  id="workers"
                  type="number"
                  min="1"
                  placeholder="Estimated number of workers"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">Basic</h4>
                    <p className="text-2xl font-bold">৳200<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <p className="text-sm text-muted-foreground">1-10 Workers</p>
                    <Button size="sm" className="mt-3 w-full" variant="outline">
                      Select
                    </Button>
                  </div>
                  <div className="rounded-lg border-2 border-primary p-4">
                    <h4 className="font-semibold">Standard</h4>
                    <p className="text-2xl font-bold">৳300<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <p className="text-sm text-muted-foreground">11-20 Workers</p>
                    <Button size="sm" className="mt-3 w-full">
                      Select
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold">Premium</h4>
                    <p className="text-2xl font-bold">৳500<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <p className="text-sm text-muted-foreground">21-50 Workers</p>
                    <Button size="sm" className="mt-3 w-full" variant="outline">
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Create Company</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CompanySelect