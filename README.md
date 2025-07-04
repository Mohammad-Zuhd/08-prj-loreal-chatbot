# L'Oréal Smart Product Advisor Chatbot

A branded chatbot for L'Oréal that helps customers with product recommendations and beauty advice.

## Features

- ✅ **L'Oréal Branding**: Official logo, colors, and styling
- ✅ **OpenAI Integration**: Uses GPT-4o for intelligent responses
- ✅ **Smart Filtering**: Only answers L'Oréal and beauty-related questions
- ✅ **Secure Deployment**: Supports Cloudflare Workers to protect API keys
- ✅ **Conversation Memory**: Maintains context throughout the conversation
- ✅ **Chat Bubbles**: Distinct styling for user and AI messages
- ✅ **User Questions Display**: Shows user input above AI responses

## Setup Instructions

### For Secure Deployment (Recommended - Full Points):

1. **Create a Cloudflare Worker** (see instructions below)
2. **Update your worker URL**: Replace the URL in `secrets.js` with your actual worker URL
3. **No API key needed in your code!** - The API key is stored securely in Cloudflare

### For Development/Testing Only:

1. **Get an OpenAI API Key**: Visit [OpenAI's website](https://platform.openai.com/)
2. **Uncomment and add your API key** in `secrets.js` (not recommended for production)

## Cloudflare Worker Deployment (Recommended for Production)

1. Create a new Cloudflare Worker
2. Copy the code from `RESOURCE_cloudflare-worker.js` into your worker
3. Add your OpenAI API key as an environment variable named `OPENAI_API_KEY`
4. Update the `CLOUDFLARE_WORKER_URL` in `secrets.js` with your worker URL

## Reflection Questions

### 1. Building a Chatbot

**Question**: What was the most challenging part of building this chatbot, and how did you overcome it?

**Answer**: The most challenging part was implementing the conversation history feature to maintain context between messages. Initially, the chatbot would treat each question as isolated, which made for a poor user experience. I overcame this by creating a `conversationHistory` array that stores all previous messages in the OpenAI format (with roles: system, user, assistant). This allows the AI to reference earlier parts of the conversation and provide more contextual responses. For example, if a user asks "What about sensitive skin?" after previously asking about moisturizers, the AI can understand the connection and provide relevant sensitive skin moisturizer recommendations.

### 2. Talking Points

**Question**: If you were to present this chatbot to L'Oréal executives, what would be your key talking points?

**Answer**: I would focus on three key value propositions:

1. **Customer Experience Enhancement**: This chatbot provides 24/7 personalized product recommendations, reducing the barrier between customers and finding the right L'Oréal products. It can handle multiple customer inquiries simultaneously, improving response times.

2. **Brand Consistency**: The chatbot is specifically trained to only discuss L'Oréal products and beauty topics, ensuring all interactions reinforce the brand message. It uses the official L'Oréal visual identity and maintains a professional, helpful tone that aligns with the brand values.

3. **Scalable Customer Support**: This solution can handle thousands of customer inquiries without additional staff costs, while collecting valuable data about customer preferences and common questions that can inform product development and marketing strategies.

### 3. L'Oréal Recruiter

**Question**: You're talking to a L'Oréal recruiter about this project. How would you explain the technical skills you demonstrated?

**Answer**: This project demonstrates several key technical competencies relevant to modern web development and AI integration:

**Frontend Development**: I built a responsive, accessible web interface using semantic HTML5, modern CSS with custom properties and gradients, and vanilla JavaScript with async/await for API calls. The design follows accessibility best practices with proper labels and focus management.

**API Integration**: I successfully integrated with OpenAI's REST API, handling authentication, request formatting, error handling, and response parsing. I implemented proper async programming patterns to manage API calls without blocking the user interface.

**Security Best Practices**: I implemented a secure architecture using Cloudflare Workers as a proxy to protect sensitive API keys from client-side exposure. The project includes proper CORS handling and environment variable management.

**User Experience Design**: I created an intuitive chat interface with real-time message display, loading states, conversation history, and distinct visual styling for different message types. The interface provides immediate feedback and maintains conversation context.

**Brand Implementation**: I successfully translated L'Oréal's brand guidelines into a digital interface, demonstrating attention to detail and understanding of brand consistency across digital touchpoints.

This project shows my ability to work with modern web technologies, third-party APIs, and create secure, user-friendly applications that align with business requirements.Project 8: L'Oréal Chatbot
L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.
