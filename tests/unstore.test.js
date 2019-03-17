// @ts-check

// Ours
import { createStore } from '../src';

test('returns valid store object', () => {
	const state = 123;
	const store = createStore(state);

	// Set initial state
	expect(store.getState()).toBe(state);

	// Helper functions
	expect(store.getState).toBeInstanceOf(Function);
	expect(store.assign).toBeInstanceOf(Function);
});
