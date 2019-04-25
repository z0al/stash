// Packages
import * as React from 'react';
import { Store, DispatchFunc } from '@stash/it';

const StateContext = React.createContext(undefined);
const DispatchContext = React.createContext(undefined);

interface Props {
	store: Store;
}

/**
 * Subscribe to to store and re-render if necessary.
 */
export const Provider: React.FunctionComponent<Props> = function(props) {
	const { store } = props;
	const [state, setState] = React.useState(store.getState());

	React.useEffect(
		function() {
			function update(next: any) {
				// Skip unnecessary updates
				if (state !== next) {
					setState(next);
				}
			}

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
};

/**
 * A hook to get current state
 */
export function useSelect() {
	const state = React.useContext(StateContext);
	return state;
}

/**
 * A proxy to access store's dispatch function
 */
export function useDispatch<P>(): DispatchFunc<P> {
	return React.useContext(DispatchContext);
}
