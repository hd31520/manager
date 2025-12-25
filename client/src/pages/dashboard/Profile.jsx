import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  CreditCard, 
  Bell,
  Camera,
  Save,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { currentCompany } = useAuth()
  const params = useParams()
  const routeCompanyId = params.companyId

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me'),
    // keep data fresh for interactive/dynamic pages
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  const userData = profileData?.user || {}

  const queryClient = useQueryClient()

  // Local form state for editable fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [bio, setBio] = useState('')
  const [nid, setNid] = useState('')

  useEffect(() => {
    setName(userData.name || '')
    setEmail(userData.email || '')
    setPhone(userData.phone || '')
    setAddress(userData.address || '')
    setBio(userData.bio || '')
    setNid(userData.nid || '')
  }, [userData])

  const { data: subscriptionResp, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription', routeCompanyId || currentCompany?.id || currentCompany?._id],
    queryFn: () => {
      const cid = routeCompanyId || currentCompany?.id || currentCompany?._id
      return api.get(`/subscriptions/${cid}`).then(res => res.data)
    },
    enabled: !!(routeCompanyId || currentCompany),
  })

  const subscriptionData = subscriptionResp?.subscription || null

  const { data: notificationsResp } = useQuery({ queryKey: ['notifications'], queryFn: () => api.get('/users/me/notifications').then(res => res.data), enabled: false })
  const notificationSettings = notificationsResp?.settings || { email: {}, push: {} }

  // Fetch available plans from server
  const { data: plansResp, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/subscriptions/plans'),
  })

  const plans = plansResp?.plans || {}

  // Mutation to change subscription plan
  const changePlanMutation = useMutation({
    mutationFn: ({ companyId, plan }) => api.put(`/subscriptions/${companyId}`, { plan }),
    onSuccess: (res) => {
      toast.success('Subscription updated')
      // refresh subscription info
      queryClient.invalidateQueries(['subscription'])
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change plan')
    }
  })

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (payload) => api.put('/users/me', payload),
    onSuccess: (data) => {
      toast.success('Profile updated')
      queryClient.invalidateQueries(['profile'])
      setIsEditing(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  // reset form values
                  setName(userData.name || '')
                  setEmail(userData.email || '')
                  setPhone(userData.phone || '')
                  setAddress(userData.address || '')
                  setBio(userData.bio || '')
                  setNid(userData.nid || '')
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // client-side validation
                  if (!name || name.trim() === '') {
                    toast.error('Name is required')
                    return
                  }

                  const payload = { name: name.trim(), phone: phone?.trim() || '', address: address?.trim() || '' }
                  updateMutation.mutate(payload)
                }}
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.profileImage || userData.avatar} alt={userData.name || 'User'} />
                        <AvatarFallback className="text-2xl">
                          {(userData.name || '').split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{userData.name || 'Unnamed User'}</h3>
                      <p className="text-muted-foreground">{userData.role}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{userData.company}</Badge>
                        <Badge variant="secondary">Member since {userData.joinDate}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nid">NID Number</Label>
                      <Input
                        id="nid"
                        value={nid}
                        onChange={(e) => setNid(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="pl-9"
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">2FA Status</h4>
                        <p className="text-sm text-muted-foreground">
                          Two-factor authentication is disabled
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Choose what email notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notificationSettings.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium capitalize">{key} Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about {key} related activities
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={value}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>
                    Control push notifications on your devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notificationSettings.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium capitalize">{key} Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications for {key}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={value}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and billing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-6">
                    {subscriptionLoading ? (
                      <div>Loading subscription...</div>
                    ) : subscriptionData ? (
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{subscriptionData.plan} Plan</h3>
                          <p className="text-muted-foreground">{subscriptionData.price}</p>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Workers: {subscriptionData.workers}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Renewal: {subscriptionData.renewal}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  subscriptionData.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {subscriptionData.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Update Payment
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">No Active Subscription</h3>
                          <p className="text-muted-foreground">You are currently on the free plan.</p>
                        </div>
                        <div>
                          <Button>Choose Plan</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-4 font-semibold">Plan Features</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {(subscriptionData?.features || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Upgrade Plan</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plansLoading ? (
                          <div className="col-span-3 flex items-center justify-center p-4">Loading plans...</div>
                        ) : (
                          Object.keys(plans).map((key) => {
                            const p = plans[key]
                            const isCurrent = subscriptionData?.plan === key
                            return (
                              <div key={key} className={`rounded-lg border p-4 ${isCurrent ? 'border-2 border-primary' : ''}`}>
                                <h5 className="font-medium">{p.name}</h5>
                                <p className="text-2xl font-bold">৳{p.monthlyFee}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                <p className="text-sm text-muted-foreground">Workers: {p.workerLimit === Infinity ? 'Unlimited' : p.workerLimit}</p>
                                <div className="mt-3 space-y-1">
                                  { (p.features || []).map((f, i) => (
                                    <div key={i} className="text-sm text-muted-foreground">• {f}</div>
                                  ))}
                                </div>
                                <Button
                                  size="sm"
                                  className="mt-3 w-full"
                                  variant={isCurrent ? 'outline' : 'default'}
                                  disabled={isCurrent || changePlanMutation.isLoading}
                                  onClick={() => {
                                    const companyId = routeCompanyId || currentCompany?._id || currentCompany?.id
                                    if (!companyId) return toast.error('No company selected')
                                    changePlanMutation.mutate({ companyId, plan: key })
                                  }}
                                >
                                  {isCurrent ? 'Current' : 'Choose'}
                                </Button>
                              </div>
                            )
                          })
                        )}
                      </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium">{userData.lastLogin}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Created</span>
                  <span className="font-medium">{userData.joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email Verified</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phone Verified</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                Devices that have accessed your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Windows PC</h4>
                    <p className="text-sm text-muted-foreground">
                      Chrome • Dhaka, Bangladesh
                    </p>
                  </div>
                  <Badge variant="outline">Current</Badge>
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Android Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      Mobile App • 2 days ago
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Bell className="mr-2 h-4 w-4" />
                Deactivate Account
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile