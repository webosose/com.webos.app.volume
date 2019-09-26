import kind from '@enact/core/kind';
import IncrementSlider from '@enact/agate/IncrementSlider';
import {Row, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

import Skinnable from '@enact/agate/Skinnable';

import css from './VolumeControl.module.less';

const VolumeControlBase = kind({
	name: 'VolumeControl',

	propTypes: {
		label: PropTypes.string,
		value: PropTypes.number  // Between zero and one (0 -> 1)
	},

	defaultProps: {
		label: 'Volume',
		value: 0
	},

	styles: {
		css,
		className: 'volumeControl'
	},

	render: ({label, className, style, value, ...rest}) => {
		return (
			<Row className={className} style={style}>
				<Cell component="label" size="30%" className={css.label}>
					{label}
				</Cell>
				<Cell>
					<IncrementSlider decrementIcon={value === 0 ? 'volume0' : 'volume1'} incrementIcon="volume2" step={10} min={0} max={100} {...rest} value={value} />
				</Cell>
			</Row>
		);
	}
});

const VolumeControl = Skinnable(VolumeControlBase);

export default VolumeControl;
export {
	VolumeControl,
	VolumeControlBase
};
