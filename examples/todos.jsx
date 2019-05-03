import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, createAction, createThunk } from '@stash/core';
import { Provider, useStore } from '@stash/react';

// create store and set initial state
const store = createStore({ todos: [], loading: false });

// An action is just a reducer
// The first param is used for logging
const AddTodo = createAction('Add todo', (state, todo) => {
	return { ...state, todos: [...state.todos, todo] };
});

const SetLoading = createAction('Set loading', (state, loading) => {
	return { ...state, loading };
});

// A thunk can dispatch actions asynchronously
const LoadTodos = createThunk('Load todos', (state, payload, dispatch) => {
	dispatch(SetLoading, true);

	setTimeout(() => {
		dispatch(AddTodo, '3. Third todo');
		dispatch(SetLoading, false);
	}, 3000);
});

function Todos() {
	// useStore also accepts a selector e.g.
	// const [loading, dispatch] = useStore(state => state.loading)
	const [state, dispatch] = useStore();

	React.useEffect(() => {
		// Load some todos
		dispatch(AddTodo, '1. First todo');
		dispatch(AddTodo, '2. Second todo');

		// Load more async
		dispatch(LoadTodos, {});
	}, []);

	return (
		<div>
			<h1>Todos</h1>
			<ul>
				{state.todos.map((todo, index) => (
					<li key={index}>{todo}</li>
				))}
			</ul>
			{state.loading && 'Loading ...'}
		</div>
	);
}

const rootElement = document.getElementById('root');

ReactDOM.render(
	<Provider store={store}>
		<Todos />
	</Provider>,
	rootElement
);
