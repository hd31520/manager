import { useState } from 'react'
import { ChevronDown, Building, Plus, Check } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const CompanySwitcher = () => {
  const [selectedCompany, setSelectedCompany] = useState({
    id: 1,
    name: 'Karim Furniture Factory',
    type: 'Wood Factory',
    plan: 'Premium',
  })

  const companies = [
    {
      id: 1,
      name: 'Karim Furniture Factory',
      type: 'Wood Factory',
      plan: 'Premium',
      workers: 25,
    },
    {
      id: 2,
      name: 'Karim Textile Mart',
      type: 'Textile Shop',
      plan: 'Standard',
      workers: 12,
    },
    {
      id: 3,
      name: 'Karim Metal Works',
      type: 'Iron Factory',
      plan: 'Basic',
      workers: 8,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-0 px-2 text-left hover:bg-transparent"
        >
          <Building className="h-4 w-4" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">{selectedCompany.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {selectedCompany.type} • {selectedCompany.plan} Plan
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuLabel>Your Companies</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {company.workers} workers • {company.plan} Plan
                </div>
              </div>
            </div>
            {selectedCompany.id === company.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2">
          <Plus className="mr-2 h-4 w-4" />
          Add New Company
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2">
          <Building className="mr-2 h-4 w-4" />
          Manage All Companies
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CompanySwitcher