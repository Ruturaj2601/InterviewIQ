import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    image: "👩‍💻",
    content: "InterviewIQ helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my technical communication skills.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Product Manager at Amazon",
    image: "👨‍💼",
    content: "The industry-specific questions were spot-on. I felt completely prepared for my PM interviews. Highly recommend!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director at Meta",
    image: "👩‍🎨",
    content: "The performance analytics helped me track my progress. Within two weeks, I saw significant improvement in my interview skills.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Loved by
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands who've successfully landed their dream jobs
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border"
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-bold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
