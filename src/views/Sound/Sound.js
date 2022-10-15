import Slider from '@enact/sandstone/Slider';
import { useCallback } from 'react';
import css from "./Sound.module.less";
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_MASTER_VOLUME } from '../../actions/actionNames';
import { setVolume } from '../../actions/volume';

const Sound = () => {
    const { volume } = useSelector(state => state.volume);
    const dispatch = useDispatch();
    const onChangeHandler = useCallback(({ value }) => {
        dispatch(setVolume(value))
        dispatch({
            type: UPDATE_MASTER_VOLUME,
            payload: { volume: value }
        });
    }, [dispatch])
    // const onMuteChangeHandler = useCallback((data)=>{
    //     dispatch(changeMute(data.selected))
    // },[]);
    return <div className={css.container}>
        {/* <SwitchItem disabled defaultValue={value.muted} onToggle={onMuteChangeHandler}>Sound</SwitchItem> */}
        <Slider
            onChange={onChangeHandler}
            max={100}
            min={0}
            value={volume}
            tooltip
        />
    </div>
}
export default Sound;