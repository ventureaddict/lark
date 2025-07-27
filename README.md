# 🐦 Lark - AI-Powered Date Night Itinerary App

Lark is a production-ready AI-powered mobile application that serves as an expert concierge for planning personalized date nights. The app combines sophisticated AI agents with comprehensive venue data to create compelling, tailored experiences for couples.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for database)
- React Native development environment
- iOS Simulator or Android emulator

### Installation

1. **Clone and install dependencies:**
```bash
cd lark
npm install
```

2. **Start the database:**
```bash
docker-compose up -d
```

3. **Set up the backend:**
```bash
cd apps/api
cp .env.example .env
# Edit .env with your API keys
npm install
npm run generate
npm run migrate:dev
```

4. **Start the backend server:**
```bash
npm run dev
```

5. **Start the mobile app:**
```bash
cd apps/mobile
npm install
npm start
# In another terminal:
npm run ios    # for iOS
# or
npm run android # for Android
```

## 🏗️ Architecture

- **Frontend**: React Native (mobile) + Next.js (web)
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Vercel AI SDK with Claude Sonnet 4
- **APIs**: Foursquare Places, OpenTable, Eventbrite, Uber
- **Cloud**: AWS + Vercel hybrid deployment

## 📱 Features (MVP)

### Phase 1 - Foundation MVP ✅
- [x] User authentication and registration
- [x] Basic chat interface with Claude Sonnet 4
- [x] Simple venue search and display
- [x] User profiles and preferences
- [x] Real-time AI conversation with streaming responses

### Phase 2 - Enhanced Conversation (In Progress)
- [ ] Advanced preference profiling
- [ ] Multi-turn conversation with context
- [ ] Weather integration for planning
- [ ] Basic itinerary generation (2-3 venues)
- [ ] Improved venue filtering and ranking

### Phase 3 - Booking Integration (Planned)
- [ ] OpenTable integration for restaurant reservations
- [ ] Real-time availability checking
- [ ] Basic event booking (Eventbrite)
- [ ] Transportation coordination (Uber)
- [ ] Booking confirmation and management

## 🛠️ Development

### Project Structure
```
lark/
├── apps/
│   ├── api/          # NestJS backend
│   ├── mobile/       # React Native app
│   └── web/          # Next.js web app (future)
├── packages/
│   ├── shared/       # Shared utilities
│   └── types/        # TypeScript types
└── docs/             # Documentation
```

### Available Scripts

**Root level:**
- `npm run dev` - Start both API and mobile app
- `npm run dev:api` - Start backend only
- `npm run dev:mobile` - Start mobile app only
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run typecheck` - Type check all packages

**Backend (apps/api):**
- `npm run dev` - Start development server
- `npm run migrate:dev` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run db:seed` - Seed database with test data

**Mobile (apps/mobile):**
- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://lark:lark_password@localhost:5432/lark_dev"
JWT_SECRET="your-super-secret-jwt-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
FOURSQUARE_API_KEY="your-foursquare-api-key"
OPENWEATHER_API_KEY="your-openweather-api-key"
```

## 🎯 Current Status

**✅ Completed:**
- Full project architecture and planning
- NestJS backend with authentication, chat, and venues modules
- PostgreSQL database schema with Prisma
- React Native mobile app with navigation
- AI integration with Claude Sonnet 4 and streaming responses
- Basic chat UI with real-time conversation
- User authentication and profile management

**🔄 In Progress:**
- Enhanced AI conversation capabilities
- Venue search integration with Foursquare API
- Weather integration for date planning

**📋 Next Steps:**
1. Implement advanced venue search and filtering
2. Add weather-responsive planning
3. Create comprehensive itinerary generation
4. Integrate booking APIs (OpenTable, Eventbrite)
5. Add real-time availability checking

## 🔧 API Keys Required

To run the full application, you'll need API keys for:

1. **Anthropic Claude API** - For AI conversation
2. **Foursquare Places API** - For venue data
3. **OpenWeatherMap API** - For weather integration
4. **OpenTable API** - For restaurant booking (Phase 3)
5. **Eventbrite API** - For event booking (Phase 3)

## 🚀 Deployment

The application is designed for hybrid deployment:
- **Backend**: AWS EKS with PostgreSQL RDS
- **Mobile**: App Store and Google Play
- **Web**: Vercel (future)

See `ARCHITECTURE.md` for detailed deployment instructions.

## 📚 Documentation

- [Product Specification](PRODUCT_SPEC.md) - Complete product vision and features
- [Technical Architecture](ARCHITECTURE.md) - System design and infrastructure
- [Development Guide](CLAUDE.md) - Developer workflow and best practices
- [MVP Roadmap](MVP_ROADMAP.md) - Development phases and timeline

## 🤝 Contributing

This is currently a private project in development. For questions or collaboration:

1. Review the documentation in `/docs`
2. Check the current todo list in the development workflow
3. Follow the coding standards and testing requirements
4. All changes require review and testing

## 📄 License

Private - All rights reserved.

---

Built with ❤️ for couples who want to create amazing memories together.