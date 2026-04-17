/**
 * Demo authentication service.
 * Stores users in applicationDataDirectory/users.json so simulator AutoFill flows
 * can be tested without a backend. Do not use plain-text passwords in production.
 */

const Logger = require('services/logger')

const IS_LOGGED_IN_KEY = 'isLoggedIn'
const CURRENT_USER_EMAIL_KEY = 'currentUserEmail'
const USERS_FILE_NAME = 'users.json'
const log = Logger.create('AUTH')

function getUsersFile() {
	return Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, USERS_FILE_NAME)
}

function normalizeEmail(email) {
	return (email || '').trim().toLowerCase()
}

function createEmptyStore() {
	return {
		version: 1,
		users: []
	}
}

function readStore() {
	const file = getUsersFile()

	if (!file.exists()) {
		return createEmptyStore()
	}

	try {
		const blob = file.read()
		const text = blob && blob.text ? blob.text : ''
		const store = text ? JSON.parse(text) : createEmptyStore()

		if (!Array.isArray(store.users)) {
			store.users = []
		}

		return store
	} catch (error) {
		log.error(`Unable to read ${USERS_FILE_NAME}: ${error.message}`)
		return createEmptyStore()
	}
}

function writeStore(store) {
	const file = getUsersFile()
	file.write(JSON.stringify(store, null, 2))
	log.info(`${USERS_FILE_NAME} saved with ${store.users.length} user(s)`)
}

function findUser(store, email) {
	const normalizedEmail = normalizeEmail(email)
	return store.users.find(user => user.email === normalizedEmail)
}

function toPublicUser(user) {
	if (!user) {
		return null
	}

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	}
}

/**
 * Check if user is currently logged in
 * @returns {boolean}
 */
exports.isLoggedIn = function () {
	const status = Ti.App.Properties.getBool(IS_LOGGED_IN_KEY, false)
	const email = exports.getCurrentUserEmail()
	const hasValidUser = status && email.length > 0 && exports.userExists(email)

	if (status && !hasValidUser) {
		log.warn('Stored login state has no matching local user, clearing session')
		exports.logout()
	}

	log.info(`Checking login status: ${hasValidUser}`)
	return hasValidUser
}

/**
 * Mark user as logged in after credential validation.
 */
exports.login = function (email) {
	const normalizedEmail = normalizeEmail(email)
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, true)

	if (normalizedEmail) {
		Ti.App.Properties.setString(CURRENT_USER_EMAIL_KEY, normalizedEmail)
	}

	log.info(`Login state saved for ${normalizedEmail || 'unknown user'}`)
}

exports.getCurrentUserEmail = function () {
	return Ti.App.Properties.getString(CURRENT_USER_EMAIL_KEY, '')
}

exports.getCurrentUser = function () {
	const email = exports.getCurrentUserEmail()

	if (!email) {
		return null
	}

	const store = readStore()
	return toPublicUser(findUser(store, email))
}

/**
 * Logout user and clear session
 */
exports.logout = function () {
	Ti.App.Properties.setBool(IS_LOGGED_IN_KEY, false)
	Ti.App.Properties.removeProperty(CURRENT_USER_EMAIL_KEY)
	log.info('Login state cleared: false')
}

exports.getUsersFilePath = function () {
	return getUsersFile().nativePath
}

exports.userExists = function (email) {
	const store = readStore()
	return !!findUser(store, email)
}

exports.createUser = function (data) {
	const name = (data.name || '').trim()
	const email = normalizeEmail(data.email)
	const password = data.password || ''
	const store = readStore()

	if (findUser(store, email)) {
		return {
			ok: false,
			code: 'USER_EXISTS'
		}
	}

	const now = new Date().toISOString()

	store.users.push({
		id: `${Date.now()}`,
		name: name,
		email: email,
		password: password,
		createdAt: now,
		updatedAt: now
	})

	writeStore(store)

	return {
		ok: true,
		user: toPublicUser(findUser(store, email))
	}
}

exports.authenticate = function (email, password) {
	const store = readStore()
	const normalizedEmail = normalizeEmail(email)
	const user = findUser(store, normalizedEmail)

	if (!user) {
		log.info(`Login rejected, user not found: ${normalizedEmail}`)
		return {
			ok: false,
			code: 'USER_NOT_FOUND'
		}
	}

	if (user.password !== password) {
		log.info(`Login rejected, invalid password for: ${normalizedEmail}`)
		return {
			ok: false,
			code: 'INVALID_PASSWORD'
		}
	}

	log.info(`Login credentials accepted for: ${normalizedEmail}`)

	return {
		ok: true,
		user: toPublicUser(user)
	}
}
