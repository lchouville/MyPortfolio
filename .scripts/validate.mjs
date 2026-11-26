import { execSync } from 'child_process';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

const errors = [];

// Find all .js files and validate syntax
function findAndCheckJs(dir) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry === 'node_modules' || entry === '.git' || entry === '.github' || entry === '.claude') {
        continue;
      }
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findAndCheckJs(fullPath);
      } else if (entry.endsWith('.js') || entry.endsWith('.mjs')) {
        try {
          execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
        } catch (err) {
          errors.push(`JS syntax error in ${fullPath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    errors.push(`Error scanning directory ${dir}: ${err.message}`);
  }
}

// Find all .json files and validate
function findAndCheckJson(dir) {
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry === 'node_modules' || entry === '.git' || entry === '.github' || entry === '.claude') {
        continue;
      }
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findAndCheckJson(fullPath);
      } else if (entry.endsWith('.json')) {
        try {
          const content = readFileSync(fullPath, 'utf8');
          JSON.parse(content);
        } catch (err) {
          errors.push(`JSON parsing error in ${fullPath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    errors.push(`Error scanning directory ${dir}: ${err.message}`);
  }
}

console.log('Validating JS syntax...');
findAndCheckJs('.');

console.log('Validating JSON files...');
findAndCheckJson('.');

// Check aggregate-projects.mjs if it exists (from PR #4)
const aggregateScript = '.github/scripts/aggregate-projects.mjs';
try {
  const stat = statSync(aggregateScript);
  if (stat.isFile()) {
    console.log('Validating aggregate-projects.mjs...');
    try {
      execSync(`node --check "${aggregateScript}"`, { stdio: 'pipe' });
    } catch (err) {
      errors.push(`JS syntax error in ${aggregateScript}: ${err.message}`);
    }
  }
} catch {
  // File doesn't exist yet, that's ok
}

if (errors.length > 0) {
  console.error('\n❌ Build validation failed:');
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}

console.log('✓ Build validation passed');
