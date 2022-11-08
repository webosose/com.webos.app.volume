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
        className={css.button_cnt}
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

  console.log("appState::", appState);
  if (icon !== 'bluetooth') {
    return <ContextualPopup
      icon={icon === 'sound' && volume === 0 ? 'soundmute' : icon}
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
      icon={Bluetooth_Disconnect}
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
export default ContextualPopupButton;