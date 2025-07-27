#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🐦 Testing Lark backend...');

// Start the backend server
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'apps/api'),
  stdio: ['pipe', 'pipe', 'pipe']
});

let startupComplete = false;

backendProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Backend:', output.trim());
  
  if (output.includes('Nest application successfully started') || output.includes('running on')) {
    startupComplete = true;
    console.log('✅ Backend started successfully!');
    console.log('');
    console.log('🎯 Backend is running at: http://localhost:3001');
    console.log('📖 API Documentation: http://localhost:3001/api');
    console.log('');
    console.log('To test the API:');
    console.log('1. Register a new user: POST http://localhost:3001/auth/register');
    console.log('2. Login: POST http://localhost:3001/auth/login');
    console.log('3. Create a conversation and start chatting!');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
  }
});

backendProcess.stderr.on('data', (data) => {
  const output = data.toString();
  if (!output.includes('Found 0 errors') && !output.includes('webpack-hmr')) {
    console.error('Backend Error:', output.trim());
  }
});

backendProcess.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping backend...');
  backendProcess.kill('SIGINT');
  process.exit(0);
});

// Timeout check
setTimeout(() => {
  if (!startupComplete) {
    console.log('⚠️  Backend is taking longer than expected to start...');
    console.log('Check the logs above for any errors.');
  }
}, 10000);