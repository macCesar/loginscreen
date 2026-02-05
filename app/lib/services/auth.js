/**
 * Authentication service - Manages user session persistence
 * Uses Ti.App.Properties for simple key-value storage
 */

const { info } = require('services/logger')

const IS_LOGGED_IN_KEY = 'isLoggedIn'

/**
 * Check if user is currently logged in
 * @returns {boolean}
 */
exports.isLoggedIn = function () {
	const status = Ti.App.Properties.getBool(IS_LOGGED_IN_KEY, false)
	info('AUTH', `Checking login status: ${status}`)
	return status
}

/**
 * Mark user as logged in (called after successful login/signup)
 */
exports.login = function () {
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, true)
	info('AUTH', 'Login state saved: true')
}

/**
 * Logout user and clear session
 */
exports.logout = function () {
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, false)
	info('AUTH', 'Login state cleared: false')
}
