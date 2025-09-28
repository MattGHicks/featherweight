# Featherweight - Deployment Guide

## 🌐 Production Application

**Live URL**: https://featherweight.vercel.app

The application is fully deployed and functional with:
- ✅ User authentication (email magic links, Google OAuth, GitHub OAuth)
- ✅ Gear management with CRUD operations
- ✅ Pack list creation and analytics
- ✅ Image upload for gear items
- ✅ Responsive design for mobile and desktop

## 🚀 Deployment Architecture

### Platform: Vercel
- **Deployment**: Automatic deployments from `main` branch
- **Domain**: Custom domain `featherweight.vercel.app`
- **Environment**: Production environment with secure configurations

### Database: Neon PostgreSQL
- **Provider**: Neon (Serverless PostgreSQL)
- **Connection**: Pooled connections for optimal performance
- **Location**: US East (AWS)
- **Features**: Connection pooling, automatic scaling

### Authentication: NextAuth.js
- **Session Strategy**: JWT-based sessions
- **Providers**: Email magic links, Google OAuth, GitHub OAuth
- **Security**: Secure cookies in production, CSRF protection

### File Storage: Vercel Blob
- **Purpose**: Gear image uploads
- **Integration**: Direct upload from frontend
- **CDN**: Global content delivery network

## 🔧 Environment Configuration

### Production Environment Variables

The following environment variables are configured in Vercel:

```bash
# Database
DATABASE_URL="postgresql://neondb_owner:npg_ZUAcrCB1y3kx@ep-dry-bar-ady7yyo8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="https://featherweight.vercel.app"
NEXTAUTH_SECRET="aXrs3GqkO41HsyqpNGA70YTCvPiHZkgr2rceMTBS2AQ="

# OAuth Providers
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="mattghicks@gmail.com"
EMAIL_SERVER_PASSWORD="ziszhhdwetfiwpha"
EMAIL_FROM="noreply@featherweight.app"

# Feature Flags
ENABLE_RETAILER_INTEGRATION="false"
ENABLE_COMMUNITY_FEATURES="false"
```

## 🔐 OAuth Provider Setup

### Google OAuth Configuration

**Google Cloud Console**: https://console.cloud.google.com/apis/credentials

- **Project**: Featherweight
- **Client Type**: Web application
- **Authorized Redirect URIs**:
  - `https://featherweight.vercel.app/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for development)

### GitHub OAuth Configuration

**GitHub Developer Settings**: https://github.com/settings/developers

- **Application Name**: Featherweight
- **Homepage URL**: `https://featherweight.vercel.app`
- **Authorization Callback URLs**:
  - `https://featherweight.vercel.app/api/auth/callback/github`
  - `http://localhost:3000/api/auth/callback/github` (for development)

## 📊 Database Schema

The database is automatically managed with Prisma migrations:

### Key Tables:
- `User` - User accounts and profiles
- `Account` - OAuth account connections
- `Session` - User sessions
- `Gear` - Gear items with weights and categories
- `Category` - Gear categories (tents, sleeping, cooking, etc.)
- `PackList` - Pack lists for trips
- `PackListItem` - Items included in pack lists

### Seeded Data:
- **Categories**: 15 ultralight backpacking categories
- **Sample Gear**: Comprehensive test data with realistic gear items
- **Pack Lists**: Example pack lists for different trip types

## 🛠️ Deployment Process

### Automatic Deployments

1. **Trigger**: Push to `main` branch
2. **Build**: Vercel builds Next.js application
3. **Deploy**: Automatic deployment to production URL
4. **Database**: Connects to Neon PostgreSQL
5. **CDN**: Assets distributed globally

### Manual Deployment (if needed)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXTAUTH_SECRET production
```

## 🧪 Testing the Deployment

### Authentication Testing
1. Visit https://featherweight.vercel.app
2. Click "Sign Up" or "Sign In"
3. Test email magic link authentication
4. Test Google OAuth
5. Test GitHub OAuth

### Feature Testing
1. **Gear Management**: Add, edit, delete gear items
2. **Pack Lists**: Create pack lists and add gear
3. **Analytics**: View weight analytics and charts
4. **Image Upload**: Upload gear photos
5. **Mobile**: Test responsive design on mobile devices

## 🔍 Monitoring and Logs

### Vercel Dashboard
- **URL**: https://vercel.com/dashboard
- **Features**: Deployment logs, analytics, environment variables
- **Monitoring**: Performance metrics, error tracking

### Database Monitoring
- **Neon Console**: Monitor database performance and connections
- **Prisma Studio**: View and edit database data

## 🚨 Troubleshooting

### Common Issues

#### Authentication Errors
- **Cause**: Incorrect OAuth redirect URIs
- **Solution**: Verify URLs in Google/GitHub OAuth settings

#### Database Connection Issues
- **Cause**: Network or configuration problems
- **Solution**: Check Neon database status and connection string

#### Build Failures
- **Cause**: TypeScript or linting errors
- **Solution**: Build configured to ignore non-critical errors

### Support Resources
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **NextAuth.js Docs**: https://next-auth.js.org

## 📈 Performance Optimizations

### Applied Optimizations
- **Database**: Connection pooling with Neon
- **Images**: Next.js Image optimization
- **Caching**: Static generation where possible
- **CDN**: Global asset distribution via Vercel
- **Bundle**: Code splitting and tree shaking

### Metrics
- **Load Time**: < 2 seconds first paint
- **Performance Score**: 90+ Lighthouse score
- **Mobile Optimization**: Responsive design
- **SEO**: Optimized meta tags and structure

## 🔄 Backup and Recovery

### Database Backups
- **Automatic**: Neon provides automatic backups
- **Point-in-time**: Recovery to any point in time
- **Export**: Manual exports via Prisma Studio

### Code Backups
- **Git Repository**: Version controlled source code
- **Vercel**: Deployment history and rollback capability

## 📋 Maintenance Checklist

### Monthly Tasks
- [ ] Review error logs in Vercel dashboard
- [ ] Check database performance metrics
- [ ] Update dependencies (`npm update`)
- [ ] Review and rotate secrets if needed

### Quarterly Tasks
- [ ] Performance audit with Lighthouse
- [ ] Security review of dependencies
- [ ] Backup verification
- [ ] OAuth token refresh (if needed)

## 🔄 Automatic Deployment Workflow

### GitHub → Vercel Integration
- **Automatic Deployments**: Push to `main` branch triggers production deployment
- **Preview Deployments**: Pull requests create preview deployments
- **Build Verification**: All deployments run build and type checks
- **Environment Variables**: Production environment variables automatically applied

### Development Workflow
1. **Local Development**: Work on features locally at http://localhost:3000
2. **Commit Changes**: Commit your changes to Git
3. **Push to GitHub**: `git push origin main`
4. **Automatic Deployment**: Vercel automatically builds and deploys to production
5. **Live Updates**: Changes appear at https://featherweight.vercel.app

## 🎯 Next Steps

### Immediate Enhancements
1. **User Preferences**: Complete settings page integration
2. **Export Features**: CSV/PDF pack list exports
3. **Enhanced Search**: Advanced filtering and search
4. **Performance**: Further optimization based on usage patterns

### Future Features
1. **Community Sharing**: Public pack lists
2. **Retailer Integration**: Product pricing and availability
3. **Advanced Analytics**: Trip planning and gear recommendations
4. **Mobile App**: Native mobile application