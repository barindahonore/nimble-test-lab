import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Users, 
  Bell,
  Search,
  Filter,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Download,
  Upload,
  Home,
  FileText,
  Award,
  Target,
  BarChart3,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
function StudentSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  
  const menuItems = [
    { title: "Dashboard", url: "/student/dashboard", icon: Home },
    { title: "My Events", url: "/student/dashboard/events", icon: Calendar },
    { title: "Submissions", url: "/student/dashboard/submissions", icon: FileText },
    { title: "Achievements", url: "/student/dashboard/achievements", icon: Award },
    { title: "Progress", url: "/student/dashboard/progress", icon: BarChart3 },
    { title: "Profile", url: "/student/dashboard/profile", icon: User },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">EduEvents</h2>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/student/dashboard"}
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

        {/* User Section */}
        <div className="mt-auto p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">ST</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Student Tessy</p>
                  <p className="text-xs text-muted-foreground">student1@sola.org</p>
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

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingEvents = [
    {
      id: 1,
      title: "Global Leadership Summit",
      date: "2024-02-15",
      time: "09:00 AM",
      status: "registered",
      category: "Leadership",
      participants: 124
    },
    {
      id: 2,
      title: "Innovation Workshop",
      date: "2024-02-20",
      time: "02:00 PM",
      status: "available",
      category: "Technology",
      participants: 89
    },
    {
      id: 3,
      title: "Entrepreneurship Bootcamp",
      date: "2024-02-25",
      time: "10:00 AM",
      status: "waitlist",
      category: "Business",
      participants: 156
    }
  ];

  const mySubmissions = [
    {
      id: 1,
      title: "Leadership Essay Competition",
      submitted: "2024-01-28",
      status: "under_review",
      score: null
    },
    {
      id: 2,
      title: "Innovation Project Showcase",
      submitted: "2024-01-25",
      status: "scored",
      score: 95
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered": return "bg-primary/10 text-primary border-primary/20";
      case "available": return "bg-green-50 text-green-700 border-green-200";
      case "waitlist": return "bg-orange-50 text-orange-700 border-orange-200";
      case "under_review": return "bg-blue-50 text-blue-700 border-blue-200";
      case "scored": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "registered": return "Registered";
      case "available": return "Available";
      case "waitlist": return "Waitlist";
      case "under_review": return "Under Review";
      case "scored": return "Scored";
      default: return status;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Student Tessy</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Events Registered</p>
                        <p className="text-2xl font-bold text-foreground">3</p>
                        <p className="text-xs text-primary font-medium">+1 this week</p>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                        <p className="text-2xl font-bold text-foreground">2</p>
                        <p className="text-xs text-green-600 font-medium">1 pending review</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                        <Upload className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-900/10 dark:border-amber-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold text-foreground">95</p>
                        <p className="text-xs text-amber-600 font-medium">Top 10%</p>
                      </div>
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center dark:bg-amber-900/30">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                        <p className="text-2xl font-bold text-foreground">5</p>
                        <p className="text-xs text-purple-600 font-medium">2 badges earned</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                        <Trophy className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Your registered events and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
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
                      <FileText className="w-5 h-5 mr-2 text-primary" />
                      Recent Submissions
                    </CardTitle>
                    <CardDescription>Your latest submitted work and scores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mySubmissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                            <BookOpen className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{submission.title}</p>
                            <p className="text-xs text-muted-foreground">{submission.submitted}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {submission.score && (
                            <span className="text-lg font-bold text-primary">{submission.score}</span>
                          )}
                          <Badge variant="outline" className={getStatusColor(submission.status)}>
                            {getStatusText(submission.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-3">
                      <Upload className="w-4 h-4 mr-2" />
                      New Submission
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Frequently used features and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Search className="w-6 h-6" />
                      <span>Browse Events</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Upload className="w-6 h-6" />
                      <span>Submit Work</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Progress</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Award className="w-6 h-6" />
                      <span>Achievements</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
