const required = ['CSC_LINK', 'CSC_KEY_PASSWORD'];
const missing = required.filter(name => !process.env[name]);

if (missing.length) {
  console.error(`Production Windows builds require code-signing variables: ${missing.join(', ')}`);
  process.exit(1);
}
