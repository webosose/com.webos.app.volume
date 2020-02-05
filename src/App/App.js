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
	Audio,
	cancelAllRequests,
	requests
} from 'webos-auto-service';
import {getDisplayAffinity} from 'webos-auto-service/utils/displayAffinity';

import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

const
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

class AppBase extends React.Component {
	static propTypes = {
		onChangeVolume: PropTypes.func,
		onHandleHide: PropTypes.func,
		onHideVolumeControl: PropTypes.func,
		onShowVolumeControl: PropTypes.func,
		setMasterVolume: PropTypes.func,
		volumeControlRunning: PropTypes.bool,
		volumeControlType: PropTypes.string,
		volumeControlVisible: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {};
		if (!__MOCK__) {
			this.displayAffinity = getDisplayAffinity();
			this.getMasterVolume();
		}
	}

	componentWillUnmount () {
		cancelAllRequests();
	}

	displayAffinity = 0
	hideTimerId = null

	getMasterVolume = () => {
		requests.getMasterVolume = Audio.getMasterVolume({
			subscribe: true,
			sessionId: this.displayAffinity,
			onSuccess: this.onSuccessGetMasterVolume,
		});
	}

/** response sample
 * {
		"volumeStatus": {
			"sessionId": 0,
			"muted": false,
			"volume": 100,
			"soundOutput": "alsa"
		},
		"returnValue": true,
		"callerId": "com.webos.lunasend-1511"
	}
 */
	onSuccessGetMasterVolume = (res) => {
		const {onShowVolumeControl, setMasterVolume} = this.props;
		if (res.hasOwnProperty('volumeStatus') && res.returnValue) {
			if (this.displayAffinity !== res.volumeStatus.sessionId) {
				return;
			}
			if (document.hidden) {
				Application.launch({
					id: 'com.webos.app.volume',
					params: {
						displayAffinity: this.displayAffinity
					},
					keepAlive: true
				});
			}
			onShowVolumeControl();
			setMasterVolume(res.volumeStatus.volume);
		}
	}

	resetStatus = () => {
		this.setState({});
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

		delete rest.setMasterVolume;

		return (
			<div {...rest} className={classNames(className, css.app, __MOCK__ ? css.withBackground : null)}>
				<Transition css={css} type="fade" visible={volumeControlVisible}>
					<div className={css.basement} onClick={onHideVolumeControl} />
				</Transition>
				<Transition css={css} onHide={onHandleHide} type={volumeControlType} visible={volumeControlVisible}>
					{volumeControlRunning ? <VolumeControls onChangeVolume={onChangeVolume} /> : null}
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
			setMasterVolume: (volume, props, {update}) => {
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
