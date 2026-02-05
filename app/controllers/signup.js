const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor } = require('helpers/validation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { createCleanup } = require('helpers/cleanup')

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
	$.bgTop.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '100%', y: '100%' },
		colors: [
			{ color: Ti.UI.fetchSemanticColor('gradientTopStart'), offset: 0.0 },
			{ color: Ti.UI.fetchSemanticColor('gradientTopEnd'), offset: 1.0 }
		]
	}
	$.signupBtn.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '50%' },
		endPoint: { x: '100%', y: '50%' },
		colors: [
			{ color: Ti.UI.fetchSemanticColor('primaryColor'), offset: 0.0 },
			{ color: Ti.UI.fetchSemanticColor('primaryDarkColor'), offset: 1.0 }
		]
	}
}

// ── Email validation ──
function validateEmail() {
	const value = $.emailField.value.trim()
	emailValid = isValidEmail(value)

	if (value.length === 0) {
		hideFieldError($.emailError)
		setUnderlineColor($.emailUnderline, '#0f3460')
	} else if (!emailValid) {
		showFieldError($.emailError)
		setUnderlineColor($.emailUnderline, '#e63946')
	} else {
		hideFieldError($.emailError)
		setUnderlineColor($.emailUnderline, '#4ecca3')
	}
}

// ── Password validation ──
function validatePassword() {
	const value = $.passwordField.value
	passwordValid = value.length >= 8

	if (value.length === 0) {
		hideFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, '#0f3460')
	} else if (!passwordValid) {
		showFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, '#e63946')
	} else {
		hideFieldError($.passwordError)
		setUnderlineColor($.passwordUnderline, '#4ecca3')
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
		setUnderlineColor($.confirmUnderline, '#0f3460')
	} else if (!confirmValid) {
		showFieldError($.confirmError)
		setUnderlineColor($.confirmUnderline, '#e63946')
	} else {
		hideFieldError($.confirmError)
		setUnderlineColor($.confirmUnderline, '#4ecca3')
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

	$.signupBtnLabel.visible = false
	$.loader.visible = true
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.visible = false
		$.signupBtnLabel.visible = true
		alert('Account created successfully!')
		$.win.close({ animated: true })
	}, 1500)
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
