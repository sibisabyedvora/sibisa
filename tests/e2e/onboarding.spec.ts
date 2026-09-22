/**
 * Playwright End-to-End Test Spec Outline for SIBISA
 */

export const e2eFlowSpec = {
  name: 'Onboarding & Chat Flow Spec',
  routes: ['/', '/harga', '/login', '/register', '/dashboard', '/chatbot', '/embed/[publicKey]'],
  expectations: [
    'User registers email and enters dashboard',
    'User fills business profile & knowledge base',
    'User tests chatbot playground response',
    'Widget embed script generates interactive chat bubble',
    'Handover opens wa.me link with prefilled message text',
  ],
};
