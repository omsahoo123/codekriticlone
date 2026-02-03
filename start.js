#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkMongoDB() {
  return new Promise((resolve) => {
    const testScript = path.join(__dirname, 'backend', 'test_mongo.py');
    const python = spawn('python', [testScript], {
      stdio: 'pipe',
      shell: true,
    });

    python.on('close', (code) => {
      resolve(code === 0);
    });

    python.on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  console.log('\n');
  log(colors.blue, '🚀 Starting HackathonHub Platform...');
  log(colors.blue, '==================================\n');

  // Check MongoDB
  log(colors.blue, 'Checking MongoDB connection...');
  const mongoRunning = await checkMongoDB();

  if (!mongoRunning) {
    log(colors.red, '⚠️  MongoDB is not running. Please start MongoDB first.');
    log(colors.yellow, '   Command: mongod');
    process.exit(1);
  }
  log(colors.green, '✓ MongoDB is running\n');

  // Start Backend
  log(colors.blue, 'Starting Backend Server...');
  const backendDir = path.join(__dirname, 'backend');
  const backend = spawn('python', ['-m', 'uvicorn', 'server:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true,
  });

  log(colors.green, `✓ Backend started (PID: ${backend.pid})\n`);

  // Wait a moment for backend to start
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Start Frontend
  log(colors.blue, 'Starting Frontend Server...');
  const frontendDir = path.join(__dirname, 'frontend');
  const frontend = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true,
  });

  log(colors.green, `✓ Frontend started (PID: ${frontend.pid})\n`);

  log(colors.green, '==================================');
  log(colors.green, '✓ Both servers are running!');
  log(colors.green, '==================================\n');
  log(colors.blue, 'Backend:  http://localhost:8000');
  log(colors.blue, 'Frontend: http://localhost:3000\n');
  log(colors.yellow, 'Default Credentials:');
  log(colors.yellow, '  Admin: admin / admin123\n');
  log(colors.blue, 'Press Ctrl+C to stop both servers\n');

  // Handle cleanup
  const cleanup = () => {
    log(colors.blue, '\nStopping servers...');
    backend.kill();
    frontend.kill();
    log(colors.green, '✓ Servers stopped');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main().catch((error) => {
  log(colors.red, `Error: ${error.message}`);
  process.exit(1);
});
