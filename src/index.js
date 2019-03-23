// @ts-check

/**
 * Create an action function
 *
 * @param {string} type
 * @param {*} func
 * @returns
 */
export function createAction(type, func) {
	func.type = type;
	return func;
}

/**
 * Create a store that holds the state tree.
 *
 *
 * @param {*} [state]
 *
 *
 * @typedef Store
 * @property {*} getState
 * @property {*} dispatch
 * @property {*} subscribe
 *
 * @returns {Store}
 */
export function createStore(state) {
	const subscribers = [];

	/**
	 * Call `action()` and persist the result back to the store.
	 *
	 * @param {*} action
	 * @param {*} payload
	 */
	function dispatch(action, payload) {
		if (typeof action !== 'function') {
			throw new Error('Expected action to be a function');
		}

		if (typeof action.type !== 'string') {
			throw new Error('Expected action.type to be a string');
		}

		// Evaluate next state
		const next = action(state, payload);

		// Override current state
		state = next;

		// Notify subscribers
		for (let sub of subscribers) {
			sub(state, action);
		}
	}

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 *
	 * @param {Function} fn
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
	return { getState, dispatch, subscribe };
}
