import AgateDecorator from '@enact/agate/AgateDecorator';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Button from '@enact/agate/Button';
import Transition from '@enact/ui/Transition';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import VolumeControls from '../views/VolumeControls';

import initialState from './initialState';

import css from './App.module.less';

const AppBase = kind({
	name: 'App',

	propTypes: {
		onHideEverything: PropTypes.func,
		onShowVolumeContainer: PropTypes.func,
		volumeContainerVisible: PropTypes.bool
	},

	styles: {
		css,
		className: 'app'
	},

	render: ({
		onHideEverything,
		onShowVolumeContainer,
		volumeContainerVisible,
		...rest
	}) => {
		return (
			<div {...rest}>
				<div className={css.basement} onClick={onHideEverything} />
				<div className={css.controls}>
					{/* These are just for a development aid */}
					<Button onClick={onShowVolumeContainer}>Open Volume</Button>
					{/* End dev aids */}
				</div>
				<Transition css={css} direction="up" className={css.volumeContainerTransition} visible={volumeContainerVisible}>
					<VolumeControls />
				</Transition>
			</div>
		);
	}
});

const AppDecorator = compose(
	AgateDecorator({overlay: true}),
	ProviderDecorator({
		state: initialState()
	}),
	ConsumerDecorator({
		handlers: {
			onHideEverything: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeContainer = false;
				});
			},
			onShowVolumeContainer: (ev, props, {update}) => {
				update(state => {
					state.app.visible.volumeContainer = true;
				});
			}
		},
		mapStateToProps: ({app}) => ({
			volumeContainerVisible: app.visible.volumeContainer
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
