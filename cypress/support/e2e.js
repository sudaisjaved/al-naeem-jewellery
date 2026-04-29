// Global Cypress support file
// Add custom commands or global hooks here

Cypress.on('uncaught:exception', (err) => {
  // Don't fail tests on third-party script errors
  if (err.message.includes('ResizeObserver')) return false;
});
