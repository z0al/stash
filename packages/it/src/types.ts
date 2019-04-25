export type State = any;

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
	dispatch<P>(action: Action<P>, payload?: P): void;

	subscribe(fn: Subscriber): UnsubscribeFunc;

	getState(): State;
}
