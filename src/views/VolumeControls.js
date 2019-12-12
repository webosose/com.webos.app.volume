import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import $L from '@enact/i18n/$L';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import VolumeControl from '../components/VolumeControl';
import Service from '../service';

import css from './VolumeControls.module.less';

const VolumeControlsBase = kind({
	name: 'VolumeControls',

	propTypes: {
		bluetoothConnected: PropTypes.bool.isRequired,
		onChangeMaster: PropTypes.func.isRequired,
		onChangeMedia: PropTypes.func.isRequired,
		onChangeSoundEffect: PropTypes.func.isRequired,
		volumeType: PropTypes.string.isRequired,
		masterValue: PropTypes.number,
		mediaValue: PropTypes.number,
		soundEffectValue: PropTypes.number
	},

	styles: {
		css,
		className: 'volumeControls'
	},

	render: ({
		bluetoothConnected,
		masterValue,
		mediaValue,
		onChangeMaster,
		onChangeMedia,
		onChangeSoundEffect,
		soundEffectValue,
		volumeType,
		...rest
	}) => {
		return (
			<div {...rest}>
				{volumeType === 'All' ? (
					<React.Fragment>
						<VolumeControl disabled={!bluetoothConnected} label={bluetoothConnected ? $L('Bluetooth') : $L('Speaker')} onChange={onChangeMaster} value={masterValue} />
						<VolumeControl label={$L('Media')} onChange={onChangeMedia} value={mediaValue} />
						<VolumeControl label={$L('Sound Effect')} onChange={onChangeSoundEffect} value={soundEffectValue} />
					</React.Fragment>
				) : (
					<VolumeControl disabled={!bluetoothConnected} label={bluetoothConnected ? $L('Bluetooth') : $L('Speaker')} onChange={onChangeMaster} value={masterValue} />
				)}
			</div>
		);
	}
});

const VolumeControlsDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onChangeMaster: (ev, props, {state, update}) => {
				if (state.bluetooth.connected) {
					Service.setAbsoluteVolume({
						address: state.bluetooth.address,
						volume: ev.value
					});
				}
				update(({volume}) => {
					volume.master = ev.value;
				});
			},
			onChangeMedia: (ev, props, {update}) => {
				update(({volume}) => {
					volume.media = ev.value;
				});
			},
			onChangeSoundEffect: (ev, props, {update}) => {
				update(({volume}) => {
					volume.soundEffect = ev.value;
				});
			}
		},
		mapStateToProps: ({app, bluetooth, volume}) => ({
			bluetoothConnected: bluetooth.connected,
			masterValue: volume.master,
			mediaValue: volume.media,
			soundEffectValue: volume.soundEffect,
			volumeType: app.volumeType
		})
	})
);

const VolumeControls = VolumeControlsDecorator(VolumeControlsBase);

export default VolumeControls;
export {
	VolumeControls
};
