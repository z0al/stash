// Packages
import React from 'react';
import { Store, DispatchFunc, State } from '@stash/it';

const StoreContext = React.createContext<Store>(null);

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
		<StoreContext.Provider value={{ ...store }}>
			{props.children}
		</StoreContext.Provider>
	);
};

/**
 * A hook to get current state and store's dispatch function
 */
export function useStore(): [State, DispatchFunc] {
	const store = React.useContext(StoreContext);

	let state = store.getState();

	return [state, store.dispatch];
}
