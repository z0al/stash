// Packages
import { Store, Action } from '@stash/it';

// Different font styles
const font = {
	inherit: 'font-weight:inherit',
	normal: 'font-weight:normal',
	bold: 'font-weight:bold'
};

// Logger styles
const styles = {
	inherit: `color:inherit;${font.inherit}`,
	action: `color:gray;${font.normal}`,
	thunk: `color:orange;${font.normal}`,
	time: `color: darkgray;${font.normal}`,
	prevstate: `color:#9E9E9E;${font.bold}`,
	payload: `color:#03A9F4;${font.bold}`,
	nextstate: `color:#4CAF50;${font.bold}`
};

/**
 * A helper to get the current time in "hh:mm:ss" format
 */
function getTime() {
	const date = new Date();
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * A pretty logger for Stash
 */
export default function logger(store: Store) {
	let current = store.getState();

	store.subscribe((state: any, action: Action<any>, payload: any) => {
		const name = action.type;
		let thunk = '';
		if (action.by) {
			thunk = `[ ${action.by.type} ]`;
		}

		// Print group header
		console.group(
			`%c action %c${thunk} %c${name} %c @ ${getTime()}`,
			styles.action,
			styles.thunk,
			styles.inherit,
			styles.time
		);

		// Previous state
		console.log('%c prev state', styles.prevstate, current);

		// Payload
		console.log('%c payload', styles.payload, payload);

		// Next state
		console.log('%c next state', styles.nextstate, state);

		// Update our local state
		current = state;

		console.groupEnd();
	});
}
