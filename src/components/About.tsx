import { Card } from '@/components/ui/card';
import { Target, Users, Sparkles, TrendingUp } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Empowering job seekers worldwide with AI-powered interview preparation'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature designed with your success and confidence in mind'
    },
    {
      icon: Sparkles,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI to provide the most realistic practice experience'
    },
    {
      icon: TrendingUp,
      title: 'Results Focused',
      description: 'Proven track record of helping candidates ace their interviews'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '95%', label: 'Success Rate' },
    { value: '1M+', label: 'Interviews Practiced' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            About
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> InterviewIQ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make interview preparation accessible, effective, and stress-free for everyone
          </p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Story</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                InterviewIQ was born from a simple observation: traditional interview preparation is broken. 
                Expensive coaches, generic advice, and limited practice opportunities leave many talented 
                individuals unprepared for the interviews that could change their lives.
              </p>
              <p>
                We believed there had to be a better way. By combining advanced AI technology with proven 
                interview coaching methodologies, we created a platform that provides personalized, 
                affordable, and unlimited practice opportunities.
              </p>
              <p>
                Today, InterviewIQ helps thousands of job seekers worldwide prepare for their dream roles. 
                From entry-level positions to C-suite executives, our AI-powered platform adapts to your 
                needs and helps you present your best self in any interview situation.
              </p>
            </div>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-card-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-primary via-primary-glow to-accent rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
