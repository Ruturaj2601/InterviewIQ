import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Video, Play, Square, AlertTriangle, Eye, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { usePostureDetection } from '@/hooks/usePostureDetection';
import DemoModal from './DemoModal';
import InterviewTips from './InterviewTips';

// Comprehensive Question Bank organized by themes
const QUESTION_BANK = {
  Behavioral: {
    Easy: [
      "Tell me about yourself and your background.",
      "What motivates you to come to work each day?",
      "Describe your ideal work environment.",
      "What are your greatest professional strengths?",
      "How do you prioritize your tasks when you have multiple deadlines?",
      "What interests you about this role and our company?",
      "How would your previous colleagues describe you?",
      "What was your favorite project you've worked on?",
      "How do you handle constructive criticism?",
      "What professional achievement are you most proud of?"
    ],
    Medium: [
      "Describe a time when you had to work with a difficult team member. How did you handle it?",
      "Tell me about a situation where you had to meet a tight deadline. What was your approach?",
      "Give an example of when you had to adapt to a significant change at work.",
      "Describe a time when you went above and beyond your job responsibilities.",
      "Tell me about a conflict you had with a coworker and how you resolved it.",
      "Share an example of when you had to persuade someone to see things your way.",
      "Describe a situation where you had to manage multiple competing priorities.",
      "Tell me about a time when you received negative feedback. How did you respond?",
      "Give an example of when you had to learn a new skill quickly.",
      "Describe a project where you had to collaborate with people from different departments."
    ],
    Hard: [
      "Tell me about a time you failed at something important. What did you learn and how did you recover?",
      "Describe a situation where you had to make a difficult ethical decision at work.",
      "Tell me about a time when you had to lead a team through a challenging situation.",
      "Give an example of when you had to deliver bad news to a client or stakeholder.",
      "Describe the most complex problem you've solved in your career. Walk me through your process.",
      "Tell me about a time when you had to challenge a decision made by senior management.",
      "Share an experience where you had to balance business needs with employee welfare.",
      "Describe a situation where you took a calculated risk that didn't pay off. What happened?",
      "Tell me about a time when you had to rebuild trust after a mistake.",
      "Give an example of when you had to influence change in an organization resistant to it."
    ]
  },
  Technical: {
    Easy: [
      "What is the difference between a class and an object in programming?",
      "Explain what an API is and why it's useful.",
      "What is the difference between frontend and backend development?",
      "Describe what version control is and why it's important.",
      "What is the purpose of a database index?",
      "Explain the difference between HTTP and HTTPS.",
      "What does 'responsive design' mean in web development?",
      "What is the difference between a bug and a feature request?",
      "Explain what cloud computing is in simple terms.",
      "What is the purpose of testing in software development?"
    ],
    Medium: [
      "Explain how you would optimize a slow-loading web page.",
      "What is the difference between authentication and authorization?",
      "Describe the MVC (Model-View-Controller) architectural pattern.",
      "How would you approach debugging a production issue?",
      "Explain what RESTful API design principles are.",
      "What is the difference between SQL and NoSQL databases? When would you use each?",
      "Describe the concept of 'technical debt' and how you manage it.",
      "How do you ensure code quality in your projects?",
      "Explain the difference between synchronous and asynchronous programming.",
      "What security considerations should you keep in mind when building a web application?"
    ],
    Hard: [
      "Design a scalable system for a real-time messaging application with millions of users.",
      "How would you design a URL shortening service like bit.ly?",
      "Explain how you would implement a recommendation system for an e-commerce platform.",
      "Design a distributed caching system for a high-traffic website.",
      "How would you architect a system to handle payment processing at scale?",
      "Describe how you would build a real-time analytics dashboard for millions of events per second.",
      "Design a system for video streaming that can handle millions of concurrent users.",
      "How would you implement a search engine for a large e-commerce site?",
      "Explain how you would design a rate limiting system for an API.",
      "Design a fault-tolerant system for financial transactions."
    ]
  },
  'Case Study': {
    Easy: [
      "A customer complains about slow delivery. How would you address this?",
      "Your team member is consistently late to meetings. What would you do?",
      "A client wants a feature that isn't technically feasible. How do you respond?",
      "Your product received negative reviews. What are your next steps?",
      "A competitor just launched a similar product at a lower price. What do you do?",
      "Your website crashed during a promotional campaign. How do you handle it?",
      "A key team member is leaving. How do you ensure continuity?",
      "Customer satisfaction scores have dropped slightly. What's your approach?",
      "You need to reduce operational costs by 10%. Where do you start?",
      "A new regulation affects your product. How do you respond?"
    ],
    Medium: [
      "Our sales dropped 20% last quarter. How would you investigate and solve this?",
      "We need to increase user engagement by 30% in 6 months. What's your strategy?",
      "Our main competitor is gaining market share. How do you respond?",
      "We have a limited budget to acquire new customers. What channels would you prioritize?",
      "Our product has a high churn rate. How would you reduce it?",
      "We're planning to pivot our business model. How would you approach this transition?",
      "Our team is burned out from overwork. How do you address this while meeting deadlines?",
      "We need to expand to a new customer segment. What's your approach?",
      "Our customer support team is overwhelmed. How would you scale support?",
      "We're launching a new feature but resources are limited. How do you prioritize?"
    ],
    Hard: [
      "Company X wants to enter a new international market. Develop a go-to-market strategy.",
      "Our business model is being disrupted by new technology. How do you transform the company?",
      "We're considering acquiring a competitor. How would you evaluate this opportunity?",
      "Revenue is growing but profit margins are shrinking. What's your turnaround strategy?",
      "We need to rebuild our brand after a major PR crisis. What's your plan?",
      "The market is shifting to subscription models but we sell one-time products. How do you adapt?",
      "We're scaling from 50 to 500 employees in a year. What systems and processes do you implement?",
      "A new well-funded competitor is aggressively targeting our key accounts. How do you respond?",
      "We need to cut 30% of costs while maintaining service quality. What's your approach?",
      "Our core product is becoming commoditized. How do you differentiate and maintain pricing power?"
    ]
  }
};

const getRandomQuestion = (type: keyof typeof QUESTION_BANK, difficulty: 'Easy' | 'Medium' | 'Hard') => {
  const questions = QUESTION_BANK[type][difficulty];
  return questions[Math.floor(Math.random() * questions.length)];
};

const InterviewDemo = () => {
  const { user } = useAuth();
  const [questionType, setQuestionType] = useState<'Behavioral' | 'Technical' | 'Case Study'>('Behavioral');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [currentQuestion, setCurrentQuestion] = useState(() => getRandomQuestion('Behavioral', 'Medium'));
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  const {
    isRecording,
    recordedBlob,
    duration,
    videoRef,
    startRecording,
    stopRecording,
    resetRecording,
    stream
  } = useMediaRecorder();

  const postureAnalysis = usePostureDetection(videoRef.current, isRecording);

  // Regenerate question when type or difficulty changes
  useEffect(() => {
    setCurrentQuestion(getRandomQuestion(questionType, difficulty));
    setUserResponse('');
    setFeedback(null);
  }, [questionType, difficulty]);

  const handleNewQuestion = () => {
    setCurrentQuestion(getRandomQuestion(questionType, difficulty));
    setUserResponse('');
    setFeedback(null);
    resetRecording();
    toast.success('New question generated!');
  };

  const handleStartRecording = async () => {
    setFeedback(null);
    resetRecording();
    const success = await startRecording();
    if (!success) {
      toast.error('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSubmitResponse = async () => {
    // Validate that at least one response type exists
    if (!userResponse.trim() && !recordedBlob) {
      toast.error('Please provide a response (record video or type answer)');
      return;
    }

    setIsGenerating(true);
    setFeedback(null);

    try {
      // Convert recorded blob to base64 if it exists
      let recordedVideoBase64 = null;
      if (recordedBlob) {
        const reader = new FileReader();
        recordedVideoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            // Extract base64 data after the comma
            resolve(base64.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(recordedBlob);
        });
      }

      // Save session to database if user is logged in
      let sessionId = null;
      if (user) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('interview_sessions')
          .insert({
            user_id: user.id,
            question_type: questionType,
            difficulty: difficulty,
            question_text: currentQuestion,
            user_response: userResponse || '[Video Response]',
            duration: duration
          })
          .select()
          .single();

        if (sessionError) throw sessionError;
        sessionId = sessionData.id;
      }

      // Generate AI feedback with both text and video
      const { data, error } = await supabase.functions.invoke('generate-feedback', {
        body: {
          questionType,
          difficulty,
          questionText: currentQuestion,
          userResponse: userResponse || null,
          recordedVideo: recordedVideoBase64
        }
      });

      if (error) throw error;

      const feedbackData = data.feedback;
      setFeedback(feedbackData);

      // Save feedback to database if user is logged in
      if (user && sessionId) {
        await supabase
          .from('interview_feedback')
          .insert({
            session_id: sessionId,
            user_id: user.id,
            overall_score: Math.round(feedbackData.overall_score),
            clarity_score: Math.round(feedbackData.clarity_score),
            relevance_score: Math.round(feedbackData.relevance_score),
            structure_score: Math.round(feedbackData.structure_score),
            feedback_text: feedbackData.feedback_text,
            strengths: feedbackData.strengths,
            improvements: feedbackData.improvements
          });
      }

      toast.success('Feedback generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('Rate limit')) {
        toast.error('Too many requests. Please try again in a moment.');
      } else if (error.message?.includes('Payment required')) {
        toast.error('AI service limit reached. Please contact support.');
      } else {
        toast.error('Failed to generate feedback. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
      
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-6 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Practice with
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                AI-Powered Feedback
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Record your interview responses and receive instant, detailed analysis on your performance
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => setShowDemoModal(true)} variant="outline" size="lg" className="gap-2">
                <Info className="w-5 h-5" />
                Watch Demo
              </Button>
              <Button onClick={() => setShowTips(true)} variant="outline" size="lg" className="gap-2">
                <Eye className="w-5 h-5" />
                Interview Tips
              </Button>
            </div>
          </div>

          {showTips && (
            <div className="mb-12 animate-fade-in">
              <InterviewTips />
              <div className="text-center mt-8">
                <Button onClick={() => setShowTips(false)} variant="outline">
                  Hide Tips
                </Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 animate-scale-in">
            {/* Video Recording & Question Setup */}
            <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Video className="w-6 h-6 text-primary" />
                  Live Interview Practice
                </CardTitle>
                <CardDescription className="text-base">Record your response with real-time posture analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Preview */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!stream && !isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="text-center space-y-2">
                        <Video className="w-16 h-16 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Camera preview will appear here</p>
                      </div>
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="animate-pulse gap-1">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        REC {formatTime(duration)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Posture Analysis */}
                {isRecording && postureAnalysis.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Posture Feedback</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {postureAnalysis.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-yellow-500">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Question Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Question Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['Behavioral', 'Technical', 'Case Study'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={questionType === type ? 'default' : 'outline'}
                      onClick={() => setQuestionType(type)}
                      className="flex-1"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                <div className="flex gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'outline'}
                      onClick={() => setDifficulty(level)}
                      className="flex-1"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

                {/* Question Display */}
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg border border-primary/20 shadow-inner space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary">Your Interview Question:</p>
                    <Button
                      onClick={handleNewQuestion}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      New Question
                    </Button>
                  </div>
                  <p className="text-foreground text-lg leading-relaxed">{currentQuestion}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{questionType}</Badge>
                    <Badge variant="outline" className="text-xs">{difficulty}</Badge>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button
                      onClick={handleStartRecording}
                      className="flex-1 text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopRecording}
                      variant="destructive"
                      className="flex-1 text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {recordedBlob && !isRecording && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Recording saved! Duration: {formatTime(duration)}
                    </p>
                  </div>
                )}

                {/* Response Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Your Response <span className="text-muted-foreground">(Optional - or just use video)</span>
                  </label>
                  <Textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="You can type your answer here, or just submit your video recording..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitResponse}
                  disabled={isGenerating || (!userResponse.trim() && !recordedBlob)}
                  className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Analyzing Your Performance...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Get AI Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Feedback Display */}
            <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">AI Performance Analysis</CardTitle>
                <CardDescription className="text-base">Comprehensive feedback on your interview response</CardDescription>
              </CardHeader>
              <CardContent>
                {!feedback && !isGenerating && (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
                    <div className="relative">
                      <Brain className="w-20 h-20 text-muted-foreground opacity-50" />
                      <div className="absolute inset-0 bg-primary/20 blur-2xl" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Ready to Analyze
                      </p>
                      <p className="text-muted-foreground max-w-sm">
                        Record your response and submit to receive detailed AI-powered feedback
                      </p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-pulse">
                    <div className="relative">
                      <Brain className="w-20 h-20 text-primary animate-bounce" />
                      <div className="absolute inset-0 bg-primary/30 blur-3xl animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-semibold text-foreground">Analyzing Your Performance</p>
                      <p className="text-muted-foreground">AI is evaluating your response...</p>
                    </div>
                  </div>
                )}

                {feedback && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Overall Score */}
                    <div className="text-center p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-xl shadow-inner">
                      <div className="text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                        {Math.round(feedback.overall_score)}%
                      </div>
                      <p className="text-base text-muted-foreground font-medium">Overall Performance Score</p>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground text-lg">Detailed Score Breakdown</h4>
                      {[
                        { label: 'Clarity', value: feedback.clarity_score, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Relevance', value: feedback.relevance_score, color: 'from-purple-500 to-pink-500' },
                        { label: 'Structure', value: feedback.structure_score, color: 'from-green-500 to-emerald-500' }
                      ].map((metric) => (
                        <div key={metric.label} className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{metric.label}</span>
                            <span className={`font-bold text-lg bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                              {Math.round(metric.value)}%
                            </span>
                          </div>
                          <Progress value={metric.value} className="h-3" />
                        </div>
                      ))}
                    </div>

                    {/* Strengths */}
                    <div className="space-y-3 p-5 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Key Strengths
                      </h4>
                      <ul className="space-y-3">
                        {feedback.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="flex gap-3 text-sm items-start">
                            <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                            <span className="text-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-3 p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                      <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Growth Opportunities
                      </h4>
                      <ul className="space-y-3">
                        {feedback.improvements.map((improvement: string, idx: number) => (
                          <li key={idx} className="flex gap-3 text-sm items-start">
                            <span className="text-yellow-500 text-lg flex-shrink-0">→</span>
                            <span className="text-foreground">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Overall Feedback */}
                    <div className="space-y-3 p-5 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-foreground text-lg">Detailed Analysis</h4>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {feedback.feedback_text}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default InterviewDemo;
