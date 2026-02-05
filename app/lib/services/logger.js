/**
 * Logger service - Detects environment and shows appropriate logs
 *
 * Development/Test → Shows all logs (INFO, DEBUG, ERROR)
 * Production → Shows only ERROR logs
 */

const PREFIX = '[LOGIN-APP]'

// Detect environment automatically
const deployType = Ti.App.deployType // 'development', 'test', 'production'
const isSimulator = Ti.Platform.model.includes('Simulator') || Ti.Platform.model.includes('sdk_gphone') || Ti.Platform.model.includes('Emulator')

// Show debug logs in development, test, or simulator
let isDebug = deployType !== 'production' || isSimulator

/**
 * Set debug mode manually (optional override)
 * @param {boolean} enabled
 */
exports.setDebugMode = function (enabled) {
	isDebug = enabled
}

/**
 * Get current debug mode
 * @returns {boolean}
 */
exports.isDebugMode = function () {
	return isDebug
}

/**
 * Info log - Only shown in debug mode
 */
exports.info = function (tag, message) {
	if (isDebug) {
		console.log(`${PREFIX} [INFO] [${tag}] ${message}`)
	}
}

/**
 * Error log - ALWAYS shown (even in production)
 */
exports.error = function (tag, message) {
	console.error(`${PREFIX} [ERROR] [${tag}] ${message}`)
}

/**
 * Debug log - Only shown in debug mode
 */
exports.debug = function (tag, message) {
	if (isDebug) {
		console.log(`${PREFIX} [DEBUG] [${tag}] ${message}`)
	}
}

/**
 * Event log - Only shown in debug mode
 */
exports.event = function (tag, event) {
	if (isDebug) {
		console.log(`${PREFIX} [EVENT] [${tag}] ${event}`)
	}
}

// Log initial configuration
if (isDebug) {
	console.log(`${PREFIX} Logger initialized in DEBUG mode (deployType: ${deployType}, simulator: ${isSimulator})`)
} else {
	console.log(`${PREFIX} Logger initialized in PRODUCTION mode (errors only)`)
}
