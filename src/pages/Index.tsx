
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Zap, Mic, Brain, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: "standard",
      name: "Standard",
      duration: "1 hour",
      price: "$50",
      priceCents: 5000,
      durationMinutes: 60,
      description: "Perfect for most technical interviews",
      features: [
        "60 minutes of real-time assistance",
        "Resume & job description analysis",
        "AI-powered answer generation",
        "Live speech-to-text",
        "Countdown timer",
        "24-hour transcript access"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      duration: "2 hours",
      price: "$90",
      priceCents: 9000,
      durationMinutes: 120,
      description: "Ideal for panel interviews and extended sessions",
      features: [
        "120 minutes of real-time assistance",
        "Resume & job description analysis",
        "AI-powered answer generation",
        "Live speech-to-text",
        "Countdown timer",
        "24-hour transcript access",
        "Enhanced answer accuracy"
      ],
      popular: true
    },
    {
      id: "elite",
      name: "Elite",
      duration: "3 hours",
      price: "$125",
      priceCents: 12500,
      durationMinutes: 180,
      description: "For comprehensive interview processes",
      features: [
        "180 minutes of real-time assistance",
        "Resume & job description analysis",
        "AI-powered answer generation",
        "Live speech-to-text",
        "Countdown timer",
        "24-hour transcript access",
        "Priority answer generation",
        "Advanced context understanding"
      ],
      popular: false
    }
  ];

  const handleStartSession = async (plan: typeof plans[0]) => {
    setLoading(plan.id);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to auth with plan info
        navigate('/auth', { state: { selectedPlan: plan } });
        return;
      }

      // Create session record
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: session.user.id,
          plan_type: plan.id as 'standard' | 'pro' | 'elite',
          duration_minutes: plan.durationMinutes,
          price_cents: plan.priceCents,
          status: 'pending_payment'
        })
        .select()
        .single();

      if (sessionError) {
        throw sessionError;
      }

      // Redirect to payment (will implement Stripe integration)
      navigate('/payment', { state: { sessionId: sessionData.id, plan } });

    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">InterviewAce</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🚀 Production-Grade Interview Assistant
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ace Your Next
            <span className="text-blue-600 block">Live Interview</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Real-time AI assistance during your interview. Upload your resume and job description, 
            then get tailored answers generated on-the-fly as you speak.
          </p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Mic className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Real-time Speech Recognition</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-medium">AI-Powered Answers</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Timer className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Timed Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Interview Duration
            </h2>
            <p className="text-xl text-gray-600">
              One-time payment. No subscriptions. No refunds after session starts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full py-6 text-lg font-semibold"
                    onClick={() => handleStartSession(plan)}
                    disabled={loading === plan.id}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {loading === plan.id ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Session'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Secure payment via</p>
            <div className="flex justify-center items-center space-x-6 text-gray-500">
              <span className="font-semibold">💳 Card</span>
              <span className="font-semibold">🍎 Apple Pay</span>
              <span className="font-semibold">📱 Google Pay</span>
              <span className="font-semibold">💙 PayPal</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our streamlined process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose & Pay",
                description: "Select your plan and complete secure payment",
                icon: "💳"
              },
              {
                step: "2", 
                title: "Upload Documents",
                description: "Upload your resume and job description (PDF/Word)",
                icon: "📄"
              },
              {
                step: "3",
                title: "Pre-Session Check",
                description: "Test your microphone and system compatibility",
                icon: "🎤"
              },
              {
                step: "4",
                title: "Live Interview",
                description: "Get real-time AI assistance during your interview",
                icon: "🧠"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is encrypted and deleted after 24 hours</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Sub-3 second response time for real-time assistance</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">8/10 average relevance score in beta testing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">InterviewAce</span>
          </div>
          <p className="text-gray-400 mb-6">
            Real-time AI interview assistance for confident candidates
          </p>
          <div className="text-sm text-gray-500">
            <p>© 2024 InterviewAce. All rights reserved.</p>
            <p className="mt-2">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span> • 
              <span className="hover:text-white cursor-pointer ml-2">Terms of Service</span> • 
              <span className="hover:text-white cursor-pointer ml-2">GDPR Compliance</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
