// Ours
import { subscribe } from '../src/subscribe';
import { Options } from '../src/logger';

describe('Subscribe', () => {
	const op: Options = {
		console: {
			log: jest.fn(),
			group: jest.fn(),
			groupEnd: jest.fn()
		}
	};

	it('registers a listener', () => {
		const store = {
			getState: jest.fn(),
			subscribe: jest.fn()
		};

		subscribe(store as any, jest.fn(), op);

		expect(store.getState).toBeCalled();
		expect(store.subscribe).toBeCalled();
	});

	it('passes prev/next states correctly', () => {
		let dispatch: Function;

		const store = {
			getState: () => 'INIT',
			subscribe: jest.fn().mockImplementation(f => (dispatch = f))
		};

		const action = { type: 'T', func: () => {} };
		const logger = jest.fn();

		subscribe(store as any, logger, op);

		dispatch('STATE_1', action);
		expect(logger).toBeCalledWith('INIT', 'STATE_1', action, op);

		dispatch('STATE_2', action);
		expect(logger).toBeCalledWith('STATE_1', 'STATE_2', action, op);

		dispatch('STATE_3', action);
		expect(logger).toBeCalledWith('STATE_2', 'STATE_3', action, op);
	});
});
