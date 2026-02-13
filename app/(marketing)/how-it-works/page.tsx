export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface-dark text-white py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-6xl mb-8">How It Works</h1>
        <p className="text-xl text-white/60 mb-12">
          The complete guide to getting hired through Fonzi.ai
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-3xl mb-4 text-primary-300">Step 1: AI Screening</h2>
            <p className="text-white/70 leading-relaxed">
              Complete our 20-minute AI interview covering technical skills, research background, and communication.
              Our AI evaluates your responses and generates a comprehensive score.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-purple-400">Step 2: Match Day</h2>
            <p className="text-white/70 leading-relaxed">
              Once approved, you enter the monthly 48-hour Match Day. Companies see anonymized profiles
              and submit salary-backed offers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-accent">Step 3: Review Offers</h2>
            <p className="text-white/70 leading-relaxed">
              During the 48-hour window, review all offers with full compensation details.
              No guessing games—real numbers on the table.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-primary-300">Step 4: Choose & Interview</h2>
            <p className="text-white/70 leading-relaxed">
              Select which companies to interview with. You're in control. Get hired at the best AI companies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
