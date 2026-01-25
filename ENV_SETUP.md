# Environment Variables Setup

This project uses environment variables to configure the API base URL and other settings.

## Configuration Files

### `.env` (Local Development)
The `.env` file contains your local development environment variables. This file is **git-ignored** and should never be committed to version control.

### `.env.example` (Template)
The `.env.example` file is a template showing all available environment variables. Copy this file to create your own `.env` file.

## Setup Instructions

### 1. Create your `.env` file
```bash
cp .env.example .env
```

### 2. Configure the API URL
Edit the `.env` file and update the `VITE_API_URL` value:

```env
# For local development
VITE_API_URL=http://localhost:3000/api

# For VPS deployment
VITE_API_URL=http://72.62.75.169:3000/api

# For production
VITE_API_URL=https://api.yourdomain.com/api
```

## Available Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` | No |
| `VITE_APP_NAME` | Application name | `SJMT Frontend` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_AUTH_TOKEN_KEY` | Session storage key for auth token | `auth_token` | No |
| `VITE_REFRESH_TOKEN_KEY` | Session storage key for refresh token | `refresh_token` | No |
| `VITE_ENVIRONMENT` | Environment name | `development` | No |

## How It Works

### In Code
The environment variables are accessed using Vite's `import.meta.env`:

```typescript
// src/services/api/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### TypeScript Support
TypeScript types for environment variables are defined in `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // ... other variables
}
```

## Environment-Specific Configuration

### Development (Local)
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

### Staging/VPS
```env
VITE_API_URL=http://72.62.75.169:3000/api
VITE_ENVIRONMENT=staging
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_ENVIRONMENT=production
```

## Important Notes

1. **Prefix with `VITE_`**: All environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

2. **Rebuild Required**: After changing environment variables, you must rebuild the application:
   ```bash
   npm run build
   ```

3. **Development Server**: For development, restart the dev server:
   ```bash
   npm run dev
   ```

4. **Security**: Never commit the `.env` file to version control. It's already added to `.gitignore`.

5. **Default Fallback**: The code includes a fallback value if the environment variable is not set:
   ```typescript
   import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
   ```

## Verifying Configuration

To verify your environment variables are loaded correctly:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser console and check:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

3. Or check the build output in the browser's Network tab to see which API endpoint is being called.

## Troubleshooting

### Environment variables not working?
- Ensure variable names start with `VITE_`
- Restart the development server
- Clear browser cache
- Rebuild the application

### API calls going to wrong URL?
- Check `.env` file exists and has correct `VITE_API_URL`
- Verify no typos in the variable name
- Ensure the dev server was restarted after changing `.env`

## Deployment

When deploying to different environments, create environment-specific `.env` files or set environment variables directly in your hosting platform:

- **Vercel/Netlify**: Set environment variables in the dashboard
- **Docker**: Use `.env` files or pass via `docker run -e`
- **GitHub Actions**: Set as repository secrets and reference in workflows
