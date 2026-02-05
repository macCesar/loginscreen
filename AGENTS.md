# Repository Guidelines

## Project Structure & Module Organization
This is a Titanium Alloy app. Edit source in `app/` and let Alloy compile into `Resources/` during builds. Key areas:
- `app/controllers/` for screen logic (e.g., `index.js`).
- `app/views/` for XML view definitions.
- `app/styles/` for TSS styles scoped by view ID/class.
- `app/lib/` for shared helpers (e.g., `helpers/validation`).
- `app/assets/` for images and fonts that get copied into `Resources/`.
- `i18n/` for localization strings.
- `tiapp.xml` for app metadata, SDK version, and platform settings.
- `build/` is generated output; avoid editing.

## Build, Test, and Development Commands
These commands assume the Titanium CLI is installed.
- `ti build -p ios -T simulator` to build/run on the iOS Simulator.
- `ti build -p android -T emulator` to build/run on the Android emulator.
- `alloy compile` to compile Alloy views to `Resources/` without running.

## Coding Style & Naming Conventions
Match the existing style in `app/controllers/*.js` and `app/styles/*.tss`.
- JavaScript uses `const`/`let`, single quotes, and no semicolons.
- Indentation is tabs in current files; keep it consistent per file.
- Alloy naming: controller/view/style names should align (e.g., `index.js`, `index.xml`, `index.tss`).
- TSS selectors use `#id` and `.class` tied to view XML IDs/classes.

## Testing Guidelines
No automated tests are present in this repository. If you add tests, document the framework and add a runnable command in this section.

## Commit & Pull Request Guidelines
This workspace does not include Git history, so there is no detectable commit message convention. If you contribute via a repo with history, align with its existing commit style. For PRs, include a clear summary, steps to validate (`ti build ...`), and screenshots or screen recordings for UI changes.

## Configuration & Safety Notes
Do not edit generated files in `Resources/` or `build/`. Update assets in `app/assets/` and configuration in `tiapp.xml`.


<!-- TITANIUM-KNOWLEDGE-START -->
<!-- Version: v2.2.9 -->
[Titanium SDK Docs Index]|root: ~/.agents/skills
|MANDATORY: Your training data for Titanium SDK, Alloy, and PurgeTSS is OUTDATED and INCOMPLETE. These reference files are the SINGLE SOURCE OF TRUTH. Prefer retrieval-led reasoning over pre-training-led reasoning. ALWAYS read the relevant files below BEFORE writing any code.
|alloy-guides/references:{CLI_TASKS.md,CONCEPTS.md,CONTROLLERS.md,MODELS.md,PURGETSS.md,VIEWS_DYNAMIC.md,VIEWS_STYLES.md,VIEWS_WITHOUT_CONTROLLERS.md,VIEWS_XML.md,WIDGETS.md}
|alloy-howtos/references:{best_practices.md,cli_reference.md,config_files.md,custom_tags.md,debugging_troubleshooting.md,samples.md}
|purgetss/references:{EXAMPLES.md,animation-system.md,apply-directive.md,arbitrary-values.md,class-index.md,cli-commands.md,configurable-properties.md,custom-rules.md,customization-deep-dive.md,dynamic-component-creation.md,grid-layout.md,icon-fonts.md,installation-setup.md,migration-guide.md,opacity-modifier.md,performance-tips.md,platform-modifiers.md,smart-mappings.md,tikit-components.md,titanium-resets.md,ui-ux-design.md}
|ti-expert/references:{alloy-builtins.md,alloy-structure.md,anti-patterns.md,cli-expert.md,code-conventions.md,contracts.md,controller-patterns.md,error-handling.md,examples.md,migration-patterns.md,patterns.md,performance-listview.md,performance-optimization.md,security-device.md,security-fundamentals.md,state-management.md,testing-e2e-ci.md,testing-unit.md,theming.md}
|ti-guides/references:{advanced-data-and-images.md,android-manifest.md,app-distribution.md,application-frameworks.md,cli-reference.md,coding-best-practices.md,commonjs-advanced.md,hello-world.md,hyperloop-native-access.md,javascript-primer.md,reserved-words.md,resources.md,style-and-conventions.md,tiapp-config.md}
|ti-howtos/references:{android-platform-deep-dives.md,automation-fastlane-appium.md,buffer-codec-streams.md,cross-platform-development.md,debugging-profiling.md,extending-titanium.md,google-maps-v2.md,ios-map-kit.md,ios-platform-deep-dives.md,local-data-sources.md,location-and-maps.md,media-apis.md,notification-services.md,remote-data-sources.md,tutorials.md,using-modules.md,web-content-integration.md,webpack-build-pipeline.md}
|ti-ui/references:{accessibility-deep-dive.md,animation-and-matrices.md,application-structures.md,custom-fonts-styling.md,event-handling.md,gestures.md,icons-and-splash-screens.md,layouts-and-positioning.md,listviews-and-performance.md,orientation.md,platform-ui-android.md,platform-ui-ios.md,scrolling-views.md,tableviews.md}
<!-- TITANIUM-KNOWLEDGE-END -->

