# Anthropic API Setup for MediAI Chatbot

## Overview
The MediAI chatbot now uses Anthropic's Claude API for real, context-aware AI responses instead of hardcoded mock responses.

## Required Setup

### 1. Get an Anthropic API Key
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-ant-...`)

### 2. Add API Key to Environment Variables
Open your `.env.local` file and update the `ANTHROPIC_API_KEY`:

```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

**Important:**
- Never commit your actual API key to version control
- Never use `NEXT_PUBLIC_` prefix for this variable (it would expose the key to browsers)
- The API key is only used server-side in the API route

### 3. Restart Development Server
After updating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Features Implemented

### Server-Side Streaming
- Real-time token-by-token streaming from Claude API
- Server-side only API key (never exposed to client)
- Proper error handling for API failures

### Client-Side Features
- **useChat hook**: Manages chat state and streaming automatically
- **Stop Generation**: Red button appears during generation to abort requests
- **Auto-scroll**: Automatically scrolls to new tokens when at bottom
- **Jump to Latest**: Button appears when user scrolls up
- **Conversation History**: Maintains context across multiple turns
- **Responsive Design**: Works at mobile widths (320px+)

### AI Configuration
- **File**: `lib/ai-config.ts`
- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **System Prompt**: Comprehensive medical assistant persona
- **Temperature**: 0.7 (balanced creativity/reliability)
- **Max Tokens**: 1024

## Testing the Chatbot

### Test Different Questions
Try these to verify context-aware responses:
1. "What symptoms should I watch for with the flu?"
2. "I have a headache and fever, what should I do?"
3. "What specialist should I see for chest pain?"
4. "Tell me about when to seek emergency care"
5. "What makes MediAI different from other health apps?"

### Test Multi-Turn Conversation
1. Ask a question
2. Wait for response
3. Ask a follow-up question related to the previous response
4. Verify the AI remembers context

### Test Stop Generation
1. Send a message
2. Click the red stop button while response is streaming
3. Verify generation stops and partial response is preserved
4. Send another message to verify chat still works

### Test Mobile Responsiveness
- Test at 320px, 375px, 390px, 768px widths
- Verify input, send button, stop button work correctly
- Verify scrolling and messages display properly

## Troubleshooting

### "Anthropic API key not configured" Error
- Verify `ANTHROPIC_API_KEY` is set in `.env.local`
- Ensure the key is not the placeholder value
- Restart the development server after updating the file

### No Response or Timeout
- Check your Anthropic API key has credits
- Verify internet connection
- Check browser console for errors
- Check server logs for API errors

### Streaming Not Working
- Ensure you're using the updated Chat component with `useChat` hook
- Verify the API route is returning a streaming response
- Check browser network tab for streaming response

## Security Notes

- ✅ API key is server-side only (never exposed to client)
- ✅ No `NEXT_PUBLIC_` prefix used
- ✅ `.env.local` is in `.gitignore`
- ✅ Error messages don't expose API keys or internal details
- ✅ Input validation on API route

## Files Modified

- `lib/ai-config.ts` - New AI configuration module
- `app/api/chat/route.ts` - Server-side streaming endpoint
- `components/chat/Chat.tsx` - Client chat component with streaming
