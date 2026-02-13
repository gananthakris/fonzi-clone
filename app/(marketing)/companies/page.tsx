export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-surface-dark text-white py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-6xl mb-8">For Companies</h1>
        <p className="text-xl text-white/60 mb-12">
          Find elite AI/ML talent through our curated Match Day hiring sprint
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-3xl mb-4 text-primary-300">Post a Role</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Create job postings with our AI-powered description generator. Set salary ranges,
              requirements, and preferences.
            </p>
            <a href="/signup?role=company" className="text-primary-300 hover:text-primary-200 underline">
              Get started →
            </a>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-purple-400">Match Day Access</h2>
            <p className="text-white/70 leading-relaxed">
              Once a month, view anonymized profiles of pre-screened candidates. All engineers
              have been vetted through our AI screening and fraud prevention.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-accent">Submit Offers</h2>
            <p className="text-white/70 leading-relaxed">
              During the 48-hour window, submit salary-backed offers to candidates you want to interview.
              Real compensation numbers required.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl mb-4 text-primary-300">Interview & Hire</h2>
            <p className="text-white/70 leading-relaxed">
              Candidates choose which offers to accept. Schedule interviews, make hiring decisions.
              Pay an 18% placement fee only when you successfully hire.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
