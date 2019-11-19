import actions from '../actions/user';
import {handleActions} from 'redux-actions';

export const userInitialState = {
  user: {},
  location: null,
};

const reducerMap = {
  [actions.setUser]: (state, action) => {
    return {
      ...state,
      user: action.payload,
    };
  },
  [actions.setLocation]: (state, action) => {
    return {
      ...state,
      location: action.payload,
    };
  },
};

const reducer = handleActions(reducerMap, userInitialState);
export default reducer;
