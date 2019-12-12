export default () => ({
	// System settings
	volume: {
		master: 0,
		media: 0,
		soundEffect: 0
	},
	// Connected bluetooth
	bluetooth: {
		address: null,
		connected: false
	},
	// General/Global app settings (view management, general app state, etc)
	app: {
		volumeType: process.env.REACT_APP_VOLUME_TYPE,
		visible: {
			volumeControl: false
		}
	}
});
