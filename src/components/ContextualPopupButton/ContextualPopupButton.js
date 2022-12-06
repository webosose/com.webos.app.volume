import Button from "@enact/sandstone/Button";
import kind from '@enact/core/kind';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import Sound from '../../views/Sound/Sound';
import Bluetooth from '../../views/Bluetooth/Bluetooth';
import Notification from '../../views/Notification/Notification';
import OTA from '../../views/OTA/OTA';
import Wifi from '../../views/Wifi/Wifi';
import { useCallback, useEffect, useState } from "react";
import Icon from '@enact/sandstone/Icon';
import Scrim from "../Scrim/Scrim";
import css from "./ContextualPopupButton.module.less";
import { useDispatch, useSelector } from "react-redux";
import launchAction from "../../actions/launchAction";
import Bluetooth_Disconnect from '../../../assets/Bluetooth_Disconnect.png'
import Wifi_Connect from '../../../assets/Wifi_Connect.png'
import Wifi_Disconnect from '../../../assets/Wifi_Disconnect.png'
import sound from '../../../assets/sound.png';
import soundmute from '../../../assets/soundmute.png';
import notification from '../../../assets/notification.png';
import downloads from '../../../assets/downloads.png';

const panels = {
  sound: Sound,
  bluetooth: Bluetooth,
  notification: Notification,
  download: OTA,
  wifi4: Wifi
}
const IconButton = kind({
  name: "SettingsIcon",
  render: (props) => {
    return (
      <Button
        selected={props.isOpened}
        icon={props.icon}
        onClick={props.onClick}
        className={props.icon.includes('sound') || props.icon.includes('Wifi_Connect') ? css.customIcon_Align :css.button_cnt}
        css={css}
      />
    );
  },
});
const ContextualPopup = ContextualPopupDecorator(IconButton);
const ContextualPopupButton = ({ icon }) => {
  const appState = useSelector(state => state.appState);
  const [isOpened, setIsOpened] = useState(false);
  const { volume } = useSelector(state => state.volume);
  const wifiState = useSelector(state => state.wifiState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!appState) {
      setIsOpened(false);
    }
  }, [appState])
  const menuClick = useCallback((event) => {
    event.stopPropagation()
  }, [])
  const closeMenu = useCallback(() => {
    console.log('Screem close..')
    setIsOpened(false)
  }, []);
  const clickMenu = useCallback(() => {
    setIsOpened(true)
  }, []);
  const openSettingsApplication = useCallback(() => {
    setIsOpened(false);
    dispatch(launchAction('com.palm.app.settings'));
  }, [dispatch]);

  const renderPopup = useCallback(() => {
    const Component = panels[icon];
    return (
      <div onClick={menuClick}>
        <Component />
        <div className={css.popupbottom} >
          <div onClick={openSettingsApplication}>
            <p size="small" className={css.settings}>
              Settings
            </p>
            <Icon className={css.icon}>arrowsmallright</Icon>
          </div>
        </div>
        <Scrim closeMenu={closeMenu} />
      </div>

    );
  }, [closeMenu, icon, menuClick, openSettingsApplication]);

  const renderIcons = () => {

    const mapIcons = {
      'bluetooth': ['bluetooth', Bluetooth_Disconnect],
      'wifi4': [Wifi_Connect, Wifi_Disconnect],
      'sound': [sound, soundmute],
      'notification': notification,
      'download': downloads
    }

    if (icon === 'bluetooth' || icon === 'wifi4') {
      return <ContextualPopup
        icon={icon === 'bluetooth' ? mapIcons['bluetooth'][1] : wifiState ? mapIcons['wifi4'][0] : mapIcons['wifi4'][1]}
        onClick={clickMenu}
        onClose={closeMenu}
        open={isOpened}
        isOpened={isOpened}
        popupComponent={renderPopup}
        size="small"
        direction="above center"
        noAutoDismiss={false}
      />
    } else {
      return <ContextualPopup
        icon={icon === 'sound' ? (volume === 0 ? mapIcons['sound'][1] : mapIcons['sound'][0]) : mapIcons[icon]}
        onClick={clickMenu}
        onClose={closeMenu}
        open={isOpened}
        isOpened={isOpened}
        popupComponent={renderPopup}
        size="small"
        direction="above center"
        noAutoDismiss={false}
      />
    }
  }

  console.log("appState::", appState);

  return renderIcons()
}
export default ContextualPopupButton;