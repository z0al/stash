// Packages
import isPromise from 'is-promise';

type State = any;

export interface Action<P> {
	(state: State, payload: P, dispath?: DispatchFunc<P>): State;
	type?: string;
	thunk?: boolean;
}

export interface DispatchFunc<P> {
	(action: Action<P>, payload?: P): void;
}

export interface ActionFunc<P> {
	(state: State, payload?: P, dispath?: DispatchFunc<P>): State;
}

export type Subscriber = (state: State, action: Action<any>) => void;
export type UnsubscribeFunc = () => void;

export interface Store {
	/**
	 * Call `action()` and persist the result back to the store.
	 */
	dispatch<P>(action: Action<P>, payload?: P): void;

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 */
	subscribe(fn: Subscriber): UnsubscribeFunc;

	/**
	 * Return current state tree.
	 */
	getState(): State;
}

/**
 * Create an action function
 *
 * @template T
 * @param {string} type
 * @param {ActionFunc<T>} fn
 * @returns {Action<T>}
 */
function createAction<T>(type: string, fn: ActionFunc<T>): Action<T> {
	(fn as Action<T>).type = type;
	return fn;
}

/**
 * Create an thunk function
 *
 * @template T
 * @param {string} type
 * @param {ActionFunc<T>} fn
 * @returns {Action<T>}
 */
function createThunk<T>(type: string, fn: ActionFunc<T>): Action<T> {
	const act = createAction(type, fn);
	act.thunk = true;
	return act;
}

/**
 * Create a store that holds the state tree.
 *
 * @param {State} [state]
 * @returns {Store}
 */
function createStore(state?: State): Store {
	// List of listeners
	const subscribers: Subscriber[] = [];

	function dispatch<P>(act: Action<P>, payload?: P) {
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

	function getState(): State {
		return state;
	}

	// Exposed store methods
	return { dispatch, subscribe, getState };
}

export { createAction, createStore, createThunk };
