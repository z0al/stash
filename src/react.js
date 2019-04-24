// @ts-check

// Packages
import React, { useContext, useEffect, useState } from 'react';

const StateContext = React.createContext(undefined);
const DispatchContext = React.createContext(undefined);

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
	const [state, setState] = useState(store.getState());

	/**
	 * Update the local state
	 *
	 * @param {*} next
	 */
	function update(next) {
		// Skip unnecessary updates
		if (state !== next) {
			setState(next);
		}
	}

	useEffect(
		function() {
			return store.subscribe(update);
		},
		[store]
	);

	return (
		<DispatchContext.Provider value={store.dispatch}>
			<StateContext.Provider value={state}>
				{props.children}
			</StateContext.Provider>
		</DispatchContext.Provider>
	);
}

/**
 * A hook to get current state
 *
 * @todo accept a selector as a param and use useMemo
 *
 * @returns
 */
export function useSelect() {
	const state = useContext(StateContext);
	return state;
}

/**
 * A proxy to access store's dispatch function
 *
 * @returns
 */
export function useDispatch() {
	return useContext(DispatchContext);
}
