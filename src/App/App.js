import AgateDecorator from '@enact/agate/AgateDecorator';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import {
	Audio,
	cancelAllRequests,
	requests,
	cancelRequest
} from '../services';
import {getDisplayAffinity} from '../services/utils/displayAffinity';

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

const getMasterVolume = (update) => {
	const currentDisplayId = getDisplayAffinity();
	requests.getMasterVolume = Audio.getMasterVolume({
		sessionId: currentDisplayId,
		onSuccess: (res) => {
			if (res.Object.prototype.hasOwnProperty.call('volumeStatus') && res.returnValue) {
				if (res.volumeStatus && res.volumeStatus.volume) {
					update(state => {
						state.volume.master = res.volumeStatus.volume;
					});
				} else {
					/* eslint-disable-next-line no-console */
					console.warn('check response', res);
				}
			}
		},
		onComplete: () => {
			cancelRequest('getMasterVolume');
		}
	});
};

class AppBase extends React.Component {
	static propTypes = {
		onChangeVolume: PropTypes.func,
		onHandleHide: PropTypes.func,
		onHideVolumeControl: PropTypes.func,
		setMasterVolumeToState: PropTypes.func,
		volumeControlRunning: PropTypes.bool,
		volumeControlType: PropTypes.string,
		volumeControlVisible: PropTypes.bool
	};

	constructor (props) {
		super(props);
		this.state = {};
	}

	componentWillUnmount () {
		cancelAllRequests();
	}

	hideTimerId = null;

	resetStatus = () => {
		this.setState({});
	};

	render () {
		const {
			onChangeVolume,
			onHandleHide,
			onHideVolumeControl,
			volumeControlRunning,
			volumeControlType,
			volumeControlVisible,
			...rest
		} = this.props;

		delete rest.setMasterVolume;

		return (
			<div {...rest} className={css.app}>
				<Transition css={css} type="fade" visible={volumeControlVisible}>
					<div className={css.basement} onClick={onHideVolumeControl} />
				</Transition>
				<Transition css={css} onHide={onHandleHide} type={volumeControlType} visible={volumeControlVisible}>
					{volumeControlRunning ? <VolumeControls onChangeVolume={onChangeVolume} /> : null}
				</Transition>
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
			getMasterVolume(update);

			document.addEventListener('webOSLocaleChange', () => {
				window.location.reload();
			});
			document.addEventListener('webOSRelaunch', () => {
				getMasterVolume(update);
				update(state => {
					state.app.running = true;
					state.app.visible.type = 'slide';
					state.app.visible.volumeControl = true;
				});
				setHideTime(update);
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
			setMasterVolumeToState: (volume, props, {state, update}) => {
				if (!state.app.touching) {
					update(updateState => {
						updateState.volume.master = volume;
					});
				}
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
