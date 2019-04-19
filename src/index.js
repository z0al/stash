// Packages
import isPromise from 'is-promise';

/**
 * Create an action function
 */
export function createAction(type, fn) {
	fn.type = type;
	return fn;
}

/**
 * Create an thunk function
 */
export function createThunk(type, fn) {
	const act = createAction(type, fn);
	act.thunk = true;
	return act;
}

/**
 * Create a store that holds the state tree.
 */
export function createStore(state) {
	// List of listeners
	const subscribers = [];

	/**
	 * Call `action()` and persist the result back to the store.
	 */
	function dispatch(act, payload) {
		if (typeof act !== 'function') {
			throw new Error('Expected action to be a function');
		}

		if (typeof act.type !== 'string') {
			throw new Error('Expected action.type to be a string');
		}

		// Run as thunk
		if (act.thunk) {
			act(state, payload, dispatch);
		} else {
			const next = act(state, payload);

			// Override the state but ignore promises ;)
			if (!isPromise(next)) {
				state = next;
			}
		}

		// Notify subscribers
		for (let sub of subscribers) {
			sub(state, act);
		}
	}

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 */
	function subscribe(fn) {
		if (typeof fn !== 'function') {
			throw new Error('A subscriber must be a function');
		}

		// Add to the list
		subscribers.push(fn);

		// Unsubscribe
		return () => {
			const index = subscribers.indexOf(fn);

			if (index >= 0) {
				subscribers.splice(index, 1);
			}
		};
	}

	/**
	 * Return current state tree.
	 *
	 * @returns
	 */
	function getState() {
		return state;
	}

	// Exposed store methods
	return { dispatch, subscribe, getState };
}
