// Packages
import React from 'react';
import { DispatchFunc, State } from '@stash/core';

// Ours
import { StoreContext } from './context';

type Selector<S> = (state: State) => S;

/**
 * A hook to get current state and the store's dispatch function
 */
export function useStore<S>(cb?: Selector<S>, deps?: any[]): [S, DispatchFunc] {
	const { state, dispatch } = React.useContext(StoreContext);

	// A memoized callaback
	const select = React.useCallback(() => {
		return cb ? cb(state) : state;
	}, [state, cb, ...(deps || [])]);

	return [select(), dispatch];
}
