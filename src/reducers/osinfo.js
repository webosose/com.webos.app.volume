import { STORE_OS_INFO } from "../actions/actionNames";

const osinfo = (state = {}, action) => {
	switch (action.type) {
		case STORE_OS_INFO:
			return {...state,...action.payload};
		default:
			return state;
	}
}
export default osinfo;