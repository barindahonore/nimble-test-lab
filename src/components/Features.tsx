import { Calendar, Users, Trophy, BarChart3, UserCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import eventsImage from "@/assets/events-illustration.jpg";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Event Creation & Management",
      description: "Create and manage educational events with customizable details, requirements, and scheduling.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Users,
      title: "Team Formation & Collaboration",
      description: "Enable students to form teams for group competitions and collaborative challenges.",
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: Trophy,
      title: "Competitions & Challenges",
      description: "Host leadership challenges, quizzes, and academic competitions with scoring systems.",
      color: "bg-accent/10 text-accent"
    },
    {
      icon: UserCheck,
      title: "Judging & Evaluation",
      description: "Online judging platform with customizable criteria and professional assessments.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Track participation, engagement, and performance with detailed analytics dashboards.",
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: Clock,
      title: "Calendar Integration",
      description: "Seamless scheduling with calendar integration and automated event notifications.",
      color: "bg-accent/10 text-accent"
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
            Platform Features
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Everything You Need to Manage
            <span className="text-primary"> Educational Events</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed specifically for educational institutions to streamline 
            event management and foster student engagement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 lg:p-8 h-full hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card border border-border/50 hover:border-primary/20 animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Feature Image */}
          <div className="relative animate-fade-in lg:sticky lg:top-8" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <img
                src={eventsImage}
                alt="Educational events and competitions"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] object-cover rounded-2xl sm:rounded-3xl shadow-2xl border border-border/20"
              />
              
              {/* Overlay Stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl sm:rounded-3xl" />
              
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
                <div className="bg-card/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4 border border-border/20 shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                    <h4 className="font-bold text-foreground text-sm sm:text-base lg:text-lg">Live Event Dashboard</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">48</div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Active Events</div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">234</div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Participants</div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">12</div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Competitions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;