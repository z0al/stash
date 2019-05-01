// Packages
import { Store, Action } from '@stash/core';

// Ours
import Logger, { Options } from './logger';

function subscribe(store: Store, logger: typeof Logger, options: Options) {
	let current = store.getState();

	store.subscribe((state: any, action: Action<any>) => {
		logger(current, state, action, options);

		current = state;
	});
}

export { subscribe };
