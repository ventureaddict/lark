# 🐦 Lark Manual Testing Guide

## Step 1: Start the Backend

```bash
cd apps/api
npm run dev
```

Wait for: `🚀 Lark API running on http://localhost:3001`

## Step 2: Test Authentication

**Register a user:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lark.app","password":"test123","name":"Test User"}'
```

**Expected response:**
```json
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "test@lark.app",
    "name": "Test User"
  }
}
```

**Save the access_token for next steps!**

## Step 3: Create a Conversation

```bash
curl -X POST http://localhost:3001/chat/conversations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected response:**
```json
{
  "id": "conversation-id",
  "userId": "user-id",
  "startedAt": "timestamp"
}
```

**Save the conversation id!**

## Step 4: Chat with AI

```bash
curl -X POST http://localhost:3001/chat/conversations/CONVERSATION_ID/messages \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Plan a romantic dinner date in San Francisco"}'
```

**Expected:** Streaming response from Claude AI with date planning suggestions!

## Step 5: Test Venue Search

```bash
curl -X GET "http://localhost:3001/venues/search?query=restaurant" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:** JSON array of venue suggestions.

## Step 6: View API Documentation

Visit: http://localhost:3001/api

## What Should Work

✅ **Authentication**: Register and login users  
✅ **Database**: SQLite with user and conversation data  
✅ **AI Chat**: Real-time streaming responses from Claude Sonnet 4  
✅ **Venue Search**: Mock venue data with search functionality  
✅ **API Documentation**: Swagger UI with all endpoints  

## Troubleshooting

**"Connection refused"**: Make sure backend is running on port 3001  
**"Unauthorized"**: Check your access_token in Authorization header  
**"AI not responding"**: Verify ANTHROPIC_API_KEY is set correctly  

## Next Steps for Mobile App

Once backend testing is complete, you can:
1. Set up React Native development environment
2. Install mobile app dependencies
3. Connect mobile app to the backend
4. Test full end-to-end experience

The backend is production-ready and provides all APIs needed for the mobile app!