import type { OnboardingStep } from "@/lib/types";

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export const APP_NAME = "Fonzi.ai";
export const APP_DESCRIPTION =
  "The AI-powered hiring marketplace that matches top tech talent with innovative companies through live Match Day events.";
export const APP_URL = "https://fonzi.ai";

// ---------------------------------------------------------------------------
// Match Day
// ---------------------------------------------------------------------------

export const MATCH_DAY_DURATION_HOURS = 48;

// ---------------------------------------------------------------------------
// Placement & Fees
// ---------------------------------------------------------------------------

export const PLACEMENT_FEE_PERCENTAGE = 18;

// ---------------------------------------------------------------------------
// Onboarding Steps (Candidate)
// ---------------------------------------------------------------------------

export const ONBOARDING_STEPS: Omit<OnboardingStep, "isComplete">[] = [
  {
    key: "create_account",
    title: "Create Account",
    description: "Sign up and verify your email address.",
  },
  {
    key: "basic_info",
    title: "Basic Information",
    description: "Add your name, location, and contact details.",
  },
  {
    key: "role_preferences",
    title: "Role Preferences",
    description: "Select your desired role focus, experience level, and work preference.",
  },
  {
    key: "skills",
    title: "Skills & Tech Stack",
    description: "List your technical skills and proficiency levels.",
  },
  {
    key: "experience",
    title: "Work Experience",
    description: "Add your employment history and key achievements.",
  },
  {
    key: "education",
    title: "Education",
    description: "Add your educational background and certifications.",
  },
  {
    key: "resume",
    title: "Upload Resume",
    description: "Upload your latest resume or CV.",
  },
  {
    key: "salary",
    title: "Salary Expectations",
    description: "Set your desired salary range and compensation preferences.",
  },
  {
    key: "availability",
    title: "Availability",
    description: "Indicate your availability and preferred start date.",
  },
  {
    key: "review",
    title: "Review & Submit",
    description: "Review your profile and submit for Match Day eligibility.",
  },
];

// ---------------------------------------------------------------------------
// Incentive Amounts (USD)
// ---------------------------------------------------------------------------

export const INCENTIVE_AMOUNTS: Record<string, number> = {
  FIRST_MATCH_DAY: 100,
  COMPLETED_INTERVIEW: 50,
  HIRE_BONUS: 1000,
  REFERRAL_MATCH_DAY: 100,
  REFERRAL_HIRED: 1000,
};

// ---------------------------------------------------------------------------
// Fraud Prevention
// ---------------------------------------------------------------------------

export const DISPOSABLE_EMAIL_DOMAINS: string[] = [
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "guerrillamail.info",
  "guerrillamail.de",
  "trbvm.com",
  "maildrop.cc",
  "dispostable.com",
  "trashmail.com",
  "10minutemail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "getnada.com",
  "emailondeck.com",
  "mohmal.com",
];

// ---------------------------------------------------------------------------
// Skill Categories
// ---------------------------------------------------------------------------

export const SKILL_CATEGORIES: Record<string, string[]> = {
  "Languages": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "C#",
    "Ruby",
    "Kotlin",
    "Swift",
    "Scala",
    "PHP",
  ],
  "Frontend": [
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Svelte",
    "Tailwind CSS",
    "HTML/CSS",
    "Redux",
    "GraphQL Client",
    "React Native",
  ],
  "Backend": [
    "Node.js",
    "Express",
    "FastAPI",
    "Django",
    "Spring Boot",
    "NestJS",
    "GraphQL",
    "REST APIs",
    "gRPC",
    "Microservices",
  ],
  "AI/ML": [
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "LLMs / GPT",
    "Computer Vision",
    "NLP",
    "MLOps",
    "Hugging Face",
    "LangChain",
    "RAG",
    "Fine-tuning",
    "Prompt Engineering",
  ],
  "Data": [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "DynamoDB",
    "Redis",
    "Elasticsearch",
    "Kafka",
    "Spark",
    "Snowflake",
    "dbt",
    "Airflow",
  ],
  "Cloud & DevOps": [
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "GitHub Actions",
    "Serverless",
    "CDK",
  ],
  "Mobile": [
    "React Native",
    "Flutter",
    "Swift/SwiftUI",
    "Kotlin/Jetpack Compose",
    "iOS",
    "Android",
  ],
};

// ---------------------------------------------------------------------------
// Navigation Links
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

/** Marketing site top nav */
export const NAV_LINKS: NavLink[] = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Candidates", href: "/candidates" },
  { label: "For Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

/** Candidate platform sidebar */
export const CANDIDATE_NAV_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Match Day", href: "/dashboard/match-day", icon: "Zap" },
  { label: "Offers", href: "/dashboard/offers", icon: "Gift" },
  { label: "Interviews", href: "/dashboard/interviews", icon: "Calendar" },
  { label: "Incentives", href: "/dashboard/incentives", icon: "DollarSign" },
  { label: "Referrals", href: "/dashboard/referrals", icon: "Users" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

/** Company platform sidebar */
export const COMPANY_NAV_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/company", icon: "LayoutDashboard" },
  { label: "Open Roles", href: "/company/roles", icon: "Briefcase" },
  { label: "Match Day", href: "/company/match-day", icon: "Zap" },
  { label: "Candidates", href: "/company/candidates", icon: "Users" },
  { label: "Interviews", href: "/company/interviews", icon: "Calendar" },
  { label: "Placements", href: "/company/placements", icon: "CheckCircle" },
  { label: "Billing", href: "/company/billing", icon: "CreditCard" },
  { label: "Settings", href: "/company/settings", icon: "Settings" },
];

/** Admin platform sidebar */
export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Match Days", href: "/admin/match-days", icon: "Zap" },
  { label: "Candidates", href: "/admin/candidates", icon: "Users" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Placements", href: "/admin/placements", icon: "CheckCircle" },
  { label: "Incentives", href: "/admin/incentives", icon: "DollarSign" },
  { label: "Fraud Signals", href: "/admin/fraud", icon: "ShieldAlert" },
  { label: "Content", href: "/admin/content", icon: "FileText" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];
