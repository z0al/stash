// Packages
import React from 'react';
import { Store } from '@stash/core';

// Ours
import { StoreContext } from './context';

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
	typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

type Props = React.PropsWithChildren<{ store: Store }>;

/**
 * Subscribe to to store and re-render if necessary.
 */
export function Provider({ store, children }: Props) {
	const { getState, dispatch } = store;
	const [state, setState] = React.useState(getState());

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
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
}
