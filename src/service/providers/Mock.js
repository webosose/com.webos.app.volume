const noop = function () {};

const mock = action => ({onSuccess = noop, subscribe = false} = {}) => {
	let id, cancelled = false;
	action.then(res => {
		if (cancelled) return;
		if (subscribe) {
			id = setInterval(() => onSuccess(res), Math.random() * 5000 + 5000);
		} else {
			onSuccess(res);
		}
	});

	return {
		cancel: () => {
			if (id) clearInterval(id);
			cancelled = true;
		}
	};
};

// Copy all mock app assets to a root output ./mockapps directory
require.context(
	'!file-loader?name=mockapps/[folder]/[name].[ext]!./mockdata/',
	true,
	/\.png$/
);

const MockProvider = {
	getRemoteVolume: mock(() => import('./mockdata/volume.json')) // subscribable
};

export default MockProvider;
export {MockProvider};
