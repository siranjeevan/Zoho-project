# Zoho Cliq App Installation Guide

## Installation Steps

1. **Deploy to Vercel**
   - Push your changes to your repository
   - Vercel will automatically redeploy with the new headers configuration

2. **Install in Zoho Cliq**
   - Use this installation link (replace MY_APP_ID with your actual app ID):
   ```
   https://cliq.zoho.com/installapp.do?id=MY_APP_ID
   ```

3. **App URLs**
   - **Main App URL**: https://zoho-project-murex.vercel.app/chat
   - **OAuth Redirect URI**: https://zoho-project-murex.vercel.app/auth/callback
   - **Manifest URL**: https://zoho-project-murex.vercel.app/manifest.json

## Configuration Details

### Headers Set
- `X-Frame-Options: ALLOWALL` - Allows embedding in iframes
- `Content-Security-Policy: frame-ancestors https://cliq.zoho.com https://*.zoho.com` - Allows embedding only in Zoho domains

### Features
- ✅ AI-powered employee management
- ✅ Task assignment and tracking
- ✅ Email notifications
- ✅ Real-time chat interface
- ✅ Iframe-optimized for Zoho Cliq
- ✅ OAuth callback handling

## Testing
1. After deployment, test the app directly: https://zoho-project-murex.vercel.app/chat
2. Verify it loads properly in an iframe
3. Install in Zoho Cliq using the installation link
4. Test the bot functionality within Zoho Cliq

## Troubleshooting
- If the app doesn't load in Zoho Cliq, check browser console for CSP errors
- Ensure the manifest.json is accessible at the public URL
- Verify OAuth redirect URI matches exactly in Zoho Cliq app settings