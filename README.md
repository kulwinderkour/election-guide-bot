# ElectionGuide Bot - AI-Powered Indian Election Assistant

A comprehensive, intelligent chatbot designed to help Indian citizens understand and navigate the electoral process. Built with modern web technologies and integrated with Google AI services.

## 🌟 Features

- **🤖 AI-Powered Chat**: Intelligent responses using Google Gemini AI
- **📊 Interactive Timeline**: Visual representation of election phases
- **🧮 Voter Eligibility Checker**: Quick eligibility assessment
- **📝 Election Quiz**: Educational quizzes with multiple difficulty levels
- **🗺️ Location Services**: Find nearby polling stations using Google Maps
- **♿ Accessible Design**: WCAG 2.1 AA compliant interface
- **🌙 Dark/Light Theme**: User-friendly theme switching
- **📱 Responsive Design**: Works seamlessly on all devices

## 🚀 Technology Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Start
- **Styling**: Tailwind CSS v4, Radix UI components
- **Backend**: Supabase (database, auth, edge functions)
- **AI Services**: Google Gemini AI, Google Maps API
- **Analytics**: Google Analytics 4
- **Deployment**: Cloudflare Workers, Vercel, Netlify options
- **Testing**: Vitest, React Testing Library
- **Build Tools**: Vite, TypeScript, ESLint, Prettier

## 📋 Prerequisites

- Node.js 18+ 
- npm or bun
- Google AI API key
- Google Maps API key
- Supabase project

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kulwinderkour/election-guide-bot.git
   cd election-guide-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your API keys:
   ```env
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

## 📦 Build & Deploy

### **Build**
```bash
npm run build
```

### **Deployment Options**

#### **Cloudflare Workers** (Recommended)
```bash
npm install wrangler
wrangler login
wrangler deploy
```

#### **Vercel**
```bash
npm install -g vercel
vercel
```

#### **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### **Railway**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

## 🏗️ Project Structure

```
election-guide-bot/
├── src/
│   ├── components/          # Reusable UI components
│   ├── lib/               # Utility libraries
│   │   ├── constants.ts   # App constants
│   │   ├── types.ts       # TypeScript definitions
│   │   ├── utils.ts       # Utility functions
│   │   ├── security.ts    # Security utilities
│   │   ├── performance.ts # Performance optimization
│   │   ├── accessibility.ts # Accessibility features
│   │   └── google-services.ts # Google API integrations
│   ├── routes/            # Page components
│   ├── test/              # Test files
│   └── styles.css         # Global styles
├── supabase/              # Supabase configuration
├── public/                # Static assets
├── package.json
├── vitest.config.ts
└── README.md
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_AI_API_KEY` | Google Gemini AI API key | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | Optional |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### **Google APIs Setup**

1. **Google AI API**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create API key
   - Enable Gemini API

2. **Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project
   - Enable Maps JavaScript API and Geocoding API
   - Create API key

3. **Google Analytics**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create GA4 property
   - Get Measurement ID

### **Supabase Setup**

1. **Create Project**
   - Go to [Supabase](https://supabase.com/)
   - Create new project
   - Get URL and anon key

2. **Set up Database**
   ```sql
   -- Create tables for users, chat sessions, quiz results, etc.
   ```

3. **Deploy Edge Functions**
   ```bash
   cd supabase
   supabase functions deploy election-chat
   ```

## 🎯 Features Deep Dive

### **AI Chat System**
- Powered by Google Gemini AI
- Context-aware conversations
- Multi-language support
- Intelligent query analysis
- Personalized responses

### **Location Services**
- Geocoding user addresses
- Finding nearby polling stations
- State-specific election information
- Directions and navigation

### **Accessibility**
- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation
- High contrast mode
- Reduced motion support

### **Performance**
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Virtual scrolling for large lists
- Performance monitoring

### **Security**
- Content Security Policy
- Input validation and sanitization
- Rate limiting
- CSRF protection
- XSS prevention

## 📊 Analytics & Monitoring

The application includes comprehensive analytics:

- **User Behavior Tracking**: Page views, interactions, feature usage
- **Performance Monitoring**: Load times, error rates, user experience
- **AI Response Analytics**: Query patterns, success rates, user satisfaction

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Testing**: 80%+ coverage requirement
- **Security**: Automated security checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Election Commission of India** for official election information
- **Google** for AI and Maps services
- **Supabase** for backend infrastructure
- **Open source community** for amazing tools and libraries

## 📞 Support

For support, questions, or contributions:

- 📧 Email: support@electionguide.bot
- 🐛 Issues: [GitHub Issues](https://github.com/kulwinderkour/election-guide-bot/issues)
- 💬 Discord: [Join our community](https://discord.gg/electionguide)

## 🌍 Impact

This bot aims to:
- Increase voter awareness and participation
- Simplify the electoral process for citizens
- Provide accurate, unbiased election information
- Make democracy more accessible to everyone

---

**Made with ❤️ for Indian Democracy**
