const { createCleanup } = require('helpers/cleanup')
const { isLoggedIn, login } = require('services/auth')
const { info, debug, error } = require('services/logger')
const { openModal, open } = require('services/navigation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')

let emailValid = false
const cleanupTracker = createCleanup()

info('INDEX', 'Controller loaded')

// Set initial card transform (can't use createMatrix2D in TSS)
$.card.applyProperties({
  transform: Ti.UI.createMatrix2D({ scale: 0.9 })
})

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
  const logoAnim = Ti.UI.createAnimation({
    opacity: 1,
    top: '12%',
    duration: 600,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  })

  const cardAnim = Ti.UI.createAnimation({
    opacity: 1,
    transform: Ti.UI.createMatrix2D(),
    duration: 500,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  })

  const signupAnim = Ti.UI.createAnimation({
    opacity: 1,
    duration: 400,
    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
  })

  $.logoContainer.animate(logoAnim, function () {
    $.card.animate(cardAnim, function () {
      $.signupRow.animate(signupAnim)
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
  info('INDEX', 'Login button clicked')
  validateEmail()

  const password = $.passwordField.value

  if (!emailValid) {
    shakeView($.emailGroup)
    return
  }

  if (!password || password.length === 0) {
    shakeView($.passwordGroup)
    return
  }

  $.loginBtnLabel.applyProperties({ visible: false })
  $.loader.applyProperties({ visible: true })
  $.loader.show()

  cleanupTracker.timeout(function () {
    info('INDEX', 'Login successful, saving state and navigating to home')
    $.loader.hide()
    $.loader.applyProperties({ visible: false })
    $.loginBtnLabel.applyProperties({ visible: true })

    // Save login state and navigate to home
    login()
    info('INDEX', 'State saved, closing login window')
    $.win.close({ animated: true })

    // Wait for close animation then open home
    // Use setTimeout (not cleanupTracker) so this runs even after cleanup
    setTimeout(function () {
      info('INDEX', 'Opening home window')
      open('home')
    }, 300)
  }, 500)
}

// ── Button press feedback ──
addButtonFeedback($.loginBtn, cleanupTracker)

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
info('INDEX', 'Checking login status...')
if (isLoggedIn()) {
  info('INDEX', 'User already logged in, opening home directly')
  // User already logged in, go directly to home
  // Don't open login window, just open home
  open('home')
} else {
  info('INDEX', 'User not logged in, showing login screen')
  // Show login screen
  cleanupTracker.on($.win, 'open', runEntrance)
  applyGradients()
  $.win.open()
}
