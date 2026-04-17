const { createCleanup } = require('helpers/cleanup')
const { isLoggedIn, login } = require('services/auth')
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

// ── Login ──
function doLogin() {
  log.info('Login button clicked')
  validateEmail()

  const password = $.passwordField.value

  if (!emailValid) {
    $.shakeAnim.shake($.emailGroup, 8)
    return
  }

  if (!password || password.length === 0) {
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
    login()
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

function signupTap() {
  openModal('signup')
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
