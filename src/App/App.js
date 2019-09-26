import AgateDecorator from '@enact/agate/AgateDecorator';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import LS2Request from '@enact/webos/LS2Request';

import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

class AppBase extends React.Component {
	static propTypes = {
		appCloseSetTimeoutId: PropTypes.number,
		messageVolume: PropTypes.number,
		onChangeVolumeMedia: PropTypes.func,
		onHideVolumeContainer: PropTypes.func,
		onShowVolumeContainer: PropTypes.func,
		visableSetTimeoutId: PropTypes.number,
		visibleTime: PropTypes.number,
		volumeContainerVisible: PropTypes.bool
	}

	constructor (props) {
		super(props);

		new LS2Request().send({
			service: 'luna://com.webos.service.audio/media/',
			method: 'getVolume',
			onSuccess: (res) => {
				const {
					appCloseSetTimeoutId,
					onChangeVolumeMedia,
					onHideVolumeContainer,
					onShowVolumeContainer,
					visableSetTimeoutId,
					visibleTime
				} = this.props;

				if (visableSetTimeoutId) {
					clearTimeout(visableSetTimeoutId);
				}
				if (appCloseSetTimeoutId) {
					clearTimeout(appCloseSetTimeoutId);
				}
				let appCloseId, visibleId;

				onChangeVolumeMedia(res);
				visibleId = setTimeout(() => {
					onHideVolumeContainer();
				}, visibleTime);
				appCloseId = setTimeout(() => {
					window.close();
				}, visibleTime + 1000);
				onShowVolumeContainer({visibleId, appCloseId});
			}
		});

		document.addEventListener('webOSRelaunch', () => {
			new LS2Request().send({
				service: 'luna://com.webos.service.audio/media/',
				method: 'getVolume',
				onSuccess: (res) => {
					const {
						appCloseSetTimeoutId,
						messageVolume,
						onChangeVolumeMedia,
						onHideVolumeContainer,
						onShowVolumeContainer,
						visableSetTimeoutId,
						visibleTime
					} = this.props;

					if (visableSetTimeoutId) {
						clearTimeout(visableSetTimeoutId);
					}
					if (appCloseSetTimeoutId) {
						clearTimeout(appCloseSetTimeoutId);
					}
					let appCloseId, visibleId;

					if (messageVolume !== res.volume) {
						onChangeVolumeMedia(res);
					}
					visibleId = setTimeout(() => {
						onHideVolumeContainer();
					}, visibleTime);
					appCloseId = setTimeout(() => {
						window.close();
					}, visibleTime + 1000);
					onShowVolumeContainer({visibleId, appCloseId});
				}
			});
		});
	}

	render () {
		const {volumeContainerVisible, ...rest} = this.props;

		delete rest.appCloseSetTimeoutId;
		delete rest.messageVolume;
		delete rest.onChangeVolumeMedia;
		delete rest.onHideVolumeContainer;
		delete rest.onShowVolumeContainer;
		delete rest.visableSetTimeoutId;
		delete rest.visibleTime;

		return (
			<div {...rest}>
				<Transition css={css} direction="up" className={css.volumeContainerTransition} visible={volumeContainerVisible}>
					<VolumeControls />
				</Transition>
			</div>
		);
	}
}

const AppDecorator = compose(
	AgateDecorator({overlay: true}),
	ProviderDecorator({
		state: initialState()
	}),
	ConsumerDecorator({
		handlers: {
			onChangeVolumeMedia: (ev, props, {update}) => {
				update(state => {
					state.volume.media = ev.volume;
				});
			},
			onHideVolumeContainer: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeContainer = false;
				});
			},
			onShowVolumeContainer: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeContainer = true;
					state.app.visible.visableSetTimeoutId = ev.visibleId;
					state.app.visible.appCloseSetTimeoutId = ev.appCloseId;
				});
			}
		},
		mapStateToProps: ({app, visibleTime, volume}) => ({
			appCloseSetTimeoutId: app.visible.appCloseSetTimeoutId,
			messageVolume: volume.media,
			visableSetTimeoutId: app.visible.visableSetTimeoutId,
			volumeContainerVisible: app.visible.volumeContainer,
			visibleTime: visibleTime
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
