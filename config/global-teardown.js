// config/global-teardown.js
// Runs once after all test suites

async function globalTeardown() {
  console.log('\n✅ Global Teardown: Test run complete.');
  console.log(`   Finished  : ${new Date().toISOString()}`);
  console.log('   Reports   : ./reports/html-report/index.html\n');
}

module.exports = globalTeardown;
