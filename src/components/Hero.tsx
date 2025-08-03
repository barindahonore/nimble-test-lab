import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Calendar, Users, Trophy, Target, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const Hero = () => {
  const stats = [
    { icon: Calendar, value: "500+", label: "Events Hosted" },
    { icon: Users, value: "2,000+", label: "Active Students" },
    { icon: Trophy, value: "150+", label: "Competitions" },
    { icon: Target, value: "95%", label: "Success Rate" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-white to-blue-50/30 overflow-hidden">
      {/* Modern grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fade-in">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-semibold shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                School of Leadership Afghanistan
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Streamline Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
                  Educational Events
                </span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 leading-relaxed max-w-xl font-light">
                Empower students through seamless event management, competitive challenges, 
                and collaborative learning experiences at Afghanistan's premier leadership institution.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6">
              <Button variant="hero" size="lg" className="h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base font-semibold group shadow-xl">
                Start Creating Events
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base font-semibold group border-2 hover:bg-slate-50">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 lg:pt-12">
              {stats.map((stat, index) => (
                <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-border/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 text-center h-full hover:border-primary/30">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary rounded-xl sm:rounded-2xl mb-2 sm:mb-3 lg:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-foreground" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in lg:animate-scale-in order-first lg:order-last" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
              <img
                src={heroImage}
                alt="Students collaborating on educational platform"
                className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] object-cover rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20"
              />
              
              {/* Modern Floating Cards - Responsive */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-6 lg:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl border border-slate-100 animate-float backdrop-blur-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">New Event</div>
                    <div className="text-xs text-slate-500">Leadership Challenge</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl border border-slate-100 animate-float backdrop-blur-sm" style={{ animationDelay: "1s" }}>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">25 Teams</div>
                    <div className="text-xs text-slate-500">Registered</div>
                  </div>
                </div>
              </div>
              
              {/* Additional floating element */}
              <div className="absolute top-1/2 -right-2 sm:-right-3 lg:-right-4 bg-white rounded-lg sm:rounded-xl p-2 sm:p-2.5 lg:p-3 shadow-xl border border-slate-100 animate-float" style={{ animationDelay: "2s" }}>
                <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md sm:rounded-lg flex items-center justify-center">
                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;