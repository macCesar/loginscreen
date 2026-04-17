// ./purgetss/config.cjs
module.exports = {
	purge: {
		mode: 'all',
		method: 'sync',

		options: {
			missing: true,
			widgets: false,
			safelist: [],
			plugins: []
		}
	},
	theme: {
		extend: {
			colors: {
				app: {
					background: 'backgroundColor',
					button: 'buttonTextColor',
					card: 'cardColor',
					error: 'errorColor',
					hint: 'hintTextColor',
					link: 'linkColor',
					muted: 'textMutedColor',
					success: 'successColor',
					text: 'textColor',
					underline: 'underlineColor'
				}
			}
		},

		'.auth-content': {
			apply: 'w-10/12 h-auto vertical opacity-0'
		},
		'.backBtn': {
			apply: 'text-app-link text-(16) left-5 bottom-2 w-auto h-auto'
		},
		'.bgTop': {
			apply: 'wh-screen top-0 touch-enabled-false'
		},
		'.field': {
			DEFAULT: {
				color: 'textColor',
				font: { fontSize: 15 },
				height: 40,
				hintTextColor: 'hintTextColor',
				paddingLeft: 4,
				textColor: 'textColor',
				top: 4,
				width: 'Ti.UI.FILL'
			},
			android: {
				backgroundColor: 'transparent'
			}
		},
		'.fieldError': {
			apply: 'text-app-error text-(11) ml-1 mt-1 w-auto h-(14) opacity-0 touch-enabled-false'
		},
		'.fieldGroup': {
			apply: 'w-screen h-auto vertical'
		},
		'.fieldLabel': {
			apply: 'text-app-muted text-xs font-semibold ml-1 w-auto h-auto touch-enabled-false'
		},
		'.header': {
			apply: 'top-0 left-0 w-screen h-(60) z-index-10'
		},
		'.login-card': {
			apply: 'w-10/12 h-auto vertical top-5/12 bg-app-card rounded-2xl opacity-0'
		},
		'.login-logo': {
			apply: 'top-1/12 w-auto h-auto vertical opacity-0'
		},
		'.primaryBtn': {
			apply: 'w-screen h-12 mt-7 rounded-12'
		},
		'.primaryBtnLabel': {
			apply: 'text-app-button text-base font-bold text-center w-screen touch-enabled-false'
		},
		'.screenIcon': {
			apply: 'text-(56) text-center w-screen touch-enabled-false'
		},
		'.screenSubtitle': {
			apply: 'text-app-muted text-sm text-center w-screen mt-2 touch-enabled-false'
		},
		'.screenTitle': {
			apply: 'text-app-text text-(26) font-bold text-center w-screen mt-3 touch-enabled-false'
		},
		'.signup-row': {
			apply: 'bottom-(5%) w-auto h-auto horizontal opacity-0 z-index-10'
		},
		'.underline': {
			apply: 'w-screen h-(2) bg-app-underline mt-0'
		}
	}
}
