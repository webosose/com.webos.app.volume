import { combineReducers } from 'redux';
import volume from './volume';
import appState from './appState';
import { wifiError, wifiList, wifiStatus,showSecurityPage } from './wifi';
import osinfo from './osinfo';

const rootReducer = combineReducers({
    volume,
    appState,
    wifiStatus,
    wifiList,
    wifiError,
    showSecurityPage,
    osinfo
});

export default rootReducer;