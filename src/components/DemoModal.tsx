import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlayCircle, CheckCircle } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const steps = [
    {
      title: 'Choose Your Question',
      description: 'Select question type (Behavioral, Technical, Case Study) and difficulty level',
      time: '30 seconds'
    },
    {
      title: 'Start Recording',
      description: 'Click "Start Practice" to begin recording your video response',
      time: '2-3 minutes'
    },
    {
      title: 'Answer Naturally',
      description: 'Speak clearly while maintaining eye contact with the camera',
      time: 'Recommended: 1-2 min'
    },
    {
      title: 'Get AI Feedback',
      description: 'Receive detailed analysis on clarity, relevance, structure, and body language',
      time: 'Instant'
    },
    {
      title: 'Review & Improve',
      description: 'Study your strengths and areas for improvement, then practice again',
      time: 'As needed'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <PlayCircle className="w-7 h-7 text-primary" />
            How InterviewIQ Works
          </DialogTitle>
          <DialogDescription className="text-base">
            Follow these steps to master your interview skills with AI-powered feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                <div className="flex items-center gap-2 text-sm text-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">{step.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">Pro Tips for Success:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Practice multiple times to track your improvement over time</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use the posture detection feedback to maintain professional body language</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Review your video recordings to identify areas for improvement</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Focus on one improvement area at a time for better results</span>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
