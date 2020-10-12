export default () => ({
	// System settings
	volume: {
		master: 0,
		media: 0,
		soundEffect: 0
	},
	// General/Global app settings (view management, general app state, etc)
	app: {
		volumeType: 'Speaker',
		visible: {
			type: 'slide',
			volumeControl: false
		},
		touching: false,
		running: false
	}
});
