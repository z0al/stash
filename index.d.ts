type State = any;

export interface Action<P> {
	(state: State, payload: P, dispath?: DispatchFunc<P>): State;
	type?: string;
	thunk?: boolean;
}

export interface DispatchFunc<P> {
	(action: Action<P>, payload?: P): void;
}

export interface ActionFunc<P> {
	(state: State, payload?: P, dispath?: DispatchFunc<P>): State;
}

export type Subscriber = (state: State, action: Action<any>) => void;
export type UnsubscribeFunc = () => void;

export interface Store {
	/**
	 * Call `action()` and persist the result back to the store.
	 */
	dispatch<P>(action: Action<P>, payload?: P): void;

	/**
	 * Register a subscriber function to be called whenever state
	 * is changed. Returns an `unsubscribe()` function.
	 */
	subscribe(fn: Subscriber): UnsubscribeFunc;

	/**
	 * Return current state tree.
	 */
	getState(): State;
}

/**
 * Create an action function
 */
export function createAction<T>(type: string, fn: ActionFunc<T>): Action<T>;

/**
 * Create an thunk function
 */
export function createThunk<T>(type: string, fn: ActionFunc<T>): Action<T>;

/**
 * Create a store that holds the state tree.
 */
export function createStore(state?: State): Store;
