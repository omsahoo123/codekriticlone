#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';

console.log('\n');
console.log('🚀 Starting CODEKRITI4.O Application...');
console.log('');
console.log('📦 Backend: http://localhost:8000');
console.log('🎨 Frontend: http://localhost:3000');
console.log('');

let backendProcess;
let frontendProcess;

// Start backend
console.log('Starting Backend...');
const backendCmd = isWindows ? 'python' : 'python3';
backendProcess = spawn(backendCmd, ['-m', 'uvicorn', 'server:app', '--host', '0.0.0.0', '--port', '8000', '--reload'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: isWindows
});

backendProcess.on('error', (err) => {
  console.error('\n❌ Backend failed to start:', err.message);
  if (err.code === 'ENOENT') {
    console.error('   Make sure Python is installed and in your PATH');
    console.error('   Run: python --version');
  }
  process.exit(1);
});

// Start frontend after a delay
setTimeout(() => {
  console.log('\nStarting Frontend...');
  frontendProcess = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWindows
  });

  frontendProcess.on('error', (err) => {
    console.error('\n❌ Frontend failed to start:', err.message);
    process.exit(1);
  });
}, 4000);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...\n');
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});
