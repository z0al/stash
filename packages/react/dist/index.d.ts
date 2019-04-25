import * as React from 'react';
import { Store, DispatchFunc } from '@stash/it';
interface Props {
    store: Store;
}
/**
 * Subscribe to to store and re-render if necessary.
 */
export declare const Provider: React.FunctionComponent<Props>;
/**
 * A hook to get current state
 */
export declare function useSelect(): any;
/**
 * A proxy to access store's dispatch function
 */
export declare function useDispatch<P>(): DispatchFunc<P>;
export {};
