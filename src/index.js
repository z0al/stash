// @ts-check

// Ours

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
 *
 * @returns {Store}
 */
function createStore(state) {
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
	return { getState, dispatch };
}

export { createStore };
