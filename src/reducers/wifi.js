import { CLEAR_LOADING, CLEAR_SECURITY_PAGE, LOADING_WIFI_LIST, SET_WIFI_ERROR, SET_WIFI_LIST, SET_WIFI_STATE, SET_WIFI_STATUS, SHOW_SECURITY_PAGE } from "../actions/actionNames";

export const wifiStatus = (state = {}, action) => {
	switch (action.type) {
		case SET_WIFI_STATUS:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

export const wifiState = (state = false, action) => {
	switch (action.type) {
		case SET_WIFI_STATE:
			return action.payload ;
		default:
			return state;
	}
}


export const wifiList = (state = [], action) => {
	switch (action.type) {
		case SET_WIFI_LIST:
			return [...action.payload];
		default:
			return state;
	}
}

export const wifiError = (state = '', action) => {
	switch (action.type) {
		case SET_WIFI_ERROR:
			return action.payload;
		default:
			return state;
	}
}

export const showSecurityPage = (state = { show: false }, action) => {
	switch (action.type) {
		case SHOW_SECURITY_PAGE:
			return { ...state, ...action.payload };
		case CLEAR_SECURITY_PAGE:
			return { show: false };
		default:
			return state;
	}
}

export const loadingWifiList = (state=false,action) => {
	switch (action.type) {
		case LOADING_WIFI_LIST:
			return true;
		case CLEAR_LOADING:
			return false;
		default:
			return state;
	}
}