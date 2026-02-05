/**
 * Navigation service - Centralized navigation with automatic cleanup
 * Handles modal opening and ensures proper memory cleanup
 */

const { info, error } = require('services/logger')

/**
 * Open a controller as a modal window
 * Automatically handles cleanup when the modal is closed
 *
 * @param {string} route - The controller route (e.g., 'signup', 'forgotPassword')
 * @param {Object} params - Optional parameters to pass to the controller
 * @returns {Object} The controller instance
 */
exports.openModal = function (route, params = {}) {
	info('NAV', `Opening modal: ${route}`)
	const ctrl = Alloy.createController(route, params)
	const win = ctrl.getView()

	// Ensure cleanup is called when window closes
	win.addEventListener('close', function () {
		info('NAV', `Modal closed: ${route}`)
		if (ctrl.cleanup) {
			ctrl.cleanup()
		}
	})

	win.open({ modal: true })
	return ctrl
}

/**
 * Open a controller as a regular window
 * Automatically handles cleanup when the window is closed
 *
 * @param {string} route - The controller route
 * @param {Object} params - Optional parameters to pass to the controller
 * @param {Object} openProps - Optional properties to pass to win.open()
 * @returns {Object} The controller instance
 */
exports.open = function (route, params = {}, openProps = {}) {
	info('NAV', `Opening window: ${route}`)
	const ctrl = Alloy.createController(route, params)
	const win = ctrl.getView()

	win.addEventListener('close', function () {
		info('NAV', `Window closed: ${route}`)
		if (ctrl.cleanup) {
			ctrl.cleanup()
		}
	})

	win.open(openProps)
	info('NAV', `Window opened successfully: ${route}`)
	return ctrl
}
