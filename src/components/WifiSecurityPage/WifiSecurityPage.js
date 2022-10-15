import css from "./WifiSecurityPage.module.less";
import Heading from '@enact/sandstone/Heading';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { useDispatch, useSelector } from "react-redux";
import { connectingWifi } from "../../actions/wifiActions";
import { useCallback, useState } from "react";
import { CLEAR_SECURITY_PAGE } from "../../actions/actionNames";

const WifiSecurityPage = () => {
    const showSecurityPage = useSelector(state => state.showSecurityPage);
    const [type, setType] = useState('password');
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    const connectWifiHandler = useCallback(() => {
        let params = {
            ssid: showSecurityPage.ssid,
            security: {
                securityType: showSecurityPage.securityType,
                simpleSecurity: {
                    passKey: value
                }
            }
        };
        dispatch((connectingWifi(params)));
        dispatch({
            type:CLEAR_SECURITY_PAGE
        });
    }, [dispatch, showSecurityPage,value])
    const changeTypeHandler = useCallback(({ selected }) => {
        if (selected) {
            setType('text');
        } else {
            setType('password');
        }
    }, [])
    const onChangeHanlder = useCallback((event) => {
        console.log(event)
        setValue(event.value)
    }, [])
    console.log("showSecurityPage:", showSecurityPage);
    return (
        <div>
            <div className={css.row}>
                <Heading size='small' className={css.label}>
                    Network
                </Heading>
                <Heading data-component-id={'wifiSsid'} className={css.item}>
                    {showSecurityPage.displayName || showSecurityPage.ssid}
                </Heading>
            </div>
            <div className={css.row}>
                <Heading size='small' className={css.label}>Password</Heading>
                <InputField value={value} onChange={onChangeHanlder} type={type} className={css.inputField} />
            </div>
            <CheckboxItem onToggle={changeTypeHandler}>Show Password</CheckboxItem>
            <div className={css.center}>
                <Button data-component-id={'wifiConnectBtn'} onClick={connectWifiHandler}>Connect</Button>
            </div>
        </div>
    )
}
export default WifiSecurityPage;