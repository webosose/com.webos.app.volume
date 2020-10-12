import Icon from '@enact/agate/Icon';
import Slider from '@enact/agate/Slider';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import css from './VolumeControl.module.less';

const VolumeControl = kind({
	name: 'VolumeControl',

	propTypes: {
		label: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		onTouchStart: PropTypes.func.isRequired,
		onTouchEnd: PropTypes.func.isRequired,
		value: PropTypes.number.isRequired
	},

	styles: {
		css,
		className: 'volumeControl'
	},

	render: ({className, label, onChange, onTouchStart, onTouchEnd, value}) => {
		return (
			<Row className={className}>
				<Cell className={css.label} shrink>
					{label}
				</Cell>
				<Cell>
					<Row className={css.labeledSlider}>
						<Cell className={css.icon} component={Icon} shrink>{value === 0 ? 'volume0' : 'volume1'}</Cell>
						<Cell className={css.slider} component={Slider} css={css} max={100} min={0} onChange={onChange} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} step={1} value={value} />
						<Cell className={css.icon} component={Icon} shrink>volume2</Cell>
					</Row>
				</Cell>
			</Row>
		);
	}
});

export default VolumeControl;
