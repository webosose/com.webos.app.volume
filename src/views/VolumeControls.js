import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import kind from '@enact/core/kind';
import $L from '@enact/i18n/$L';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import {
	Audio,
	requests
} from '../services';
import {getDisplayAffinity} from '../services/utils/displayAffinity';

import VolumeControl from '../components/VolumeControl';

import css from './VolumeControls.module.less';

const VolumeControlsBase = kind({
	name: 'VolumeControlsBase',

	propTypes: {
		onChangeMaster: PropTypes.func.isRequired,
		onChangeMedia: PropTypes.func.isRequired,
		onChangeSoundEffect: PropTypes.func.isRequired,
		onChangeVolume: PropTypes.func.isRequired,
		onTouchStart: PropTypes.func.isRequired,
		onTouchEnd: PropTypes.func.isRequired,
		volumeType: PropTypes.string.isRequired,
		masterValue: PropTypes.number,
		mediaValue: PropTypes.number,
		soundEffectValue: PropTypes.number
	},

	styles: {
		css,
		className: 'volumeControls'
	},

	render: ({masterValue, mediaValue, onChangeMaster, onChangeMedia, onChangeSoundEffect, onTouchStart, onTouchEnd, soundEffectValue, volumeType, ...rest}) => {
		delete rest.onChangeMaster;
		delete rest.onChangeMedia;
		delete rest.onChangeSoundEffect;
		delete rest.onChangeVolume;

		return (
			<div {...rest}>
				{volumeType === 'All' ? (
					<React.Fragment>
						<VolumeControl label={$L('Speaker')} onChange={onChangeMaster} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} value={masterValue} />
						<VolumeControl label={$L('Media')} onChange={onChangeMedia} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} value={mediaValue} />
						<VolumeControl label={$L('Sound Effect')} onChange={onChangeSoundEffect} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} value={soundEffectValue} />
					</React.Fragment>
				) : (
					<VolumeControl label={$L('Speaker')} onChange={onChangeMaster} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} value={masterValue} />
				)}
			</div>
		);
	}
});


const VolumeControlsDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onChangeMaster: ({value}, {onChangeVolume}, {update}) => {
				const currentDisplayId = getDisplayAffinity();
				update(({volume}) => {
					volume.master = value;
				});
				requests.setMasterVolume = Audio.setMasterVolume({
					sessionId: currentDisplayId,
					volume: value,
					onSuccess: ({volume}) => {
						console.log('set master volume = ' + volume);
					},
					onFailure: (err) => {
						console.error(err);
					}
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
			},
			onTouchStart: (_, event, {update}) => {
				update(({app}) => {
					app.touching = true;
				});
			},
			onTouchEnd: (_, event, {update}) => {
				update(({app}) => {
					app.touching = false;
				});
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
