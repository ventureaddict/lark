# Lark Development Guide for Claude

## Project Overview

Lark is a production-ready AI-powered date night itinerary app that serves as an expert concierge for couples. The app combines sophisticated AI agents with comprehensive venue data to create personalized dating experiences.

## Development Context

**Technology Stack:**
- Frontend: React Native (mobile) + Next.js (web) with Vercel AI SDK
- Backend: NestJS with TypeScript + PostgreSQL + Redis
- AI: Claude Sonnet 4 (primary), GPT-4o mini (cost optimization)
- AI Framework: Vercel AI SDK for streaming and multi-provider management
- APIs: Foursquare Places, OpenTable, Eventbrite, Uber, OpenWeatherMap
- Cloud: AWS with Kubernetes (EKS) + Vercel for frontend/AI workloads
- Payments: Stripe

## Key Commands

**Development:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build
```

**Database:**
```bash
# Run migrations
npm run migrate

# Seed development data
npm run seed

# Reset database
npm run db:reset
```

## Project Structure

```
/src
  /mobile              # React Native app
    /components        # Reusable UI components
    /screens          # App screens/pages
    /navigation       # Navigation configuration
    /services         # API clients and business logic
    /hooks            # Custom React hooks
  /web                # Next.js web app
    /pages            # Next.js pages
    /components       # Web components
  /backend            # NestJS API
    /modules          # Feature modules
    /common           # Shared utilities
    /config           # Configuration
  /shared             # Shared types and utilities
  /tests              # Test files
```

## Development Priorities

1. **AI Integration Quality**: Focus on sophisticated conversation flows and accurate venue recommendations
2. **Performance**: Optimize for mobile performance and API response times
3. **User Experience**: Premium polish comparable to AllTrails/Airbnb quality
4. **Data Privacy**: Implement strong privacy protections for relationship data
5. **Testing**: Comprehensive testing for AI integrations and booking flows

## AI Integration Guidelines

**Vercel AI SDK + Claude Architecture:**
- Use Vercel AI SDK's `useChat` for streaming conversation interface
- Claude Sonnet 4 as primary model with 200K context window
- Implement prompt caching for user profiles (90% cost savings)
- Use function calling for real-time venue data integration
- Stream responses with `createStreamableValue` for dynamic venue suggestions

**Model Selection:**
- **Claude Sonnet 4**: Primary conversation, planning logic, relationship reasoning
- **GPT-4o mini**: Simple queries, basic venue lookups (cost optimization)

**Performance Features:**
- Streaming responses for real-time conversation feel
- Progressive venue suggestions as they're generated
- Multi-step tool calling for complex planning workflows
- Context preservation across planning sessions

**Cost Optimization:**
- Prompt caching for user profiles and preferences
- Route simple queries to GPT-4o mini
- Cache venue data for 24 hours
- Vercel AI SDK's efficient token usage patterns

## API Integration Notes

**Foursquare Places API:**
- Primary venue data source
- 120M+ places, good coverage
- Use premium attributes for detailed venue info

**OpenTable API:**
- Requires partnership approval (3-4 weeks)
- Real-time restaurant availability
- Essential for restaurant booking flow

**Uber API:**
- Free transportation integration
- Use for seamless date logistics

## Security & Privacy

**Data Protection:**
- Encrypt all relationship and preference data
- Implement data retention policies
- GDPR/CCPA compliance from day one
- User consent for location tracking

**API Security:**
- Secure all API keys in environment variables
- Implement rate limiting and abuse protection
- Use HTTPS for all communications

## Development Workflow

1. **Feature Development:**
   - Create feature branch from main
   - Implement with comprehensive tests
   - Run full test suite and linting
   - Create pull request with detailed description

2. **AI Testing:**
   - Test conversation flows with various user inputs
   - Validate venue recommendations for accuracy
   - Test error handling and fallback scenarios
   - Monitor token usage and costs

3. **Quality Assurance:**
   - Test on both iOS and Android devices
   - Validate booking integrations in sandbox mode
   - Performance testing with large venue datasets
   - Accessibility testing for inclusive design

## Monitoring & Analytics

**Application Monitoring:**
- Datadog for performance monitoring
- Error tracking with stack traces
- API response time monitoring
- Database performance metrics

**User Analytics:**
- PostHog for product analytics
- User journey and conversion tracking
- A/B testing for feature optimization
- Privacy-compliant user behavior analysis

## Deployment

**Staging Environment:**
- Automatic deployment on PR merge to develop
- Full API sandbox integrations
- Performance testing environment

**Production Deployment:**
- Manual approval gate for production releases
- Blue-green deployment via Kubernetes
- Automated rollback on health check failures
- Real-time monitoring during deployments

## Common Issues & Solutions

**AI Response Quality:**
- Use detailed prompts with context about venue types and user preferences
- Implement feedback loops to improve recommendations
- Cache successful query patterns for reuse

**API Rate Limits:**
- Implement exponential backoff for API failures
- Use multiple API keys for load distribution
- Cache venue data aggressively to reduce API calls

**Performance Optimization:**
- Use React Native's FlatList for large venue lists
- Implement image lazy loading and compression
- Optimize database queries with proper indexing

## Testing Strategy

**Unit Tests:**
- All utility functions and business logic
- AI integration functions with mocked responses
- Database operations and migrations

**Integration Tests:**
- API endpoint testing with real integrations
- AI conversation flow testing
- Booking workflow end-to-end testing

**UI Tests:**
- Critical user journeys (onboarding, planning, booking)
- Cross-platform compatibility testing
- Accessibility compliance testing

## Code Quality Standards

**TypeScript:**
- Strict type checking enabled
- No `any` types in production code
- Comprehensive interface definitions for API responses

**Code Style:**
- ESLint configuration for consistent formatting
- Prettier for automatic code formatting
- Conventional commit messages

**Performance:**
- Bundle size monitoring and optimization
- Database query optimization
- API response caching strategies

## Documentation Requirements

**Code Documentation:**
- JSDoc comments for all public functions
- README files for each major module
- API documentation with examples

**User Documentation:**
- Feature documentation for complex AI interactions
- Privacy policy and data handling explanations
- Support documentation for booking issues

Remember: Lark's success depends on delivering a premium user experience that feels magical and effortless. Every feature should be implemented with the quality and polish of best-in-class consumer applications.