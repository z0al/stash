import * as React from 'react';

interface ProviderProps {
	store: any;
}

/**
 * Subscribe to to store and re-render if necessary.
 */
export declare const Provider: React.FunctionComponent<ProviderProps>;

/**
 * A hook to get current state
 */
export declare function useSelect(): any;
