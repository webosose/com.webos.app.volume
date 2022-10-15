import { useCallback, useEffect } from "react";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import MainPanel from "../views/MainPanel";
import css from "./App.module.less";
import Transition from "@enact/ui/Transition";
import { useDispatch, useSelector } from "react-redux";
import { getVolume } from "../actions/volume";
import { SHOW_APP } from "../actions/actionNames";
import getOSInfo from "../actions/getOSInfo";


const App = () => {
  // const [appShow, seAppShow] = useState(false);
  // const [type, setType] = useState('fade');
  const appShow = useSelector(state => state.appState);
  const dispatch = useDispatch();
  const onShowHandler = useCallback(() => {
    dispatch({
      type: SHOW_APP,
      payload: true
    });
    // setType('fade');
  }, [dispatch])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('webOSRelaunch', onShowHandler);
    }
    dispatch(getVolume());
    dispatch(getOSInfo());
  }, [dispatch,onShowHandler]);

  const onHideHandler = useCallback(() => {
    dispatch({
      type: SHOW_APP,
      payload: false
    });
    // setType('fade');
  }, [dispatch])
  const closeApp = useCallback(() => {
    // setType('slide');
    if (typeof window !== 'undefined') {
      window.close();
    }
  }, []);
  return (
    <div className={css.app}>
      <Transition type="fade" visible={appShow} onHide={closeApp}>
        <div className={css.basement} onClick={onHideHandler} />
      </Transition>
      <Transition
        direction="up"
        visible={appShow}
      // type={type}
      >
        <MainPanel />
      </Transition>
    </div>
  )
}

export default ThemeDecorator({ overlay: true }, App);
