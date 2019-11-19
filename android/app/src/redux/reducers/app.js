import actions from '../actions/app';
import {handleActions} from 'redux-actions';

export const appInitialState = {
  initializing: false,
  currentImage: null,
  showCamera: false,
};

const reducerMap = {
  [actions.setInitializing]: (state, action) => {
    return {
      ...state,
      initializing: action.payload,
    };
  },
  [actions.setCurrentImage]: (state, action) => {
    return {
      ...state,
      currentImage: action.payload,
    };
  },
  [actions.setShowCamera]: (state, action) => {
    return {
      ...state,
      showCamera: action.payload,
    };
  },
};

const reducer = handleActions(reducerMap, appInitialState);
export default reducer;
