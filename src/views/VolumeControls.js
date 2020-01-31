import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import $L from '@enact/i18n/$L';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import {
	__MOCK__,
	Bluetooth
} from 'webos-auto-service';

import VolumeControl from '../components/VolumeControl';

import css from './VolumeControls.module.less';

const VolumeControlsBase = kind({
	name: 'VolumeControlsBase',

	propTypes: {
		isBluetoothConnected: PropTypes.bool.isRequired,
		onChangeMaster: PropTypes.func.isRequired,
		onChangeMedia: PropTypes.func.isRequired,
		onChangeSoundEffect: PropTypes.func.isRequired,
		onChangeVolume: PropTypes.func.isRequired,
		volumeType: PropTypes.string.isRequired,
		bluetoothDeviceAddress: PropTypes.string,
		masterValue: PropTypes.number,
		mediaValue: PropTypes.number,
		soundEffectValue: PropTypes.number
	},

	styles: {
		css,
		className: 'volumeControls'
	},

	render: ({isBluetoothConnected, masterValue, mediaValue, onChangeMaster, onChangeMedia, onChangeSoundEffect, soundEffectValue, volumeType, ...rest}) => {
		delete rest.bluetoothDeviceAddress;
		delete rest.onChangeMaster;
		delete rest.onChangeMedia;
		delete rest.onChangeSoundEffect;
		delete rest.onChangeVolume;

		return (
			<div {...rest}>
				{volumeType === 'All' ? (
					<React.Fragment>
						<VolumeControl label={isBluetoothConnected ? $L('Bluetooth') : $L('Speaker')} onChange={onChangeMaster} value={masterValue} />
						<VolumeControl label={$L('Media')} onChange={onChangeMedia} value={mediaValue} />
						<VolumeControl label={$L('Sound Effect')} onChange={onChangeSoundEffect} value={soundEffectValue} />
					</React.Fragment>
				) : (
					<VolumeControl label={isBluetoothConnected ? $L('Bluetooth') : $L('Speaker')} onChange={onChangeMaster} value={masterValue} />
				)}
			</div>
		);
	}
});

const VolumeControlsDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onChangeMaster: ({value}, {bluetoothDeviceAddress, onChangeVolume, isBluetoothConnected}, {update}) => {
				if (!__MOCK__ && isBluetoothConnected) {
					Bluetooth.setAbsoluteVolume({
						address: bluetoothDeviceAddress,
						volume: value
					});
				}
				update(({volume}) => {
					volume.master = value;
				});
				onChangeVolume();
			},
			onChangeMedia: ({value}, {onChangeVolume}, {update}) => {
				update(({volume}) => {
					volume.media = value;
				});
				onChangeVolume();
			},
			onChangeSoundEffect: ({value}, {onChangeVolume}, {update}) => {
				update(({volume}) => {
					volume.soundEffect = value;
				});
				onChangeVolume();
			}
		},
		mapStateToProps: ({app, volume}) => ({
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
