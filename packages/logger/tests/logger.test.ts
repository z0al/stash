// Ours
import logger, { Options } from '../src/logger';

describe('Logger', () => {
	let op: Options;

	beforeEach(() => {
		op = {
			console: {
				log: jest.fn(),
				group: jest.fn(),
				groupEnd: jest.fn()
			}
		};
	});

	it('logs action details', () => {
		const act = {
			type: 'T',
			payload: {},
			func: () => {}
		};

		logger(null, null, act, op);

		expect(op.console.group).toBeCalledWith(
			expect.stringMatching(act.type),
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything() // styles
		);

		expect(op.console.log).toBeCalledWith(
			expect.stringMatching('action payload'),
			expect.anything(), // styles
			act.payload
		);

		expect(op.console.group).toBeCalled();
		expect(op.console.log).toBeCalledTimes(3);
		expect(op.console.groupEnd).toBeCalled();
	});

	it('logs caller info', () => {
		const thunk = {
			type: 'THUNK',
			payload: { do: true },
			thunk: true,
			func: () => {}
		};

		const act = {
			type: 'ACTION',
			payload: {},
			func: () => {},
			by: thunk
		};

		logger(null, null, act, op);

		expect(op.console.group).toBeCalledWith(
			expect.stringMatching(`[ ${thunk.type} ]`),
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything() // styles
		);

		expect(op.console.log).toBeCalledWith(
			expect.stringMatching('thunk payload'),
			expect.anything(), // styles
			thunk.payload
		);

		expect(op.console.group).toBeCalled();
		expect(op.console.log).toBeCalledTimes(4);
		expect(op.console.groupEnd).toBeCalled();
	});

	it('prev/new states', () => {
		const act = {
			type: 'T',
			payload: {},
			func: () => {}
		};

		logger('prev', 'new', act, op);

		expect(op.console.log).toBeCalledWith(
			expect.stringMatching('prev state'),
			expect.anything(),
			'prev'
		);

		expect(op.console.log).toBeCalledWith(
			expect.stringMatching('new state'),
			expect.anything(),
			'new'
		);
	});

	it('logs time', () => {
		const act = {
			type: 'T',
			payload: {},
			func: () => {}
		};

		logger(null, null, act, op);

		expect(op.console.group).toBeCalledWith(
			expect.stringMatching(/\d{1,2}:\d{1,2}:\d{1,2}$/),
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything(), // styles
			expect.anything() // styles
		);
	});
});
