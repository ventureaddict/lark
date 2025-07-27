# 🚀 Deploy Lark to Railway

## Quick Deploy (Recommended)

### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/lark.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway
1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "Deploy from GitHub"**
4. **Select your Lark repository**
5. **Choose "Deploy Now"**

### Step 3: Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
DATABASE_URL=file:./prod.db
JWT_SECRET=lark-production-secret-key-change-this
ANTHROPIC_API_KEY=your-anthropic-api-key-here
NODE_ENV=production
PORT=3001
```

### Step 4: Set Root Directory
In Railway dashboard:
1. **Go to Settings**
2. **Set Root Directory to**: `apps/api`
3. **Set Build Command to**: `npm run build`
4. **Set Start Command to**: `npm run start:prod`

### Step 5: Deploy
Railway will automatically build and deploy!

Your API will be available at: `https://your-app-name.up.railway.app`

## Alternative: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from API directory
cd apps/api
railway deploy
```

## Testing Your Deployed API

Once deployed, test with:

```bash
# Replace with your Railway URL
export API_URL="https://your-app.up.railway.app"

# Test health check
curl $API_URL

# Test user registration
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Test venue search (replace TOKEN with the one from registration)
curl -X GET "$API_URL/venues/search?query=restaurant" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected Result

✅ **Your Lark API will be live and accessible worldwide!**

- **Health Check**: `GET /` returns `{"status": "ok"}`
- **API Docs**: `GET /api` shows Swagger documentation
- **Authentication**: `POST /auth/register` and `POST /auth/login`
- **Venues**: `GET /venues/search?query=restaurant` 
- **AI Chat**: `POST /chat/conversations` (after fixing conversation bug)

## Troubleshooting

**Build Fails**: Check Railway logs in dashboard
**Database Issues**: Ensure `DATABASE_URL=file:./prod.db` is set
**CORS Errors**: Domain will be added to CORS whitelist automatically
**API Key**: Make sure `ANTHROPIC_API_KEY` is set correctly

Once deployed, you'll have a production-ready Lark API running in the cloud! 🎉