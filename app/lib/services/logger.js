/**
 * Logger Service v1.0.0
 *
 * What it does:
 * - Detects environment automatically
 * - In development/test/simulator: shows INFO/DEBUG/WARN/EVENT/ERROR
 * - In production: shows ERROR only (WARN optional via config)
 * - Boot log "[LOGGER] Logger v..." is always printed once on module load
 * - Supports optional runtime init and module loggers
 *
 * Quick usage:
 * const {
 *   info, debug, warn, error, event, create, init,
 *   setDebugMode, isDebugMode, setPrefix, getPrefix, resetPrefix,
 *   setIncludeMetadata, isIncludingMetadata, getSystemInfo, logSystemInfo,
 *   setIncludeTimestamp, isIncludingTimestamp, time, timeEnd, timed, VERSION
 * } = require('services/logger')
 *
 * // Global logger (source = APP):
 * info('User logged in')
 * error('Invalid credentials', { userId: 123 })
 *
 * // Optional runtime config:
 * init({ includeMetadata: true, includeTimestamp: true })
 *
 * // Optional module logger:
 * const log = create('AUTH', { feature: 'login' })
 * log.info('Session opened')
 * log.warn('Slow request', { ms: 820 })
 * await log.timed('login_flow', async () => doLogin())
 *
 * // Prefix override (optional):
 * setPrefix('MY-APP')
 */

const VERSION = '1.0.0'
exports.VERSION = VERSION

const DEPLOY_TYPE = Ti.App.deployType // 'development', 'test', 'production'
const IS_SIMULATOR = Ti.Platform.model.includes('Simulator') || Ti.Platform.model.includes('sdk_gphone') || Ti.Platform.model.includes('Emulator')
const defaultPrefix = ''
let prefix = defaultPrefix
let isDebug = DEPLOY_TYPE !== 'production' || IS_SIMULATOR
let includeMetadata = false
let includeTimestamp = false
let showWarningsInProduction = false
const timers = Object.create(null)

function normalizePrefix(value) {
  if (value === undefined || value === null || String(value).trim().length === 0) {
    return defaultPrefix
  }
  const clean = String(value).trim()
  if (clean.startsWith('[') && clean.endsWith(']')) {
    return clean
  }
  return `[${clean}]`
}

function normalizeTag(tag, fallback = 'APP') {
  if (tag === undefined || tag === null) {
    return fallback
  }
  const clean = String(tag).trim()
  return clean.length > 0 ? clean : fallback
}

function getTimestamp() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function getSystemInfo() {
  return {
    version: Ti.App.version,
    appName: Ti.App.name,
    appId: Ti.App.id,
    deployType: Ti.App.deployType,
    platform: Ti.Platform.name,
    osname: Ti.Platform.osname,
    model: Ti.Platform.model,
    dpi: Ti.Platform.displayCaps.dpi || 'unknown',
    density: Ti.Platform.displayCaps.density || 'unknown',
    screenWidth: Ti.Platform.displayCaps.platformWidth,
    screenHeight: Ti.Platform.displayCaps.platformHeight
  }
}

function shouldLog(level) {
  if (level === 'ERROR') {
    return true
  }
  if (level === 'WARN' && DEPLOY_TYPE === 'production' && showWarningsInProduction) {
    return true
  }
  return isDebug
}

function hasPayload(value) {
	if (value === undefined || value === null) {
		return false
	}
	if (Array.isArray(value)) {
		return value.length > 0
	}
	if (typeof value === 'object') {
		return Object.keys(value).length > 0
	}
	return true
}

function writeLog(level, tag, message, data) {
  if (!shouldLog(level)) {
    return
  }

  const cleanTag = normalizeTag(tag)
  const hasPrefix = prefix && String(prefix).trim().length > 0
  const prefixPart = hasPrefix ? `${prefix} ` : ''
  const tagPart = `[${cleanTag}]`
  const line = includeTimestamp
    ? `${prefixPart}${tagPart} ${getTimestamp()}: ${String(message)}`
    : `${prefixPart}${tagPart}: ${String(message)}`

  if (level === 'ERROR') {
    console.error(line)
  } else if (level === 'WARN') {
    console.warn(line)
  } else {
    console.log(line)
  }

	let payload = data
	if (hasPayload(payload) && includeMetadata && (level === 'ERROR' || level === 'WARN')) {
		if (typeof payload === 'object') {
			payload = Object.assign({}, payload, { _meta: getSystemInfo() })
		} else {
			payload = { value: payload, _meta: getSystemInfo() }
		}
	}

	if (hasPayload(payload)) {
		try {
			const serialized = JSON.stringify(payload, null, 2)
			if (level === 'ERROR') {
        console.error(serialized)
      } else if (level === 'WARN') {
        console.warn(serialized)
      } else {
        console.log(serialized)
      }
    } catch (_error) {
      if (level === 'ERROR') {
        console.error('[Unserializable log data]')
      } else if (level === 'WARN') {
        console.warn('[Unserializable log data]')
      } else {
        console.log('[Unserializable log data]')
      }
    }
  }
}

function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`
  }
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(2)
  return `${minutes}m ${seconds}s`
}

/**
 * Set debug mode manually (optional override)
 * @param {boolean} enabled
 */
exports.setDebugMode = function (enabled) {
  isDebug = Boolean(enabled)
}

/**
 * Get current debug mode
 * @returns {boolean}
 */
exports.isDebugMode = function () {
  return isDebug
}

/**
 * Runtime configuration helper
 * @param {Object} options
 * @param {string} [options.prefix]
 * @param {boolean} [options.debug]
 * @param {boolean} [options.includeMetadata]
 * @param {boolean} [options.includeTimestamp]
 * @param {boolean} [options.showWarningsInProduction]
 */
exports.init = function (options = {}) {
  if (Object.prototype.hasOwnProperty.call(options, 'prefix')) {
    prefix = normalizePrefix(options.prefix)
  }
  if (Object.prototype.hasOwnProperty.call(options, 'debug')) {
    isDebug = Boolean(options.debug)
  }
  if (Object.prototype.hasOwnProperty.call(options, 'includeMetadata')) {
    includeMetadata = Boolean(options.includeMetadata)
  }
  if (Object.prototype.hasOwnProperty.call(options, 'includeTimestamp')) {
    includeTimestamp = Boolean(options.includeTimestamp)
  }
  if (Object.prototype.hasOwnProperty.call(options, 'showWarningsInProduction')) {
    showWarningsInProduction = Boolean(options.showWarningsInProduction)
  }

  writeLog('INFO', 'LOGGER', 'Logger configuration updated', {
    version: VERSION,
    prefix,
    debug: isDebug,
    includeMetadata,
    includeTimestamp,
    showWarningsInProduction
  })
}

/**
 * Set custom prefix for log lines (optional override)
 * @param {string} value
 */
exports.setPrefix = function (value) {
  prefix = normalizePrefix(value)
}

/**
 * Get current log prefix
 * @returns {string}
 */
exports.getPrefix = function () {
  return prefix
}

/**
 * Reset prefix to default (none)
 */
exports.resetPrefix = function () {
  prefix = defaultPrefix
}

/**
 * Include metadata automatically for WARN and ERROR logs
 * @param {boolean} enabled
 */
exports.setIncludeMetadata = function (enabled) {
  includeMetadata = Boolean(enabled)
}

/**
 * Get metadata inclusion state
 * @returns {boolean}
 */
exports.isIncludingMetadata = function () {
  return includeMetadata
}

/**
 * Include timestamp in each log line
 * @param {boolean} enabled
 */
exports.setIncludeTimestamp = function (enabled) {
  includeTimestamp = Boolean(enabled)
}

/**
 * Get timestamp inclusion state
 * @returns {boolean}
 */
exports.isIncludingTimestamp = function () {
  return includeTimestamp
}

/**
 * Info log - global logger (tag APP)
 * @param {string} message
 * @param {*} [data]
 */
exports.info = function (message, data) {
  writeLog('INFO', 'APP', String(message), data)
}

/**
 * Warn log - global logger (tag APP)
 * @param {string} message
 * @param {*} [data]
 */
exports.warn = function (message, data) {
  writeLog('WARN', 'APP', String(message), data)
}

/**
 * Error log - global logger (tag APP)
 * @param {string} message
 * @param {*} [data]
 */
exports.error = function (message, data) {
  writeLog('ERROR', 'APP', String(message), data)
}

/**
 * Debug log - global logger (tag APP)
 * @param {string} message
 * @param {*} [data]
 */
exports.debug = function (message, data) {
  writeLog('DEBUG', 'APP', String(message), data)
}

/**
 * Event log - global logger (tag APP)
 * @param {string} message
 * @param {*} [data]
 */
exports.event = function (message, data) {
  writeLog('EVENT', 'APP', String(message), data)
}

/**
 * Factory logger with fixed source and optional default data
 * @param {string} source
 * @param {Object} defaultData
 * @returns {Object}
 */
exports.create = function (source, defaultData = {}) {
	function mergeData(extraData) {
		const extra = (extraData && typeof extraData === 'object') ? extraData : (extraData !== undefined ? { value: extraData } : {})
		const merged = Object.assign({}, defaultData, extra)
		return hasPayload(merged) ? merged : null
	}

  return {
    info: function (message, data) {
      writeLog('INFO', source, String(message), mergeData(data))
    },
    warn: function (message, data) {
      writeLog('WARN', source, String(message), mergeData(data))
    },
    error: function (message, data) {
      writeLog('ERROR', source, String(message), mergeData(data))
    },
    debug: function (message, data) {
      writeLog('DEBUG', source, String(message), mergeData(data))
    },
    event: function (message, data) {
      writeLog('EVENT', source, String(message), mergeData(data))
    },
    time: function (label) {
      exports.time(label, source)
    },
    timeEnd: function (label) {
      exports.timeEnd(label, source)
    },
    timed: function (label, fn) {
      return exports.timed(label, fn, source)
    }
  }
}

/**
 * Returns device/app metadata
 */
exports.getSystemInfo = function () {
  return getSystemInfo()
}

/**
 * Logs system metadata once (useful at app startup)
 * @param {string} tag
 */
exports.logSystemInfo = function (tag = 'SYSTEM') {
  writeLog('INFO', tag, 'System info', getSystemInfo())
}

/**
 * Starts a performance timer
 * @param {string} label
 * @param {string} source
 */
exports.time = function (label, source = 'APP') {
  const key = `${normalizeTag(source)}:${String(label)}`
  timers[key] = Date.now()
}

/**
 * Ends a performance timer and logs elapsed time
 * @param {string} label
 * @param {string} source
 */
exports.timeEnd = function (label, source = 'APP') {
  const key = `${normalizeTag(source)}:${String(label)}`
  const startedAt = timers[key]

  if (!startedAt) {
    writeLog('WARN', source, `Timer "${label}" was never started`)
    return
  }

  const duration = Date.now() - startedAt
  delete timers[key]
  writeLog('INFO', source, `${label} took ${formatDuration(duration)}`, { duration })
}

/**
 * Runs a function and auto-measures execution time
 * @param {string} label
 * @param {Function} fn
 * @param {string} source
 * @returns {Promise<*>}
 */
exports.timed = async function (label, fn, source = 'APP') {
  exports.time(label, source)
  try {
    const result = await fn()
    exports.timeEnd(label, source)
    return result
  } catch (error) {
    exports.timeEnd(label, source)
    throw error
  }
}

// Log initial configuration
if (isDebug) {
  console.log(`[LOGGER] Logger v${VERSION} initialized in DEBUG mode (deployType: ${DEPLOY_TYPE}, simulator: ${IS_SIMULATOR})`)
} else {
  console.log(`[LOGGER] Logger v${VERSION} initialized in PRODUCTION mode (errors only)`)
}
