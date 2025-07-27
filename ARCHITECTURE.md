# Lark Technical Architecture

## Overview

Lark's architecture is designed for production-ready scalability while maintaining development simplicity. The system uses modern technologies with proven track records in consumer applications.

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │    │     Next.js      │    │   NestJS API    │
│   Mobile App    │────│    Web App       │────│   Backend       │
│                 │    │                  │    │                 │
│ - Chat UI       │    │ - Planning UI    │    │ - AI Integration│
│ - Navigation    │    │ - Admin Panel    │    │ - Venue APIs    │
│ - Booking       │    │ - Analytics      │    │ - Booking Logic │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    Vercel AI SDK        │
                    │                         │
                    │ - Streaming Responses   │
                    │ - Multi-Provider Mgmt   │
                    │ - Tool Calling          │
                    │ - Cost Optimization     │
                    └─────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                       │                        │
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Claude Sonnet │    │   GPT-4o mini   │    │  External APIs  │
│      4        │    │                 │    │                 │
│ - Main Logic  │    │ - Simple Queries│    │ - Foursquare    │
│ - Reasoning   │    │ - Cost Savings  │    │ - OpenTable     │
│ - Context     │    │                 │    │ - Uber          │
└───────────────┘    └─────────────────┘    │ - Weather       │
                                            └─────────────────┘
```

## Core Components

### Frontend Layer

#### React Native Mobile App
- **Framework**: React Native with TypeScript
- **State Management**: Zustand for simplicity and performance
- **Navigation**: React Navigation v6
- **Maps**: React Native Maps with custom styling
- **Real-time**: Socket.io client for live updates

**Key Features**:
- Conversational chat interface with streaming responses
- Real-time venue suggestions and booking
- GPS integration for location-based planning
- Camera integration for venue photos and memories
- Push notifications for date reminders

#### Next.js Web App
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for rapid development
- **Components**: Radix UI for accessible primitives
- **Real-time**: Server-Sent Events for streaming

**Key Features**:
- Comprehensive planning interface for desktop users
- Admin dashboard for venue management
- Analytics and user insights
- Marketing and content pages

### AI & Conversation Layer

#### Vercel AI SDK Integration
```typescript
// Core conversation hook
const { messages, append, isLoading } = useChat({
  api: '/api/chat',
  onToolCall: async ({ toolCall }) => {
    switch (toolCall.toolName) {
      case 'searchVenues':
        return await searchVenues(toolCall.args);
      case 'checkAvailability':
        return await checkRestaurantAvailability(toolCall.args);
      case 'getWeather':
        return await getWeatherForecast(toolCall.args);
    }
  }
});

// Streaming venue suggestions
const streamVenues = createStreamableValue();
const venues = await searchNearbyVenues(preferences);
streamVenues.update(venues);
return streamVenues.value;
```

#### AI Model Strategy
- **Claude Sonnet 4**: Primary conversation, relationship reasoning, complex planning
- **GPT-4o mini**: Simple queries, basic venue information, cost optimization
- **Provider Flexibility**: Easy switching between models based on requirements

### Backend Layer

#### NestJS API Architecture
```
/src
  /modules
    /auth          # User authentication and authorization
    /users         # User profile and preference management
    /chat          # AI conversation handling
    /venues        # Venue search and management
    /bookings      # Booking coordination and tracking
    /notifications # Push notification service
  /common
    /guards        # Authentication and rate limiting
    /interceptors  # Logging and response transformation
    /pipes         # Validation and data transformation
  /integrations
    /ai            # AI provider integrations
    /venues        # Venue API integrations
    /booking       # Booking platform integrations
```

#### Database Design (PostgreSQL)

**Core Tables**:
```sql
-- Users and relationships
users (id, email, name, created_at, preferences)
couples (id, user1_id, user2_id, relationship_start, preferences)

-- Conversations and planning
conversations (id, couple_id, started_at, context)
messages (id, conversation_id, role, content, tokens_used)
plans (id, conversation_id, venues, timeline, budget, status)

-- Venues and bookings
venues (id, foursquare_id, name, location, category, metadata)
bookings (id, plan_id, venue_id, booking_type, external_id, status)

-- Analytics and learning
user_interactions (id, user_id, action, metadata, timestamp)
venue_ratings (id, user_id, venue_id, rating, review, date_experienced)
```

**Indexes**:
- Geospatial indexes on venue locations (PostGIS)
- Full-text search on venue names and descriptions
- Composite indexes on user preferences and venue categories

#### Caching Strategy (Redis)
- **User Sessions**: 30-day expiration
- **Venue Data**: 24-hour cache for Foursquare responses
- **AI Responses**: Cache common planning patterns
- **Real-time Data**: 5-minute cache for availability and weather

### Integration Layer

#### AI Provider Management
```typescript
// Unified AI client with provider switching
class AIService {
  async generateResponse(conversation: Conversation): Promise<StreamableValue> {
    const complexity = this.analyzeComplexity(conversation);
    
    if (complexity === 'simple') {
      return this.openai.chat(conversation); // GPT-4o mini
    } else {
      return this.anthropic.chat(conversation); // Claude Sonnet 4
    }
  }
  
  async toolCall(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'searchVenues':
        return this.venueService.search(args);
      case 'bookRestaurant':
        return this.bookingService.reserveTable(args);
    }
  }
}
```

#### Venue API Integration
```typescript
// Unified venue search across multiple providers
class VenueService {
  async search(criteria: SearchCriteria): Promise<Venue[]> {
    const [foursquareResults, yelpResults] = await Promise.all([
      this.foursquare.search(criteria),
      this.yelp.search(criteria)
    ]);
    
    return this.mergeAndRankResults(foursquareResults, yelpResults);
  }
}
```

#### Booking Coordination
```typescript
// Multi-platform booking management
class BookingService {
  async reserveTable(venueId: string, details: BookingDetails): Promise<Booking> {
    const venue = await this.venueService.getById(venueId);
    
    switch (venue.bookingProvider) {
      case 'opentable':
        return this.opentable.reserve(venue, details);
      case 'resy':
        return this.resy.reserve(venue, details);
      default:
        return this.createPendingBooking(venue, details);
    }
  }
}
```

## Deployment Architecture

### Development Environment
```yaml
# docker-compose.yml
services:
  api:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/lark_dev
      - REDIS_URL=redis://redis:6379
  
  db:
    image: postgis/postgis:15-3.3
    
  redis:
    image: redis:7-alpine
    
  web:
    build: ./web
    ports:
      - "3000:3000"
```

### Production Environment (AWS + Vercel)

#### AWS Infrastructure
- **EKS Cluster**: Container orchestration for backend services
- **RDS PostgreSQL**: Multi-AZ deployment with read replicas
- **ElastiCache**: Redis cluster for caching and sessions
- **S3 + CloudFront**: Media storage and global CDN
- **Application Load Balancer**: SSL termination and traffic distribution

#### Vercel Deployment
- **Next.js Web App**: Automatic deployment with edge functions
- **AI SDK Integration**: Optimized AI model routing and caching
- **Edge Functions**: Real-time conversation handling

#### Monitoring & Observability
- **Datadog**: Application performance monitoring
- **PostHog**: Product analytics and feature flags
- **Sentry**: Error tracking and performance monitoring

## Security Architecture

### Authentication & Authorization
- **Auth Strategy**: JWT tokens with refresh token rotation
- **Session Management**: Redis-backed sessions with 30-day expiration
- **Role-Based Access**: User, Premium, Admin roles
- **API Rate Limiting**: Per-user and per-endpoint limits

### Data Protection
- **Encryption**: AES-256 for PII, bcrypt for passwords
- **Data Minimization**: Only collect necessary relationship data
- **Retention Policies**: Automatic deletion of inactive accounts
- **Privacy Controls**: User data export and deletion tools

### API Security
- **Input Validation**: Strict schema validation on all endpoints
- **CORS Configuration**: Restricted origins for API access
- **API Key Management**: Secure storage and rotation
- **Request Logging**: Comprehensive audit trails

## Performance Considerations

### Optimization Strategies
- **AI Response Caching**: Cache common planning patterns
- **Venue Data Prefetching**: Predictive venue loading based on user location
- **Image Optimization**: WebP conversion and CDN delivery
- **Database Query Optimization**: Connection pooling and query analysis

### Scalability Patterns
- **Horizontal Scaling**: Stateless API design for easy horizontal scaling
- **Database Sharding**: Geographic sharding for venue data
- **CDN Strategy**: Global content delivery for media assets
- **Microservices**: Independent scaling of venue search, booking, and chat services

### Mobile Performance
- **Bundle Optimization**: Code splitting and lazy loading
- **Image Loading**: Progressive loading with blur placeholders
- **Offline Capability**: Cached venue data for offline viewing
- **Battery Optimization**: Efficient GPS usage and background processing

## Development Workflow

### Local Development
1. Clone repository and install dependencies
2. Start PostgreSQL and Redis with Docker Compose
3. Run database migrations and seed data
4. Start backend API server
5. Start React Native metro bundler
6. Start Next.js development server

### Testing Strategy
- **Unit Tests**: Jest for business logic and utilities
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for critical user journeys
- **AI Testing**: Regression tests for conversation quality

### Deployment Pipeline
1. **Feature Branch**: Development with local testing
2. **Pull Request**: Automated testing and code review
3. **Staging**: Full integration testing with sandbox APIs
4. **Production**: Blue-green deployment with health checks

This architecture provides a solid foundation for building Lark as a production-ready application while maintaining development velocity and code quality.