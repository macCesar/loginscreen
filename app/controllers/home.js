const { logout } = require('services/auth')
const { createCleanup } = require('helpers/cleanup')
const { applyBgTopGradient, applyPrimaryButtonGradient } = require('helpers/gradients')
const Logger = require('services/logger')

const cleanupTracker = createCleanup()
const log = Logger.create('HOME')

log.info('Controller loaded')

// ── Entrance animation ──
function runEntrance() {
	$.contentEntrance.open($.content)
}

function applyGradients() {
	applyBgTopGradient($.bgTop)
	applyPrimaryButtonGradient($.logoutBtn)
}

// ── Logout ──
function doLogout() {
	log.info('Logout button clicked')

	// Clear login state
	logout()
	log.info('Login state cleared, closing home window')

	// Listen for window close before opening login
	$.win.addEventListener('close', function onWindowClose() {
		$.win.removeEventListener('close', onWindowClose)
		log.info('Home window closed, opening login screen')
		const { open } = require('services/navigation')
		open('index')
	})

	// Close home window
	$.win.close({ animated: true })
}

// ── Button press feedback ──
function openButton(e) {
	$.buttonPressAnim.open(e.source)
}

function closeButton(e) {
	$.buttonPressAnim.close(e.source)
}

// ── Cleanup ──
function cleanup() {
	cleanupTracker.clear()
	$.destroy()
}

$.cleanup = cleanup
cleanupTracker.on($.win, 'open', runEntrance)
log.info('Setting up window open listener')
applyGradients()
log.info('Gradients applied, window will open')
