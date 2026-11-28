// ==============================================================================
// yourframies - Private Admin Security Configuration
// ==============================================================================

export const ADMIN_CONFIG = {
  // Dedicated, configurable private admin URL path
  // Change this path anytime to alter the secret admin route (e.g. '/secure-control', '/atelier-gate', etc.)
  basePath: '/secure-control',

  // Session Security
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  lockoutMinutes: 15,

  // Admin Brand Metadata
  adminPortalTitle: 'Your Framies Admin',
}
