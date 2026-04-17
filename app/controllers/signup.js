const { isValidEmail, showFieldError, hideFieldError, setUnderlineColor, colors } = require('helpers/validation')
const { createCleanup } = require('helpers/cleanup')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const { createUser } = require('services/auth')

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
	$.contentEntrance.open($.content)
}

function applyGradients() {
	applyBgTopGradient($.bgTop)
	applyPrimaryButtonGradient($.signupBtn)
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
		$.shakeAnim.shake($.nameGroup, 8)
		return
	}

	if (!emailValid) {
		$.shakeAnim.shake($.emailGroup, 8)
		return
	}

	if (!passwordValid) {
		$.shakeAnim.shake($.passwordGroup, 8)
		return
	}

	if (!confirmValid) {
		$.shakeAnim.shake($.confirmGroup, 8)
		return
	}

	const createResult = createUser({
		name: name,
		email: $.emailField.value,
		password: $.passwordField.value
	})

	if (!createResult.ok && createResult.code === 'USER_EXISTS') {
		$.emailError.applyProperties({ text: 'This email is already registered' })
		showFieldError($.emailError)
		setUnderlineColor($.emailUnderline, colors.error)
		$.shakeAnim.shake($.emailGroup, 8)
		return
	}

	$.signupBtnLabel.applyProperties({ visible: false })
	$.loader.applyProperties({ visible: true })
	$.loader.show()

	cleanupTracker.timeout(function () {
		$.loader.hide()
		$.loader.applyProperties({ visible: false })
		$.signupBtnLabel.applyProperties({ visible: true })

		const dialog = Ti.UI.createAlertDialog({
			buttonNames: ['Sign In'],
			message: 'Your account was saved locally. Sign in with the email and password you just created.',
			title: 'Account Created'
		})

		dialog.addEventListener('click', function () {
			$.win.close({ animated: true })
		})

		dialog.show()
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
