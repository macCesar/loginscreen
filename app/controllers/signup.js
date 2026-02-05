const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { createCleanup } = require('helpers/cleanup')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const { openModal } = require('services/navigation')
const { login } = require('services/auth')

let emailValid = false
let passwordValid = false
let confirmValid = false
const cleanupTracker = createCleanup()

// ── Dismiss keyboard on background tap ──
function onWinClick(e) {
	if (e && e.source && (e.source.apiName === 'Ti.UI.TextField' || e.source.apiName === 'Ti.UI.TextArea')) {
		return
	}
	$.nameField.blur()
	$.emailField.blur()
	$.passwordField.blur()
	$.confirmField.blur()
}

cleanupTracker.on($.win, 'click', onWinClick)

// ── Entrance animation ──
function runEntrance() {
	$.content.animate({
		opacity: 1,
		duration: 500,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	})
}

function applyGradients() {
	applyBgTopGradient($.bgTop)
	applyPrimaryButtonGradient($.signupBtn)
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

// ── Password validation ──
function validatePassword() {
	const value = $.passwordField.value
	passwordValid = value.length >= 8

	if (value.length === 0) {
		hideFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, colors.base)
	} else if (!passwordValid) {
		showFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, colors.error)
	} else {
		hideFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, colors.success)
	}

	if ($.confirmField.value.length > 0) {
		validateConfirm()
	}
}

// ── Confirm password validation ──
function validateConfirm() {
	const value = $.confirmField.value
	confirmValid = value.length > 0 && value === $.passwordField.value

	if (value.length === 0) {
		hideFieldError($.confirmError)
		setUnderlineColor($.confirmUnderline, colors.base)
	} else if (!confirmValid) {
		showFieldError($.confirmError)
		setUnderlineColor($.confirmUnderline, colors.error)
	} else {
		hideFieldError($.confirmError)
		setUnderlineColor($.confirmUnderline, colors.success)
	}
}

// ── Focus handlers ──
function focusEmail() {
	$.emailField.focus()
}

function focusPassword() {
	$.passwordField.focus()
}

function focusConfirm() {
	$.confirmField.focus()
}

// ── Sign up ──
function doSignup() {
	validateEmail()
	validatePassword()
	validateConfirm()

	const name = $.nameField.value ? $.nameField.value.trim() : ''

	if (name.length === 0) {
		shakeView($.nameGroup)
		return
	}

	if (!emailValid) {
		shakeView($.emailGroup)
		return
	}

	if (!passwordValid) {
		shakeView($.passwordGroup)
		return
	}

	if (!confirmValid) {
		shakeView($.confirmGroup)
		return
	}

	$.signupBtnLabel.applyProperties({ visible: false })
	$.loader.applyProperties({ visible: true })
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.applyProperties({ visible: false })
		$.signupBtnLabel.applyProperties({ visible: true })

		// Save login state
		login()

		// Close signup modal and navigate to home
		$.win.close({ animated: true })

		// Wait for modal close animation then open home
		// Use setTimeout (not cleanupTracker) so this runs even after cleanup
		setTimeout(function () {
			const { open } = require('services/navigation')
			open('home')
		}, 300)
	}, 500)
}

// ── Button press feedback ──
addButtonFeedback($.signupBtn, cleanupTracker)

// ── Navigation ──
function goBack() {
	$.win.close({ animated: true })
}

// ── Cleanup ──
function cleanup() {
	cleanupTracker.clear()
	$.destroy()
}

$.cleanup = cleanup
cleanupTracker.on($.win, 'open', runEntrance)
applyGradients()
