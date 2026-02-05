const { logout } = require('services/auth')
const { createCleanup } = require('helpers/cleanup')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const { addButtonFeedback } = require('helpers/animation')
const { info, debug, error } = require('services/logger')

const cleanupTracker = createCleanup()

info('HOME', 'Controller loaded')

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
	applyPrimaryButtonGradient($.logoutBtn)
}

// ── Logout ──
function doLogout() {
	info('HOME', 'Logout button clicked')

	// Clear login state
	logout()
	info('HOME', 'Login state cleared, closing home window')

	// Listen for window close before opening login
	$.win.addEventListener('close', function onWindowClose() {
		$.win.removeEventListener('close', onWindowClose)
		info('HOME', 'Home window closed, opening login screen')
		const { open } = require('services/navigation')
		open('index')
	})

	// Close home window
	$.win.close({ animated: true })
}

// ── Button press feedback ──
addButtonFeedback($.logoutBtn, cleanupTracker)

// ── Cleanup ──
function cleanup() {
	cleanupTracker.clear()
	$.destroy()
}

$.cleanup = cleanup
cleanupTracker.on($.win, 'open', runEntrance)
info('HOME', 'Setting up window open listener')
applyGradients()
info('HOME', 'Gradients applied, window will open')
