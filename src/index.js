// @ts-check

// Ours

/**
 * Create a store that holds the state tree.
 *
 *
 * @param {*} state
 *
 *
 * @typedef Store
 * @property {()=> any} getState
 * @property {(action)=> void} assign
 *
 * @returns {Store}
 */
function createStore(state) {
	/**
	 * Call `action()` and persist the result back to the store.
	 *
	 * If the `action` is a thunk, the function executes it but ignore
	 * the result.
	 *
	 * @param {*} action
	 */
	function dispatch(action, payload) {
		// Evaluate next state
		const next = action(state, payload);

		// Ignore thunks
		if (next instanceof Promise) {
			return;
		}

		// Set state
		state = next;
	}

	/**
	 * Create a bound copy of a given action.
	 *
	 * A bounded action automatically calls `action()` and persist the
	 * result back to the store.
	 *
	 * @param {*} action
	 */
	function assign(action) {
		if (typeof action !== 'function') {
			throw Error('Expected action to be a function');
		}

		if (typeof action.type !== 'string') {
			throw Error('Expected action.type to be a string');
		}

		// Copy action
		const act = action;

		// Inject dispatch
		action = function(paylaod) {
			dispatch(act, paylaod);
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

	// Exposed store instance
	const store = { getState, assign };

	return store;
}

export { createStore };
