// Demo configuration file
// Modify these values to customize the demo experience

export const DEMO_CONFIG = {
  // API simulation settings
  apiDelay: {
    min: 300, // Minimum delay in milliseconds
    max: 800, // Maximum delay in milliseconds
    default: 500, // Default delay in milliseconds
  },

  // Authentication settings
  auth: {
    demoCredentials: {
      email: 'demo@example.com',
      password: 'demo123',
    },
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },

  // Arcade (Dating) settings
  arcade: {
    matchProbabilities: {
      like: 0.2, // 20% chance of match with like
      superLike: 0.4, // 40% chance of match with super like
    },
    maxPotentialMatches: 50, // Maximum number of potential matches to show
    maxMatches: 100, // Maximum number of matches to store
  },

  // Chat settings
  chat: {
    maxMessages: 1000, // Maximum number of messages per chat
    maxChats: 50, // Maximum number of chats
    pinLength: 4, // Length of chat PIN codes
  },

  // Subscription settings
  subscriptions: {
    maxSubscriptions: 20, // Maximum number of active subscriptions
    maxTiers: 5, // Maximum number of subscription tiers per streamer
  },

  // User settings
  users: {
    maxUsers: 1000, // Maximum number of demo users
    maxReports: 50, // Maximum number of user reports
  },

  // Feature toggles
  features: {
    enableFileUploads: true, // Enable file upload simulation
    enableRealTimeUpdates: false, // Disable real-time updates in demo
    enablePushNotifications: false, // Disable push notifications in demo
    enableSMS: false, // Disable SMS functionality in demo
  },

  // Demo data sources
  dataSources: {
    profileImages: 'unsplash', // Use Unsplash for profile images
    avatars: 'unsplash', // Use Unsplash for avatar images
    names: 'generated', // Generate names programmatically
    locations: 'cities', // Use real city names
  },

  // Error simulation
  errors: {
    simulateNetworkErrors: false, // Simulate network failures
    simulateServerErrors: false, // Simulate server errors
    errorRate: 0.05, // 5% chance of error (when enabled)
  },

  // Performance settings
  performance: {
    enableLazyLoading: true, // Enable lazy loading for large datasets
    batchSize: 20, // Number of items to load in batches
    cacheExpiry: 5 * 60 * 1000, // 5 minutes cache expiry
  },
};

// Helper function to get random API delay
export const getRandomApiDelay = (): number => {
  const { min, max } = DEMO_CONFIG.apiDelay;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get default API delay
export const getDefaultApiDelay = (): number => {
  return DEMO_CONFIG.apiDelay.default;
};

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature: keyof typeof DEMO_CONFIG.features): boolean => {
  return DEMO_CONFIG.features[feature];
};

// Helper function to get configuration value
export const getConfig = <T>(key: string, defaultValue: T): T => {
  const keys = key.split('.');
  let value: any = DEMO_CONFIG;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return value as T;
};
