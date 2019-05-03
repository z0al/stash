export type State = any;

export interface Action<P> {
	// The actual reducer/thunk
	func: ActionFunc<P>;

	// A string for logging
	type?: string;
	thunk?: boolean;

	// The thunk which fired this action
	by?: Action<any>;

	// The payload given upon call
	payload?: any;
}

export interface DispatchFunc {
	<P>(action: Action<P>, payload: P): void;
}

export interface ActionFunc<P> {
	(state: State, payload: P, dispatch?: DispatchFunc): State;
}

/**
 * Create an action function
 */
export function createAction<T>(type: string, func: ActionFunc<T>): Action<T> {
	return { func, type };
}

/**
 * Create an thunk function
 */
export function createThunk<T>(type: string, func: ActionFunc<T>): Action<T> {
	const act = createAction(type, func);

	// Mark as a thunk
	act.thunk = true;

	return act;
}
