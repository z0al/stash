import { Action, ActionFunc, Store, State } from './types';
/**
 * Create an action function
 */
export declare function createAction<T>(type: string, fn: ActionFunc<T>): Action<T>;
/**
 * Create an thunk function
 */
export declare function createThunk<T>(type: string, fn: ActionFunc<T>): Action<T>;
/**
 * Create a store that holds the state tree.
 */
export declare function createStore(state?: State): Store;
