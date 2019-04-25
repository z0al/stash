// Packages
import isPromise from 'is-promise';

// Ours
import {
	Action,
	ActionFunc,
	Store,
	State,
	Subscriber,
	UnsubscribeFunc
} from './types';

/**
 * Create an action function
 */
export function createAction<T>(type: string, fn: ActionFunc<T>): Action<T> {
	(fn as Action<T>).type = type;
	return fn;
}

/**
 * Create an thunk function
 */
export function createThunk<T>(type: string, fn: ActionFunc<T>): Action<T> {
	const act = createAction(type, fn);

	// Mark as a thunk
	act.thunk = true;

	return act;
}

/**
 * Create a store that holds the state tree.
 */
export function createStore(state?: State): Store {
	// List of listeners
	const subscribers: Subscriber[] = [];

	/**
	 * Call `action()` and persist the result back to the store.
	 */
	function dispatch<P>(action: Action<P>, payload?: P) {
		if (typeof action !== 'function') {
			throw new Error('Expected action to be a function');
		}

		if (typeof action.type !== 'string') {
			throw new Error('Expected action.type to be a string');
		}

		// Run as thunk
		if (action.thunk) {
			action(state, payload, dispatch);
		} else {
			const next = action(state, payload);

			// Override the state but ignore promises ;)
			if (!isPromise(next)) {
				state = next;
			}
		}

		// Notify subscribers
		for (let sub of subscribers) {
			sub(state, action, payload);
		}
	}

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 */
	function subscribe(fn: Subscriber): UnsubscribeFunc {
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
	 */
	function getState(): State {
		return state;
	}

	// Exposed store methods
	return { dispatch, subscribe, getState };
}

// Export types
export * from './types';
