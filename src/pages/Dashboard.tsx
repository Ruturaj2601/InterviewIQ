import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Clock, Award, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionStats {
  totalSessions: number;
  averageScore: number;
  weeklyProgress: number;
}

interface RecentSession {
  id: string;
  question_type: string;
  difficulty: string;
  created_at: string;
  feedback?: {
    overall_score: number;
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    averageScore: 0,
    weeklyProgress: 0
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch all sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          question_type,
          difficulty,
          created_at,
          interview_feedback(overall_score)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Calculate stats
      const totalSessions = sessions?.length || 0;
      
      const sessionsWithScores = sessions?.filter(
        s => s.interview_feedback && s.interview_feedback.length > 0
      ) || [];

      const averageScore = sessionsWithScores.length > 0
        ? Math.round(
            sessionsWithScores.reduce((acc, s) => {
              const feedback = Array.isArray(s.interview_feedback) 
                ? s.interview_feedback[0] 
                : s.interview_feedback;
              return acc + (feedback?.overall_score || 0);
            }, 0) / sessionsWithScores.length
          )
        : 0;

      // Calculate weekly progress (sessions in last 7 days vs previous 7 days)
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const lastWeekSessions = sessions?.filter(
        s => new Date(s.created_at) >= lastWeek
      ).length || 0;

      const previousWeekSessions = sessions?.filter(
        s => new Date(s.created_at) >= twoWeeksAgo && new Date(s.created_at) < lastWeek
      ).length || 0;

      const weeklyProgress = previousWeekSessions > 0
        ? Math.round(((lastWeekSessions - previousWeekSessions) / previousWeekSessions) * 100)
        : lastWeekSessions > 0 ? 100 : 0;

      setStats({
        totalSessions,
        averageScore,
        weeklyProgress
      });

      // Format recent sessions
      const formattedSessions = sessions?.slice(0, 5).map(s => ({
        id: s.id,
        question_type: s.question_type,
        difficulty: s.difficulty,
        created_at: s.created_at,
        feedback: Array.isArray(s.interview_feedback) && s.interview_feedback.length > 0
          ? { overall_score: s.interview_feedback[0].overall_score }
          : undefined
      })) || [];

      setRecentSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewIQ</span>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your interview preparation progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Practice makes perfect
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep improving!
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Progress
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.weeklyProgress > 0 ? '+' : ''}{stats.weeklyProgress}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                vs. last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleStartInterview}
              className="w-full md:w-auto"
            >
              <Brain className="w-4 h-4 mr-2" />
              Start New Interview
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest practice interviews</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {session.question_type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.difficulty} • {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {session.feedback && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {session.feedback.overall_score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No sessions yet</p>
                <Button onClick={handleStartInterview}>
                  Start Your First Interview
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
