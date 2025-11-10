import { Brain, BarChart3, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description: "Get instant, detailed feedback on your responses using advanced GPT technology. Learn what works and what doesn't.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Target,
    title: "Industry-Specific Questions",
    description: "Practice with questions tailored to your target role and industry. From tech to finance, we've got you covered.",
    color: "from-cyan-500 to-teal-500"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress over time with detailed analytics. Identify strengths and areas for improvement.",
    color: "from-teal-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Real-Time Voice Analysis",
    description: "Practice speaking naturally. Our AI analyzes your speech patterns, pace, and clarity in real-time.",
    color: "from-blue-600 to-indigo-600"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform gives you the tools and insights to ace any interview
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
