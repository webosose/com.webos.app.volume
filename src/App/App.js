import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import {
	__MOCK__,
	Application,
	Bluetooth,
	cancelAllRequests,
	cancelRequest,
	requests
} from 'webos-auto-service';
import {getDisplayAffinity} from 'webos-auto-service/utils/displayAffinity';

import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

const
	BLUETOOTH_STATE = {
		READY: 0,
		CONNECTED: 1,
		DISCONNECTED: 2
	},
	delayTohide = 5000;

let hideTimerId = null;

const
	clearHideTime = () => {
		if (hideTimerId) {
			clearTimeout(hideTimerId);
		}
	},
	setHideTime = (update) => {
		clearHideTime();
		hideTimerId = setTimeout(() => {
			update(state => {
				state.app.visible.type = 'fade';
				state.app.visible.volumeControl = false;
			});
		}, delayTohide);
	};

const getBluetoothAdapterNumber = (str = '') => {
	// This variable supports up to 10 maximum number of Bluetooth adapters.
	// If you have more than 10 adapters, you need to modify the variables.
	const bluetoothAdapter = Number(str.slice(-1));
	return isNaN(bluetoothAdapter) ? 0 : bluetoothAdapter;
};

class AppBase extends React.Component {
	static propTypes = {
		onChangeVolume: PropTypes.func,
		onHandleHide: PropTypes.func,
		onHideVolumeControl: PropTypes.func,
		onShowVolumeControl: PropTypes.func,
		setBluetoothVolume: PropTypes.func,
		volumeControlRunning: PropTypes.bool,
		volumeControlType: PropTypes.string,
		volumeControlVisible: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {
			isBluetoothConnected: false
		};
		if (!__MOCK__) {
			this.displayAffinity = getDisplayAffinity();
			this.getBluetoothAdapterStatus();
		}
	}

	componentWillUnmount () {
		cancelAllRequests();
	}

	adaptersAddress = []
	connectedStatus = []
	devicesAddress = []
	displayAffinity = 0
	hideTimerId = null

	getBluetoothAdapterStatus = () => {
		requests.getBluetoothAdapter = Bluetooth.getBluetoothAdapter({
			onSuccess: this.onSuccessGetBluetoothAdapter,
			subscribe: true
		});
	}

	onSuccessGetBluetoothAdapter = ({adapters}) => {
		this.adaptersAddress = [];
		for (const {adapterAddress, name} of adapters) {
			this.adaptersAddress[getBluetoothAdapterNumber(name)] = adapterAddress;
		}
		this.searchConnectedDevices();
	}

	searchConnectedDevices = () => {
		requests.getKnownBluetoothDevices = Bluetooth.getKnownBluetoothDevices({
			onSuccess: this.onSuccessGetKnownBluetoothDevices,
			subscribe: true
		});
	}

	onSuccessGetKnownBluetoothDevices = ({devices}) => {
		for (const {adapterAddress, address, connectedProfiles} of devices) {
			if (connectedProfiles.length > 0) {
				if ((this.adaptersAddress[this.displayAffinity] !== adapterAddress) &&
					(this.connectedStatus[this.displayAffinity])) {
					continue;
				}
				cancelRequest(['getRemoteVolume']);
				this.connectedStatus[this.displayAffinity] = BLUETOOTH_STATE.READY;
				this.devicesAddress[this.displayAffinity] = address;
				requests.getRemoteVolume = Bluetooth.getRemoteVolume({
					address,
					onSuccess: this.onSuccessGetRemoteVolume,
					subscribe: true
				});
				this.setState({
					isBluetoothConnected: true
				});
				return;
			}
		}
		this.resetStatus();
	}

	onSuccessGetRemoteVolume = (param) => {
		const {onShowVolumeControl, setBluetoothVolume} = this.props;
		if (param.hasOwnProperty('volume')) {
			if (document.hidden) {
				Application.launch({
					id: 'com.webos.app.volume',
					params: {
						displayAffinity: this.displayAffinity
					}
				});
			}
			if (this.connectedStatus[this.displayAffinity] === BLUETOOTH_STATE.CONNECTED) {
				onShowVolumeControl();
				setBluetoothVolume(param.volume);
			} else {
				this.connectedStatus[this.displayAffinity] = BLUETOOTH_STATE.CONNECTED;
			}
		}
	}

	resetStatus = () => {
		this.connectedStatus = [];
		this.devicesAddress = [];
		this.setState({
			isBluetoothConnected: false
		});
	}

	render () {
		const {
			className,
			onChangeVolume,
			onHandleHide,
			onHideVolumeControl,
			onShowVolumeControl,
			volumeControlRunning,
			volumeControlType,
			volumeControlVisible,
			...rest
		} = this.props;

		delete rest.setBluetoothVolume;

		return (
			<div {...rest} className={classNames(className, css.app, __MOCK__ ? css.withBackground : null)}>
				<Transition css={css} type="fade" visible={volumeControlVisible}>
					<div className={css.basement} onClick={onHideVolumeControl} />
				</Transition>
				<Transition css={css} onHide={onHandleHide} type={volumeControlType} visible={volumeControlVisible}>
					{volumeControlRunning ? <VolumeControls bluetoothDeviceAddress={this.devicesAddress[this.displayAffinity]} isBluetoothConnected={this.state.isBluetoothConnected} onChangeVolume={onChangeVolume} /> : null}
				</Transition>
				{__MOCK__ && (
					<div className={css.control}>
						<Button onClick={onShowVolumeControl}>Open Volume</Button>
					</div>
				)}
			</div>
		);
	}
}

const AppDecorator = compose(
	AgateDecorator({
		noAutoFocus: true,
		overlay: true
	}),
	ProviderDecorator({
		state: initialState()
	}),
	ConsumerDecorator({
		mount: (props, {update}) => {
			const currentDisplayId = getDisplayAffinity();
			document.title = `${document.title} - Display ${currentDisplayId}`;

			document.addEventListener('webOSLocaleChange', () => {
				window.location.reload();
			});
			document.addEventListener('webOSRelaunch', () => {
				update(({app}) => {
					app.visible.volumeControl = true;
				});
			});

			update(state => {
				state.app.running = true;
			});
			return () => {
				clearHideTime();
			};
		},
		handlers: {
			onHandleHide: (ev, props, {update}) => {
				update(state => {
					state.app.visible.type = 'slide';
					state.app.running = false;
				});
				window.close();
			},
			onChangeVolume: (ev, props, {update}) => {
				setHideTime(update);
			},
			onHideVolumeControl: (ev, props, {update}) => {
				update(state => {
					state.app.visible.type = 'fade';
					state.app.visible.volumeControl = false;
				});
			},
			onShowVolumeControl: (ev, props, {update}) => {
				update(state => {
					state.app.running = true;
					state.app.visible.type = 'slide';
					state.app.visible.volumeControl = true;
				});
				setHideTime(update);
			},
			setBluetoothVolume: (volume, props, {update}) => {
				update(state => {
					state.volume.master = volume;
				});
			}
		},
		mapStateToProps: ({app}) => ({
			volumeControlRunning: app.running,
			volumeControlType: app.visible.type,
			volumeControlVisible: app.visible.volumeControl
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
