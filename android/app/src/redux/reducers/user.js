import actions from '../actions/user';
import {handleActions} from 'redux-actions';

export const userInitialState = {
  user: {},
};

const reducerMap = {
  [actions.setUser]: (state, action) => {
    return {
      ...state,
      user: action.payload,
    };
  },
};

const reducer = handleActions(reducerMap, userInitialState);
export default reducer;
