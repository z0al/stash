// Ours
import { createStore, createAction, createThunk, Action } from '../src';

describe('createStore', () => {
	it('returns valid store object', () => {
		const store = createStore();

		// Helper functions
		expect(store.setState).toBeUndefined();
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
		const action = state => state;

		// Not a function
		expect(() => {
			store.dispatch('ACT');
		}).toThrow();

		// Not "type" attribute
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

		const increment = state => state + 1;
		increment.type = 'INC';

		const decrement = state => state - 1;
		decrement.type = 'DEC';

		store.dispatch(increment);
		expect(store.getState()).toBe(1);

		store.dispatch(decrement);

		expect(store.getState()).toBe(0);
	});

	it('passes payload to actions', () => {
		const store = createStore(0);

		const inc = (state, payload) => state + payload;
		inc.type = 'INC';

		store.dispatch(inc, 10);
		expect(store.getState()).toBe(10);
	});

	it('notifies subscribers when the state has been updated', () => {
		const store = createStore();
		const act = () => 0;
		act.type = 'ACT';

		const sub = jest.fn();

		store.subscribe(sub);
		store.dispatch(act);

		expect(sub).toBeCalledWith(0, act);
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

		const act = () => 1;
		act.type = 'ONE';

		store.dispatch(act);
		expect(sub).not.toBeCalled();
	});
});

describe('createAction', () => {
	it('adds .type to the action function', () => {
		const fn = state => state;
		const act = createAction('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act).toBeInstanceOf(Function);
		expect(act).toBe(fn);
	});
});

describe('createThunk', () => {
	it('adds .type and .thunk to the action function', () => {
		const fn = state => state;
		const act = createThunk('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act.thunk).toBe(true);
		expect(act).toBeInstanceOf(Function);
		expect(act).toBe(fn);
	});
});
