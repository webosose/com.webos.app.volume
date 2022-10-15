import service from '../services/service';
import { SET_WIFI_LIST, SET_WIFI_STATUS } from './actionNames';

export const getWifiStatus = () => (dispatch) => {
    service.getWifiStatus({
        subscribe: true,
        onSuccess: (res) => {
            console.log('getWifiStatus res: ', res)
            dispatch({
                type: SET_WIFI_STATUS,
                payload: { ...res.wifi }
            })
        }
    });
}
export const enableWifi = (state) => () => {
    service.setWifiState({
        wifi: state ? 'enabled' : 'disabled',
        onSuccess: (res) => {
            console.log('enableWifi res: ', res)
        }
    });
}

export const findWifiNetworks = () => (dispatch) => {
    service.findWifiNetworks({
        subscribe: true,
        onSuccess: (res) => {
            if (res.returnValue) {
                dispatch({
                    type: SET_WIFI_LIST,
                    payload: [...res.foundNetworks]
                })
                console.log('findWifiNetworks res: ', res)
            }
        }
    });
}

export const connectingWifi = (params) => () => {
    console.log("connectingWifi:  ",params)
    service.connectingWifi({
        ...params,
        onSuccess: (res) => {
            const obj = {};
            if (res.returnValue) {
                obj.errorText = 'NO_ERROR';
            } else if (res.errorText) {
                obj.errorText = res.errorText;
            } else {
                obj.errorText = '';
            }
            obj.errorCode = res.errorCode || -1;
            console.log('connectingWifi res: ', obj)
        }
    });
}

