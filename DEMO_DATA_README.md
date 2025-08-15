# Demo Data System

This project has been configured to use demo data instead of real API calls, allowing you to develop and test the frontend without needing a backend server.

## How It Works

The demo data system replaces all API calls with realistic mock data and simulated API delays. This provides a seamless development experience while maintaining the same interface as the real API.

## Demo Credentials

To test the authentication system, use these demo credentials:

- **Email**: `demo@example.com`
- **Password**: `demo123`

## Features

### Authentication
- Login/Register functionality with demo user creation
- Username availability checking
- Username suggestions
- Token-based authentication simulation

### User Management
- Demo user profiles with realistic data
- Avatar upload simulation
- Profile updates

### Settings
- Account, privacy, notification, and app settings
- Settings export functionality
- Settings reset to defaults

### Arcade (Dating/Matching)
- User preferences management
- Potential matches with realistic profiles
- Like, super-like, dislike, and pass functionality
- Match simulation (20% chance with like, 40% with super-like)
- User blocking/unblocking
- Statistics tracking

### Subscriptions
- Streamer discovery
- Subscription tier management
- Subscription creation and cancellation
- Auto-renewal settings

### Chat System
- Chat creation and management
- Message sending and retrieval
- Message pinning
- Chat PIN system
- Read status tracking

### Reporting System
- User reporting functionality
- Report status tracking
- Admin notes simulation

## Demo Data Sources

The demo data includes:
- Realistic user profiles with Unsplash profile pictures
- Sample matches and interactions
- Subscription tiers and pricing
- Chat conversations
- User reports

## Switching Back to Real API

When you're ready to connect to a real backend:

1. Replace imports from `@/services/demoData` with `@/services/api`
2. Update the API base URL in `src/services/api.ts`
3. Ensure your backend server is running
4. Update any environment variables for API configuration

## Benefits

- **No Backend Required**: Develop frontend features independently
- **Realistic Data**: Work with data that looks and behaves like real user data
- **Consistent Interface**: Same API interface as production code
- **Fast Development**: No network delays or server setup required
- **Easy Testing**: Predictable data for testing edge cases

## File Structure

- `src/services/demoData.ts` - Main demo data service
- `src/hooks/useAuth.tsx` - Authentication hook using demo data
- `src/hooks/useArcade.ts` - Arcade functionality using demo data
- `src/hooks/useSubscriptions.ts` - Subscription management using demo data
- `src/hooks/useSettings.ts` - Settings management using demo data
- `src/hooks/useChat.ts` - Chat functionality using demo data
- `src/hooks/useReports.ts` - Reporting system using demo data

## Customization

You can easily customize the demo data by modifying the constants in `src/services/demoData.ts`:

- Add more demo users
- Modify subscription tiers
- Change match probabilities
- Add more sample conversations
- Customize user preferences

## Notes

- All API calls simulate network delays (500ms by default)
- Data is stored in memory and resets on page refresh
- File uploads create local object URLs for preview
- Error handling simulates real API error responses
- Success messages use the same toast system as production
