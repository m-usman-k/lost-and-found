/**
 * Seed the database and start the API for UI screenshots.
 * Uses MONGODB_URI from .env, or mongodb://127.0.0.1:27017/lost-and-found by default.
 *
 * Usage: node docs/demo_server.js
 */
if (typeof crypto === 'undefined') global.crypto = require('crypto').webcrypto;

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

async function main() {
  const env = {
    ...process.env,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lost-and-found',
    JWT_SECRET: process.env.JWT_SECRET || 'demo-secret-for-screenshots',
    PORT: process.env.PORT || '5000',
  };

  console.log('Seeding database...');
  execSync('node src/seeder.js', { stdio: 'inherit', env, cwd: ROOT });

  process.env.MONGODB_URI = env.MONGODB_URI;
  process.env.JWT_SECRET = env.JWT_SECRET;
  process.env.PORT = env.PORT;

  const app = require('../src/app');
  app.listen(env.PORT, () => {
    console.log(`API ready at http://127.0.0.1:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
