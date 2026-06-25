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
const downloadHtml = read('download/index.html');
const sitemapXml = read('sitemap.xml');
const appCss = read('app/styles.css');
const localServerPath = path.join(root, 'scripts/serve_local.py');
const userGuidePath = path.join(root, 'user-guide', 'index.html');

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
  appHtml.includes('../desktop/renderer/vendor/supabase.js') &&
    accessHtml.includes('../desktop/renderer/vendor/supabase.js'),
  'Web entry points should load the bundled Supabase client before falling back to any CDN import'
);
assert(
  fs.existsSync(path.join(root, 'app/app.js')) &&
    fs.existsSync(path.join(root, 'app/styles.css')),
  'Canonical application assets should live under app/'
);
[
  '[data-theme="dark"] input',
  '[data-theme="dark"] select',
  '[data-theme="dark"] option',
  '[data-theme="dark"] .builder-editor',
  '[data-theme="dark"] .builder-replicates',
  '[data-theme="dark"] .builder-treatment-arm',
  '[data-theme="dark"] .builder-preview',
  '[data-theme="dark"] .builder-preview canvas'
].forEach(requiredDarkRule => {
  assert(
    appCss.includes(requiredDarkRule),
    `Dark mode should keep builder controls readable: ${requiredDarkRule}`
  );
});
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
assert(
  !guideHtml.includes('id="visualGuideTabs"') &&
    !guideHtml.includes('<img '),
  'Guide should stay text-only and should not reintroduce the visual tabbed guide'
);
[
  'Image QC',
  'Manual correction',
  'Publication Figure Builder',
  'single-group figure',
  'Control vs Treatment',
  'multi-treatment',
  'Analyze missing groups',
  '600 DPI',
  'TIFF',
  'full-size contour-overlay'
].forEach(requiredGuidePhrase => {
  assert(
    guideHtml.includes(requiredGuidePhrase),
    `Guide should explain the Cytomove 1.0 feature: ${requiredGuidePhrase}`
  );
});
assert(
  !landingHtml.includes('user-guide/'),
  'Landing page should stay focused and should not be changed for the detailed user guide'
);
assert(
  guideHtml.includes('../user-guide/'),
  'Scratch assay guide should link to the detailed user guide'
);
assert(
  fs.existsSync(userGuidePath),
  '/user-guide/ should provide a detailed text user guide'
);
const userGuideHtml = read('user-guide/index.html');
assert(
  userGuideHtml.includes('rel="canonical" href="https://cytomove.com/user-guide/"') &&
    userGuideHtml.includes('../app/') &&
    userGuideHtml.includes('../wound-healing-scratch-assay-analysis/'),
  'User guide should have canonical metadata and links back to the app and scratch assay guide'
);
[
  'Quick start',
  'Supported inputs',
  'Web app and Desktop',
  'Access and export permissions',
  'Image QC',
  'Analysis parameters',
  'Result metrics',
  'Manual correction',
  'Publication Figure Builder',
  'Builder layout and typography',
  'Validation data and tutorials',
  'Export package',
  'Parameter glossary',
  'Quality-control checklist',
  'Troubleshooting',
  '72-hour offline',
  'required update',
  'Scratch orientation',
  'Fine rotation',
  'Auto crop FOV',
  'Review mode',
  'Auto detect microscope',
  'Threshold level',
  'Variance radius',
  'Ignore tiny islands',
  'Contour thickness',
  'Scale bar',
  'p-value label',
  'Stars',
  'summary_mean',
  'summary_sd',
  'summary_n',
  'single_column_85mm_600dpi.png',
  'double_column_180mm_600dpi.tiff',
  'PowerPoint',
  'full_images/original',
  'full_images/contour_overlay',
  'single-group figure',
  'Control vs Treatment',
  'multi-treatment',
  'Analyze missing groups',
  '600 DPI',
  'TIFF',
  'full-size contour-overlay'
].forEach(requiredUserGuidePhrase => {
  assert(
    userGuideHtml.includes(requiredUserGuidePhrase),
    `User guide should document: ${requiredUserGuidePhrase}`
  );
});
assert(
  !userGuideHtml.includes('<img '),
  'User guide should be text-only for this release'
);
assert(
  sitemapXml.includes('https://cytomove.com/user-guide/'),
  'Sitemap should include the detailed user guide route'
);
assert(
  downloadHtml.includes('../user-guide/') &&
    downloadHtml.includes('Cytomove Desktop 1.0.0') &&
    downloadHtml.includes('72-hour offline') &&
    downloadHtml.includes('Cytomove-Desktop-1.0.0-setup.exe') &&
    downloadHtml.includes('Cytomove-Desktop-1.0.0-portable.exe') &&
    downloadHtml.includes('https://github.com/zduzgun/CytoMove/releases/tag/v1.0'),
  'Download page should document the 1.0.0 release assets, User Guide, offline window, and release notes'
);
assert(
  fs.existsSync(localServerPath) &&
    read('scripts/serve_local.py').includes('Cache-Control') &&
    read('scripts/serve_local.py').includes('no-store'),
  'The local development server should disable stale HTML caching'
);

console.log('Canonical app route contract passed.');
