# Fonzi.ai Clone - Quick Start

## 🚀 Start the App (2 Commands)

```bash
cd /Users/gokulkrishnaa/fonzi-clone

# Terminal 1: Frontend
npm run dev
# Visit http://localhost:3000

# Terminal 2: Backend (AWS Sandbox)
npm run sandbox
# Deploys to AWS (2-3 min first time)
```

## ✅ What Works Right Now

### Frontend
- **Marketing Homepage**: http://localhost:3000
  - Dark editorial brutalist design
  - Hero + stats panel
  - Features, testimonials, company logos
  - Fully responsive

### Backend (After `npm run sandbox`)
- **GraphQL API**: Complete schema with 22 models
- **Auth**: Cognito with email + Google SSO
- **Database**: DynamoDB tables ready
- **Storage**: S3 bucket configured
- **Lambda**: 13 function placeholders deployed

## 🔧 Configuration Needed

### For Google SSO
```bash
npx ampx sandbox secret set GOOGLE_CLIENT_ID
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET
```

### For Stripe (Later)
```bash
npx ampx sandbox secret set STRIPE_SECRET_KEY
npx ampx sandbox secret set STRIPE_WEBHOOK_SECRET
```

## 📋 Project Status

- [x] Next.js 14 + Tailwind CSS v4
- [x] Amplify Gen 2 backend configured
- [x] 22 data models + 14 enums
- [x] Complete design system
- [x] 17 UI components
- [x] Marketing homepage
- [ ] Auth pages (login, signup)
- [ ] Platform layouts
- [ ] Candidate portal
- [ ] Company portal
- [ ] Admin dashboard
- [ ] Lambda function logic
- [ ] AI features (Bedrock)
- [ ] Match Day engine
- [ ] Billing integration

## 🎯 Build Order (Recommended)

1. **Week 1**: Auth pages + guards
2. **Week 2**: Candidate onboarding
3. **Week 3**: Company portal
4. **Week 4**: Admin dashboard
5. **Week 5-6**: AI features
6. **Week 7-8**: Match Day engine
7. **Week 9-10**: Integrations

## 📁 Key Files

- `amplify/data/resource.ts` - GraphQL schema (996 lines)
- `app/page.tsx` - Marketing homepage
- `components/ui/*` - 17 reusable components
- `lib/auth-utils.ts` - Auth helpers
- `hooks/use-auth.ts` - Auth state management

## 📚 Documentation

- `IMPLEMENTATION_STATUS.md` - Detailed progress
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `QUICK_START.md` - This file

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
pkill -9 -f "next"
npm run dev
```

### Sandbox deployment fails
```bash
# Delete old sandbox
npm run sandbox:delete

# Create new one
npm run sandbox
```

### Build errors
The Lambda functions import AWS SDK packages. This is fine - they're available in the Lambda runtime. To fix TypeScript errors, add to `tsconfig.json`:
```json
{
  "exclude": ["amplify"]
}
```

## 🎉 You're Ready!

Phase 1 is complete. Start building features now!
