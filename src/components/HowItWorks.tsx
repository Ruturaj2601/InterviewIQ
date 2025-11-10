import { Mic, MessageSquare, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Choose Your Role",
    description: "Select your target position and industry. Our AI customizes questions to match your career goals."
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Practice Interview",
    description: "Answer questions using voice or text. Our AI listens and analyzes your responses in real-time."
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get Detailed Feedback",
    description: "Receive comprehensive feedback on content, delivery, and communication skills. Track your improvement."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How InterviewIQ
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get interview-ready in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20"></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Step number circle */}
                <div className="mb-6 relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-30"></div>
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
