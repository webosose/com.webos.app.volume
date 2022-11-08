import LS2Request from '@enact/webos/LS2Request';

const fwd = res => res;

const handler = (callback, map = fwd) => callback && (res => {
	if ((res.errorCode || res.returnValue === false)) {
		const err = new Error(res.errorText);
		err.code = res.errorCode;
		callback(err);
	} else {
		callback(map(res));
	}
});

const luna = (
	service,
	method,
	{ subscribe = false, timeout = 0, ...params } = {},
	map
) => (
	({ onSuccess, onFailure, onTimeout, onComplete, ...additionalParams } = {}) => {
		const req = new LS2Request();
		req.send({
			service: 'luna://' + service,
			method,
			parameters: Object.assign({}, params, additionalParams),
			onSuccess: handler(onSuccess, map),
			onFailure: handler(onFailure),
			onTimeout: handler(onTimeout),
			onComplete: handler(onComplete, map),
			subscribe,
			timeout
		});
		return req;
	}
);

const LunaProvider = {
	setMasterVolume: luna('com.webos.service.audio', 'master/setVolume', {
		soundOutput: 'alsa'
	}),
	getMasterVolume: luna('com.webos.service.audio', 'master/getVolume'),
	setMuted: luna('com.webos.service.audio', 'setMuted'),


	// Application Handling
	launch: luna('com.webos.service.applicationmanager', 'launch'),
	pause: luna('com.webos.service.applicationmanager', 'pause'),
	close: luna('com.webos.service.applicationmanager', 'close'),
	closeByAppId: luna('com.webos.service.applicationmanager', 'closeByAppId'),

	// Application Specific
	getWifiStatus: luna('com.palm.connectionmanager', 'getstatus'),
	setWifiState: luna('com.palm.connectionmanager', 'setstate'),
	gettWifiState: luna('com.webos.service.wifi', 'getstatus'),
	findWifiNetworks: luna('com.palm.wifi', 'findnetworks'),
	connectingWifi: luna('com.palm.wifi', 'connect'),

	getOSinfo: luna('com.palm.systemservice', 'osInfo/query')
};

export default LunaProvider;
export { LunaProvider };
