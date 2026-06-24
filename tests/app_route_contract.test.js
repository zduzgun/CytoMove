const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const appHtml = read('app/index.html');
const accessHtml = read('access/index.html');
const landingHtml = read('index.html');
const legacyHtml = read('prototype_refactor/index.html');
const olderLegacyHtml = read('prototype/index.html');
const guideHtml = read('wound-healing-scratch-assay-analysis/index.html');
const tutorialHtml = read('tutorial/index.html');
const localServerPath = path.join(root, 'scripts/serve_local.py');

assert(
  appHtml.includes('id="qcModuleTab"') &&
    appHtml.includes('id="publicationBuilderPanel"'),
  '/app/ should serve the current Image QC and Publication Figure Builder UI'
);
assert(
  appHtml.includes('href="styles.css?') &&
    appHtml.includes('src="app.js?'),
  '/app/ should own its JavaScript and CSS assets'
);
assert(
  fs.existsSync(path.join(root, 'app/app.js')) &&
    fs.existsSync(path.join(root, 'app/styles.css')),
  'Canonical application assets should live under app/'
);
assert(
  appHtml.includes("params.get('mode') === 'demo'"),
  '/app/?mode=demo should preserve loginless demo mode'
);
assert(
  accessHtml.includes('href="../app/?mode=demo&amp;v=20260620-canonical-app"') &&
    accessHtml.includes("var appUrl = '../app/?v=20260620-canonical-app';"),
  'The access gateway should route demo and authenticated users to /app/'
);
assert(
  landingHtml.match(/href="access\/\?v=20260620-canonical-app"/g)?.length === 2 &&
    !landingHtml.includes('access/?stay=1'),
  'Landing Open Web App calls should check the session through versioned Cytomove Access'
);
assert(
  accessHtml.includes('if (snapshot.signedIn && !stayOnGateway)') &&
    !accessHtml.includes('if (snapshot.approved && !stayOnGateway)'),
  'Cytomove Access should open the app for any signed-in session and stay for signed-out users'
);
assert(
  !appHtml.includes('isLocalReview') &&
    !appHtml.includes("dataset.accessMode = 'local-review'"),
  '/app/ should not bypass access state on localhost'
);
assert(
  legacyHtml.includes("target.pathname = '/app/'") &&
    legacyHtml.includes('target.search = window.location.search') &&
    legacyHtml.includes('target.hash = window.location.hash') &&
    legacyHtml.includes('window.location.replace(target.href)'),
  '/prototype_refactor/ should redirect to /app/ while preserving search and hash'
);
assert(
  olderLegacyHtml.includes('url=../app/') &&
    olderLegacyHtml.includes('href="../app/"') &&
    !olderLegacyHtml.includes('../prototype_refactor/'),
  '/prototype/ should point directly to the canonical /app/ route'
);
assert(
  !guideHtml.includes('../prototype_refactor/') &&
    guideHtml.includes('../app/'),
  'Guide calls to action should point directly to /app/'
);
const guideTabLabels = [
  'Overview',
  'Load images',
  'Image QC',
  'Analysis',
  'Manual correction',
  'Publication figures',
  'Export',
  'Troubleshooting'
];
const visualGuideSource = guideHtml.slice(guideHtml.indexOf('class="visual-guide"'));
assert(
  guideHtml.includes('id="visualGuideTabs"') &&
    guideHtml.includes('class="guide-tab"') &&
    guideHtml.includes('class="guide-panel"'),
  'Guide should include a visual tabbed handbook section'
);
guideTabLabels.forEach(label => {
  assert(
    visualGuideSource.includes(`>${label}<`) || visualGuideSource.includes(`>${label}`),
    `Guide should include the ${label} tab`
  );
});
assert(
  visualGuideSource.indexOf('Image QC') < visualGuideSource.indexOf('Analysis') &&
    visualGuideSource.indexOf('Analysis') < visualGuideSource.indexOf('Publication Figure Builder') &&
    visualGuideSource.indexOf('Publication Figure Builder') < visualGuideSource.indexOf('Export'),
  'Guide should teach the Cytomove workflow in the correct order'
);
assert(
  guideHtml.includes('single-group figure') &&
    guideHtml.includes('Control vs Treatment') &&
    guideHtml.includes('multi-treatment'),
  'Guide should explain single-group, Control vs Treatment, and multi-treatment figure modes'
);
assert(
  guideHtml.includes('full-size original') &&
    guideHtml.includes('full-size contour-overlay'),
  'Guide should explain full-size original and contour-overlay export assets'
);
assert(
  guideHtml.includes('../app/?tutorial=huvec-full') &&
    guideHtml.includes('../app/?tutorial=manual') &&
    guideHtml.includes('../app/?tutorial=publication-quality'),
  'Guide should link to the full HUVEC, manual correction, and publication figure tutorials'
);
assert(
  tutorialHtml.includes('../wound-healing-scratch-assay-analysis/'),
  'Tutorial landing page should link back to the visual guide'
);
assert(
  fs.existsSync(localServerPath) &&
    read('scripts/serve_local.py').includes('Cache-Control') &&
    read('scripts/serve_local.py').includes('no-store'),
  'The local development server should disable stale HTML caching'
);

console.log('Canonical app route contract passed.');
