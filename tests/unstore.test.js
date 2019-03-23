// Ours
import { createStore } from '../src';

describe('createStore', () => {
	it('returns valid store object', () => {
		const store = createStore();

		// Helper functions
		expect(store.setState).toBeUndefined();
		expect(store.getState).toBeInstanceOf(Function);
		expect(store.dispatch).toBeInstanceOf(Function);
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
});
