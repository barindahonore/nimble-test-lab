import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
  Activity,
  Home,
  FileText,
  User,
  Database,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";

// Sidebar Navigation Component
function AdminSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  
  const menuItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Event Management", url: "/admin-dashboard/events", icon: Calendar },
    { title: "User Management", url: "/admin-dashboard/users", icon: Users },
    { title: "Analytics", url: "/admin-dashboard/analytics", icon: BarChart3 },
    { title: "Content Management", url: "/admin-dashboard/content", icon: FileText },
    { title: "System Settings", url: "/admin-dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">EduEvents</h2>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin-dashboard"}
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:bg-accent"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@sola.org</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const platformStats = {
    totalUsers: 1247,
    activeEvents: 8,
    totalSubmissions: 342,
    avgEngagement: 87.3
  };

  const recentEvents = [
    {
      id: 1,
      title: "Global Leadership Summit",
      startDate: "2024-02-15",
      participants: 124,
      status: "active",
      submissions: 89,
      judgesAssigned: 3
    },
    {
      id: 2,
      title: "Innovation Workshop",
      startDate: "2024-02-20",
      participants: 89,
      status: "upcoming",
      submissions: 0,
      judgesAssigned: 2
    },
    {
      id: 3,
      title: "Entrepreneurship Bootcamp",
      startDate: "2024-01-28",
      participants: 156,
      status: "completed",
      submissions: 142,
      judgesAssigned: 4
    }
  ];

  const userManagement = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@student.edu",
      role: "student",
      status: "active",
      joinDate: "2024-01-15",
      eventsParticipated: 3
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "mchen@judge.edu",
      role: "judge",
      status: "active",
      joinDate: "2023-12-10",
      reviewsCompleted: 47
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@student.edu",
      role: "student",
      status: "inactive",
      joinDate: "2024-02-01",
      eventsParticipated: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700 border-green-200";
      case "upcoming": return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed": return "bg-gray-50 text-gray-700 border-gray-200";
      case "inactive": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-50 text-blue-700 border-blue-200";
      case "judge": return "bg-purple-50 text-purple-700 border-purple-200";
      case "admin": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Platform management and analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-background">
            <div className="p-6 space-y-6">
              {/* Platform Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold text-foreground">{platformStats.totalUsers}</p>
                        <p className="text-xs text-blue-600 font-medium flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% this month
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                        <p className="text-2xl font-bold text-foreground">{platformStats.activeEvents}</p>
                        <p className="text-xs text-green-600 font-medium flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          2 starting soon
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                        <p className="text-2xl font-bold text-foreground">{platformStats.totalSubmissions}</p>
                        <p className="text-xs text-purple-600 font-medium flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          89% reviewed
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-900/10 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                        <p className="text-2xl font-bold text-foreground">{platformStats.avgEngagement}%</p>
                        <p className="text-xs text-orange-600 font-medium flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +5.2% vs last month
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900/30">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used administrative functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Plus className="w-6 h-6" />
                      <span>Create Event</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <UserCheck className="w-6 h-6" />
                      <span>Add User</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Reports</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Database className="w-6 h-6" />
                      <span>Backup Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Recent Events
                    </CardTitle>
                    <CardDescription>Latest platform events and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.participants} participants • {event.submissions} submissions</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-3">
                      View All Events
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      User Overview
                    </CardTitle>
                    <CardDescription>User statistics and management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">847</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">23</p>
                        <p className="text-xs text-muted-foreground">Judges</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">5</p>
                        <p className="text-xs text-muted-foreground">Admins</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      {userManagement.slice(0, 2).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded border border-border bg-muted/20">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="ghost" className="w-full">
                      Manage Users
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* System Health & Security */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-500" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Server Status</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Backup Status</span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Updated</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-amber-500" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Sessions</span>
                        <span className="font-semibold">128</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Failed Logins</span>
                        <span className="font-semibold text-orange-600">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">SSL Status</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Secure</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time</span>
                        <span className="font-semibold">142ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <span className="font-semibold">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Memory Usage</span>
                        <span className="font-semibold">67%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
