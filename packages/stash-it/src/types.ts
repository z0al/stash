export type State = any;

export interface Action<P> {
	(state: State, payload: P, dispatch?: DispatchFunc): State;
	type?: string;
	thunk?: boolean;
	by?: Action<any>;
}

export interface DispatchFunc {
	<P>(action: Action<P>, payload?: P): void;
}

export interface ActionFunc<P> {
	(state: State, payload?: P, dispatch?: DispatchFunc): State;
}

export type Subscriber = (
	state: State,
	action: Action<any>,
	payload: any
) => void;
export type UnsubscribeFunc = () => void;

export interface Store {
	dispatch: DispatchFunc;

	subscribe(fn: Subscriber): UnsubscribeFunc;

	getState(): State;
}
