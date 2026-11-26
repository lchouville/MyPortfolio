#!/usr/bin/env node

/**
 * Aggregate portfolio.json from all public repos of lchouville
 * into a single projects.json for MyPortfolio.
 *
 * Usage: node aggregate-projects.mjs <output-file>
 * Example: node aggregate-projects.mjs _site/data/projects.json
 *
 * Fetches repos from GitHub API (authenticated for higher rate limit),
 * then fetches each repo's portfolio.json from its gh-pages.
 * Transforms and flattens to the shape project.js expects.
 * Skips silently on 404, warns and skips on JSON parse error or hidden: true.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_FILE = process.argv[2];

if (!OUTPUT_FILE) {
  console.error('Usage: node aggregate-projects.mjs <output-file>');
  process.exit(1);
}

/**
 * Mapping function: transform upstream portfolio.json to project.js shape.
 * Pure function, testable without network.
 */
function transformProject(portfolioData, repoName) {
  const { name, description, stack, progress, softSkills, images, links } =
    portfolioData;

  // Helper: convert progress string to French status
  const progressToStatus = (p) => {
    const map = {
      completed: 'Terminé',
      'in-progress': 'En cours',
      paused: 'En pause',
      cancelled: 'Annulé',
    };
    return map[p] || 'En pause'; // default if absent/unknown
  };

  // Helper: convert image path to absolute hotlink URL
  const toHotlink = (imagePath) => {
    if (!imagePath) return null;
    // If already an absolute URL, keep it; otherwise build hotlink
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `https://lchouville.github.io/${repoName}/${imagePath}`;
  };

  // Extract first image, rewrite as hotlink
  const firstImage = images && images.length > 0 ? images[0] : null;
  const imageUrl = toHotlink(firstImage);

  return {
    name: name || 'Unknown',
    description: description?.fr || '',
    repository: links?.repo || null,
    access: links?.demo || null,
    image: imageUrl,
    techno: stack || [],
    status: progressToStatus(progress),
    competences: {
      hard_skills: stack || [],
      soft_skills: softSkills || [],
    },
  };
}

/**
 * Main aggregation logic.
 */
async function aggregateProjects() {
  const projects = [];
  const warnings = [];

  // Step 1: Fetch list of repos
  console.log('Fetching repository list...');
  let repos = [];
  try {
    const headers = GITHUB_TOKEN
      ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
      : {};
    const url = 'https://api.github.com/users/lchouville/repos?per_page=100';
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(
        `GitHub API returned ${res.status}: ${res.statusText}`
      );
    }
    repos = await res.json();
    console.log(`Found ${repos.length} repositories.`);
  } catch (err) {
    console.error('Failed to fetch repo list:', err.message);
    process.exit(1);
  }

  // Step 2: For each repo, fetch and transform portfolio.json
  for (const repo of repos) {
    const repoName = repo.name;
    const portfolioUrl = `https://lchouville.github.io/${repoName}/portfolio.json`;

    try {
      // Fetch portfolio.json from that repo's gh-pages
      const res = await fetch(portfolioUrl);

      // 404 / non-2xx = no portfolio data, skip silently
      if (!res.ok) {
        // Silently skip non-2xx (expected for repos without gh-pages or portfolio.json)
        continue;
      }

      let portfolioData;
      try {
        portfolioData = await res.json();
      } catch (parseErr) {
        warnings.push(
          `${repoName}: Invalid JSON in portfolio.json — ${parseErr.message}`
        );
        continue;
      }

      // Skip if hidden: true
      if (portfolioData.hidden === true) {
        continue;
      }

      // Transform and add to projects array
      const transformed = transformProject(portfolioData, repoName);
      projects.push(transformed);
      console.log(`  ✓ ${repoName}`);
    } catch (err) {
      // Unexpected network errors: warn and skip
      warnings.push(`${repoName}: Network error — ${err.message}`);
    }
  }

  // Step 3: Log warnings
  if (warnings.length > 0) {
    console.warn('\nWarnings (repos skipped):');
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  }

  // Step 4: Write output
  console.log(`\nWriting ${projects.length} projects to ${OUTPUT_FILE}...`);
  const { mkdir } = await import('fs/promises');
  const { dirname } = await import('path');
  const outputDir = dirname(OUTPUT_FILE);
  await mkdir(outputDir, { recursive: true });
  const fs = await import('fs/promises');
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(projects, null, 2) + '\n');

  console.log('✓ Done.');
  return projects;
}

/**
 * Self-check: verify transformProject function with mock data.
 * Real network behavior can only be tested in actual CI execution.
 */
function selfCheck() {
  console.log('\nRunning self-checks...');

  // Test 1: transform with minimal data
  const minimalData = {
    name: 'Test Project',
  };
  const result1 = transformProject(minimalData, 'test-repo');
  console.assert(result1.name === 'Test Project', 'name should be passed through');
  console.assert(result1.description === '', 'missing description.fr should be empty string');
  console.assert(result1.techno.length === 0, 'missing stack should be empty array');
  console.assert(result1.status === 'En pause', 'missing progress should default to "En pause"');

  // Test 2: transform with full data
  const fullData = {
    name: 'Full Project',
    description: { fr: 'Projet complet', en: 'Full project' },
    stack: ['React', 'Node.js'],
    progress: 'in-progress',
    softSkills: ['Leadership', 'Communication'],
    images: ['data/images/cover.png', 'data/images/detail.png'],
    links: {
      repo: 'https://github.com/lchouville/example',
      demo: 'https://example.com',
    },
  };
  const result2 = transformProject(fullData, 'example-repo');
  console.assert(result2.name === 'Full Project', 'name should match');
  console.assert(result2.description === 'Projet complet', 'description.fr should be used');
  console.assert(result2.status === 'En cours', 'progress in-progress should map to "En cours"');
  console.assert(
    result2.image === 'https://lchouville.github.io/example-repo/data/images/cover.png',
    'image should be rewritten as hotlink'
  );
  console.assert(result2.repository === 'https://github.com/lchouville/example', 'repository should match links.repo');
  console.assert(result2.access === 'https://example.com', 'access should match links.demo');
  console.assert(result2.competences.hard_skills.length === 2, 'hard_skills should copy stack');
  console.assert(result2.competences.soft_skills.length === 2, 'soft_skills should copy softSkills');

  // Test 3: progress status mapping
  const statuses = ['completed', 'in-progress', 'paused', 'cancelled', ''];
  const expected = ['Terminé', 'En cours', 'En pause', 'Annulé', 'En pause'];
  statuses.forEach((status, i) => {
    const data = { name: 'Test', progress: status };
    const result = transformProject(data, 'test');
    console.assert(
      result.status === expected[i],
      `progress "${status}" should map to "${expected[i]}", got "${result.status}"`
    );
  });

  console.log('✓ All self-checks passed.');
}

// Entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  selfCheck();
  aggregateProjects().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

export { transformProject };
