 /* eslint-disable  react/jsx-no-bind */
import kind from "@enact/core/kind";
import ContextualPopupDecorator from "@enact/sandstone/ContextualPopupDecorator";
import Heading from "@enact/sandstone/Heading";

import { useState } from "react";

import Button from "@enact/sandstone/Button";
import Icon from "@enact/sandstone/Icon";
import LS2Request from "@enact/webos/LS2Request";

let hideTimerId,
delayTohide = 5000;
const MenuIconButton = kind({
  name: "SettingsIcon",
  render: (props) => {
    return (
      <Button
        size="large"
        backgroundOpacity="transparent"
        icon={props.icon}
        onClick={props.onClick}
      />
    );
  },
});

const MenuPopupButton = ContextualPopupDecorator(MenuIconButton);

const StatusBarItems = (props) => {
  const [popUp, setpopUp] = useState(false);

  const launchSettings = () => {
    const req = new LS2Request();
    req.send({
      service: "luna://com.webos.applicationManager",
      method: "launch",
      parameters: {
        id: "com.palm.app.settings",
      },
      subscribe: true,
      onSuccess: (res) => {
        console.log("success result is ===> ", res);
        setpopUp(false);
      },
      onFailure: (res) => {
        console.log("failure result is ===> ", res);
      },
    });
  };
  const renderPopup = () => {
    return (
      <>
        <Heading size="small" onClick={launchSettings}>
          Settings
          <Icon>triangleright</Icon>
        </Heading>
      </>
    );
  };

  const clearHideTime = () => {
    if (hideTimerId) {
      clearTimeout(hideTimerId);
    }
  };

  const setHideTime = () => {
    clearHideTime();
    hideTimerId = setTimeout(() => {
      setpopUp(false);
    }, delayTohide);
  };
  const handleClick = () => {
    setpopUp(true);
    setHideTime();
  };
  return (
    <MenuPopupButton
      onClick={handleClick}
      // onClick={()=>{}}
      icon={props.statusIcon}
      open={popUp}
      popupComponent={renderPopup}
      size="small"
      direction="above center"
      noAutoDismiss={false}
    />
  );
};

export default StatusBarItems;
