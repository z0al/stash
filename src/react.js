// @ts-check

// Packages
import React, { useContext, useEffect, useState } from 'react';

const StoreContext = React.createContext(null);

/**
 * Subscribe to to store and re-render if necessary.
 *
 * @param {object} props
 * @param {*} props.store
 * @param {*} [props.children]
 * @returns
 */
export function Provider(props) {
	const { store } = props;
	let [current, setState] = useState(store.getState());

	/**
	 * Update the local state
	 *
	 * @param {*} state
	 */
	function update(state) {
		// Skip unnecessary updates
		if (current !== state) {
			setState(state);
		}
	}

	useEffect(
		function() {
			return store.subscribe(update);
		},
		[store]
	);

	return (
		<StoreContext.Provider value={current}>
			{props.children}
		</StoreContext.Provider>
	);
}

/**
 * A hook to get current state
 *
 * @returns
 */
export function useSelect() {
	const value = useContext(StoreContext);
	return value;
}
