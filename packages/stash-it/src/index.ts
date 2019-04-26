// Ours
import {
	Action,
	ActionFunc,
	Store,
	State,
	Subscriber,
	UnsubscribeFunc,
	DispatchFunc
} from './types';

/**
 * Create an action function
 */
export function createAction<T>(type: string, func: ActionFunc<T>): Action<T> {
	return { func, type };
}

/**
 * Create an thunk function
 */
export function createThunk<T>(type: string, func: ActionFunc<T>): Action<T> {
	const act = createAction(type, func);

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
		if (typeof action.func !== 'function') {
			throw new Error('Expected action.func to be a function');
		}

		if (typeof action.type !== 'string') {
			throw new Error('Expected action.type to be a string');
		}

		// Run as thunk
		if (action.thunk) {
			const thunk = action;

			// Wrap dispatch to track action calls
			const track: DispatchFunc = <P>(act: Action<P>, args?: P) => {
				act = { ...act };
				act.by = { ...thunk };
				return dispatch(act, args);
			};

			return thunk.func(state, payload, track);
		}

		state = action.func(state, payload);

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
