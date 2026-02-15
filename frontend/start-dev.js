#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const http = require('http');

const isWindows = os.platform() === 'win32';

console.log('\n');
console.log('🚀 Starting CODEKRITI4.O Application...');
console.log('');
console.log('📦 Backend: http://localhost:8000');
console.log('🎨 Frontend: http://localhost:3000');
console.log('');

let backendProcess;
let frontendProcess;

// Function to check if backend is ready
function checkBackendReady() {
  return new Promise((resolve) => {
    const check = () => {
      http.get('http://localhost:8000/docs', (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          setTimeout(check, 500);
        }
      }).on('error', () => {
        setTimeout(check, 500);
      });
    };
    check();
  });
}

// Start backend
console.log('Starting Backend...');
const backendCmd = isWindows ? 'python' : 'python3';
backendProcess = spawn(backendCmd, ['-m', 'uvicorn', 'server:app', '--host', '0.0.0.0', '--port', '8000', '--reload'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: isWindows
});

backendProcess.on('error', (err) => {
  console.error('❌ Backend error:', err.message);
  if (err.message.includes('ENOENT')) {
    console.error('Make sure Python is installed and in PATH');
  }
  process.exit(1);
});

// Wait for backend to be ready, then start frontend
console.log('Waiting for backend to start...');
setTimeout(async () => {
  try {
    await checkBackendReady();
    console.log('✅ Backend is ready!');
    console.log('Starting Frontend...');
    
    frontendProcess = spawn('npm', ['start'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    });

    frontendProcess.on('error', (err) => {
      console.error('❌ Frontend error:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start frontend:', err.message);
    process.exit(1);
  }
}, 2000);

process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...\n');
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});
