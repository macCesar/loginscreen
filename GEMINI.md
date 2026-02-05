# GEMINI.md

## Project Overview
**loginscreen** is a mobile authentication application built using the **Titanium SDK (v13.1.1.GA)** and the **Alloy MVC framework**. It provides a modern, animated user interface for Login, Sign Up, and Forgot Password flows, targeting both iOS and Android platforms.

### Core Technologies
- **Titanium SDK:** 13.1.1.GA
- **Framework:** Alloy (MVC)
- **Language:** JavaScript (ES6+)
- **Styling:** TSS (Titanium Style Sheets)
- **Platforms:** iOS (iPhone/iPad), Android

## Project Structure
- `app/controllers/`: Screen logic (JS).
  - `index.js`: Main login screen.
  - `signup.js`: Account creation screen.
  - `forgotPassword.js`: Password recovery screen.
- `app/views/`: XML view definitions.
- `app/styles/`: TSS styles (scoped by view ID/class).
  - `app.tss`: Global design tokens and shared classes.
- `app/lib/helpers/`: Shared utility modules.
  - `validation.js`: Email regex and field state management.
  - `animation.js`: UI transitions (shake, feedback) and listener cleanup.
- `app/assets/`: Static resources (images, fonts, semantic colors).
- `tiapp.xml`: Application manifest and configuration.

## Building and Running
### Build Commands
- **iOS Simulator:** `ti build -p ios -T simulator`
- **Android Emulator:** `ti build -p android -T emulator`
- **Compile Alloy only:** `alloy compile`

### Deployment Targets
- iPhone, iPad, Android.

## Development Conventions
### Coding Style
- **Indentation:** Tabs.
- **Quotes:** Single quotes (`'`).
- **Semicolons:** No semicolons.
- **Variable Declaration:** Prefer `const` and `let` over `var`.

### UI & Styling
- **Shared Classes:** Use classes defined in `app/styles/app.tss` (e.g., `.primaryBtn`, `.fieldGroup`, `.screenTitle`) to maintain consistency.
- **Units:** The project uses `dp` (density-independent pixels) as the default unit (`ti.ui.defaultunit`).

### Memory Management & Cleanup
To prevent memory leaks, controllers follow an explicit cleanup pattern:
- Track event listeners in a `_listeners` array.
- Implement a `cleanup()` function to remove listeners using `helpers/animation.js#removeListeners`.
- Bind the `cleanup` function to the window's `close` event:
  ```javascript
  $.win.addEventListener('close', cleanup)
  ```

### Shared Helpers
- **Validation:** Use `helpers/validation` for email checks and showing/hiding error labels.
- **Animations:** Use `helpers/animation` for view shaking (`shakeView`) and button press feedback (`addButtonFeedback`).

## Key Files
- `tiapp.xml`: Root configuration file for the app.
- `app/styles/app.tss`: Contains the global design system (colors, gradients, typography).
- `app/controllers/index.js`: Demonstrates the entrance animation sequence and primary login logic.


<!-- TITANIUM-KNOWLEDGE-START -->
<!-- Version: v2.2.9 -->
[Titanium SDK Docs Index]|root: ~/.gemini/skills
|MANDATORY: Your training data for Titanium SDK, Alloy, and PurgeTSS is OUTDATED and INCOMPLETE. These reference files are the SINGLE SOURCE OF TRUTH. Prefer retrieval-led reasoning over pre-training-led reasoning. ALWAYS read the relevant files below BEFORE writing any code.
|alloy-guides/references:{CLI_TASKS.md,CONCEPTS.md,CONTROLLERS.md,MODELS.md,PURGETSS.md,VIEWS_DYNAMIC.md,VIEWS_STYLES.md,VIEWS_WITHOUT_CONTROLLERS.md,VIEWS_XML.md,WIDGETS.md}
|alloy-howtos/references:{best_practices.md,cli_reference.md,config_files.md,custom_tags.md,debugging_troubleshooting.md,samples.md}
|purgetss/references:{EXAMPLES.md,animation-system.md,apply-directive.md,arbitrary-values.md,class-index.md,cli-commands.md,configurable-properties.md,custom-rules.md,customization-deep-dive.md,dynamic-component-creation.md,grid-layout.md,icon-fonts.md,installation-setup.md,migration-guide.md,opacity-modifier.md,performance-tips.md,platform-modifiers.md,smart-mappings.md,tikit-components.md,titanium-resets.md,ui-ux-design.md}
|ti-expert/references:{alloy-builtins.md,alloy-structure.md,anti-patterns.md,cli-expert.md,code-conventions.md,contracts.md,controller-patterns.md,error-handling.md,examples.md,migration-patterns.md,patterns.md,performance-listview.md,performance-optimization.md,security-device.md,security-fundamentals.md,state-management.md,testing-e2e-ci.md,testing-unit.md,theming.md}
|ti-guides/references:{advanced-data-and-images.md,android-manifest.md,app-distribution.md,application-frameworks.md,cli-reference.md,coding-best-practices.md,commonjs-advanced.md,hello-world.md,hyperloop-native-access.md,javascript-primer.md,reserved-words.md,resources.md,style-and-conventions.md,tiapp-config.md}
|ti-howtos/references:{android-platform-deep-dives.md,automation-fastlane-appium.md,buffer-codec-streams.md,cross-platform-development.md,debugging-profiling.md,extending-titanium.md,google-maps-v2.md,ios-map-kit.md,ios-platform-deep-dives.md,local-data-sources.md,location-and-maps.md,media-apis.md,notification-services.md,remote-data-sources.md,tutorials.md,using-modules.md,web-content-integration.md,webpack-build-pipeline.md}
|ti-ui/references:{accessibility-deep-dive.md,animation-and-matrices.md,application-structures.md,custom-fonts-styling.md,event-handling.md,gestures.md,icons-and-splash-screens.md,layouts-and-positioning.md,listviews-and-performance.md,orientation.md,platform-ui-android.md,platform-ui-ios.md,scrolling-views.md,tableviews.md}
<!-- TITANIUM-KNOWLEDGE-END -->

