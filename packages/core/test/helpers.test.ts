// Ours
import { createAction, createThunk } from '../src';

describe('createAction', () => {
	it('adds .type to the action function', () => {
		const fn = (state: any) => state;
		const act = createAction('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act.func).toBeInstanceOf(Function);
		expect(act.func).toBe(fn);
	});
});

describe('createThunk', () => {
	it('adds .type and .thunk to the action function', () => {
		const fn = (state: any) => state;
		const act = createThunk('myaction', fn);

		expect(act.type).toBe('myaction');
		expect(act.thunk).toBe(true);
		expect(act.func).toBeInstanceOf(Function);
		expect(act.func).toBe(fn);
	});
});
