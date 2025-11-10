import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Shirt, Eye, Users, Clock } from 'lucide-react';

const InterviewTips = () => {
  const attireTips = [
    {
      icon: Shirt,
      title: 'Professional Attire',
      description: 'Wear business professional or business casual attire',
      examples: ['Solid colored shirt or blouse', 'Blazer or professional jacket', 'Avoid busy patterns or logos']
    },
    {
      icon: Eye,
      title: 'Visual Presentation',
      description: 'Ensure good lighting and camera positioning',
      examples: ['Face the light source', 'Camera at eye level', 'Clean, professional background']
    }
  ];

  const behaviorTips = [
    {
      icon: Users,
      title: 'Body Language',
      description: 'Maintain confident and professional posture',
      points: ['Sit up straight', 'Maintain eye contact with camera', 'Use natural hand gestures', 'Smile appropriately']
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Structure your responses effectively',
      points: ['Use STAR method (Situation, Task, Action, Result)', 'Keep answers concise (1-2 minutes)', 'Practice beforehand', 'Prepare questions for the interviewer']
    }
  ];

  return (
    <div className="space-y-8 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          Interview <span className="text-primary">Preparation Guide</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow these professional guidelines to make the best impression
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {attireTips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card key={index} className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {behaviorTips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card key={index} className="border-accent/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{tip.description}</p>
                <ul className="space-y-2">
                  {tip.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Remember</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Practice makes perfect - record yourself and review your performance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Authenticity matters - be yourself while maintaining professionalism
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Technical setup - test your camera, microphone, and internet connection beforehand
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewTips;
