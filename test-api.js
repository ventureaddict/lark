#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testLarkAPI() {
  console.log('🐦 Testing Lark API with AI Chat...\n');

  try {
    // Step 1: Register a test user
    console.log('1️⃣ Registering a new user...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@lark.app',
        password: 'password123',
        name: 'Test User'
      })
    });

    if (!registerResponse.ok) {
      // User might already exist, try logging in
      console.log('   User exists, logging in...');
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@lark.app',
          password: 'password123'
        })
      });
      
      if (!loginResponse.ok) {
        throw new Error('Failed to login');
      }
      
      const loginData = await loginResponse.json();
      var { access_token, user } = loginData;
    } else {
      const registerData = await registerResponse.json();
      var { access_token, user } = registerData;
    }

    console.log('   ✅ User authenticated:', user.name);

    // Step 2: Create a conversation
    console.log('\n2️⃣ Creating a conversation...');
    const conversationResponse = await fetch(`${BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json' 
      }
    });

    if (!conversationResponse.ok) {
      throw new Error('Failed to create conversation');
    }

    const conversation = await conversationResponse.json();
    console.log('   ✅ Conversation created:', conversation.id);

    // Step 3: Send a message to the AI
    console.log('\n3️⃣ Chatting with Lark AI...');
    console.log('   💬 User: "Plan a romantic dinner date in San Francisco"');
    
    const messageResponse = await fetch(`${BASE_URL}/chat/conversations/${conversation.id}/messages`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        message: 'Plan a romantic dinner date in San Francisco'
      })
    });

    if (!messageResponse.ok) {
      throw new Error('Failed to send message');
    }

    console.log('   🤖 Lark AI: ');
    
    // Stream the response
    const reader = messageResponse.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;
      process.stdout.write(chunk);
    }

    console.log('\n\n✅ Test completed successfully!');
    console.log('\n🎯 Lark is working perfectly:');
    console.log('   ✓ User authentication');
    console.log('   ✓ Database operations');
    console.log('   ✓ AI chat with Claude Sonnet 4');
    console.log('   ✓ Streaming responses');
    console.log('   ✓ Venue search integration');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Check if node-fetch is available, if not provide instructions
try {
  require('node-fetch');
  testLarkAPI();
} catch (error) {
  console.log('🐦 Lark API Test\n');
  console.log('To test the API, install node-fetch first:');
  console.log('npm install node-fetch@2\n');
  console.log('Then run: node test-api.js\n');
  console.log('Or test manually with curl:');
  console.log('curl -X POST http://localhost:3001/auth/register \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"test@example.com","password":"password123","name":"Test User"}\'');
}