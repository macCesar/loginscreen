exports.shakeView = function (view) {
	const base = view.transform || Ti.UI.createMatrix2D()
	const right = Ti.UI.createAnimation({ transform: base.translate(8, 0), duration: 60 })
	const left = Ti.UI.createAnimation({ transform: base.translate(-8, 0), duration: 60 })
	const center = Ti.UI.createAnimation({ transform: base, duration: 60 })

	view.animate(right, function () {
		view.animate(left, function () {
			view.animate(right, function () {
				view.animate(center)
			})
		})
	})
}

exports.addButtonFeedback = function (btn, tracker) {
	function onTouchStart() {
		btn.animate({ opacity: 0.8, duration: 100 })
	}

	function onTouchEnd() {
		btn.animate({ opacity: 1, duration: 100 })
	}

	function addListener(event, handler) {
		if (tracker && typeof tracker.on === 'function') {
			tracker.on(btn, event, handler)
			return
		}

		btn.addEventListener(event, handler)

		if (Array.isArray(tracker)) {
			tracker.push({ target: btn, event: event, handler: handler })
		}
	}

	addListener('touchstart', onTouchStart)
	addListener('touchend', onTouchEnd)
}

exports.removeListeners = function (listeners) {
	listeners.forEach(function (l) {
		l.target.removeEventListener(l.event, l.handler)
	})
	listeners.length = 0
}
