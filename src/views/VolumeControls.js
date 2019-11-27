import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import VolumeControl from '../components/VolumeControl';

import css from './VolumeControls.module.less';

const VolumeControlsBase = kind({
	name: 'VolumeControls',

	propTypes: {
		onChangeVolumeBluetooth: PropTypes.func.isRequired,
		onChangeVolumeMaster: PropTypes.func.isRequired,
		onChangeVolumeMedia: PropTypes.func.isRequired,
		onChangeVolumeSoundEffect: PropTypes.func.isRequired,
		volumeType: PropTypes.string.isRequired,
		bluetoothVolume: PropTypes.number,
		masterVolume: PropTypes.number,
		mediaVolume: PropTypes.number,
		soundEffectVolume: PropTypes.number
	},

	styles: {
		css,
		className: 'volumeControls'
	},

	render: ({
		bluetoothVolume,
		masterVolume,
		mediaVolume,
		onChangeVolumeBluetooth,
		onChangeVolumeMaster,
		onChangeVolumeMedia,
		onChangeVolumeSoundEffect,
		soundEffectVolume,
		volumeType,
		...rest
	}) => {
		return (
			<div {...rest}>
				{volumeType === 'All' ? (
					<React.Fragment>
						<VolumeControl label="Master Volume" onChange={onChangeVolumeMaster} value={masterVolume} />
						<VolumeControl label="Media" onChange={onChangeVolumeMedia} value={mediaVolume} />
						<VolumeControl label="Sound Effect" onChange={onChangeVolumeSoundEffect} value={soundEffectVolume} />
						<VolumeControl label="Bluetooth" onChange={onChangeVolumeBluetooth} value={bluetoothVolume} />
					</React.Fragment>
				) : (
					<VolumeControl label="Bluetooth" onChange={onChangeVolumeBluetooth} value={bluetoothVolume} />
				)}
			</div>
		);
	}
});

const VolumeControlsDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onChangeVolumeBluetooth: (ev, props, {update}) => {
				update(state => {
					state.volume.bluetooth = ev.value;
				});
			},
			onChangeVolumeMaster: (ev, props, {update}) => {
				update(state => {
					state.volume.master = ev.value;
				});
			},
			onChangeVolumeMedia: (ev, props, {update}) => {
				update(state => {
					state.volume.media = ev.value;
				});
			},
			onChangeVolumeSoundEffect: (ev, props, {update}) => {
				update(state => {
					state.volume.soundEffect = ev.value;
				});
			}
		},
		mapStateToProps: ({app, volume}) => ({
			bluetoothVolume: volume.bluetooth,
			masterVolume: volume.master,
			mediaVolume: volume.media,
			soundEffectVolume: volume.soundEffect,
			volumeType: app.volumeType
		})
	})
);

const VolumeControls = VolumeControlsDecorator(VolumeControlsBase);

export default VolumeControls;
export {
	VolumeControls
};
