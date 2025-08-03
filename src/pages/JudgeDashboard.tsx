
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Scale, 
  FileText, 
  Users, 
  Clock, 
  Star, 
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  Home,
  BarChart3,
  User,
  BookOpen,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface Competition {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  submissionsAwaitingEvaluation: number;
}

interface JudgeDashboardData {
  competitionsToJudge: Competition[];
}

// Sidebar Navigation Component
function JudgeSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  
  const menuItems = [
    { title: "Dashboard", url: "/judge-dashboard", icon: Home },
    { title: "Pending Reviews", url: "/judge-dashboard/pending", icon: AlertCircle },
    { title: "Completed Reviews", url: "/judge-dashboard/completed", icon: CheckCircle },
    { title: "Analytics", url: "/judge-dashboard/analytics", icon: BarChart3 },
    { title: "Guidelines", url: "/judge-dashboard/guidelines", icon: BookOpen },
    { title: "Profile", url: "/judge-dashboard/profile", icon: User },
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
              <Scale className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">EduEvents</h2>
                <p className="text-xs text-muted-foreground">Judge Portal</p>
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
                      end={item.url === "/judge-dashboard"}
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
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Judge</p>
                  <p className="text-xs text-muted-foreground">judge@sola.org</p>
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

const JudgeDashboard = () => {
  const [dashboardData, setDashboardData] = useState<JudgeDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/dashboard');
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return "bg-green-50 text-green-700 border-green-200";
      case "draft": return "bg-gray-50 text-gray-700 border-gray-200";
      case "in_progress": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return <Calendar className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-background">
          <JudgeSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error || !dashboardData) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-background">
          <JudgeSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">Dashboard Error</h2>
                <p className="text-muted-foreground">{error || 'Unable to load dashboard data'}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const { competitionsToJudge } = dashboardData;
  const totalCompetitions = competitionsToJudge.length;
  const pendingEvaluations = competitionsToJudge.reduce((sum, comp) => sum + comp.submissionsAwaitingEvaluation, 0);
  const activeCompetitions = competitionsToJudge.filter(comp => comp.status === 'IN_PROGRESS').length;
  const completedReviews = 47; // This would come from API in real implementation

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <JudgeSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Judge Dashboard</h1>
                <p className="text-sm text-muted-foreground">Review submissions and provide feedback</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {pendingEvaluations > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-background">
            <div className="p-6 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Competitions</p>
                        <p className="text-2xl font-bold text-foreground">{totalCompetitions}</p>
                        <p className="text-xs text-blue-600 font-medium">To judge</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                        <Trophy className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-900/10 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Evaluations</p>
                        <p className="text-2xl font-bold text-foreground">{pendingEvaluations}</p>
                        <p className="text-xs text-orange-600 font-medium">Needs attention</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900/30">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Competitions</p>
                        <p className="text-2xl font-bold text-foreground">{activeCompetitions}</p>
                        <p className="text-xs text-green-600 font-medium">In progress</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed Reviews</p>
                        <p className="text-2xl font-bold text-foreground">{completedReviews}</p>
                        <p className="text-xs text-purple-600 font-medium">All time</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Competitions to Judge */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-orange-500" />
                        Competitions to Judge
                      </CardTitle>
                      <CardDescription>Your assigned competitions and pending evaluations</CardDescription>
                    </div>
                    <Badge variant="secondary" className="animate-pulse">
                      {pendingEvaluations} pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {competitionsToJudge.length > 0 ? (
                    competitionsToJudge.map((competition) => (
                      <div key={competition.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getStatusIcon(competition.status)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{competition.title}</p>
                            <p className="text-sm text-muted-foreground">{competition.description}</p>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(competition.startTime).toLocaleDateString()} - {new Date(competition.endTime).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className={getStatusColor(competition.status)}>
                                {competition.status.toLowerCase().replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {competition.submissionsAwaitingEvaluation > 0 && (
                            <Badge variant="destructive" className="mr-2">
                              {competition.submissionsAwaitingEvaluation} pending
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" disabled={competition.submissionsAwaitingEvaluation === 0}>
                            Start Judging
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No competitions assigned yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity & Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      Judging Progress
                    </CardTitle>
                    <CardDescription>Your evaluation progress and stats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{completedReviews}/{completedReviews + pendingEvaluations} evaluations</span>
                        </div>
                        <Progress value={(completedReviews / (completedReviews + pendingEvaluations)) * 100} className="h-3" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{Math.round((completedReviews / (completedReviews + pendingEvaluations)) * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">2.5</p>
                          <p className="text-xs text-muted-foreground">Avg Days</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">4.8</p>
                          <p className="text-xs text-muted-foreground">Quality Score</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest judging activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {competitionsToJudge.slice(0, 3).map((competition) => (
                      <div key={competition.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getStatusIcon(competition.status)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{competition.title}</p>
                            <p className="text-xs text-muted-foreground">{competition.status.toLowerCase().replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{competition.submissionsAwaitingEvaluation}</p>
                          <p className="text-xs text-muted-foreground">pending</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-3">
                      View All Activities
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
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

export default JudgeDashboard;
