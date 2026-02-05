const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor } = require('helpers/validation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { createCleanup } = require('helpers/cleanup')

let emailValid = false
const cleanupTracker = createCleanup()

// Set initial card transform (can't use createMatrix2D in TSS)
$.card.transform = Ti.UI.createMatrix2D({ scale: 0.9 })

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
	$.bgTop.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '100%', y: '100%' },
		colors: [
			{ color: Ti.UI.fetchSemanticColor('gradientTopStart'), offset: 0.0 },
			{ color: Ti.UI.fetchSemanticColor('gradientTopEnd'), offset: 1.0 }
		]
	}
	$.loginBtn.backgroundGradient = {
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

// ── Focus handlers ──
function focusPassword() {
	$.passwordField.focus()
}

// ── Login ──
function doLogin() {
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

	$.loginBtnLabel.visible = false
	$.loader.visible = true
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.visible = false
		$.loginBtnLabel.visible = true
		alert('Login successful!')
	}, 1500)
}

// ── Button press feedback ──
addButtonFeedback($.loginBtn, cleanupTracker)

// ── Navigation ──
function forgotTap() {
	const ctrl = Alloy.createController('forgotPassword')
	const win = ctrl.getView()
	cleanupTracker.on(win, 'close', function () {
		if (ctrl.cleanup) ctrl.cleanup()
	})
	win.open({ modal: true })
}

function signupTap() {
	const ctrl = Alloy.createController('signup')
	const win = ctrl.getView()
	cleanupTracker.on(win, 'close', function () {
		if (ctrl.cleanup) ctrl.cleanup()
	})
	win.open({ modal: true })
}

// ── Cleanup ──
function cleanup() {
	cleanupTracker.clear()
	$.destroy()
}

$.cleanup = cleanup
cleanupTracker.on($.win, 'open', runEntrance)
applyGradients()
$.win.open()
