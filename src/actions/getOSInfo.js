import service from '../services/service';
import { STORE_OS_INFO } from './actionNames';
const getOSInfo = () => dispatch => {
    service.getOSinfo({
        parameters: ["webos_release"],
        onSuccess: (res) => {
            if (res.returnValue) {
                dispatch({
                    type: STORE_OS_INFO,
                    payload: {
                        webos_release: res.webos_release
                    }
                });
            }
        }
    });
}
export default getOSInfo;