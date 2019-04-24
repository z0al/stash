import * as React from 'react';
import * as store from '..';

interface ProviderProps {
	store: store.Store;
}

/**
 * Subscribe to to store and re-render if necessary.
 */
export declare const Provider: React.FunctionComponent<ProviderProps>;

/**
 * A hook to get current state
 */
export declare function useSelect(): any;

/**
 * A proxy to access store's dispatch function
 */
export declare function useDispatch(): store.DispatchFunc;
