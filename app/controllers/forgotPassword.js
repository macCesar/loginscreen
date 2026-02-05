const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')
const { shakeView, addButtonFeedback } = require('helpers/animation')
const { createCleanup } = require('helpers/cleanup')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')

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
	applyBgTopGradient($.bgTop)
	applyPrimaryButtonGradient($.sendBtn)
	applyPrimaryButtonGradient($.backToLoginBtn)
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

// ── Send reset link ──
function doSend() {
	validateEmail()

	if (!emailValid) {
		shakeView($.emailGroup)
		return
	}

	$.sendBtnLabel.applyProperties({ visible: false })
	$.loader.applyProperties({ visible: true })
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.applyProperties({ visible: false })
		$.sendBtnLabel.applyProperties({ visible: true })

		$.content.animate({ opacity: 0, duration: 300 }, function () {
			$.content.applyProperties({ visible: false })
			$.confirmation.applyProperties({ visible: true })
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
