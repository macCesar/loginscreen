const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Semantic color cache (fetch once, use everywhere)
const colors = {
	base: Ti.UI.fetchSemanticColor('underlineColor'),
	error: Ti.UI.fetchSemanticColor('errorColor'),
	success: Ti.UI.fetchSemanticColor('successColor')
}

exports.isValidEmail = function (value) {
	return EMAIL_PATTERN.test((value || '').trim())
}

exports.showFieldError = function (label) {
	label.animate({ opacity: 1, duration: 200 })
}

exports.hideFieldError = function (label) {
	label.animate({ opacity: 0, duration: 150 })
}

exports.setUnderlineColor = function (view, color) {
	view.animate({ backgroundColor: color, duration: 200 })
}

/**
 * Get semantic color constants for consistent styling
 */
exports.colors = colors
