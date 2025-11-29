# Zoho Cliq App Installation Guide

## Your App Credentials
- **Client ID**: 1000.54UX4GFS79P7LHHALH8TTSQAYRDVOI
- **Client Secret**: b9f2aedc1826151fa3de766bd0c41f6f6285cfeec3
- **Redirect URI**: https://zoho-project-murex.vercel.app/auth/callback

## Installation Steps

1. **Deploy to Vercel**
   - Push your changes to your repository
   - Vercel will automatically redeploy with the new headers configuration

2. **Your App URLs**
   - **Main App URL**: https://zoho-project-murex.vercel.app/chat
   - **OAuth Redirect URI**: https://zoho-project-murex.vercel.app/auth/callback
   - **Manifest URL**: https://zoho-project-murex.vercel.app/manifest.json

3. **Install in Zoho Cliq**
   - Go to: https://cliq.zoho.com/api
   - Find your app with Client ID: 1000.54UX4GFS79P7LHHALH8TTSQAYRDVOI
   - Click "Install" or use the installation link when available

## OAuth Configuration
Your OAuth is already configured with:
- ✅ Client ID and Secret added to environment
- ✅ Redirect URI set to callback endpoint
- ✅ Callback handler created

## Testing
1. Test app directly: https://zoho-project-murex.vercel.app/chat
2. Verify OAuth callback: https://zoho-project-murex.vercel.app/auth/callback
3. Check manifest: https://zoho-project-murex.vercel.app/manifest.json
4. Install in Zoho Cliq and test bot functionality

## Next Steps
1. Deploy to Vercel
2. Go to Zoho Cliq Developer Console
3. Install your app using your Client ID
4. Test the integration