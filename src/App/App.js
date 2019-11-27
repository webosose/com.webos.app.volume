import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import kind from '@enact/core/kind';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {__MOCK__} from '../service';
import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

const AppBase = kind({
	name: 'App',

	propTypes: {
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
				<Transition css={css} direction="up" visible={volumeControlVisible} >
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
		handlers: {
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
