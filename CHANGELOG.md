# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planning

- Plan de migracion a PurgeTSS:
  - Inicializar pipeline PurgeTSS con `purgetss/config.cjs`, `purgetss/styles/utilities.tss` y `purgetss/styles/definitions.css`.
  - Ejecutar PurgeTSS automaticamente desde `app/alloy.jmk` antes de compilar Alloy.
  - Migrar vistas XML a clases utilitarias y clases de producto definidas en `config.cjs`.
  - Reemplazar animaciones manuales por el modulo `purgetss.ui`.
  - Eliminar la dependencia de `app/lib/helpers/animation.js` cuando sus transiciones puedan expresarse con `Animation`, clases `open:*`/`close:*` y eventos Alloy.
  - Mantener estilos persistentes fuera de `app/styles/app.tss`, porque ese archivo es generado.
  - Validar `purgetss --debug`, `alloy compile --config platform=ios` y `alloy compile --config platform=android`.

### Added

- PurgeTSS como pipeline principal de estilos.
- Hook `pre:compile` en `app/alloy.jmk` para regenerar clases PurgeTSS antes de Alloy.
- Modulo `app/lib/purgetss.ui.js` para animaciones declarativas.
- Clases personalizadas en `purgetss/config.cjs` para estructura de pantallas, formularios, botones, textos, fondo y tarjetas.
- Mapeo semantico de colores `app.*` en PurgeTSS:
  - `bg-app`
  - `bg-app-card`
  - `text-app-text`
  - `text-app-muted`
  - `text-app-link`
  - `text-app-error`
  - `bg-app-underline`
- Flujo demo de usuarios locales en `applicationDataDirectory/users.json`.
- Validacion real de Login contra usuarios locales.
- Validacion de Forgot Password contra correos existentes en `users.json`.
- Home con datos del usuario autenticado: nombre, email e ID local.

### Changed

- Migradas las vistas `index`, `signup`, `forgotPassword` y `home` a clases PurgeTSS.
- Reemplazado feedback de botones por eventos XML `onTouchstart`, `onTouchend` y `onTouchcancel` usando `purgetss.ui`.
- Reemplazadas animaciones de entrada por tags Alloy `<Animation module="purgetss.ui">`.
- Login ya no permite entrar con credenciales arbitrarias.
- Sign Up guarda la cuenta local, crea sesion y abre Home para que iOS detecte un registro exitoso.
- Forgot Password ya no simula envio para cualquier correo; primero valida existencia local.
- Campos de password configurados con clases de AutoFill:
  - `autofill-type-username`
  - `autofill-type-password`
  - `autofill-type-new-password`
- Associated Domains configurado en `tiapp.xml` con `webcredentials:codigomovil.mx` para habilitar Password AutoFill basado en dominio.

### Removed

- `app/lib/helpers/animation.js`; el comportamiento se migro a `purgetss.ui` y eventos por controller.

### Documentation

- Reescrito `README.md` para documentar:
  - Funcionamiento general de la app.
  - Flujo local con `users.json`.
  - Pipeline PurgeTSS.
  - Uso de `config.cjs`.
  - Clases utilitarias y clases personalizadas.
  - Modulo de animacion `purgetss.ui`.
  - Password AutoFill, Llavero de iOS, Google Password Manager y limitaciones observadas.
  - Comandos de compilacion y prueba.

### Notes

- Passwords en `users.json` se guardan en texto plano solo para debug local y pruebas de AutoFill. No es una implementacion segura para produccion.
- iOS Password AutoFill puede no mostrar una sugerencia directa aunque los campos tengan `autofillType`; el dominio debe publicar `apple-app-site-association` con `webcredentials` para `mx.codigomovil.loginscreen`.
- La app todavia no llama una API nativa explicita para guardar credenciales compartidas. En iOS, el siguiente paso seria exponer `SecAddSharedWebCredential` mediante Hyperloop o un modulo nativo.
- En Android/Google Password Manager, el prompt de password segura puede dejar vacio `Nombre de usuario`; durante pruebas debe usarse el mismo correo capturado por Sign Up, no el nombre completo.

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
