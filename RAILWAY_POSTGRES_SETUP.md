# Railway PostgreSQL Setup Instructions

## Step 1: Add PostgreSQL to Railway Project

1. Go to your Railway project dashboard
2. Click "New Service" or the "+" button
3. Select "Database" → "PostgreSQL"
4. Railway will provision a PostgreSQL database

## Step 2: Get Database Connection String

1. Click on the PostgreSQL service in your Railway dashboard
2. Go to the "Variables" tab
3. Copy the `DATABASE_URL` value (starts with `postgresql://`)

## Step 3: Update Environment Variables

In your Railway API service, update the environment variable:

```
DATABASE_URL=postgresql://postgres:password@host:port/dbname
```

Replace with the actual PostgreSQL URL from step 2.

## Step 4: The schema is already updated for PostgreSQL

The Prisma schema has been converted from SQLite to PostgreSQL with proper JSON fields.

## Expected DATABASE_URL format:
```
postgresql://username:password@hostname:port/database
```

Once you update the DATABASE_URL in Railway, the database will work properly with user registration and authentication.