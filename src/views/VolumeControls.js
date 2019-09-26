import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

import LS2Request from '@enact/webos/LS2Request';
// import service from '../service';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import VolumeControl from '../components/VolumeControl';

import css from './VolumeControls.module.less';

const VolumeControlsBase = kind({
	name: 'VolumeControls',
	propTypes: {
		mediaVolume: PropTypes.number,
		messageVolume: PropTypes.number,
		onChangeVolumeMedia: PropTypes.func,
		onChangeVolumeMessage: PropTypes.func,
		onChangeVolumeSafetyAlert: PropTypes.func,
		safetyAlertVolume: PropTypes.number
	},
	styles: {
		css,
		className: 'volumeControls'
	},
	render: ({
		mediaVolume,
		messageVolume,
		onChangeVolumeMedia,
		onChangeVolumeMessage,
		onChangeVolumeSafetyAlert,
		safetyAlertVolume,
		...rest
	}) => {
		return (
			<div {...rest}>
				<VolumeControl label="Media" value={mediaVolume} onChange={onChangeVolumeMedia} />
				<VolumeControl label="Message" value={messageVolume} onChange={onChangeVolumeMessage} />
				<VolumeControl label="Safety Alert" value={safetyAlertVolume} onChange={onChangeVolumeSafetyAlert} />
			</div>
		);
	}
});

const VolumeControlsDecorator = compose(
	ConsumerDecorator({
		// mount: (props, {update}) => {
		// 	// Simulate a slow luna call
		// 	setTimeout(() => {
		// 		service.listLaunchPoints({
		// 			subscribe: true,
		// 			onSuccess: ({launchPoints}) => {
		// 				update(state => {
		// 					state.launcher.launchPoints = launchPoints;
		// 				});
		// 			}
		// 		});
		// 	}, 2000);

		// 	// On unmount, run this returned method
		// 	return () => {
		// 		update(state => {
		// 			state.launcher.launchPoints = [];
		// 		});
		// 	};
		// },
		handlers: {
			onChangeVolumeMedia: (ev, props, {update}) => {
				update(state => {
					state.volume.media = ev.value;
					new LS2Request().send({
						service: 'luna://com.webos.service.audio/media/',
						method: 'setVolume',
						parameters: {
							volume: ev.value
						},
					});
				});
			},
			onChangeVolumeMessage: (ev, props, {update}) => {
				update(state => {
					state.volume.message = ev.value;
				});
			},
			onChangeVolumeSafetyAlert: (ev, props, {update}) => {
				update(state => {
					state.volume.safetyAlert = ev.value;
				});
			}
		},
		mapStateToProps: ({volume}) => ({
			mediaVolume: volume.media,
			messageVolume: volume.message,
			safetyAlertVolume: volume.safetyAlert
		})
	})
);

const VolumeControls = VolumeControlsDecorator(VolumeControlsBase);

export default VolumeControls;
export {
	VolumeControls
};
