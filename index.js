import { stat } from "fs";
import { StaticRouter } from "react-router";

// Library code
function createStore(reducer) {
    // The store should have four parts
    // 1. The state
    // 2. Get the state.
    // 3. Listen to changes on the state
    // 4. update the state

    let state;
    const listeners = [];

    const getState = () => state;

    //Keep track of state changes
    const subscribe = (listener) => {
        listeners.push(listener);

        //To unsubscribe
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        }
    }

    //Updating state
    const dispatch = (action) => {
        state = reducer(state, action);

        //call all stored listeners
        listeners.forEach((listener) = listener());
    }

    return {
        getState,
        subscribe,
        dispatch,
    }
}

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// App code
// Reducer to add Todos
function todos(state = [], action) {
    switch(action.type) {
        case ADD_TODO :
            return state.concat([action.todo])
        case REMOVE_TODO :
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO :
            return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }));

        default :
            return state;
    }
}

// Reducer to add goals
function goals ( state = [], action) {
    switch(action.type) {
        case ADD_GOAL :
            return state.concat([action.goal]);
        case REMOVE_GOAL :
            return state.filter((goal) => goal.id !== action.goal);
        default :
            return state;
    }
}

function app (state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}

const store = createStore(app);

store.subscribe(() => {
    console.log('The new state is', store.getState());
});

store.dispatch({
    type: ADD_TODO,
    todo: {
        id: 0,
        name: 'Learn redux',
        complete: false,
    }
});

