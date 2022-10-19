import SwitchItem from '@enact/sandstone/SwitchItem';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VirtualList from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import { enableWifi, findWifiNetworks, getWifiStatus } from '../../actions/wifiActions';
import css from "./Wifi.module.less";
import WifiItem from '../../components/WifiItem/WifiItem';
import Popup from '@enact/sandstone/Popup';
import Heading from '@enact/sandstone/Heading';
import WifiSecurityPage from '../../components/WifiSecurityPage/WifiSecurityPage';

import Icon from "@enact/sandstone/Icon";
import { CLEAR_SECURITY_PAGE, SET_WIFI_LIST } from '../../actions/actionNames';
const Wifi = () => {
    const [wifiState,setWifiState] = useState(true);
    const wifiList = useSelector(state => state.wifiList);
    const showSecurityPage = useSelector(state => state.showSecurityPage);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getWifiStatus());
        dispatch(findWifiNetworks());
        dispatch(enableWifi(true));
    }, [dispatch])
    const onWifiChangeHander = useCallback(({ selected }) => {
        if(!selected){
            dispatch({ type: SET_WIFI_LIST, payload: [] })
        }        
        dispatch(enableWifi(selected));
        setWifiState(selected);
    }, [dispatch])
    const setWirelessItem = useCallback(({ index }) => {
        return (
            <WifiItem
                key={index}
                dataIndex={index}
                {...wifiList[index].networkInfo}
                data-component-id="wirelessItem"
            />
        );
    }, [wifiList]);
    const closePopupHandler = useCallback(() => {
        dispatch({
            type: CLEAR_SECURITY_PAGE
        });
    }, [dispatch])
    return <div className={css.container}>
        <SwitchItem className={css.switchItem} disabled selected={wifiState} onToggle={onWifiChangeHander}>Wi-Fi</SwitchItem>
        <VirtualList className={css.wifiList}
            dataSize={wifiList.length}
            itemSize={ri.scale(140)}
            itemRenderer={setWirelessItem} />
        <Popup position="center" noAnimation noAutoDismiss open={showSecurityPage.show} >
            <div className={css.header}>
                <Heading size="small" className={css.title}>Wi-Fi Security</Heading>
                <Icon className={css.closeicon} onClick={closePopupHandler}>closex</Icon>
            </div>
            <WifiSecurityPage />
        </Popup>
    </div>
}
export default Wifi;