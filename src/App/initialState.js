export default () => ({
	visibleTime: 5000,
	// System settings
	volume: {
		media: 0,
		message: 30,
		safetyAlert: 60
	},
	// General/Global app settings (view management, general app state, etc)
	app: {
		visible: {
			appCloseSetTimeoutId: null,
			visableSetTimeoutId: null,
			volumeContainer: false
		}
	}
});
