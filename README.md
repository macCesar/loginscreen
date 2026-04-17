# Login Screen

Demo de autenticacion construido con Titanium SDK, Alloy MVC y PurgeTSS. La app incluye flujo de Login, Sign Up, Forgot Password y Home, con usuarios guardados localmente para probar formularios, validaciones y Password AutoFill en simulador.

## Estado Actual

- Titanium SDK: `13.2.0.GA`
- Framework: Alloy MVC
- Estilos: PurgeTSS + TSS generado
- Animaciones: modulo `purgetss.ui`
- Persistencia demo: `Ti.Filesystem.applicationDataDirectory/users.json`
- Sesion activa: `Ti.App.Properties`

Esta app no usa backend. Las credenciales se guardan en texto plano solo para facilitar pruebas locales de registro, login, recuperacion y AutoFill. No uses este esquema para produccion.

## Flujo Funcional

1. Al iniciar, `index.js` revisa si existe una sesion valida.
2. Login valida formato de email y autentica contra `users.json`.
3. Sign Up crea una cuenta local con nombre, email y password, guarda sesion y abre Home.
4. Forgot Password valida que el email exista en `users.json`.
5. Home muestra los datos publicos del usuario autenticado.
6. Logout limpia la sesion y regresa a Login.

El archivo local queda dentro del contenedor de datos de la app:

```text
applicationDataDirectory/users.json
```

Estructura esperada:

```json
{
  "version": 1,
  "users": [
    {
      "id": "1776458277751",
      "name": "Cesar Estrada",
      "email": "cesar@example.com",
      "password": "demo-password",
      "createdAt": "2026-04-17T20:37:57.751Z",
      "updatedAt": "2026-04-17T20:37:57.751Z"
    }
  ]
}
```

## Estructura

```text
app/
├── alloy.jmk                  # Ejecuta PurgeTSS antes de compilar Alloy
├── controllers/
│   ├── index.js               # Login
│   ├── signup.js              # Registro local
│   ├── forgotPassword.js      # Validacion de correo existente
│   └── home.js                # Usuario autenticado y logout
├── views/
│   ├── index.xml
│   ├── signup.xml
│   ├── forgotPassword.xml
│   └── home.xml
├── styles/
│   ├── app.tss                # Generado por PurgeTSS
│   ├── _app.tss               # Estilos persistentes manuales
│   └── *.tss                  # Archivos TSS por controller
├── lib/
│   ├── purgetss.ui.js         # Modulo UI/animacion de PurgeTSS
│   ├── helpers/
│   │   ├── cleanup.js
│   │   ├── gradients.js
│   │   └── validation.js
│   └── services/
│       ├── auth.js            # users.json + sesion
│       ├── logger.js
│       └── navigation.js
└── assets/
    └── semantic.colors.json

purgetss/
├── config.cjs                 # Tema, colores y clases personalizadas
└── styles/
    ├── utilities.tss          # Catalogo de utilidades PurgeTSS
    └── definitions.css        # IntelliSense/clases disponibles
```

## PurgeTSS

PurgeTSS es el pipeline principal de estilos. Las vistas XML usan clases utilitarias y clases de proyecto; PurgeTSS escanea las vistas/controladores y regenera `app/styles/app.tss` con solo las clases usadas.

El hook esta en `app/alloy.jmk`:

```js
task('pre:compile', function(event, logger) {
	require('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));
})
```

Regla practica:

- No editar `app/styles/app.tss` a mano.
- Definir clases del producto en `purgetss/config.cjs`.
- Usar `app/styles/_app.tss` solo para estilos persistentes que no deban generarse.
- Revisar al final de `app/styles/app.tss` que no aparezca `Unused or unsupported classes`.

## Clases Personalizadas

Las clases de proyecto viven en `purgetss/config.cjs` dentro de `theme`. Ejemplos actuales:

```js
'.login-card': {
	apply: 'w-10/12 h-auto vertical top-5/12 bg-app-card rounded-2xl opacity-0'
},
'.field': {
	DEFAULT: {
		color: 'textColor',
		font: { fontSize: 15 },
		height: 40,
		hintTextColor: 'hintTextColor',
		paddingLeft: 4,
		textColor: 'textColor',
		top: 4,
		width: 'Ti.UI.FILL'
	},
	android: {
		backgroundColor: 'transparent'
	}
}
```

El bloque `extend.colors.app` mapea nombres semanticos de PurgeTSS a colores dinamicos de Titanium:

```js
colors: {
	app: {
		background: 'backgroundColor',
		card: 'cardColor',
		error: 'errorColor',
		link: 'linkColor',
		muted: 'textMutedColor',
		success: 'successColor',
		text: 'textColor',
		underline: 'underlineColor'
	}
}
```

Eso permite clases como:

```text
bg-app
bg-app-card
text-app-text
text-app-muted
text-app-link
text-app-error
bg-app-underline
```

## Clases de Utilidad

Las vistas combinan clases personalizadas con utilidades PurgeTSS:

```xml
<View id="card" class="login-card">
  <View id="emailGroup" class="fieldGroup mx-5 mt-7">
    <TextField id="emailField" class="field keyboard-type-email autofill-type-username autocorrect-false return-key-type-next normal-case"/>
  </View>
</View>
```

Tipos de utilidades usadas en esta app:

- Layout: `vertical`, `horizontal`, `w-screen`, `h-auto`, `h-screen`
- Espaciado: `mt-5`, `mx-5`, `mb-10`, `top-1/4`, `top-(60)`
- Texto: `text-center`, `text-right`, `text-xs`, `text-base`, `text-(28)`
- Formulario: `keyboard-type-email`, `return-key-type-next`, `password-mask`
- AutoFill: `autofill-type-username`, `autofill-type-password`, `autofill-type-new-password`
- Estado visual: `opacity-0`, `hidden`, `touch-enabled-false`

Para clases arbitrarias se usa la sintaxis de PurgeTSS:

```text
text-(72)
top-(60)
bottom-(5%)
h-(14)
```

## Modulo de Animacion

La app usa `app/lib/purgetss.ui.js` mediante el tag Alloy `Animation`:

```xml
<Animation id="cardEntrance" module="purgetss.ui" class="opacity-to-100 zoom-in-90 duration-200 ease-out"/>
<Animation id="buttonPressAnim" module="purgetss.ui" class="close:opacity-100 duration-100 ease-out open:opacity-80"/>
<Animation id="shakeAnim" module="purgetss.ui" class="duration-75 ease-out"/>
```

Las animaciones se disparan desde controllers:

```js
function runEntrance() {
  $.logoEntrance.open($.logoContainer, function () {
    $.cardEntrance.open($.card, function () {
      $.signupEntrance.open($.signupRow)
    })
  })
}

function openButton(e) {
  $.buttonPressAnim.open(e.source)
}

function closeButton(e) {
  $.buttonPressAnim.close(e.source)
}
```

Para feedback de botones se usan eventos directos en XML:

```xml
<View id="loginBtn"
  class="primaryBtn mx-5"
  onTouchstart="openButton"
  onTouchend="closeButton"
  onTouchcancel="closeButton"
  onClick="doLogin">
  <Label class="primaryBtnLabel">Sign In</Label>
</View>
```

Con esto ya no existe `app/lib/helpers/animation.js`; el comportamiento se expresa con `purgetss.ui`, clases `open:*`/`close:*` y eventos de Alloy.

## Password AutoFill y Gestores de Contrasenas

Los formularios estan marcados para ayudar a iOS y Android a detectar campos de credenciales:

- Login email: `autofill-type-username`
- Login password: `autofill-type-password`
- Sign Up email: `autofill-type-username`
- Sign Up password/confirm: `autofill-type-new-password`

El objetivo esperado es:

1. En Sign Up, el gestor de contrasenas detecta el email como usuario.
2. El gestor ofrece generar una password segura.
3. Al terminar el registro, el gestor guarda la credencial como `usuario + password`.
4. En Login, al escribir el mismo usuario o enfocar password, el gestor sugiere rellenar esa credencial.

### Estado Actual Observado

- iOS puede mostrar sugerencias por heuristica al detectar `username/password`, pero no es deterministico.
- iOS no siempre muestra el prompt de guardar/actualizar aunque el formulario tenga `autofillType`.
- Android/Google Password Manager si puede mostrar el prompt de generar password segura.
- En Android se observo que el prompt puede dejar `Nombre de usuario` vacio. Si el usuario escribe manualmente un valor incorrecto, por ejemplo el nombre completo en vez del email, el gestor guarda la credencial con ese usuario incorrecto y luego Login no puede relacionarla con el correo real.
- La app guarda correctamente el usuario y password en `users.json`, pero eso no obliga al gestor del sistema a guardar o sugerir la credencial.

### Limitaciones Actuales

Los `autofillType` ayudan a clasificar campos, pero no fuerzan al sistema a guardar credenciales. El guardado automatico depende del gestor de contrasenas del sistema, sus heuristicas, el estado del dispositivo/simulador y, en iOS, la asociacion de dominio.

Actualmente la app no llama una API nativa explicita para guardar credenciales compartidas. En iOS, la API nativa para hacerlo es `SecAddSharedWebCredential(domain, account, password, callback)`. Titanium no expone esa llamada directamente en este proyecto; habria que implementarla con Hyperloop o con un modulo iOS nativo.

### iOS

La app declara Associated Domains en `tiapp.xml`:

```xml
<entitlements>
  <dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
      <string>webcredentials:codigomovil.mx</string>
    </array>
  </dict>
</entitlements>
```

El servidor tambien debe publicar `webcredentials` en `apple-app-site-association`. Para esta app, el dominio debe incluir el app id completo:

```json
{
  "webcredentials": {
    "apps": [
      "RU3D9TXPMR.mx.codigomovil.loginscreen"
    ]
  }
}
```

El archivo de servidor listo para subir esta en:

```text
server/apple-app-site-association
```

Si el archivo AASA no contiene `webcredentials` para `mx.codigomovil.loginscreen`, iOS puede guardar la contrasena por heuristica, pero no tiene una asociacion confiable para sugerirla automaticamente al volver a Login.

Para una prueba valida de Associated Domains no basta LiveView. La app debe instalarse de nuevo con el entitlement actualizado:

```bash
ti build -p ios -T simulator
```

Para forzar el guardado/actualizacion de credenciales en iOS, el siguiente paso tecnico seria agregar un wrapper nativo para `SecAddSharedWebCredential` y llamarlo despues de `createUser(...)`.

### Android

Android usa el gestor de contrasenas configurado en el dispositivo, por ejemplo Google Password Manager. El prompt puede aparecer aunque no exista backend real.

Comportamiento observado:

- El sistema puede sugerir una password segura en Sign Up.
- El campo `Nombre de usuario` del prompt puede aparecer vacio si el gestor no asocia el email capturado con el campo de username.
- Si el usuario llena ese campo con un dato que no es el email usado en la app, Android guardara la credencial bajo ese usuario y luego Login no recibira una sugerencia util.

Funcionamiento esperado para pruebas:

1. Escribir primero el correo en el campo Email de Sign Up.
2. Al aceptar una password segura, verificar que el prompt de Google tenga como `Nombre de usuario` el mismo correo.
3. Si el prompt deja el usuario vacio, escribir el correo, no el nombre completo.
4. Terminar Sign Up y entrar a Home.
5. Hacer Logout.
6. En Login, escribir el mismo correo y enfocar Password.

Si Android sigue dejando `Nombre de usuario` vacio, hay que investigar si Titanium necesita propiedades adicionales o si el gestor requiere otro orden de foco/campos para asociar `autofill-type-username` con `autofill-type-new-password`.

## Servicios

### Auth

`app/lib/services/auth.js` centraliza:

- `createUser(data)`
- `authenticate(email, password)`
- `userExists(email)`
- `login(email)`
- `logout()`
- `isLoggedIn()`
- `getCurrentUser()`
- `getUsersFilePath()`

La sesion activa se guarda con `Ti.App.Properties`, pero el login solo es valido si el usuario existe en `users.json`.

### Navigation

`app/lib/services/navigation.js` abre ventanas normales y modales, y llama `cleanup()` al cerrar:

```js
const { open, openModal } = require('services/navigation')

open('home')
openModal('signup')
```

### Cleanup

Cada controller expone `$.cleanup` y usa `helpers/cleanup` para listeners, timeouts e intervals:

```js
function cleanup() {
  cleanupTracker.clear()
  $.destroy()
}

$.cleanup = cleanup
```

## Comandos

```bash
# Regenerar estilos PurgeTSS
purgetss --debug

# Compilar Alloy sin correr app
alloy compile --config platform=ios
alloy compile --config platform=android

# Ejecutar en simulador iOS
ti build -p ios -T simulator

# Ejecutar en emulador Android
ti build -p android -T emulator
```

## Flujo de Prueba

1. Abrir Login.
2. Intentar entrar con una cuenta que no existe: debe rechazar.
3. Ir a Sign Up y registrar una cuenta.
4. Confirmar que Home muestra nombre, email e ID local.
5. Hacer Logout para regresar a Login.
6. Entrar con el mismo email/password.
7. Probar Forgot Password con un email existente y uno inexistente.
8. En iOS Simulator, probar si Password AutoFill ofrece guardar, actualizar o rellenar la credencial.

## Notas de Desarrollo

- `Resources/` y `build/` son salida generada.
- `app/styles/app.tss` es generado por PurgeTSS.
- `purgetss/styles/utilities.tss` tambien puede regenerarse cuando cambia `config.cjs`.
- No guardar passwords en texto plano fuera de esta demo.
- No editar `Resources/` directamente; cambiar `app/` y recompilar.

## TiTools

Este proyecto se trabaja con skills locales de Titanium, Alloy y PurgeTSS instalados por TiTools. Son la fuente de referencia para APIs, patrones Alloy y clases PurgeTSS.

```bash
npm install -g @titools/cli
titools install
```

## Licencia

Demo de referencia para flujos de autenticacion en Titanium Alloy.
