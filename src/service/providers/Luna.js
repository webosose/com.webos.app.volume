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
		{timeout = 0, ...params} = {},
		map
) => (
	({onSuccess, onFailure, onTimeout, onComplete, subscribe = false, ...additionalParams} = {}) => {
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
	// Device information
	getKnownBluetoothDevices: luna('com.webos.service.bluetooth2', 'device/getStatus'),
	getBluetoothStatus: luna('com.webos.service.bluetooth2', 'a2dp/getStatus'),
	queryAvailable: luna('com.webos.service.bluetooth2', 'adapter/queryAvailable'),

	// Device volume
	getRemoteVolume: luna('com.webos.service.bluetooth2', 'avrcp/getRemoteVolume'),
	setAbsoluteVolume: luna('com.webos.service.bluetooth2', 'avrcp/setAbsoluteVolume'),

	// Application Handling
	launch: luna('com.webos.service.applicationmanager', 'launch', {id: 'com.webos.app.volume'})
};

export default LunaProvider;
export {LunaProvider};
