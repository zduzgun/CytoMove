const asar = require('@electron/asar');

const archive = process.argv[2];
if (!archive) throw new Error('Provide the packaged app.asar path.');

const auth = asar.extractFile(archive, 'renderer\\auth\\cytomove-auth.js').toString();
const access = asar.extractFile(archive, 'lib\\academic-access.js').toString();

if (!auth.includes('flowType: "pkce"')) throw new Error('Packaged OAuth client is not using PKCE.');
if (!access.includes('academic-email-approved')) throw new Error('Packaged academic-domain policy is stale.');

console.log('Packaged PKCE and academic-domain policy verified.');
