import actions from '../actions/user';
import {handleActions} from 'redux-actions';

export const userInitialState = {
  user: {},
  location: null,
  coordinates: [],
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
  [actions.addCoordinate]: (state, action) => {
    const newArr = Array.from(state.coordinates);
    newArr.push(action.payload);
    return {
      ...state,
      coordinates: newArr,
    };
  },
  [actions.deleteCoordinates]: (state, action) => {
    return {
      ...state,
      coordinates: [],
    };
  },
};

const reducer = handleActions(reducerMap, userInitialState);
export default reducer;
