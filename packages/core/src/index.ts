// Ours
import { Action, State, DispatchFunc } from './helpers';

export type Subscriber = (state: State, action: Action<any>) => void;

export interface Store {
	dispatch: DispatchFunc;

	subscribe(fn: Subscriber): () => void;

	getState(): State;
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

		// Copy action
		action = { ...action, payload };

		// Run as thunk
		if (action.thunk) {
			// Wrap dispatch to track action calls
			const track: DispatchFunc = <P>(act: Action<P>, args?: P) => {
				return dispatch({ ...act, by: action }, args);
			};

			return action.func(state, payload, track);
		}

		state = action.func(state, payload);

		// Notify subscribers
		for (let sub of subscribers) {
			sub(state, action);
		}
	}

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 */
	function subscribe(fn: Subscriber): () => void {
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
export * from './helpers';
