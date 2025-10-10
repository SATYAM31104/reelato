#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Reelato development servers...\n');

// Start backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});