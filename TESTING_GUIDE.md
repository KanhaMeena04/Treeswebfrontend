# Testing Guide for SocialStream Platform

## Overview
This guide covers unit testing, integration testing, and end-to-end testing for the SocialStream platform.

## Prerequisites
- Node.js 18+ installed
- All dependencies installed (`npm install`)
- Backend server running for E2E tests

## Running Tests

### Frontend Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Backend Tests
```bash
cd backend

# Run backend tests
npm test

# Run with coverage
npm run test:coverage
```

## Test Structure

### Frontend Tests (`src/test/`)
- `AuthModal.test.tsx` - Authentication component tests
- `utils.test.ts` - Utility function tests
- `e2e.test.tsx` - End-to-end authentication flow tests
- `setup.ts` - Test configuration

### Test Categories

#### Unit Tests
- Component rendering
- Form validation
- Utility functions
- API service methods

#### Integration Tests
- Component interactions
- API calls
- State management

#### End-to-End Tests
- Complete user workflows
- Authentication flows
- Navigation testing

## Demo Login Credentials

### Test Users
```javascript
// Demo user (automatically created)
const demoUser = {
  email: 'demo@example.com',
  username: 'demouser',
  password: 'demo123' // For backend testing
}

// Admin user (for admin panel testing)
const adminUser = {
  email: 'admin@example.com',
  username: 'admin',
  password: 'admin123'
}
```

## Testing Scenarios

### Authentication Testing
1. **Login Flow**
   - Valid credentials
   - Invalid credentials
   - Empty form submission
   - Demo login

2. **Signup Flow**
   - Valid registration
   - Duplicate email/username
   - Password validation
   - Required field validation

3. **Session Management**
   - Token storage
   - Auto-logout on token expiry
   - Persistent login

### Component Testing
1. **AuthModal Component**
   - Renders correctly
   - Switches between login/signup
   - Form validation
   - API integration

2. **Navigation Testing**
   - Authenticated routes
   - Unauthenticated redirects
   - Menu interactions

### API Testing
1. **Authentication Endpoints**
   - POST /api/auth/login
   - POST /api/auth/register
   - GET /api/auth/profile

2. **Protected Routes**
   - Authorization headers
   - Token validation
   - Error handling

## Manual Testing Checklist

### Pre-deployment Testing
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new account
- [ ] Demo login functionality
- [ ] Logout functionality
- [ ] Protected route access
- [ ] Form validation messages
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Memory usage
- [ ] Network requests optimization

## Test Data

### Sample Test Data
```javascript
const testUsers = [
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    password: 'password123'
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    password: 'password123'
  }
]
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Debugging Tests

### Common Issues
1. **Import Errors**: Check file paths and exports
2. **Mock Issues**: Verify mock implementations
3. **Async Test Failures**: Use proper async/await patterns
4. **DOM Testing**: Ensure proper cleanup

### Debug Commands
```bash
# Run specific test file
npm test -- AuthModal.test.tsx

# Run tests in debug mode
npm test -- --reporter=verbose

# Run tests with specific pattern
npm test -- --grep "login"
```

## Coverage Reports

Tests generate coverage reports in `coverage/` directory:
- HTML report: `coverage/index.html`
- Text summary in terminal
- Coverage thresholds configured in `vitest.config.ts`

## Best Practices

1. **Test Naming**: Use descriptive test names
2. **Test Isolation**: Each test should be independent
3. **Mock External Dependencies**: Use mocks for API calls
4. **Test Edge Cases**: Include error scenarios
5. **Keep Tests Simple**: One assertion per test when possible

## Deployment Testing

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Coverage above 80%
- [ ] No console errors
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Database connections working

This testing strategy ensures the SocialStream platform is reliable, secure, and user-friendly across all deployment environments.