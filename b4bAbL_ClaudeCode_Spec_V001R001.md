# b4bAbL - Claude Code Project Specification
# Version: V001R001
# Created: 2025-12-02
# Author: Dan / Carrier Enterprise Canada
# Purpose: Complete specification for Claude Code to build the b4bAbL React application

---

## PROJECT OVERVIEW

**App Name:** b4bAbL  
**Subtitle:** A DANMAN Solution  
**Tagline:** "To unite the tongues of Humanity"  
**Footer Text:** "DANMAN - DATA And NUMBERS METRICS And NETWORKS | Carrier Enterprise Tech Team Pilot Project"

**Concept:** A live translation web app themed around the Tower of Babel story. The visual metaphor: humanity once spoke one language, Babel scattered us, and now b4bAbL reunites us through real-time translation.

---

## TECHNICAL STACK

```
Framework:     React 18+ with Vite
Language:      TypeScript
Styling:       Tailwind CSS
Animations:    Framer Motion
Routing:       React Router v6
Hosting:       GitHub Pages
Backend:       Google Apps Script Web App (existing, external)
Auth:          Google OAuth (optional) / Simple name entry
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "framer-motion": "^10.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "gh-pages": "^6.x"
  }
}
```

---

## DESIGN SYSTEM

### Color Palette (Stone/Temple Theme)
```css
--stone-50:    #faf8f5;    /* Lightest cream */
--stone-100:   #f0ebe3;    /* Light sand */
--stone-200:   #e4dcd0;    /* Warm beige */
--stone-300:   #d4c4a8;    /* Sandstone light */
--stone-400:   #c4956a;    /* Warm tan */
--stone-500:   #a67c5b;    /* Desert sand */
--stone-600:   #8b6b4a;    /* Weathered stone */
--stone-700:   #6b5344;    /* Dark earth */
--stone-800:   #4a3728;    /* Deep brown */
--stone-900:   #3d2b1f;    /* Darkest brown */

--gold-accent: #c4a878;    /* Gold highlights */
--gold-bright: #ffd700;    /* Bright gold for emphasis */
```

### Typography
```css
/* Primary - Headers, titles, menu labels */
font-family: 'Cinzel', serif;
/* Weights: 400 (regular), 600 (semibold), 700 (bold) */

/* Secondary - Body text, quotes, inputs */
font-family: 'Crimson Text', Georgia, serif;
/* Weights: 400, 600, italic variants */
```

### Stone Texture CSS (Background)
```css
background: 
  url('data:image/svg+xml,...noise-filter...'),
  linear-gradient(180deg, 
    #d4a574 0%, 
    #c4956a 20%,
    #b8866a 40%,
    #a67c5b 60%,
    #8b6b4a 80%,
    #6b5344 100%
  );
background-attachment: fixed;
```

### Stone Tablet Component Styling
```css
.stone-tablet {
  background: linear-gradient(145deg, #d4c4a8 0%, #c4b498 50%, #b4a488 100%);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 
    8px 8px 20px rgba(0,0,0,0.3),
    -2px -2px 10px rgba(255,255,255,0.1),
    inset 0 0 60px rgba(139,107,74,0.2);
  border: 3px solid #8b6b4a;
}
```

### Etched Text Effect (KEY FEATURE)
Text should appear as if carved/etched into stone:
```css
.etched-text {
  color: #4a3728;
  text-shadow: 
    1px 1px 0 rgba(255,255,255,0.3),  /* Light edge (top-left light source) */
    -1px -1px 0 rgba(0,0,0,0.2);       /* Shadow edge */
  letter-spacing: 2px;
}
```

For animated typing effect, characters should appear one by one with a subtle "chisel" sound option.

---

## USER FLOW / SCREENS

### Screen 1: Splash / Language Selection
```
┌─────────────────────────────────────┐
│                                     │
│        [Tower Silhouette]           │
│                                     │
│           b4bAbL                    │
│    A DANMAN Solution                │
│                                     │
│   "To unite the tongues            │
│        of Humanity"                 │
│                                     │
│   ┌─────────────────────────┐       │
│   │  Select Your Language ▼ │       │
│   └─────────────────────────┘       │
│                                     │
│        [ Continue → ]               │
│                                     │
│   [Skip to Translator]              │
│                                     │
└─────────────────────────────────────┘
```

**Languages to Support:**
- English, Spanish, French, Portuguese, Mandarin, Japanese, Korean, Arabic, Hindi, German, Italian, Russian

### Screen 2: Sign In
```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────────────────────────┐   │
│   │      STONE TABLET           │   │
│   │                             │   │
│   │   Enter Your Name           │   │
│   │   ┌───────────────────┐     │   │
│   │   │                   │     │   │
│   │   └───────────────────┘     │   │
│   │                             │   │
│   │   [ Sign in with Google ]   │   │
│   │           or                │   │
│   │   [ Continue as Guest ]     │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   [Skip]                            │
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: The Babel Question
```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────────────────────────┐   │
│   │      STONE TABLET           │   │
│   │                             │   │
│   │   "Do you know the story    │   │
│   │        of Babel?"           │   │
│   │                             │   │
│   │   Share your thoughts...    │   │
│   │   ┌───────────────────┐     │   │
│   │   │                   │     │   │
│   │   │   [textarea]      │     │   │
│   │   │                   │     │   │
│   │   └───────────────────┘     │   │
│   │                             │   │
│   │   [ Submit Your Story ]     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌──────┐  ┌──────┐  ┌──────┐      │  ← Speech bubbles float in
│   │Maria │  │Kenji │  │Ahmed │      │    as user types
│   └──────┘  └──────┘  └──────┘      │
│                                     │
│   [Skip]                            │
└─────────────────────────────────────┘
```

**Behavior:** As user types, previous responses from other users randomly appear as speech bubbles floating onto the screen. Each bubble shows the author's name and a snippet of their response.

### Screen 4: The Story
```
┌─────────────────────────────────────┐
│                                     │
│   [Animated etched text appears]    │
│                                     │
│   "Before the tower, humanity       │
│    spoke with one voice.            │
│                                     │
│    In our ambition to touch         │
│    the divine, we reached           │
│    too high—and in that             │
│    reaching, we lost each other.    │
│                                     │
│    Languages scattered like         │
│    stones from an unfinished        │
│    monument.                        │
│                                     │
│    But now, through b4bAbL,         │
│    we build again... not a          │
│    tower of pride, but a            │
│    bridge of understanding."        │
│                                     │
│        — Genesis 11:1-9,            │
│          Reimagined                 │
│                                     │
│        [ Continue → ]               │
│                                     │
│   [Skip]                            │
└─────────────────────────────────────┘
```

**Animation:** Text appears word-by-word or line-by-line with etching effect (like being carved in real-time). Subtle dust particles float. Optional: ambient stone-carving sound.

### Screen 5: Main Menu (Stone Tablets)
```
┌─────────────────────────────────────┐
│                                     │
│           b4bAbL                    │
│                                     │
│   ┌─────────┐    ┌─────────┐        │
│   │   ⚡    │    │   🆕    │        │
│   │         │    │         │        │
│   │  QUICK  │    │   NEW   │        │
│   │ SESSION │    │ SESSION │        │
│   └─────────┘    └─────────┘        │
│                                     │
│   ┌─────────┐    ┌─────────┐        │
│   │   📜    │    │   ⚙️    │        │
│   │         │    │         │        │
│   │   MY    │    │         │        │
│   │SESSIONS │    │SETTINGS │        │
│   └─────────┘    └─────────┘        │
│                                     │
│   ┌─────────────────────────┐       │
│   │   🔊 Audio Player       │       │
│   └─────────────────────────┘       │
│                                     │
│   ─────────────────────────────     │
│   DANMAN - DATA And NUMBERS         │
│   METRICS And NETWORKS              │
│   Carrier Enterprise Tech Team      │
│   Pilot Project                     │
│                                     │
└─────────────────────────────────────┘
```

**Tablet Animation:** Tablets should appear to slide in from bottom or "emerge" from stone background.

### Screen 6: Translation Session
This is the main functional screen - connects to existing Google Apps Script backend.

Features needed:
- Two-column layout (User A | User B)
- Real-time message display
- Audio playback controls
- Language indicators
- Session info header

---

## COMPONENT STRUCTURE

```
src/
├── components/
│   ├── layout/
│   │   ├── StoneBackground.tsx      # Textured background
│   │   ├── Header.tsx               # App header with tower
│   │   ├── Footer.tsx               # DANMAN footer
│   │   └── SkipButton.tsx           # Persistent skip option
│   │
│   ├── ui/
│   │   ├── StoneTablet.tsx          # Reusable tablet container
│   │   ├── StoneButton.tsx          # Carved button style
│   │   ├── StoneInput.tsx           # Input with stone styling
│   │   ├── EtchedText.tsx           # Animated carved text
│   │   ├── SpeechBubble.tsx         # Floating response bubbles
│   │   └── DustParticles.tsx        # Floating dust effect
│   │
│   ├── screens/
│   │   ├── SplashScreen.tsx         # Language selection
│   │   ├── SignInScreen.tsx         # Name/Google auth
│   │   ├── BabelQuestionScreen.tsx  # "Do you know Babel?"
│   │   ├── StoryScreen.tsx          # Animated story reveal
│   │   ├── MainMenuScreen.tsx       # Tablet menu
│   │   └── TranslationScreen.tsx    # Main translator UI
│   │
│   └── audio/
│       ├── AudioPlayer.tsx          # Audio playback component
│       └── AudioToggle.tsx          # On/off control
│
├── hooks/
│   ├── useGoogleAuth.ts             # Google OAuth hook
│   ├── useTranslationSession.ts     # Session management
│   ├── useAudioQueue.ts             # Audio polling
│   └── useBabelResponses.ts         # Fetch/submit Babel stories
│
├── services/
│   ├── api.ts                       # Google Apps Script API calls
│   └── storage.ts                   # LocalStorage helpers
│
├── styles/
│   └── globals.css                  # Tailwind + custom styles
│
├── types/
│   └── index.ts                     # TypeScript interfaces
│
├── App.tsx                          # Main app with routing
└── main.tsx                         # Entry point
```

---

## API INTEGRATION

### Existing Google Apps Script Endpoints

**Base URL:** (User's deployed Web App URL - store in .env)

```typescript
// Environment variable
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/xxxxx/exec
```

**Endpoints:**

```typescript
// Get audio queue
GET ?mode=queue&session={sessionId}&to={userName}&lastId={lastCheckedId}
Response: { queue: [...], lastId: number }

// Audio player standalone mode
GET ?mode=audioplayer&session={sessionId}&to={userName}

// NEW: Submit Babel response
POST ?mode=babelResponse
Body: { name: string, response: string, language: string, timestamp: string }

// NEW: Get Babel responses
GET ?mode=babelResponses&limit=20
Response: { responses: [{ name, response, timestamp }...] }
```

### New Backend Functions Needed
Add to existing Google Apps Script:

```javascript
// Handle Babel story submissions
function handleBabelResponse(data) {
  const sheet = getOrCreateSheet('BabelResponses');
  sheet.appendRow([
    new Date().toISOString(),
    data.name,
    data.language,
    data.response
  ]);
  return { success: true };
}

// Get recent Babel responses
function getBabelResponses(limit = 20) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('BabelResponses');
  if (!sheet) return { responses: [] };
  
  const data = sheet.getDataRange().getValues();
  const responses = data.slice(1).slice(-limit).map(row => ({
    timestamp: row[0],
    name: row[1],
    language: row[2],
    response: row[3]
  }));
  
  return { responses: responses.reverse() };
}
```

---

## ANIMATIONS (Framer Motion)

### Etched Text Animation
```typescript
// Word-by-word reveal with carving effect
const etchedVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};
```

### Speech Bubble Float-In
```typescript
const bubbleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    x: Math.random() * 100 - 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    x: 0,
    transition: { type: "spring", damping: 15 }
  }
};
```

### Stone Tablet Entrance
```typescript
const tabletVariants = {
  hidden: { opacity: 0, y: 100, rotateX: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
```

---

## GITHUB PAGES DEPLOYMENT

### Vite Config for GitHub Pages
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/b4bAbL/', // Repository name
  build: {
    outDir: 'dist'
  }
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### GitHub Actions (Optional Auto-Deploy)
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

Key responsive behaviors:
- Menu tablets: 2x2 grid on desktop, 1 column on mobile
- Speech bubbles: Fewer visible on mobile
- Font sizes: Scale down on mobile
- Padding: Reduced on mobile

---

## ACCESSIBILITY

- All interactive elements keyboard accessible
- ARIA labels on buttons and inputs
- Color contrast meets WCAG AA
- Focus indicators visible
- Screen reader announcements for dynamic content
- Reduced motion option (respects prefers-reduced-motion)

---

## LOCAL STORAGE KEYS

```typescript
const STORAGE_KEYS = {
  USER_NAME: 'b4babl_userName',
  USER_LANGUAGE: 'b4babl_userLanguage',
  SEEN_STORY: 'b4babl_seenStory',
  AUDIO_ENABLED: 'b4babl_audioEnabled',
  LAST_SESSION: 'b4babl_lastSession',
  THEME_PREFERENCE: 'b4babl_theme'  // For future dark mode
};
```

---

## TESTING CHECKLIST

- [ ] Language selection persists
- [ ] Skip button works on all screens
- [ ] Babel responses submit and appear
- [ ] Speech bubbles animate correctly
- [ ] Etched text animation smooth
- [ ] Audio playback functions
- [ ] Session connection works
- [ ] Mobile responsive
- [ ] GitHub Pages deployment works
- [ ] Google Auth (if implemented)

---

## FUTURE ENHANCEMENTS (V2)

- Dark mystical theme option (toggle)
- Voice input for Babel stories
- Real-time collaborative translation
- Session history with search
- Push notifications for new messages
- PWA offline support
- Custom language model integration

---

## FILES TO REFERENCE

**Existing Working Code:**
- `C:\Users\youwo\Desktop\1pyjRP54bTq-BZ_VAoJKQk6EfN-P4dsY1KxQIG0Ut603qyvu5PZm2f5QH\push\LiveChatV004r004.js` - Backend functions
- `C:\Users\youwo\Desktop\1pyjRP54bTq-BZ_VAoJKQk6EfN-P4dsY1KxQIG0Ut603qyvu5PZm2f5QH\push\AudioPlayerV004r004.html` - Audio player reference

**Style Reference:**
- `C:\Users\youwo\Desktop\BabelTheme_StyleA_Stone.html` - Approved visual design

---

## SUMMARY FOR CLAUDE CODE

Build a React + TypeScript web app called "b4bAbL" with:

1. **Ancient stone temple visual theme** (tan/brown/gold, weathered textures)
2. **5-screen onboarding flow**: Splash → SignIn → Babel Question → Story → Menu
3. **Interactive features**: Floating speech bubbles, etched text animations
4. **Translation functionality**: Connect to existing Google Apps Script backend
5. **GitHub Pages deployment**: Vite build with gh-pages

The app reunites humanity's scattered languages through the metaphor of rebuilding what Babel broke - not with pride, but with understanding.

---

*End of Specification*
*b4bAbL_ClaudeCode_Spec_V001R001.md*
