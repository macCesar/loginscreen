/**
 * Authentication service - Manages user session persistence
 * Uses Ti.App.Properties for simple key-value storage
 */

const Logger = require('services/logger')

const IS_LOGGED_IN_KEY = 'isLoggedIn'
const log = Logger.create('AUTH')

/**
 * Check if user is currently logged in
 * @returns {boolean}
 */
exports.isLoggedIn = function () {
	const status = Ti.App.Properties.getBool(IS_LOGGED_IN_KEY, false)
	log.info(`Checking login status: ${status}`)
	return status
}

/**
 * Mark user as logged in (called after successful login/signup)
 */
exports.login = function () {
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, true)
	log.info('Login state saved: true')
}

/**
 * Logout user and clear session
 */
exports.logout = function () {
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, false)
	log.info('Login state cleared: false')
}
