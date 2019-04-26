// Packages
import React from 'react';
import { Store, DispatchFunc, State } from '@stash/it';

const StoreContext = React.createContext<Store>(null);

interface Props {
	store: Store;
}

/**
 * Subscribe to a store and re-render if necessary.
 */
export class Provider extends React.Component<Props> {
	unsubscribe = () => {};

	constructor(props: Props) {
		super(props);

		this.state = props.store.getState();
	}

	componentDidMount() {
		this.subscribe();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	componentDidUpdate({ store }: Props) {
		if (this.props.store !== store) {
			this.subscribe();
		}
	}

	subscribe() {
		const { store } = this.props;

		// Unsubscribe from the current store
		this.unsubscribe();

		const update = (next: any) => {
			// Skip unnecessary updates
			if (this.state !== next) {
				this.setState(next);
			}
		};

		this.unsubscribe = store.subscribe(update);

		// Make sure we have the latest state
		update(store.getState());
	}

	render() {
		const { store, children } = this.props;

		return (
			<StoreContext.Provider value={{ ...store }}>
				{children}
			</StoreContext.Provider>
		);
	}
}

/**
 * A hook to get current state and store's dispatch function
 */
export function useStore(): [State, DispatchFunc] {
	const store = React.useContext(StoreContext);

	let state = store.getState();

	return [state, store.dispatch];
}
