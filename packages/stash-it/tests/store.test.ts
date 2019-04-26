// Ours
import { Action } from '../src/types';
import { createStore, createAction, createThunk } from '../src/index';

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
	it('throws if the action is invalid', () => {
		const store = createStore();
		const action: Action<any> = { func: state => state };

		// Not a function
		expect(() => {
			store.dispatch(('ACT' as unknown) as Action<any>);
		}).toThrow();

		// No "type" attribute
		expect(() => {
			store.dispatch(action);
		}).toThrow();

		expect(() => {
			action.type = 'ACT';

			store.dispatch(action);
		}).not.toThrow();
	});

	it('applies actions and set the result back to the state', () => {
		const store = createStore(0);

		const increment: Action<any> = { func: state => state + 1 };
		increment.type = 'INC';

		const decrement: Action<any> = { func: state => state - 1 };
		decrement.type = 'DEC';

		store.dispatch(increment);
		expect(store.getState()).toBe(1);

		store.dispatch(decrement);

		expect(store.getState()).toBe(0);
	});

	it('passes payload to actions', () => {
		const store = createStore(0);

		const inc: Action<number> = { func: (state, payload) => state + payload };
		inc.type = 'INC';

		store.dispatch(inc, 10);
		expect(store.getState()).toBe(10);
	});

	it('notifies subscribers when the state has been updated', () => {
		const store = createStore();
		const act: Action<any> = { func: () => 0, type: 'ACT' };

		const sub = jest.fn();

		store.subscribe(sub);
		store.dispatch(act, 'payload');

		expect(sub).toBeCalledWith(0, act, 'payload');
	});

	it('tracks action calls in thunks', () => {
		const store = createStore();
		const act = createAction('my action', () => {});

		const thunk = createThunk('my thunk', (s, p_, dispatch) => {
			store.subscribe((state, action, payload) => {
				expect(action).toBe(act);
				expect(action.by).toEqual(thunk);
			});
		});
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

describe('createAction', () => {
	it('adds .type to the action function', () => {
		const fn = state => state;
		const act = createAction('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act.func).toBeInstanceOf(Function);
		expect(act.func).toBe(fn);
	});
});

describe('createThunk', () => {
	it('adds .type and .thunk to the action function', () => {
		const fn = state => state;
		const act = createThunk('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act.thunk).toBe(true);
		expect(act.func).toBeInstanceOf(Function);
		expect(act.func).toBe(fn);
	});
});
