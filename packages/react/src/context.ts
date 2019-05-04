// Packages
import React from 'react';
import { State, DispatchFunc } from '@stash/core';

export const StoreContext = React.createContext<{
	state: State;
	dispatch: DispatchFunc;
}>({ state: undefined, dispatch: undefined as any });
