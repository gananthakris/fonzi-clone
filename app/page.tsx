import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-dark">
      {/* Navigation - Minimal, floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="text-white font-serif text-2xl tracking-tight">
            fonzi<span className="text-primary-300">.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-white/70 hover:text-white text-sm font-mono transition-colors">
              How It Works
            </Link>
            <Link href="/companies" className="text-white/70 hover:text-white text-sm font-mono transition-colors">
              For Companies
            </Link>
            <Link href="/blog" className="text-white/70 hover:text-white text-sm font-mono transition-colors">
              Blog
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Dramatic, asymmetric */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[140px] opacity-15" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Badge className="mb-6 bg-primary-500/20 text-primary-200 border-primary-400/30 font-mono text-xs tracking-wider">
                MONTHLY MATCH DAY • 48 HOURS
              </Badge>

              <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white mb-6 tracking-tight">
                Get Hired by the<br />
                <span className="text-primary-300 italic">World's Best</span><br />
                AI Companies
              </h1>

              <p className="text-xl text-white/60 max-w-[560px] mb-8 font-mono leading-relaxed">
                Elite AI/ML engineers meet top tech companies in a 48-hour hiring sprint.
                Review salary-backed offers. Choose who to interview. Get hired.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="text-base group" asChild>
                  <Link href="/signup?role=candidate">
                    Join as Candidate
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" className="text-base" asChild>
                  <Link href="/signup?role=company">
                    Post a Role
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 text-sm text-white/40 font-mono">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-300" />
                  <span>Fraud Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Screened</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>48h Offers</span>
                </div>
              </div>
            </div>

            {/* Stats panel - floating card */}
            <div className="lg:col-span-5">
              <div className="bg-surface-dark/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="text-5xl font-serif text-primary-300">2.4K</div>
                    <div className="text-sm text-white/50 font-mono">Elite Engineers</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-serif text-purple-400">$180K</div>
                    <div className="text-sm text-white/50 font-mono">Avg. Salary</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-serif text-accent">350+</div>
                    <div className="text-sm text-white/50 font-mono">Companies</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-serif text-primary-300">94%</div>
                    <div className="text-sm text-white/50 font-mono">Match Rate</div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="text-xs text-white/40 font-mono mb-3">NEXT MATCH DAY</div>
                  <div className="text-2xl font-serif text-white mb-1">March 15, 2026</div>
                  <div className="text-sm text-white/50 font-mono">23 days remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Editorial layout */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20">
            <h2 className="font-serif text-6xl text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-white/50 font-mono max-w-2xl">
              Four steps to your next AI role. No applications. No ghosting. Just results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Complete AI Screening",
                desc: "Our AI interviewer evaluates your technical skills, research background, and communication. Takes 20 minutes.",
                icon: Sparkles,
                color: "primary-300"
              },
              {
                num: "02",
                title: "Match Day Begins",
                desc: "Once a month, approved candidates enter the 48-hour Match Day. Companies see anonymized profiles.",
                icon: Zap,
                color: "accent"
              },
              {
                num: "03",
                title: "Review Offers",
                desc: "Receive salary-backed offers directly. No guessing games. Companies put real compensation on the table.",
                icon: TrendingUp,
                color: "purple-400"
              },
              {
                num: "04",
                title: "Choose & Interview",
                desc: "Select which companies to interview with. You're in control. Get hired at the best AI companies.",
                icon: CheckCircle2,
                color: "primary-300"
              }
            ].map((step) => (
              <div key={step.num} className="group relative">
                <div className="absolute -left-4 top-0 text-[120px] font-serif text-white/5 leading-none">
                  {step.num}
                </div>
                <div className="relative bg-surface-dark/60 backdrop-blur border border-white/10 rounded-xl p-8 hover:border-white/20 transition-colors">
                  <step.icon className={`w-10 h-10 text-${step.color} mb-4`} />
                  <h3 className="text-2xl font-serif text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 font-mono text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Asymmetric grid */}
      <section className="py-32 relative bg-white/[0.02]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large feature */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-400/30 rounded-2xl p-12">
              <div className="max-w-[500px]">
                <Shield className="w-12 h-12 text-primary-300 mb-6" />
                <h3 className="text-4xl font-serif text-white mb-4">
                  Multi-Layer<br />Fraud Prevention
                </h3>
                <p className="text-white/60 font-mono mb-6">
                  Disposable email blocking, AI-powered screening, GitHub analysis, and manual verification ensure only legitimate candidates.
                </p>
                <Button variant="ghost" size="sm" className="text-primary-300" asChild>
                  <Link href="/fraud-prevention">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Small feature */}
            <div className="bg-surface-dark/60 backdrop-blur border border-white/10 rounded-2xl p-8">
              <Sparkles className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-2xl font-serif text-white mb-3">$1000 Hiring Bonus</h3>
              <p className="text-white/60 font-mono text-sm">
                Earn rewards for Match Day participation, interviews, and successful hires.
              </p>
            </div>

            {/* Medium features */}
            <div className="bg-surface-dark/60 backdrop-blur border border-white/10 rounded-2xl p-8">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-2xl font-serif text-white mb-3">Elite Community</h3>
              <p className="text-white/60 font-mono text-sm">
                Join the top 5% of AI/ML engineers. Exclusive events, networking, career growth.
              </p>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-purple-500/20 to-accent/20 border border-purple-400/30 rounded-2xl p-12">
              <div className="max-w-[500px]">
                <Zap className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-4xl font-serif text-white mb-4">
                  Salary-Backed<br />Offers Only
                </h3>
                <p className="text-white/60 font-mono mb-6">
                  No vague "competitive salary" promises. Companies submit real compensation numbers within your role's posted range.
                </p>
                <Button variant="ghost" size="sm" className="text-accent" asChild>
                  <Link href="/how-it-works">
                    See How <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Magazine style */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="font-serif text-6xl text-white mb-20 tracking-tight">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I received 6 offers in 48 hours. The transparency around compensation made it easy to compare and choose the best fit.",
                name: "Sarah Chen",
                role: "ML Engineer",
                company: "Anthropic",
                avatar: "SC"
              },
              {
                quote: "Fonzi's AI screening was thorough but fair. It felt like talking to a senior engineer, not filling out a form.",
                name: "Marcus Johnson",
                role: "Research Scientist",
                company: "OpenAI",
                avatar: "MJ"
              },
              {
                quote: "As a company, Match Day is incredible. We hired 3 exceptional engineers in one cohort. The fraud prevention works.",
                name: "Elena Rodriguez",
                role: "Head of Talent",
                company: "Hugging Face",
                avatar: "ER"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-surface-dark/40 backdrop-blur border border-white/10 rounded-xl p-8 hover:border-white/20 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-white/80 font-mono text-sm mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-300 flex items-center justify-center font-mono text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-mono text-sm">{testimonial.name}</div>
                    <div className="text-white/40 font-mono text-xs">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos - Scrolling */}
      <section className="py-20 border-y border-white/10 overflow-hidden">
        <div className="flex gap-12 animate-[scroll_40s_linear_infinite]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="text-white/20 font-mono text-xl tracking-wider px-8">
                {["ANTHROPIC", "OPENAI", "HUGGING FACE", "STABILITY", "COHERE", "MIDJOURNEY"][i % 6]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA - Bold */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 via-purple-500/20 to-accent/20" />
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
          <h2 className="font-serif text-[clamp(3rem,6vw,5rem)] text-white mb-8 leading-tight tracking-tight">
            Ready to Find Your<br />
            <span className="italic text-primary-300">Next AI Role?</span>
          </h2>
          <p className="text-xl text-white/60 font-mono mb-12 max-w-2xl mx-auto">
            Join 2,400+ elite AI/ML engineers. Next Match Day starts in 23 days.
          </p>
          <Button size="xl" className="text-lg" asChild>
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-white font-serif text-2xl mb-4">
                fonzi<span className="text-primary-300">.ai</span>
              </div>
              <p className="text-white/40 font-mono text-sm">
                Elite AI talent marketplace
              </p>
            </div>

            <div>
              <div className="text-white/60 font-mono text-xs mb-4 uppercase tracking-wider">Platform</div>
              <div className="space-y-2">
                {["For Candidates", "For Companies", "How It Works", "Match Day"].map(link => (
                  <div key={link}>
                    <Link href="#" className="text-white/60 hover:text-white font-mono text-sm transition-colors">
                      {link}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-white/60 font-mono text-xs mb-4 uppercase tracking-wider">Resources</div>
              <div className="space-y-2">
                {["Blog", "Glossary", "FAQ", "Events"].map(link => (
                  <div key={link}>
                    <Link href="#" className="text-white/60 hover:text-white font-mono text-sm transition-colors">
                      {link}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-white/60 font-mono text-xs mb-4 uppercase tracking-wider">Company</div>
              <div className="space-y-2">
                {["About", "Careers", "Press", "Contact"].map(link => (
                  <div key={link}>
                    <Link href="#" className="text-white/60 hover:text-white font-mono text-sm transition-colors">
                      {link}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="text-white/40 font-mono text-xs">
              © 2026 Fonzi.ai. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              {["Terms", "Privacy", "Security"].map(link => (
                <Link key={link} href="#" className="text-white/40 hover:text-white/60 font-mono text-xs transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
