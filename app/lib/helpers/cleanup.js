exports.createCleanup = function () {
	const listeners = []
	const timeouts = []

	function on(target, event, handler) {
		if (!target || !event || !handler) return
		target.addEventListener(event, handler)
		listeners.push({ target: target, event: event, handler: handler })
	}

	function timeout(fn, delay) {
		const id = setTimeout(fn, delay)
		timeouts.push(id)
		return id
	}

	function clear() {
		listeners.forEach(function (l) {
			l.target.removeEventListener(l.event, l.handler)
		})
		listeners.length = 0

		timeouts.forEach(function (id) {
			clearTimeout(id)
		})
		timeouts.length = 0
	}

	return {
		on: on,
		timeout: timeout,
		clear: clear
	}
}
