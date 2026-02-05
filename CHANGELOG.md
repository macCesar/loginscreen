# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-05

### Added

- **Home screen** with welcome message and logout functionality
- **Authentication service** (`lib/services/auth.js`) for session persistence using Ti.App.Properties
- **Navigation service** (`lib/services/navigation.js`) with automatic cleanup on window close
- **Logger service** (`lib/services/logger.js`) with environment-aware logging
- **Gradient helper** (`lib/helpers/gradients.js`) for consistent styling across screens
- Dynamic semantic color fetching in validation helper
- Session persistence - app remembers login state across restarts
- Smart logging that auto-detects development vs production environment
- Auto-navigation to home screen when user is already logged in

### Changed

- **Refactored all controllers** to use `applyProperties()` instead of direct assignment for better performance
- **Login controller** - Added authentication check at startup, reduced API simulation delay to 500ms
- **Signup controller** - Reduced API simulation delay to 500ms, added session persistence
- **Forgot password controller** - Updated to use applyProperties pattern
- **Background styling** - Changed from percentage heights to `Ti.UI.FILL` for full screen coverage
- **All views** - Removed redundant `bgBottom` layer, gradient now covers full screen

### Fixed

- **Timeout bug** - Window navigation after login now works correctly (use `setTimeout` instead of `cleanupTracker.timeout`)
- **Blank screen issue** - Home screen now properly opens after logout and re-login
- **Background gradient** - Now covers entire screen instead of stopping at midpoint

### Removed

- Temporary screenshot files used for debugging

### Documentation

- Added comprehensive README with:
  - Feature list and tech stack
  - Project structure
  - Authentication flow diagram
  - Design system documentation
  - Key patterns with code examples
  - "Built with Claude Code + TiTools" section

---

## Development Notes

### Built With

This project was built entirely using **Claude Code** with specialized Titanium SDK skills from **TiTools**.

- **ti-expert** - Architecture and best practices
- **ti-guides** - SDK fundamentals
- **ti-ui** - Layouts and animations
- **alloy-guides** - MVC framework
- **alloy-howtos** - CLI commands
- **purgetss** - Utility-first styling
- **ti-howtos** - Native features

### Semantic Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **chore**: Maintenance task
- **docs**: Documentation changes
