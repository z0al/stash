// Packages
import { Action } from '@stash/core';

// Ours
import { styles } from './styles';

// Logger options
export interface Options {
	console: {
		log: (...data: any[]) => void;
		group: (...data: any[]) => void;
		groupEnd: (...data: any[]) => void;
	};
}

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
function logger(prev: any, next: any, action: Action<any>, op: Options) {
	const { console } = op;

	let thunk = '';
	if (action.by) {
		thunk = `[ ${action.by.type} ]`;
	}

	// Start group
	console.group(
		`%c action %c${thunk} %c${action.type} %c @ ${getTime()}`,
		styles.action,
		styles.thunk,
		styles.inherit,
		styles.time
	);

	// Thunk payload
	if (action.by) {
		console.log('%c thunk payload', styles.thunk, action.by.payload);
	}

	// Previous state
	console.log('%c prev state', styles.prevstate, prev);

	// Action payload
	console.log('%c action payload', styles.payload, action.payload);

	// New state
	console.log('%c new state', styles.newstate, next);

	console.groupEnd();
}

export default logger;
