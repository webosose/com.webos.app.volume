import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import kind from '@enact/core/kind';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Service, {__MOCK__} from '../service';
import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

const AppBase = kind({
	name: 'App',

	propTypes: {
		onHandleHide: PropTypes.func,
		onHideVolumeControl: PropTypes.func,
		onShowVolumeControl: PropTypes.func,
		volumeControlVisible: PropTypes.bool
	},

	styles: {
		css,
		className: 'app'
	},

	computed: {
		// If this is running Mock data, remove the background, so this becomes an overlay app
		className: ({styler}) => styler.append({withBackground: __MOCK__})
	},

	render: ({
		onHandleHide,
		onHideVolumeControl,
		onShowVolumeControl,
		volumeControlVisible,
		...rest
	}) => {
		return (
			<div {...rest}>
				<Transition css={css} type="fade" visible={volumeControlVisible}>
					<div className={css.basement} onClick={onHideVolumeControl} />
				</Transition>
				<Transition css={css} direction="up" onHide={onHandleHide} visible={volumeControlVisible} >
					<VolumeControls />
				</Transition>
				{__MOCK__ && (
					<div className={css.control}>
						<Button onClick={onShowVolumeControl}>Open Volume</Button>
					</div>
				)}
			</div>
		);
	}
});

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
			const adaptersAddress = [];
			let
				displayAffinity = 0,
				isDualAdapters = false;
			if ((window !== 'undefined') && window.webOSSystem && window.webOSSystem.launchParams && window.webOSSystem.launchParams.hasOwnProperty('displayAffinity')) {
				displayAffinity = JSON.parse(window.webOSSystem.launchParams).displayAffinity || 0;
				Service.queryAvailable({
					onSuccess: ({adapters}) => {
						for (let i = 0; i < adapters.length; i++) {
							const adapter = adapters[i];
							adaptersAddress[adapter.default ? 0 : 1] = adapter.adapterAddress;
							if (!adapter.default) {
								isDualAdapters = true;
							}
						}
					}
				});
			}
			Service.getKnownBluetoothDevices({
				onSuccess: ({devices}) => {
					let isConnected = false;
					for (let i = 0; i < devices.length; i++) {
						const device = devices[i];
						if (device.connectedProfiles.length > 0) {
							if (isDualAdapters && (adaptersAddress[displayAffinity] !== device.adapterAddress)) {
								continue;
							}
							update(({bluetooth}) => {
								bluetooth.address = device.address;
								bluetooth.connected = true;
							});
							Service.getRemoteVolume({
								address: device.address,
								onSuccess: (param) => {
									if (param.hasOwnProperty('volume')) {
										if (document.hidden) {
											Service.launch();
										}
										update(({app, volume}) => {
											app.visible.volumeControl = true;
											volume.master = param.volume;
										});
									}
								},
								subscribe: true
							});
							isConnected = true;
							break;
						}
					}
					if (!isConnected) {
						update(({bluetooth, volume}) => {
							bluetooth.address = null;
							bluetooth.connected = false;
							volume.master = 0;

						});
					}
				},
				subscribe: true
			});

			document.addEventListener('webOSLocaleChange', () => {
				window.location.reload();
			});

			document.addEventListener('webOSRelaunch', () => {
				update(({app}) => {
					app.visible.volumeControl = true;
				});
			});
		},
		handlers: {
			onHandleHide: () => {
				window.close();
			},
			onHideVolumeControl: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeControl = false;
				});
			},
			onShowVolumeControl: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeControl = true;
				});
			}
		},
		mapStateToProps: ({app}) => ({
			volumeControlVisible: app.visible.volumeControl
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
