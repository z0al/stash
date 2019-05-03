// Packages
import React, { useLayoutEffect, useEffect, useContext } from 'react';
import { Store, DispatchFunc, State } from '@stash/core';

// "If you use server rendering, keep in mind that neither useLayoutEffect
// nor useEffect can run until the JavaScript is downloaded. This is why
// React warns when a server-rendered component contains useLayoutEffect.
//
// To fix this, either move that logic to useEffect (if it isn’t necessary
// for the first render), or delay showing that component until after the
// client renders (if the HTML looks broken until useLayoutEffect runs)."
//
// -- React Docs
const useIsomorphicEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// exposed for testing
export const StoreContext = React.createContext<Store>(null);

/**
 * Subscribe to to store and re-render if necessary.
 */
export function Provider(props: React.PropsWithChildren<{ store: Store }>) {
	const { store } = props;
	const [state, setState] = React.useState(store.getState());

	// Subscribe to state changes
	useIsomorphicEffect(() => {
		function update(next: any) {
			// Skip unnecessary updates
			if (state !== next) {
				setState(next);
			}
		}

		return store.subscribe(update);
	}, [store, state]);

	return (
		<StoreContext.Provider value={{ ...store }}>
			{props.children}
		</StoreContext.Provider>
	);
}

/**
 * A hook to get current state and store's dispatch function
 */
export function useStore(): [State, DispatchFunc] {
	const store = useContext(StoreContext);

	let state = store.getState();

	return [state, store.dispatch];
}
