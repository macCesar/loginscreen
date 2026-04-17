const { createCleanup } = require('helpers/cleanup')
const { authenticate, isLoggedIn, login } = require('services/auth')
const Logger = require('services/logger')
const { openModal, open } = require('services/navigation')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')

let emailValid = false
const cleanupTracker = createCleanup()
const log = Logger.create('INDEX')

Logger.init({
  includeTimestamp: true
})
Logger.logSystemInfo('APP_INIT')
log.info('Controller loaded')

// ── Dismiss keyboard on background tap ──
function onWinClick(e) {
  if (e && e.source && (e.source.apiName === 'Ti.UI.TextField' || e.source.apiName === 'Ti.UI.TextArea')) {
    return
  }
  $.emailField.blur()
  $.passwordField.blur()
}

cleanupTracker.on($.win, 'click', onWinClick)

// ── Entrance animations ──
function runEntrance() {
  $.logoEntrance.open($.logoContainer, function () {
    $.cardEntrance.open($.card, function () {
      $.signupEntrance.open($.signupRow)
    })
  })
}

function applyGradients() {
  applyBgTopGradient($.bgTop)
  applyPrimaryButtonGradient($.loginBtn)
}

// ── Email validation ──
function validateEmail() {
  const value = $.emailField.value.trim()
  emailValid = isValidEmail(value)
  $.emailError.applyProperties({ text: 'Please enter a valid email address' })

  if (value.length === 0) {
    hideFieldError($.emailError)
    setUnderlineColor($.emailUnderline, colors.base)
  } else if (!emailValid) {
    showFieldError($.emailError)
    setUnderlineColor($.emailUnderline, colors.error)
  } else {
    hideFieldError($.emailError)
    setUnderlineColor($.emailUnderline, colors.success)
  }
}

// ── Focus handlers ──
function focusPassword() {
  $.passwordField.focus()
}

function resetLoginErrors() {
  const email = $.emailField.value.trim()

  $.emailError.applyProperties({ text: 'Please enter a valid email address' })
  hideFieldError($.emailError)
  setUnderlineColor($.emailUnderline, email.length > 0 && isValidEmail(email) ? colors.success : colors.base)

  $.passwordError.applyProperties({ text: 'Please enter your password' })
  hideFieldError($.passwordError)
  setUnderlineColor($.passwordUnderline, colors.base)
}

// ── Login ──
function doLogin() {
  log.info('Login button clicked')
  validateEmail()

  const password = $.passwordField.value
  const email = $.emailField.value.trim()

  if (!emailValid) {
    $.shakeAnim.shake($.emailGroup, 8)
    return
  }

  if (!password || password.length === 0) {
    $.passwordError.applyProperties({ text: 'Please enter your password' })
    showFieldError($.passwordError)
    setUnderlineColor($.passwordUnderline, colors.error)
    $.shakeAnim.shake($.passwordGroup, 8)
    return
  }

  const authResult = authenticate(email, password)

  if (!authResult.ok && authResult.code === 'USER_NOT_FOUND') {
    $.emailError.applyProperties({ text: 'No account found for this email' })
    showFieldError($.emailError)
    setUnderlineColor($.emailUnderline, colors.error)
    $.shakeAnim.shake($.emailGroup, 8)
    return
  }

  if (!authResult.ok) {
    $.passwordError.applyProperties({ text: 'Incorrect password for this email' })
    showFieldError($.passwordError)
    setUnderlineColor($.passwordUnderline, colors.error)
    $.shakeAnim.shake($.passwordGroup, 8)
    return
  }

  $.loginBtnLabel.applyProperties({ visible: false })
  $.loader.applyProperties({ visible: true })
  $.loader.show()

  cleanupTracker.timeout(function () {
    log.info('Login successful, saving state and navigating to home')
    $.loader.hide()
    $.loader.applyProperties({ visible: false })
    $.loginBtnLabel.applyProperties({ visible: true })

    // Save login state and navigate to home
    login(authResult.user.email)
    log.info('State saved, closing login window')
    $.win.close({ animated: true })

    // Wait for close animation then open home
    // Use setTimeout (not cleanupTracker) so this runs even after cleanup
    setTimeout(function () {
      log.info('Opening home window')
      open('home')
    }, 300)
  }, 500)
}

// ── Button press feedback ──
function openButton(e) {
  $.buttonPressAnim.open(e.source)
}

function closeButton(e) {
  $.buttonPressAnim.close(e.source)
}

// ── Navigation ──
function forgotTap() {
  openModal('forgotPassword')
}

function completeSignup(user) {
  login(user.email)
  $.win.close({ animated: true })

  setTimeout(function () {
    open('home')
  }, 300)
}

function signupTap() {
  const ctrl = openModal('signup', {
    onSignupComplete: completeSignup
  })
  const win = ctrl.getView()

  win.addEventListener('close', resetLoginErrors)
}

// ── Cleanup ──
function cleanup() {
  cleanupTracker.clear()
  $.destroy()
}

$.cleanup = cleanup

// ── Check if user is already logged in ──
log.info('Checking login status...')
if (isLoggedIn()) {
  log.info('User already logged in, opening home directly')
  // User already logged in, go directly to home
  // Don't open login window, just open home
  open('home')
} else {
  log.info('User not logged in, showing login screen')
  // Show login screen
  cleanupTracker.on($.win, 'open', runEntrance)
  applyGradients()
  $.win.open()
}
