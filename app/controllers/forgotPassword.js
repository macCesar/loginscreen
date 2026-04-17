const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')
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
	$.contentEntrance.open($.content)
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
		$.shakeAnim.shake($.emailGroup, 8)
		return
	}

	$.sendBtnLabel.applyProperties({ visible: false })
	$.loader.applyProperties({ visible: true })
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.applyProperties({ visible: false })
		$.sendBtnLabel.applyProperties({ visible: true })

		$.contentEntrance.close($.content, function () {
			$.content.applyProperties({ visible: false })
			$.confirmation.applyProperties({ visible: true })
			$.contentEntrance.open($.confirmation)
		})
	}, 1500)
}

// ── Button press feedback ──
function openButton(e) {
	$.buttonPressAnim.open(e.source)
}

function closeButton(e) {
	$.buttonPressAnim.close(e.source)
}

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
