// Packages
import { Store } from '@stash/core';

// Ours
import logger, { Options } from './logger';
import { subscribe } from './subscribe';

// Default options
const defaultOpt: Options = { console };

function createLogger(options?: Options) {
	options = { ...options, ...defaultOpt };

	return function(store: Store) {
		subscribe(store, logger, options);
	};
}

export { createLogger };
