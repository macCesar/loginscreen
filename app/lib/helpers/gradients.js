/**
 * Gradient helper - Centralized gradient definitions
 * Uses semantic colors from semantic.colors.json
 */

// Background gradient for top section (used on all screens)
exports.bgTopGradient = {
	type: 'linear',
	startPoint: { x: '0%', y: '0%' },
	endPoint: { x: '100%', y: '100%' },
	colors: [
		{ color: Ti.UI.fetchSemanticColor('gradientTopStart'), offset: 0.0 },
		{ color: Ti.UI.fetchSemanticColor('gradientTopEnd'), offset: 1.0 }
	]
}

// Primary button gradient (login, signup, send, backToLogin)
exports.primaryButtonGradient = {
	type: 'linear',
	startPoint: { x: '0%', y: '50%' },
	endPoint: { x: '100%', y: '50%' },
	colors: [
		{ color: Ti.UI.fetchSemanticColor('primaryColor'), offset: 0.0 },
		{ color: Ti.UI.fetchSemanticColor('primaryDarkColor'), offset: 1.0 }
	]
}

/**
 * Apply background top gradient to a view
 * @param {Ti.UI.View} view - The view to apply the gradient to
 */
exports.applyBgTopGradient = function (view) {
	view.backgroundGradient = exports.bgTopGradient
}

/**
 * Apply primary button gradient to a view
 * @param {Ti.UI.View} view - The button view to apply the gradient to
 */
exports.applyPrimaryButtonGradient = function (view) {
	view.backgroundGradient = exports.primaryButtonGradient
}
