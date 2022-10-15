/* global ENACT_PACK_ISOMORPHIC */
import {createRoot, hydrateRoot} from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
// import { InputField } from '@enact/sandstone/Input';
import App from './App';
import configureStore from './store';

const store = configureStore();
const appElement = (<Provider store={store}><App /></Provider>);

// const appElement = (<InputField></InputField>);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	if (ENACT_PACK_ISOMORPHIC) {
		hydrateRoot(document.getElementById('root'), appElement);
	} else {
		createRoot(document.getElementById('root')).render(appElement);
	}
}

export default appElement;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
// Learn more: https://github.com/enactjs/cli/blob/master/docs/measuring-performance.md
// reportWebVitals();
