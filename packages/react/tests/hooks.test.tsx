// Packages
import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';

// Ours
import { useStore } from '../src/hooks';
import { StoreContext } from '../src/context';

const action = { type: 'ACT', func: () => {} };

function Tester({ selector }: any) {
	const [state, dispatch] = useStore(selector);

	return (
		<div>
			<button data-testid={'btn'} onClick={() => dispatch(action, {})} />
			<span data-testid={'state'}>{state}</span>
		</div>
	);
}

function With(state: any, dispatch: any, selector?: any) {
	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			<Tester selector={selector} />
		</StoreContext.Provider>
	);
}

describe('useStore', () => {
	afterEach(() => {
		cleanup();
	});

	const state = 'CUSTOM_STATE';

	it('returns the current state', () => {
		const { getByTestId } = render(With(state, jest.fn()));
		expect(getByTestId('state').textContent).toBe(state);
	});

	it('returns the dispatch function', () => {
		const dispatch = jest.fn();
		const { getByTestId } = render(With(state, dispatch));

		fireEvent.click(getByTestId('btn'));

		expect(dispatch).toBeCalledTimes(1);
		expect(dispatch).toBeCalledWith(action, {});
		expect(getByTestId('state').textContent).toBe(state);
	});

	it('applies selectors and returns the selected state', () => {
		const store = { top: { level: { state } } };
		const selector = jest
			.fn()
			.mockImplementation((state: any) => state.top.level.state);

		const { getByTestId } = render(With(store, jest.fn(), selector));

		expect(selector).toBeCalledTimes(1);
		expect(selector).toBeCalledWith(store);
		expect(getByTestId('state').textContent).toBe(state);
	});
});
