// Ours
import { createStore } from '../src';

describe('createStore', () => {
	it('returns valid store object', () => {
		const store = createStore();

		// Helper functions
		expect(store.getState).toBeInstanceOf(Function);
		expect(store.dispatch).toBeInstanceOf(Function);
		expect(store.subscribe).toBeInstanceOf(Function);
	});

	it('sets the initial state', () => {
		// Empty state
		let store = createStore();
		expect(store.getState()).toBeUndefined();

		// Number
		store = createStore(0);
		expect(store.getState()).toBe(0);

		// Object
		store = createStore({ status: true });
		expect(store.getState()).toEqual({ status: true });
	});
});

describe('dispatch', () => {
	it('throws if an invalid action object is given', () => {
		const store = createStore();

		// Not a function
		expect(() => {
			store.dispatch({} as any);
		}).toThrow();

		// No "type" attribute
		expect(() => {
			store.dispatch({ func: () => {} });
		}).toThrow();

		expect(() => {
			store.dispatch({ func: () => {}, type: 'ACT' });
		}).not.toThrow();
	});

	it('calls action.func and set the result back to the state', () => {
		const store = createStore(-1);

		const set0 = { func: jest.fn().mockReturnValue(0), type: 'ZERO' };
		const set10 = { func: jest.fn().mockReturnValue(10), type: 'TEN' };

		store.dispatch(set0);
		expect(set0.func).toBeCalledWith(-1, undefined);
		expect(set0.func).toBeCalledTimes(1);
		expect(store.getState()).toBe(0);

		store.dispatch(set10, 'DOES NOT MATTER');

		expect(set10.func).toBeCalledWith(0, 'DOES NOT MATTER');
		expect(set10.func).toBeCalledTimes(1);
		expect(store.getState()).toBe(10);
	});

	it('passes payload to actions', () => {
		const store = createStore(0);

		const inc = { func: (c: number, n: number) => c + n, type: 'INC' };

		store.dispatch(inc, 10);
		expect(store.getState()).toBe(10);
	});

	it('notifies subscribers when the state has been updated', () => {
		const store = createStore();
		const act = { func: () => 0, type: 'ACT' };

		const sub = jest.fn();

		store.subscribe(sub);
		store.dispatch(act, 'payload');

		expect(sub).toBeCalledWith(0, { ...act, payload: 'payload' });
	});

	it('tracks action calls in thunks', () => {
		const store = createStore(null);
		const listener = jest.fn();
		const action = { func: jest.fn().mockReturnValue(0), type: 'my action' };

		const thunk = {
			type: 'my thunk',
			thunk: true,
			func: (_, __, fire) => fire(action)
		};

		store.subscribe(listener);
		store.dispatch(thunk);

		expect(action.func).toBeCalledTimes(1);
		expect(listener).toBeCalledWith(0, { ...action, by: thunk });
	});
});

describe('subscribe', () => {
	it('throws if the argument is not a function', () => {
		const store = createStore();

		expect(() => {
			store.subscribe(null);
		}).toThrow();

		expect(() => {
			store.subscribe(() => {});
		}).not.toThrow();
	});

	it('returns "unsubscribe" function', () => {
		const store = createStore(0);
		const sub = jest.fn();
		let unsubscribe = store.subscribe(sub);

		expect(unsubscribe).toBeInstanceOf(Function);

		// Remove subscriber
		unsubscribe();

		const act = { func: () => 1, type: 'T' };

		store.dispatch(act);
		expect(sub).not.toBeCalled();
	});
});
