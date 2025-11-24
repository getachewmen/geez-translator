# ግእዝ አቋም → Geez-Amharic Dictionary App

A modern, mobile-optimized web application for translating Geez verbs to Amharic, English, and Oromiffa with grammar guides.

## ✨ Features

- 🔍 **Search** - Find Geez verbs with instant results
- 💡 **Autocomplete** - Smart suggestions as you type
- 🔗 **Related Words** - Discover similar verbs
- 📚 **Grammar Guides** - Learn Geez grammar and conjugation
- 📱 **Mobile Optimized** - Works perfectly on all devices
- ⚡ **Fast** - Instant search with local data
- 🌐 **Offline Ready** - Works without internet

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started quickly
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - API documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[BACKEND_EXAMPLE.md](BACKEND_EXAMPLE.md)** - Backend examples
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What changed
- **[CHECKLIST.md](CHECKLIST.md)** - Implementation checklist

## 🎯 Key Features

### Search & Discovery

- Search by Geez verb
- Autocomplete suggestions
- Related words finder
- Recent searches history

### Grammar Learning

- Verb conjugation guides
- Pronoun tables
- Grammar rules
- Example sentences

### User Experience

- Mobile-responsive design
- Touch-friendly interface
- Loading indicators
- Error handling
- Offline support

## 🏗️ Architecture

```
React Components (App.jsx)
         ↓
API Service Layer (services/dictionaryApi.js)
         ↓
Dictionary Data (data/dictionary.js)
```

The app uses an **API service layer** that makes it easy to switch between local data and a real API in the future.

## 📊 Data

- **5000+** Geez verbs
- **4 languages** (Geez, Amharic, English, Oromiffa)
- **Multiple verb types** (ገቢር ግሥ, ተገብሮ ግሥ, etc.)
- **Root letter classification**
- **Conjugation information**

## 🛠️ Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling
- **LocalStorage** - Data persistence

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🔧 Configuration

### API Service

Edit `src/services/dictionaryApi.js`:

```javascript
const API_CONFIG = {
  useMockApi: true, // Enable/disable mock API
  networkDelay: 300, // Network delay in ms
  // apiEndpoint: 'https://your-api.com/v1'  // Future API
};
```

### Disable Network Delay

For faster development:

```javascript
const API_CONFIG = {
  useMockApi: false,
  networkDelay: 0,
};
```

## 📦 Export Dictionary Data

```bash
npm run export
```

Creates:

- `dictionary-export.json` - Full dictionary in JSON
- `dictionary-export.csv` - Dictionary in CSV format
- `dictionary-stats.json` - Statistics

## 🚀 Deployment

### Recommended Platforms

- **Vercel** (Recommended) - Zero config deployment
- **Netlify** - Easy continuous deployment
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Fast global CDN

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔮 Future Enhancements

### Planned Features

- [ ] User accounts
- [ ] Favorites/bookmarks
- [ ] Audio pronunciation
- [ ] Advanced search filters
- [ ] Community contributions
- [ ] Mobile app (React Native)

### Backend API (Optional)

- [ ] Node.js + Express
- [ ] Firebase/Supabase
- [ ] User authentication
- [ ] Real-time updates

See [BACKEND_EXAMPLE.md](BACKEND_EXAMPLE.md) for implementation details.

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run export   # Export dictionary data
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Test thoroughly
7. Commit: `git commit -m "Add your feature"`
8. Push: `git push origin feature/your-feature`
9. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

**Dn Getachew Menberu**

## 🙏 Acknowledgments

- Geez language scholars
- Ethiopian Orthodox Church
- Open source community

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Check the documentation files
- Review the code comments

## 🎓 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Geez Language Resources](https://en.wikipedia.org/wiki/Ge%CA%BDez)

## ⚠️ Important Note

The Softonic link (https://geez-amharic-dictionary.en.softonic.com/android) mentioned in the original request is **not an API** - it's just a download page for an Android app. This implementation uses local dictionary data with an API-like interface, which is actually faster and more reliable than a remote API.

## 🎉 Status

**Production Ready!** ✅

The app is fully functional, well-documented, and ready to deploy.

---

Made with ❤️ for the Geez language community
