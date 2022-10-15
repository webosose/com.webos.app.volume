import service from '../services/service';
import { UPDATE_MASTER_VOLUME } from './actionNames';
export const setVolume = (value) => () => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.setMasterVolume({
        volume: value,
        sessionId: displayAffinity,
        onSuccess: (res) => {
            if (res.returnValue) {
                console.log("Master volume set:", res)
            }
        },

    });
}

export const getVolume = () => dispatch => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.getMasterVolume({
        sessionId: displayAffinity,
        onSuccess: (res) => {
            console.log("getMasterVolume:  ", res)
            if (res.returnValue) {
                dispatch({
                    type: UPDATE_MASTER_VOLUME,
                    payload: { ...res.volumeStatus }
                })
            }
        },
    });
}

export const changeMute = (value) => () => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.setMasterVolume({
        muted: value,
        sessionId: displayAffinity,
        onSuccess: (res) => {
            if (res.returnValue) {
                console.log("Master volume set:", res)
            }
        },

    });
}