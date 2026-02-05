const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor } = require('helpers/validation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { createCleanup } = require('helpers/cleanup')

let emailValid = false
const cleanupTracker = createCleanup()

// ── Dismiss keyboard on background tap ──
function onWinClick(e) {
	if (e && e.source && (e.source.apiName === 'Ti.UI.TextField' || e.source.apiName === 'Ti.UI.TextArea')) {
		return
	}
	$.emailField.blur()
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
	$.sendBtn.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '50%' },
		endPoint: { x: '100%', y: '50%' },
		colors: [
			{ color: Ti.UI.fetchSemanticColor('primaryColor'), offset: 0.0 },
			{ color: Ti.UI.fetchSemanticColor('primaryDarkColor'), offset: 1.0 }
		]
	}
	$.backToLoginBtn.backgroundGradient = {
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

// ── Send reset link ──
function doSend() {
	validateEmail()

	if (!emailValid) {
		shakeView($.emailGroup)
		return
	}

	$.sendBtnLabel.visible = false
	$.loader.visible = true
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.visible = false
		$.sendBtnLabel.visible = true

		$.content.animate({ opacity: 0, duration: 300 }, function () {
			$.content.visible = false
			$.confirmation.visible = true
			$.confirmation.animate({
				opacity: 1,
				duration: 500,
				curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
			})
		})
	}, 1500)
}

// ── Button press feedback ──
addButtonFeedback($.sendBtn, cleanupTracker)

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
