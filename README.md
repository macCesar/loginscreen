# Login Screen - Titanium Authentication Demo

A complete authentication flow demo built with **Titanium SDK 13.1.1.GA** and **Alloy MVC framework**. This project demonstrates best practices for implementing login, signup, and password reset flows with session persistence.

## Features

- **Login Screen** - Email validation with real-time feedback
- **Sign Up** - Full registration with name, email, password confirmation
- **Forgot Password** - Password reset flow with email input
- **Session Persistence** - Uses `Ti.App.Properties` to remember login state
- **Home Screen** - Post-login destination with logout functionality
- **Beautiful UI** - Gradient backgrounds, smooth animations, modern design
- **Responsive Design** - Works on iPhone, iPad, and Android
- **Smart Logging** - Auto-detects environment (development vs production)

## Tech Stack

- **Framework**: Titanium SDK 13.1.1.GA with Alloy MVC
- **Language**: JavaScript (ES6+)
- **Styling**: TSS (Titanium Style Sheets)
- **Storage**: Ti.App.Properties for session persistence

## Built with

This project was built entirely using **Claude Code** (Anthropic's AI coding assistant) with specialized Titanium SDK skills from **TiTools**.

[![TiTools](https://img.shields.io/badge/TiTools-Titanium%20CLI%20for%20AI-blue)](https://github.com/macCesar/titools)

### What is TiTools?

**TiTools** is a CLI that installs Titanium SDK skills and a knowledge index for AI coding assistants. One command installs 7 skills, a research agent, and 100+ reference files for Titanium SDK, Alloy MVC, and PurgeTSS.

Without TiTools, assistants rely on general training data. That data can be outdated or too generic for Titanium work. With TiTools, the assistant can look up Alloy architecture, memory cleanup patterns, PurgeTSS utility classes, and platform-specific APIs.

Vercel's AGENTS.md evaluation reports a **100% pass rate** for the knowledge index approach, compared to 53-79% using skills alone.

### Skills Used

- **ti-expert** - Architecture, controller patterns, and best practices
- **ti-guides** - SDK fundamentals and configuration
- **ti-ui** - Layouts, animations, and platform-specific UI
- **alloy-guides** - MVC framework, models, and views
- **alloy-howtos** - CLI commands and debugging
- **purgetss** - Utility-first styling framework
- **ti-howtos** - Native feature integration

### Get TiTools

```bash
npm install -g @titools/cli
titools install
```

## Project Structure

```
app/
├── controllers/          # Screen logic
│   ├── index.js         # Login screen
│   ├── signup.js        # Sign up screen
│   ├── forgotPassword.js # Password reset
│   └── home.js          # Post-login home
├── views/               # XML view definitions
├── styles/              # TSS styling
│   └── app.tss          # Global design system
├── lib/
│   ├── helpers/         # Shared utilities
│   │   ├── validation.js    # Email validation, field errors
│   │   ├── animation.js     # Animations, feedback
│   │   └── gradients.js     # Gradient definitions
│   └── services/        # Business logic
│       ├── navigation.js    # Centralized navigation
│       ├── auth.js          # Session management
│       └── logger.js        # Smart logging service
└── assets/              # Images, fonts, colors
```

## Build & Run

```bash
# iOS Simulator
ti build -p ios -T simulator

# Android Emulator
ti build -p android -T emulator

# Build only (no run)
alloy compile
```

## Authentication Flow

```
┌─────────────┐
│   Launch    │
│     App     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Is Logged In?   │
└────┬────────┬───┘
     │ YES    │ NO
     ▼        ▼
┌───────┐  ┌──────────┐
│ Home  │  │  Login   │
└───────┘  └────┬─────┘
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
┌─────────┐ ┌───────┐ ┌──────────┐
│ Sign Up │ │Login  │ │Forgot PW │
└────┬────┘ └───┬───┘ └────┬─────┘
     │          │          │
     └──────────┴──────────┘
                │
                ▼
           ┌─────────┐
           │  Home   │
           └────┬────┘
                │
                ▼
           ┌──────────┐
           │ Logout   │
           └────┬─────┘
                │
                ▼
           ┌──────────┐
           │  Login   │
           └──────────┘
```

## Design System

**Colors (from `semantic.colors.json`):**
- `bg-dark`: `#1a1a2e` - Main background
- `bg-card`: `#16213e` - Card backgrounds
- `bg-accent`: `#0f3460` - Accent elements
- `primary`: `#e94560` - Primary buttons
- `primary-dark`: `#c81d4e` - Button hover/active
- `text-main`: `#ffffff` - Primary text
- `text-muted`: `#8d99ae` - Secondary text
- `error`: `#e63946` - Error states
- `success`: `#4ecca3` - Success states

**Shared Classes (app.tss):**
- `.bgTop` / `.bgBottom` - Background gradient layers
- `.fieldGroup` / `.field` / `.fieldLabel` - Form inputs
- `.primaryBtn` / `.primaryBtnLabel` - Action buttons
- `.screenTitle` / `.screenSubtitle` - Typography

## Key Patterns

### 1. Navigation Service
Centralized window management with automatic cleanup:
```javascript
const { open, openModal } = require('services/navigation')

// Open as full-screen window
open('home')

// Open as modal
openModal('signup')
```

### 2. Authentication Service
Simple session persistence:
```javascript
const { isLoggedIn, login, logout } = require('services/auth')

if (isLoggedIn()) {
  open('home')
}

login()   // Save session
logout()  // Clear session
```

### 3. Smart Logger
Auto-detects environment:
```javascript
const { info, error } = require('services/logger')

info('TAG', 'This only shows in dev/test')
error('TAG', 'This always shows (even in production)')
```

### 4. applyProperties Pattern
Batch UI updates to minimize bridge crossings:
```javascript
// Good - Single bridge crossing
$.label.applyProperties({
  text: 'Hello',
  color: '#fff',
  font: { fontSize: 16 }
})
```

## Memory Management

All controllers implement proper cleanup:
```javascript
function cleanup() {
  cleanupTracker.clear() // Removes listeners, timeouts, intervals
  $.destroy()            // Cleanup Alloy bindings
}

$.cleanup = cleanup
```

The navigation service automatically calls `cleanup()` when windows close.

## License

This is a demo project. Feel free to use it as a reference for your own authentication flows.

## Stay Connected

For the latest information, please find us on Twitter: [Titanium SDK](https://twitter.com/titaniumsdk) and [TiDev](https://twitter.com/tidevio).

Join our growing Slack community by visiting https://slack.tidev.io

## Legal

Titanium is a registered trademark of TiDev Inc. All Titanium trademark and patent rights were transferred and assigned to TiDev Inc. on 4/7/2022. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at https://tidev.io/legal.
